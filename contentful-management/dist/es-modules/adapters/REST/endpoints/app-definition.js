function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as raw from './raw';
import copy from 'fast-copy';
import { normalizeSelect } from './utils';

var getBaseUrl = function getBaseUrl(params) {
  return "/organizations/".concat(params.organizationId, "/app_definitions");
};

export var getAppDefinitionUrl = function getAppDefinitionUrl(params) {
  return getBaseUrl(params) + "/".concat(params.appDefinitionId);
};
export var get = function get(http, params) {
  return raw.get(http, getAppDefinitionUrl(params), {
    params: normalizeSelect(params.query)
  });
};
export var getMany = function getMany(http, params) {
  return raw.get(http, getBaseUrl(params), {
    params: params.query
  });
};
export var create = function create(http, params, rawData) {
  var data = copy(rawData);
  return raw.post(http, getBaseUrl(params), data);
};
export var update = function update(http, params, rawData, headers) {
  var _rawData$sys$version;

  var data = copy(rawData);
  delete data.sys;
  return raw.put(http, getAppDefinitionUrl(params), data, {
    headers: _objectSpread({
      'X-Contentful-Version': (_rawData$sys$version = rawData.sys.version) !== null && _rawData$sys$version !== void 0 ? _rawData$sys$version : 0
    }, headers)
  });
};
export var del = function del(http, params) {
  return raw.del(http, getAppDefinitionUrl(params));
};