// FIRST TIME ONLY- run:
//   ./node_modules/.bin/webdriver-manager update
//
//   Try: `npm run webdriver:update`
//
// AND THEN EVERYTIME ...
//   1. Compile with `tsc`
//   2. Make sure the test server (e.g., http-server: localhost:8080) is running.
//   3. ./node_modules/.bin/protractor protractor.config.js
//
//   To do all steps, try:  `npm run e2e`

var fs = require('fs');
var path = require('canonical-path');
var _ = require('lodash');

// const SpecReporter = require("jasmine-spec-reporter");
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {

  // Capabilities to be passed to the webdriver instance.
  // capabilities: {
  //   browserName: 'chrome'
  // },

  // Protractor will run tests in parallel against each set of capabilities.
  // Please note that if multiCapabilities is defined, the runner will ignore the capabilities configuration.
  multiCapabilities: [{
    'browserName': 'firefox'
  }, {
    'browserName': 'chrome'
  }],

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine2',
  // framework: 'jasmine2', supposedly a workaround of some sort? jasmine also is for jasmine versions +2.x

  // Spec patterns are relative to this config file
  specs: ['**/*e2e-spec.js' ],

  // timeout stuff
  allScriptsTimeout: 30000,
  getPageTimeout: 30000,

  // Base URL for application server .. http-serve
  baseUrl: 'http://localhost:8080',

  // Base URL for application server .. webdriver server
  // directConnect: true,
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // For angular2 tests
  useAllAngular2AppRoots: true,
  rootElement: 'app-sac-gwh',

  onPrepare: function() {
    //// SpecReporter
    jasmine.getEnv().addReporter(new SpecReporter());
    // jasmine.getEnv().addReporter(new SpecReporter({
    //   displayStacktrace: true,
    //   displayFailuresSummary: true,
    //   displayFailedSpec: true,
    //   displaySuiteNumber: true,
    //   displaySpecDuration: true
    // }));

    // debugging
    console.log('browser.params:' + JSON.stringify(browser.params));

    global.sendKeys = sendKeys;

    // Allow changing bootstrap mode to NG1 for upgrade tests, AK 20170425 not necessary anymore?
    // global.setProtractorToNg1Mode = function() {
    //   browser.useAllAngular2AppRoots = false;
    //   browser.rootEl = 'body';
    // };
  },

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    // defaultTimeoutInterval: 10000,
    showTiming: true,
    print: function() {}
  }
};

// Hack - because of bug with protractor send keys
function sendKeys(element, str) {
  return str.split('').reduce(function (promise, char) {
    return promise.then(function () {
      return element.sendKeys(char);
    });
  }, element.getAttribute('value'));
  // better to create a resolved promise here but ... don't know how with protractor;
}

// Custom reporter
function Reporter(options) {
  var _defaultOutputFile = path.resolve(process.cwd(), './_test-output', 'protractor-results.txt');
  options.outputFile = options.outputFile || _defaultOutputFile;

  initOutputFile(options.outputFile);
  options.appDir = options.appDir ||  './';
  var _root = { appDir: options.appDir, suites: [] };
  log('AppDir: ' + options.appDir, +1);
  var _currentSuite;

  this.suiteStarted = function(suite) {
    _currentSuite = { description: suite.description, status: null, specs: [] };
    _root.suites.push(_currentSuite);
    log('Suite: ' + suite.description, +1);
  };

  this.suiteDone = function(suite) {
    var statuses = _currentSuite.specs.map(function(spec) {
      return spec.status;
    });
    statuses = _.uniq(statuses);
    var status = statuses.indexOf('failed') >= 0 ? 'failed' : statuses.join(', ');
    _currentSuite.status = status;
    log('Suite ' + _currentSuite.status + ': ' + suite.description, -1);
  };

  this.specStarted = function(spec) {

  };

  this.specDone = function(spec) {
    var currentSpec = {
      description: spec.description,
      status: spec.status
    };
    if (spec.failedExpectations.length > 0) {
      currentSpec.failedExpectations = spec.failedExpectations;
    }

    _currentSuite.specs.push(currentSpec);
    log(spec.status + ' - ' + spec.description);
  };

  this.jasmineDone = function() {
    outputFile = options.outputFile;
    //// Alternate approach - just stringify the _root - not as pretty
    //// but might be more useful for automation.
    // var output = JSON.stringify(_root, null, 2);
    var output = formatOutput(_root);
    fs.appendFileSync(outputFile, output);
  };

  function initOutputFile(outputFile) {
    var header = "Protractor results for: " + (new Date()).toLocaleString() + "\n\n";
    fs.writeFileSync(outputFile, header);
  }

  // for output file output
  function formatOutput(output) {
    var indent = '  ';
    var pad = '  ';
    var results = [];
    results.push('AppDir:' + output.appDir);
    output.suites.forEach(function(suite) {
      results.push(pad + 'Suite: ' + suite.description + ' -- ' + suite.status);
      pad+=indent;
      suite.specs.forEach(function(spec) {
        results.push(pad + spec.status + ' - ' + spec.description);
        if (spec.failedExpectations) {
          pad+=indent;
          spec.failedExpectations.forEach(function (fe) {
            results.push(pad + 'message: ' + fe.message);
          });
          pad=pad.substr(2);
        }
      });
      pad = pad.substr(2);
      results.push('');
    });
    results.push('');
    return results.join('\n');
  }

  // for console output
  var _pad;
  function log(str, indent) {
    _pad = _pad || '';
    if (indent == -1) {
      _pad = _pad.substr(2);
    }
    console.log(_pad + str);
    if (indent == 1) {
      _pad = _pad + '  ';
    }
  }

}
