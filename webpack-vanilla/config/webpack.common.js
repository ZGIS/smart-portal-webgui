var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {

  /*
   * Cache generated modules and chunks to improve performance for multiple incremental builds.
   * This is enabled by default in watch mode.
   * You can pass false to disable it.
   *
   * See: http://webpack.github.io/docs/configuration.html#cache
   */
  //cache: false,

  /*
   * The entry point for the bundle
   * Our Angular.js app
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    /*
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     */
    extensions: ['', '.js', '.ts']
  },

  /*
   * Options affecting the normal modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    /*
     * An array of applied pre and post loaders.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
     */
    preLoaders: [],

    /*
     * An array of automatically applied loaders.
     *
     * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
     * This means they are not resolved relative to the configuration file.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-loaders
     */
    loaders: [
      /*
       * Typescript loader support for .ts and Angular 2 async routes via .async.ts
       * Replace templateUrl and stylesUrl with require()
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader
       * See: https://github.com/TheLarkInn/angular2-template-loader
       */
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader'
        ],
        exclude: [/\.(spec|e2e)\.(t|j)s$/]
      },

      /*
       * Json loader support for *.json files.
       *
       * See: https://github.com/webpack/json-loader

      {
        test: /\.json$/,
        loader: 'json-loader'
      },
       */

      /* Raw loader support for *.html for component templates (the index.html is a special thing)
       * Returns file content as string
       *
       * See: https://github.com/webpack/html-loader
       */
      {
        test: /\.html$/,
        loader: 'html'
      },

      /* File loader for supporting images, for example referenced in CSS and html component files.
       * Images and fonts are bundled and hashed.
       */
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      // workaround to resolve font files from font-awesome node_module referencing
      {
        test: /\.(svg|woff|woff2|ttf|eot)\?v=4\.6\.3$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },

      /*
       * From here now CSS maniac mansion:
       *
       * - one problem is that webpack/angular builder expects styles as arrays
       * - another problem are global styles (like bootstrap theme etc and ol
       *   that we want almost everywhere
       *
       */

      /*
       * from angular.io webpack example intro
       * The first pattern matches application-wide styles,
       * The first pattern excludes .css files within the /src/app directories where our
       * component-scoped styles sit. It includes only .css files located at or above /src;
       * these are the application-wide styles. The ExtractTextPlugin (described below)
       * applies the style and css loaders to these files.
       *
       * the second handles component-scoped styles (the ones specified in a component's
       * styleUrls metadata property).
       * The second pattern filters for component-scoped styles and loads them as strings via the
       * raw loader,        * which is what Angular expects to do with styles specified in a
       * styleUrls metadata property.
       */
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      },

      /*
       * from AngualrClass various snippets
       *
       * to string and css loader support for *.css files
       * Returns file content as string
       *

      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loaders: ['to-string-loader', 'css-loader']
      },
       */

      // other stuff I found and I am not quite sure how it works

      /*
       {
       test: /\.css$/,
       include: helpers.root('src', 'app'),
       loader: "style!css"
       },
       */

      /*
       {
       test: /.css$/,
       exclude: helpers.root('src', 'app'),
       loaders:[ExtractTextPlugin.extract('style', 'css-loader'), 'to-string', 'css']
       }
       */
    ],

    postLoaders: []
  },

  plugins: [

    /*
     * Plugin: CommonsChunkPlugin
     * Description: Shares common code between the pages.
     * It identifies common modules and put them into a commons chunk.
     * We want the app.js bundle to contain only app code and the vendor.js bundle to contain only
     * the vendor code.
     * Our application code imports vendor code. Webpack is not smart enough to keep the vendor
     * code out of the app.js bundle. We rely on the CommonsChunkPlugin to do that job.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
     * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    /*
     * Plugin: HtmlWebpackPlugin
     * Description: Simplifies creation of HTML files to serve your webpack bundles.
     * This is especially useful for webpack bundles that include a hash in the filename
     * which changes every compilation.
     *
     * Webpack generates a number of js and css files. We could insert them into our
     * index.html manually. That would be tedious and error-prone.
     * Webpack can inject those scripts and links for us with the HtmlWebpackPlugin.
     *
     * See: https://github.com/ampedandwired/html-webpack-plugin
     */
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'public/images/favicon.png',
      minify: false,
      // seems not to be picked up title: 'SAC Groundwater Hub',
      // chunksSortMode: 'dependency'
    }),

    // only in dev or prod mode, not in test
    // new ExtractTextPlugin("[name].[hash].css")
  ]
};
