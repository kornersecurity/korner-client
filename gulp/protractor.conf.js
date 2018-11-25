// protractor.conf.js

exports.config = {
  capabilities: {
    browserName: 'chrome'
  },

  baseUrl: 'http://localhost:8100/',

  framework: 'jasmine',
  
  specs: ['../src/app/**/*.e2e.js'],
  
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose: true,
    includeStackTrace: true,
  },
  
  allScriptsTimeout: 30000,
    onPrepare: function() {
    }
};
