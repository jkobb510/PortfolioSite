'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('@theme-ui/preset-base');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var base__default = /*#__PURE__*/_interopDefault(base);

const text = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
const polaris = { ...base__default['default'],
  colors: {
    text: '#454f5b',
    background: '#fff',
    primary: '#5c6ac4',
    secondary: '#006fbb',
    highlight: '#47c1bf',
    muted: '#e6e6e6',
    gray: '#dfe3e8',
    accent: '#f49342',
    darken: '#00044c',
    modes: {
      dark: {
        text: '#3e4155',
        background: '#000639',
        primary: '#9c6ade',
        secondary: '#b4e1fa',
        highlight: '#b7ecec',
        muted: '#e6e6e6'
      }
    }
  },
  fonts: {
    body: text,
    heading: text,
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

exports.default = polaris;
exports.polaris = polaris;
