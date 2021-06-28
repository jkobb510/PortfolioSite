import React from "react";
import { createPortal } from "react-dom";
import Indicator from "./components/Indicator";

const ShadowPortal = ({
  children,
  identifier
}) => {
  const mountNode = React.useRef(null);
  const portalNode = React.useRef(null);
  const shadowNode = React.useRef(null);
  const [, forceUpdate] = React.useState();
  React.useLayoutEffect(() => {
    const ownerDocument = mountNode.current.ownerDocument;
    portalNode.current = ownerDocument.createElement(identifier);
    shadowNode.current = portalNode.current.attachShadow({
      mode: `open`
    });
    ownerDocument.body.appendChild(portalNode.current);
    forceUpdate({});
    return () => {
      if (portalNode.current && portalNode.current.ownerDocument) {
        portalNode.current.ownerDocument.body.removeChild(portalNode.current);
      }
    };
  }, []);
  return shadowNode.current ? /*#__PURE__*/createPortal(children, shadowNode.current) : /*#__PURE__*/React.createElement("span", {
    ref: mountNode
  });
};

export const wrapRootElement = ({
  element
}) => {
  if (process.env.GATSBY_PREVIEW_INDICATOR_ENABLED === `true`) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, element, /*#__PURE__*/React.createElement(ShadowPortal, {
      identifier: "gatsby-preview-indicator"
    }, /*#__PURE__*/React.createElement(Indicator, null)));
  } else {
    return /*#__PURE__*/React.createElement(React.Fragment, null, element);
  }
};