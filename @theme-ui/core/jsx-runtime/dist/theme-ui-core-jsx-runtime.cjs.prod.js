'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var parseProps = require('@theme-ui/parse-props');
var jsxRuntime = require('@emotion/react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var parseProps__default = /*#__PURE__*/_interopDefault(parseProps);

const jsx = (type, props, key) => jsxRuntime.jsx(type, parseProps__default['default'](props), key);
const jsxs = (type, props, key) => jsxRuntime.jsxs(type, parseProps__default['default'](props), key);

Object.defineProperty(exports, 'Fragment', {
  enumerable: true,
  get: function () {
    return React.Fragment;
  }
});
exports.jsx = jsx;
exports.jsxs = jsxs;
