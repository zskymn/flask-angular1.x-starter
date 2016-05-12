module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      './tmp/vendor/vendor.js',
      './src/vendor/node_modules/angular-mocks/angular-mocks.js',
      './src/{base,app}/js/**/module.js',
      './src/{base,app}/js/**/!(*.spec|*.mock|tpls).js',
      './src/{base,app}/js/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      './src/{base,app}/**/!(*.spec|*.mock|tpls).js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
