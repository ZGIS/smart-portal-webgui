var webpackConfig = require('./config/webpack/webpack.test');

module.exports = function (config) {

  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {
        pattern: './config/test/karma-test-shim.js',
        watched: false
      }
    ],

    preprocessors: {
      './config/test/karma-test-shim.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    // coverageReporter: {
    //   type: 'in-memory'
    // },
    //
    // remapCoverageReporter: {
    //   'text-summary': null,
    //   'json': './coverage/coverage.json',
    //   'html': './coverage/html',
    //   'lcovonly': './coverage/lcov.info'
    // },

    specReporter: {
      maxLogLines: 5, // limit number of lines logged per test
      suppressErrorSummary: false, // do not print error summary
      suppressFailed: false, // do not print information about failed tests
      suppressPassed: false, // do not print information about passed tests
      suppressSkipped: false, // do not print information about skipped tests
      showSpecTiming: true,  // print the time elapsed for each spec
      failFast: true // test would finish with error when a first fail occurs.
    },

    // reporter options
    mochaReporter: {
      colors: {
        success: 'blue',
        info: 'bgGreen',
        warning: 'cyan',
        error: 'bgRed'
      },
      symbols: {
        success: '+',
        info: '#',
        warning: '!',
        error: 'x'
      }
    },

    // 'remap-coverage',
    reporters: ['spec', 'mocha' ],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: !config.ci,
    browsers: ['Chrome'],
    singleRun: config.ci
  };

  // _config.reporters.push('coverage');
  if (config.ci) {
    _config.preprocessors['./config/test/karma-test-shim.js'].unshift('coverage');
  }

  config.set(_config);
};
