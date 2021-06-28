import * as React from 'react';
import { useContext, useRef, useState, useEffect } from 'react';
import { useMemoOne, useOnce, raf } from '@react-spring/shared';
import { Controller, a, config } from '@react-spring/web';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

const _excluded = ["horizontal", "factor", "offset", "speed", "sticky"],
      _excluded2 = ["pages", "innerStyle", "config", "enabled", "horizontal", "children"];
const ParentContext = React.createContext(null);

function getScrollType(horizontal) {
  return horizontal ? 'scrollLeft' : 'scrollTop';
}

const START_TRANSLATE_3D = 'translate3d(0px,0px,0px)';
const START_TRANSLATE = 'translate(0px,0px)';
const ParallaxLayer = React.memo(React.forwardRef((_ref, ref) => {
  let {
    horizontal,
    factor = 1,
    offset = 0,
    speed = 0,
    sticky
  } = _ref,
      rest = _objectWithoutPropertiesLoose(_ref, _excluded);

  const parent = useContext(ParentContext);
  const ctrl = useMemoOne(() => {
    let translate;

    if (sticky) {
      const start = sticky.start || 0;
      translate = start * parent.space;
    } else {
      const targetScroll = Math.floor(offset) * parent.space;
      const distance = parent.space * offset + targetScroll * speed;
      translate = -(parent.current * speed) + distance;
    }

    return new Controller({
      space: sticky ? parent.space : parent.space * factor,
      translate
    });
  }, []);
  const layer = useMemoOne(() => ({
    horizontal: horizontal === undefined || sticky ? parent.horizontal : horizontal,
    sticky: undefined,
    isSticky: false,

    setPosition(height, scrollTop, immediate = false) {
      if (sticky) {
        setSticky(height, scrollTop);
      } else {
        const targetScroll = Math.floor(offset) * height;
        const distance = height * offset + targetScroll * speed;
        ctrl.start({
          translate: -(scrollTop * speed) + distance,
          config: parent.config,
          immediate
        });
      }
    },

    setHeight(height, immediate = false) {
      ctrl.start({
        space: sticky ? height : height * factor,
        config: parent.config,
        immediate
      });
    }

  }), []);
  useOnce(() => {
    if (sticky) {
      const start = sticky.start || 0;
      const end = sticky.end || start + 1;
      layer.sticky = {
        start,
        end
      };
    }
  });
  React.useImperativeHandle(ref, () => layer);
  const layerRef = useRef();

  const setSticky = (height, scrollTop) => {
    const start = layer.sticky.start * height;
    const end = layer.sticky.end * height;
    const isSticky = scrollTop >= start && scrollTop <= end;
    if (isSticky === layer.isSticky) return;
    layer.isSticky = isSticky;
    const ref = layerRef.current;
    ref.style.position = isSticky ? 'sticky' : 'absolute';
    ctrl.set({
      translate: isSticky ? 0 : scrollTop < start ? start : end
    });
  };

  useOnce(() => {
    if (parent) {
      parent.layers.add(layer);
      parent.update();
      return () => {
        parent.layers.delete(layer);
        parent.update();
      };
    }
  });
  const translate3d = ctrl.springs.translate.to(layer.horizontal ? x => `translate3d(${x}px,0,0)` : y => `translate3d(0,${y}px,0)`);
  return React.createElement(a.div, _extends({}, rest, {
    ref: layerRef,
    style: _extends({
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',
      willChange: 'transform',
      [layer.horizontal ? 'height' : 'width']: '100%',
      [layer.horizontal ? 'width' : 'height']: ctrl.springs.space,
      WebkitTransform: translate3d,
      msTransform: translate3d,
      transform: translate3d
    }, rest.style)
  }));
}));
const Parallax = React.memo(React.forwardRef((props, ref) => {
  const [ready, setReady] = useState(false);

  const {
    pages,
    config: config$1 = config.slow,
    enabled = true,
    horizontal = false,
    children
  } = props,
        rest = _objectWithoutPropertiesLoose(props, _excluded2);

  const state = useMemoOne(() => ({
    config: config$1,
    horizontal,
    busy: false,
    space: 0,
    current: 0,
    offset: 0,
    controller: new Controller({
      scroll: 0
    }),
    layers: new Set(),
    update: () => update(),
    scrollTo: offset => scrollTo(offset),
    stop: () => state.controller.stop()
  }), []);
  useEffect(() => {
    state.config = config$1;
  }, [config$1]);
  React.useImperativeHandle(ref, () => state);
  const containerRef = useRef();
  const contentRef = useRef();

  const update = () => {
    const container = containerRef.current;
    if (!container) return;
    const spaceProp = horizontal ? 'clientWidth' : 'clientHeight';
    state.space = container[spaceProp];
    const scrollType = getScrollType(horizontal);

    if (enabled) {
      state.current = container[scrollType];
    } else {
      container[scrollType] = state.current = state.offset * state.space;
    }

    const content = contentRef.current;

    if (content) {
      const sizeProp = horizontal ? 'width' : 'height';
      content.style[sizeProp] = `${state.space * pages}px`;
    }

    state.layers.forEach(layer => {
      layer.setHeight(state.space, true);
      layer.setPosition(state.space, state.current, true);
    });
  };

  const scrollTo = offset => {
    const container = containerRef.current;
    const scrollType = getScrollType(horizontal);
    state.offset = offset;
    state.controller.set({
      scroll: state.current
    });
    state.controller.stop().start({
      scroll: offset * state.space,
      config: config$1,

      onChange({
        value: {
          scroll
        }
      }) {
        container[scrollType] = scroll;
      }

    });
  };

  const onScroll = event => {
    if (!state.busy) {
      state.busy = true;
      state.current = event.target[getScrollType(horizontal)];
      raf.onStart(() => {
        state.layers.forEach(layer => layer.setPosition(state.space, state.current));
        state.busy = false;
      });
    }
  };

  useEffect(() => state.update());
  useOnce(() => {
    setReady(true);

    const onResize = () => {
      const update = () => state.update();

      raf.onFrame(update);
      setTimeout(update, 150);
    };

    window.addEventListener('resize', onResize, false);
    return () => window.removeEventListener('resize', onResize, false);
  });
  const overflow = enabled ? 'scroll' : 'hidden';
  return React.createElement(a.div, _extends({}, rest, {
    ref: containerRef,
    onScroll: onScroll,
    onWheel: enabled ? state.stop : undefined,
    onTouchStart: enabled ? state.stop : undefined,
    style: _extends({
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow,
      overflowY: horizontal ? 'hidden' : overflow,
      overflowX: horizontal ? overflow : 'hidden',
      WebkitOverflowScrolling: 'touch',
      WebkitTransform: START_TRANSLATE,
      msTransform: START_TRANSLATE,
      transform: START_TRANSLATE_3D
    }, rest.style)
  }), ready && React.createElement(React.Fragment, null, React.createElement(a.div, {
    ref: contentRef,
    style: _extends({
      overflow: 'hidden',
      position: 'absolute',
      [horizontal ? 'height' : 'width']: '100%',
      [horizontal ? 'width' : 'height']: state.space * pages,
      WebkitTransform: START_TRANSLATE,
      msTransform: START_TRANSLATE,
      transform: START_TRANSLATE_3D
    }, props.innerStyle)
  }, React.createElement(ParentContext.Provider, {
    value: state
  }, React.Children.map(children, child => !child.props.sticky && child))), React.createElement(ParentContext.Provider, {
    value: state
  }, React.Children.map(children, child => child.props.sticky && child))));
}));

export { Parallax, ParallaxLayer };
