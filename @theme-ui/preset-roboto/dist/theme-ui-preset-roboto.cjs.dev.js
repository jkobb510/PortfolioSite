'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('@theme-ui/preset-base');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var base__default = /*#__PURE__*/_interopDefault(base);

const roboto = { ...base__default['default'],
  colors: {
    text: '#202124',
    background: '#fff',
    primary: '#1a73e8',
    secondary: '#9c27b0',
    muted: '#f1f3f4'
  },
  fonts: {
    body: 'Roboto, system-ui, sans-serif',
    heading: 'Roboto, system-ui, sans-serif',
    monospace: '"Roboto Mono", monospace'
  },
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 600
  }
};

exports.default = roboto;
exports.roboto = roboto;
