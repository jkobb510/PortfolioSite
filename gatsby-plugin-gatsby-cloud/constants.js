"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.POLLING_INTERVAL = exports.PAGE_DATA_DIR = exports.COMMON_BUNDLES = exports.LINK_REGEX = exports.CACHING_HEADERS = exports.NEVER_CACHE_HEADER = exports.IMMUTABLE_CACHING_HEADER = exports.SECURITY_HEADERS = exports.DEFAULT_OPTIONS = exports.CACHE_FUNCTIONS_FILENAME = exports.PUBLIC_FUNCTIONS_FILENAME = exports.REDIRECTS_FILENAME = exports.HEADERS_FILENAME = exports.BUILD_CSS_STAGE = exports.BUILD_HTML_STAGE = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

// Gatsby values
const BUILD_HTML_STAGE = `build-html`;
exports.BUILD_HTML_STAGE = BUILD_HTML_STAGE;
const BUILD_CSS_STAGE = `build-css`; // Plugin values

exports.BUILD_CSS_STAGE = BUILD_CSS_STAGE;
const HEADERS_FILENAME = `_headers.json`;
exports.HEADERS_FILENAME = HEADERS_FILENAME;
const REDIRECTS_FILENAME = `_redirects.json`;
exports.REDIRECTS_FILENAME = REDIRECTS_FILENAME;
const PUBLIC_FUNCTIONS_FILENAME = `_functions.json`;
exports.PUBLIC_FUNCTIONS_FILENAME = PUBLIC_FUNCTIONS_FILENAME;
const CACHE_FUNCTIONS_FILENAME = `manifest.json`;
exports.CACHE_FUNCTIONS_FILENAME = CACHE_FUNCTIONS_FILENAME;
const DEFAULT_OPTIONS = {
  headers: {},
  mergeSecurityHeaders: true,
  mergeLinkHeaders: true,
  mergeCachingHeaders: true,
  transformHeaders: _lodash.default.identity,
  // optional transform for manipulating headers for sorting, etc
  generateMatchPathRewrites: true // generate rewrites for client only paths

};
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
const SECURITY_HEADERS = {
  "/*": [`X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: same-origin`]
};
exports.SECURITY_HEADERS = SECURITY_HEADERS;
const IMMUTABLE_CACHING_HEADER = `Cache-Control: public, max-age=31536000, immutable`;
exports.IMMUTABLE_CACHING_HEADER = IMMUTABLE_CACHING_HEADER;
const NEVER_CACHE_HEADER = `Cache-Control: public, max-age=0, must-revalidate`;
exports.NEVER_CACHE_HEADER = NEVER_CACHE_HEADER;
const CACHING_HEADERS = {
  "/static/*": [IMMUTABLE_CACHING_HEADER],
  "/sw.js": [NEVER_CACHE_HEADER]
};
exports.CACHING_HEADERS = CACHING_HEADERS;
const LINK_REGEX = /^(Link: <\/)(.+)(>;.+)/;
exports.LINK_REGEX = LINK_REGEX;
const COMMON_BUNDLES = [`commons`, `app`];
exports.COMMON_BUNDLES = COMMON_BUNDLES;
const PAGE_DATA_DIR = `page-data/`;
exports.PAGE_DATA_DIR = PAGE_DATA_DIR;
const POLLING_INTERVAL = 5000;
exports.POLLING_INTERVAL = POLLING_INTERVAL;