'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('@theme-ui/preset-base');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var base__default = /*#__PURE__*/_interopDefault(base);

const future = { ...base__default['default'],
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#11e',
    secondary: '#c0c',
    highlight: '#e0e',
    muted: '#f6f6ff',
    modes: {
      dark: {
        text: '#fff',
        background: '#000',
        primary: '#0fc',
        secondary: '#0cf',
        highlight: '#f0c',
        muted: '#011'
      }
    }
  },
  fonts: {
    body: '"Avenir Next", system-ui, sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace'
  },
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 700
  },
  lineHeights: {
    body: 1.75,
    heading: 1.25
  }
};

exports.default = future;
exports.future = future;
