const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const path = require('path');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  // copy plugin requirements
  // context: path.join(__dirname, 'app'),
  context: path.resolve(__dirname, '..'),
  devServer: {
    // This is required for older versions of webpack-dev-server
    // if you use absolute 'to' paths. The path should be an
    // absolute path to your build destination.
    // outputPath: path.join(__dirname, 'build')
    outputPath: helpers.root('dist/')
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

    // static copy for dynamic images
    new CopyWebpackPlugin([

      // Copy directory contents to {output}/
      // { from: 'public/images' }

      // Copy directory contents to {output}/to/directory/
      { from: 'public/images', to: 'public/images' },

      // Copy glob results to /absolute/path/
      //{ from: 'public/images/**/*', to: 'dist/public/images' },

      // Copy glob results (with dot files) to /absolute/path/

      // {
      //   from: {
      //     glob:'public/images/**/*',
      //     dot: false
      //   },
      //   to: 'dist/public/images'
      // }
    ], {
      ignore: [
        // Doesn't copy any files with a txt extension
        '*.txt',
        '*.json'
      ],

      // By default, we only copy modified files during
      // a watch or webpack-dev-server build. Setting this
      // to `true` copies all files.
      copyUnmodified: true
    }),

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
    }),

    /**
     * Plugin LoaderOptionsPlugin (experimental)
     *
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7
     */
    new LoaderOptionsPlugin({
      minimize: false,
      debug: false,
      options: {

        /**
         * Html loader advanced options
         *
         * htmlLoader: {
         *   minimize: false // workaround for ng2
         * },
         *
         *
         * See: https://github.com/webpack/html-loader#advanced-options
         */
        // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
        htmlLoader: {
          minimize: false,
          removeAttributeQuotes: false,
          caseSensitive: true,
          customAttrSurround: [
            [/#/, /(?:)/],
            [/\*/, /(?:)/],
            [/\[?\(?/, /(?:)/]
          ],
          customAttrAssign: [/\)?\]?=/]
        },

      }
    }),
  ]
});
