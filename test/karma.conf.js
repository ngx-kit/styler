const webpackConfig = require('./webpack.test');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      './test.js'
    ],
    preprocessors: {
      './test.js': ['webpack'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      quiet: false,
      stats: {
        colors: true
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
};
