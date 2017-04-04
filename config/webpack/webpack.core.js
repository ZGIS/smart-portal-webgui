const webpack = require('webpack');
const chalk = require('chalk');
const env = require('dotenv').config().parsed;
const _ = require('lodash');

const constants = require('./constants');
const helpers = require('./helpers');
const envMap = _.mapValues(env, v => JSON.stringify(v));

const color = constants.ENV_COLOR[env.APP_ENV] || 'bgMagenta';

if (!envMap.APP_ENV) {
  envMap.APP_ENV = '"development"';
  console.log('APP_ENV is not set in your .env, it will default to "development"');
} else {
  console.log('APP_ENV is ' + chalk[color]('%s'), envMap.APP_ENV);
}

if (envMap.APP_CSWI_API_URL && envMap.APP_PORTAL_API_URL) {
  console.log('APP_CSWI_API_URL is ' + chalk[color]('%s'), envMap.APP_CSWI_API_URL);
  console.log('APP_PORTAL_API_URL is ' + chalk[color]('%s'), envMap.APP_PORTAL_API_URL);
} else {
  console.log('No API URL Providers found in ENV, using defaults');
  envMap.APP_CSWI_API_URL = '"https://dev.smart-project.info/cswi-api/v1"';
  envMap.APP_PORTAL_API_URL = '"https://dev.smart-project.info/api/v1"';
  console.log('APP_CSWI_API_URL is ' + chalk[color]('%s'), envMap.APP_CSWI_API_URL);
  console.log('APP_PORTAL_API_URL is ' + chalk[color]('%s'), envMap.APP_PORTAL_API_URL);
}

if (envMap.TRAVIS_BUILD_NUMBER) {
  envMap.APP_BUILD_NUMBER = envMap.TRAVIS_BUILD_NUMBER;
  console.log('APP_BUILD_NUMBER is ' + chalk[color]('%s'), envMap.APP_BUILD_NUMBER);
} else {
  envMap.APP_BUILD_NUMBER = JSON.stringify('' + Date.now());
  console.log('APP_BUILD_NUMBER is ' + chalk[color]('%s'), envMap.APP_BUILD_NUMBER);
}

module.exports = {
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: ['node_modules', helpers.root('src')],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': envMap,
      APP_VERSION: JSON.stringify(require(helpers.root('package.json')).version),
      APP_BUILD_NUMBER: envMap.APP_BUILD_NUMBER,
      APP_CSWI_API_URL: envMap.APP_CSWI_API_URL,
      APP_PORTAL_API_URL: envMap.APP_PORTAL_API_URL
    }),
    new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery'
    }),
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      constants.CONTEXT_REPLACE_REGEX2,
      helpers.root('./src') // location of your src
    )
  ]
};
