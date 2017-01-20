const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ngtools = require('@ngtools/webpack');

const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  module: {
    rules: [
      {
        enforce: 'post',
        test: /\.ts$/,
        loaders: ['@ngtools/webpack'],
        exclude: [/\.(spec|e2e)\.ts$/]
      }
    ]
  },

  output: {
    path: helpers.root('dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  plugins: [
    new ngtools.AotPlugin({
      tsConfigPath: "./src/tsconfig-aot.json",
      mainPath: "main.ts"
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        keep_fnames: true
      },
      compress: {screw_ie8: true},
      comments: false
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: false,
      options: {
        postcss: [require('postcss-cssnext')],
        htmlLoader: {
          minimize: false // workaround for ng2
        }
      }
    }),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8
    }),
    new CopyWebpackPlugin([
      {
        from: './src/public/images',
        to: './images'
      }
    ])
  ]
});
