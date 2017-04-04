const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');

const coreConfig = require('./webpack.core');
const helpers = require('./helpers');

const isCI = process.argv.indexOf('--ci') !== -1;

if (isCI) {
  console.log(chalk.bgBlue('CI flag is on'));
} else {
  console.log(chalk.bgGreen('CI flag is off'))
}

module.exports = webpackMerge(coreConfig, {
  devtool: 'inline-source-map',

  // entry: 'src/app/main.ts',
  entry: function(){return {}} ,

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'awesome-typescript-loader',
        query: {
          module: 'commonjs',
          sourceMap: !isCI,
          inlineSourceMap: isCI,
          forkChecker: true
        }
      },
      {
        test: /\.ts$/,
        use: 'angular2-template-loader'
      },
      {
        test: /\.html$/,
        use: 'html-loader'

      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)/,
        use: 'null-loader'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        use: 'null-loader'
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        use: 'raw-loader'
      }
    ]
    .concat(!isCI ? [] : [
      {
        test: /\.(js|ts)$/,
        enforce: 'post',
        use: 'istanbul-instrumenter-loader',
        include: helpers.root('src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      }
    ])
  }
});
