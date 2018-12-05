const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');


 // // only needed in prod aot builds
 // ,
 // new TypedocWebpackPlugin({
 //
 // name: 'SMART WebGui',
 // mode: 'file',
 // includeDeclarations: false,
 // ignoreCompilerErrors: true,
 // out: helpers.root('api-docs'),
 // exclude: '**/node_modules/**/*.*',
 //  experimentalDecorators: true,
 //    excludeExternals: true
 //  },
 //  [ helpers.root('src')]
 //  )

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: 'awesome-typescript-loader',
        query: {
          forkChecker: true
        },
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.ts$/,
        loaders: [
          'angular2-template-loader'
        ],
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.ts$/,
        loaders: [
          'angular-router-loader?loader=system&genDir=src&aot=false'
        ],
        exclude: [
          /node_modules/
        ]
      }
    ]
  },

  output: {
    path: helpers.root('dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        warnings: false,
        screw_ie8: true
      },
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
    ]),
    new CopyWebpackPlugin([
      { from: './src/public/robots.txt', to: './robots.txt' },
      { from: './src/public/sitemap.xml', to: './sitemap.xml' },
      { from: './src/public/sitemap_base.xml', to: './sitemap_base.xml' }
    ])
  ]
});
