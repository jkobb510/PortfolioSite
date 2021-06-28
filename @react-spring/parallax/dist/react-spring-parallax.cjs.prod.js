'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var shared = require('@react-spring/shared');
var web = require('@react-spring/web');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

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
const ParentContext = React__namespace.createContext(null);

function getScrollType(horizontal) {
  return horizontal ? 'scrollLeft' : 'scrollTop';
}

const START_TRANSLATE_3D = 'translate3d(0px,0px,0px)';
const START_TRANSLATE = 'translate(0px,0px)';
const ParallaxLayer = React__namespace.memo(React__namespace.forwardRef((_ref, ref) => {
  let {
    horizontal,
    factor = 1,
    offset = 0,
    speed = 0,
    sticky
  } = _ref,
      rest = _objectWithoutPropertiesLoose(_ref, _excluded);

  const parent = React.useContext(ParentContext);
  const ctrl = shared.useMemoOne(() => {
    let translate;

    if (sticky) {
      const start = sticky.start || 0;
      translate = start * parent.space;
    } else {
      const targetScroll = Math.floor(offset) * parent.space;
      const distance = parent.space * offset + targetScroll * speed;
      translate = -(parent.current * speed) + distance;
    }

    return new web.Controller({
      space: sticky ? parent.space : parent.space * factor,
      translate
    });
  }, []);
  const layer = shared.useMemoOne(() => ({
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
  shared.useOnce(() => {
    if (sticky) {
      const start = sticky.start || 0;
      const end = sticky.end || start + 1;
      layer.sticky = {
        start,
        end
      };
    }
  });
  React__namespace.useImperativeHandle(ref, () => layer);
  const layerRef = React.useRef();

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

  shared.useOnce(() => {
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
  return React__namespace.createElement(web.a.div, _extends({}, rest, {
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
const Parallax = React__namespace.memo(React__namespace.forwardRef((props, ref) => {
  const [ready, setReady] = React.useState(false);

  const {
    pages,
    config = web.config.slow,
    enabled = true,
    horizontal = false,
    children
  } = props,
        rest = _objectWithoutPropertiesLoose(props, _excluded2);

  const state = shared.useMemoOne(() => ({
    config,
    horizontal,
    busy: false,
    space: 0,
    current: 0,
    offset: 0,
    controller: new web.Controller({
      scroll: 0
    }),
    layers: new Set(),
    update: () => update(),
    scrollTo: offset => scrollTo(offset),
    stop: () => state.controller.stop()
  }), []);
  React.useEffect(() => {
    state.config = config;
  }, [config]);
  React__namespace.useImperativeHandle(ref, () => state);
  const containerRef = React.useRef();
  const contentRef = React.useRef();

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
      config,

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
      shared.raf.onStart(() => {
        state.layers.forEach(layer => layer.setPosition(state.space, state.current));
        state.busy = false;
      });
    }
  };

  React.useEffect(() => state.update());
  shared.useOnce(() => {
    setReady(true);

    const onResize = () => {
      const update = () => state.update();

      shared.raf.onFrame(update);
      setTimeout(update, 150);
    };

    window.addEventListener('resize', onResize, false);
    return () => window.removeEventListener('resize', onResize, false);
  });
  const overflow = enabled ? 'scroll' : 'hidden';
  return React__namespace.createElement(web.a.div, _extends({}, rest, {
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
  }), ready && React__namespace.createElement(React__namespace.Fragment, null, React__namespace.createElement(web.a.div, {
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
  }, React__namespace.createElement(ParentContext.Provider, {
    value: state
  }, React__namespace.Children.map(children, child => !child.props.sticky && child))), React__namespace.createElement(ParentContext.Provider, {
    value: state
  }, React__namespace.Children.map(children, child => child.props.sticky && child))));
}));

exports.Parallax = Parallax;
exports.ParallaxLayer = ParallaxLayer;
