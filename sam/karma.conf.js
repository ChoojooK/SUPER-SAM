module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'browserify'],
    browsers: ['ChromeHeadless', 'Chrome_without_security'],
    browserDisconnectTimeout: 10000, // timeout for disconnect
    browserDisconnectTolerance: 3, // tolerance for disconnect
    browserNoActivityTimeout: 30000, // timeout for no activity
    customLaunchers: {
      Chrome_without_security: {
        base: 'ChromeHeadless',
        flags: ['--disable-web-security']
      }
    },
    files: [
      'test/minimum-tests.spec.js',
      'src/**/*.es6',
      'test/**/*.json',
      { pattern: 'test/**/*-testcase.js', include: false, serve: false, watch: true }
    ],
    exclude: [],
    client: {
      mocha: {
        require: []
      }
    },
    reporters: ['progress', 'mocha'],
    mochaReporter: {
      output: 'minimal',
      showDiff: true
    },
    preprocessors: {
      'src/**/*.es6': ['browserify', 'sourcemap'],
      'test/**/*.spec.js': ['browserify', 'sourcemap'],
      'test/**/*-testcase.js': ['browserify', 'sourcemap']
    },
    browserify: {
      debug: true,
      transform: ['babelify']
    }
  });
};
