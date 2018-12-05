const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

// const ngtools = require('@ngtools/webpack');
const AotPlugin = require('@ngtools/webpack').AotPlugin;

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

    new AotPlugin({
      tsConfigPath: helpers.root('tsconfig-aot.json'),
      entryModule: helpers.root('src','app','app.module#AppModule')
    }),
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
    ]),
    new TypedocWebpackPlugin({

        name: 'SMART WebGui',
        mode: 'file',
        includeDeclarations: false,
        ignoreCompilerErrors: true,
        out: helpers.root('api-docs'),
        exclude: '**/node_modules/**/*.*',
        experimentalDecorators: true,
        excludeExternals: true
      },
      [ helpers.root('src')]
    )
  ]
});
