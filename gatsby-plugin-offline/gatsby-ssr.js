"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.onRenderBody = exports.onPreRenderHTML = void 0;

var _react = _interopRequireDefault(require("react"));

var onPreRenderHTML = function onPreRenderHTML(_ref) {
  var getHeadComponents = _ref.getHeadComponents,
      pathname = _ref.pathname,
      replaceHeadComponents = _ref.replaceHeadComponents;
  if (pathname !== "/offline-plugin-app-shell-fallback/") return;
  var headComponents = getHeadComponents();
  var filteredHeadComponents = headComponents.filter(function (_ref2) {
    var type = _ref2.type,
        props = _ref2.props;
    return !(type === "link" && props.as === "fetch" && props.rel === "preload" && (props.href.startsWith("/static/d/") || props.href.startsWith("/page-data/")));
  });
  replaceHeadComponents(filteredHeadComponents);
};

exports.onPreRenderHTML = onPreRenderHTML;

var onRenderBody = function onRenderBody(_ref3) {
  var pathname = _ref3.pathname,
      setHeadComponents = _ref3.setHeadComponents;

  if (pathname !== "/offline-plugin-app-shell-fallback/") {
    return;
  }

  setHeadComponents([/*#__PURE__*/_react.default.createElement("noscript", {
    key: "disable-offline-shell"
  }, /*#__PURE__*/_react.default.createElement("meta", {
    httpEquiv: "refresh",
    content: "0;url=/.gatsby-plugin-offline:api=disableOfflineShell&redirect=true"
  }))]);
};

exports.onRenderBody = onRenderBody;