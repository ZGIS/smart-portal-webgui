var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  /**
   * causes webpack-validator to fail the config, but it works and seems necessary?
   * from angular.io webpack example
   */
  htmlLoader: {
    minimize: false // workaround for ng2
  },

  plugins: [

    /**
     * NoErrorsPlugin - stops the build if there is any error.
     * we might want to make it fail :-) ?
     */
    new webpack.NoErrorsPlugin(),

    /**
     * DedupePlugin - detects identical (and nearly identical) files and removes them from the output.
     *
     */
    new webpack.optimize.DedupePlugin(),

    /**
     * ExtractTextPlugin - extracts embedded css as external files, adding cache-busting hash to the filename.
     *
     */
    new ExtractTextPlugin('[name].[hash].css'),

    /**
     * UglifyJsPlugin - minifies the bundles.
     */
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),

    /**
     * DefinePlugin - use to define environment variables that we can reference within our application.
     */
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ]
});
