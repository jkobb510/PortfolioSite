"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _webpackAssetsManifest = _interopRequireDefault(require("webpack-assets-manifest"));

var _gatsbyTelemetry = require("gatsby-telemetry");

var _pluginData = _interopRequireDefault(require("./plugin-data"));

var _buildHeadersProgram = _interopRequireDefault(require("./build-headers-program"));

var _copyFunctionsManifest = _interopRequireDefault(require("./copy-functions-manifest"));

var _createRedirects = _interopRequireDefault(require("./create-redirects"));

var _fsExtra = require("fs-extra");

var _gatsbyCoreUtils = require("gatsby-core-utils");

var _constants = require("./constants");

const assetsManifest = {};
process.env.GATSBY_PREVIEW_INDICATOR_ENABLED = process.env.GATSBY_PREVIEW_INDICATOR_ENABLED || `false`; // Inject a webpack plugin to get the file manifests so we can translate all link headers

exports.onCreateWebpackConfig = ({
  actions,
  stage
}) => {
  if (stage !== _constants.BUILD_HTML_STAGE && stage !== _constants.BUILD_CSS_STAGE) {
    return;
  }

  actions.setWebpackConfig({
    plugins: [new _webpackAssetsManifest.default({
      assets: assetsManifest,
      // mutates object with entries
      merge: true
    })]
  });
};

exports.onPostBuild = async ({
  store,
  pathPrefix,
  reporter
}, userPluginOptions) => {
  const pluginData = (0, _pluginData.default)(store, assetsManifest, pathPrefix);
  const pluginOptions = { ..._constants.DEFAULT_OPTIONS,
    ...userPluginOptions
  };
  const {
    redirects,
    pageDataStats,
    nodes
  } = store.getState();
  let nodesCount;

  try {
    const {
      getDataStore
    } = require(`gatsby/dist/datastore`);

    nodesCount = getDataStore().countNodes();
  } catch (e) {// swallow exception
  }

  if (typeof nodesCount === `undefined`) {
    nodesCount = nodes && nodes.size;
  }

  const pagesCount = pageDataStats && pageDataStats.size;
  (0, _gatsbyTelemetry.captureEvent)(`GATSBY_CLOUD_METADATA`, {
    siteMeasurements: {
      pagesCount,
      nodesCount
    }
  });
  let rewrites = [];

  if (pluginOptions.generateMatchPathRewrites) {
    const matchPathsFile = (0, _gatsbyCoreUtils.joinPath)(pluginData.program.directory, `.cache`, `match-paths.json`);
    const matchPaths = await (0, _fsExtra.readJSON)(matchPathsFile);
    rewrites = matchPaths.map(({
      matchPath,
      path
    }) => {
      return {
        fromPath: matchPath,
        toPath: path
      };
    });
  }

  await Promise.all([(0, _buildHeadersProgram.default)(pluginData, pluginOptions, reporter), (0, _createRedirects.default)(pluginData, redirects, rewrites), (0, _copyFunctionsManifest.default)(pluginData)]);
};

const MATCH_ALL_KEYS = /^/;

const pluginOptionsSchema = function ({
  Joi
}) {
  const headersSchema = Joi.object().pattern(MATCH_ALL_KEYS, Joi.array().items(Joi.string())).description(`Add more headers to specific pages`);
  return Joi.object({
    headers: headersSchema,
    allPageHeaders: Joi.array().items(Joi.string()).description(`Add more headers to all the pages`),
    mergeSecurityHeaders: Joi.boolean().description(`When set to false, turns off the default security headers`),
    mergeLinkHeaders: Joi.boolean().description(`When set to false, turns off the default gatsby js headers`),
    mergeCachingHeaders: Joi.boolean().description(`When set to false, turns off the default caching headers`),
    transformHeaders: Joi.function().maxArity(2).description(`Transform function for manipulating headers under each path (e.g.sorting), etc. This should return an object of type: { key: Array<string> }`),
    generateMatchPathRewrites: Joi.boolean().description(`When set to false, turns off automatic creation of redirect rules for client only paths`)
  });
};

exports.pluginOptionsSchema = pluginOptionsSchema;