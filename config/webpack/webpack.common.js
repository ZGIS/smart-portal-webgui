const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const helpers = require('./helpers');
const coreConfig = require('./webpack.core');

const isProd = process.env.npm_lifecycle_event === 'build';

const entry = {
  'polyfills': './src/polyfills.ts',
  'style': './src/style.ts',
  'vendor': './src/vendor.ts',
  'app': './src/main.ts'
};

module.exports = webpackMerge(coreConfig, {
  entry: entry,

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /^((?!(ngfactory|shim)).)*ts$/,
        use: 'tslint-loader',
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: helpers.root('src', 'public')
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        use: ExtractTextPlugin
          .extract({
            fallback: "style-loader",
              use: ['css-loader' + (isProd ? '?minimize' : ''), 'postcss-loader']
          })
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        use: 'raw-loader'
        // use: 'raw-loader!postcss-loader'
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app','style', 'vendor', 'vendorDll', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      favicon: 'src/public/favicon.png',
      template: 'src/public/index.html'
    }),

    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [require('postcss-cssnext')],
        tslint: {
          emitError: false,
          failOnHint: false
        }
      }
    })
  ]

});
