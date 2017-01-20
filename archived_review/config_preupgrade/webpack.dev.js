const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:8080/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  /**
   * Our CSS are buried inside our Javascript bundles by default.
   * The ExtractTextPlugin extracts them into external .css files
   * that the HtmlWebpackPlugin inscribes as <link> tags into the index.html.
   */
  plugins: [
    new ExtractTextPlugin('[name].css'),

    /**
     * Plugin LoaderOptionsPlugin (experimental)
     *
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7
     */
    new LoaderOptionsPlugin({
      debug: true,
      options: {

      }
    }),
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});
