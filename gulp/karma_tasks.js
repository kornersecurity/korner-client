var gulp = require('gulp');
var karma = require('karma').server;
var config = require("./config.json");
var helpers = require("./gulp_helpers.js");
var path = require('path');
var mainBowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var karma = require("karma").server;
var git = require('gulp-git');

/**
 * Run test once and exit
 */
gulp.task('karma:test', function(done) {

  // it appears that the karma.conf.js file is not flushed to disk
  // so instead of running straight away, we wait for 1 second
  setTimeout(function() {
    karma.start({
      // configFile: __dirname + '/karma.conf.js',
      configFile: path.resolve('./karma.conf.js'),
      singleRun: true,
      reporters: ['junit', 'progress']
    }, done);

  }, 1000);

});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('karma:tdd', function(done) {
  karma.start({
    configFile: path.resolve('./karma.conf.js'),
    reporters: ['junit', 'progress']
  }, done);
});

/**
 * Inject dependencies in karma.conf.js
 */
gulp.task('karma:inject', function() {

  var components = mainBowerFiles({
    paths: {
      bowerDirectory: config.web.bower.base
    },
    includeDev: true
  });

  var splittedComponents = helpers.splitComponentFilesByType(components);
  var jsComponents = splittedComponents.jsComponents;


  jsComponents.push('./src/app/app.js');
  jsComponents.push('./src/app/**/*.js');
  jsComponents.push('./src/app/**/*-spec.js');

  gulp.src('./karma.conf.js')
    .pipe(inject(gulp.src(jsComponents, {
      read: false
    }), {
      starttag: 'files: [',
      endtag: ']',
      transform: function(filepath, file, i, length) {
        return '  ".' + filepath + '"' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('./'));

  // this will remove the tracking of karma conf
  // to start tracking do a git update-index --no-skip-worktree karma.conf.js
  git.exec({
    args: 'update-index --skip-worktree ./karma.conf.js'
  }, function(err, stdout) {
    if (err) throw err;
  });



});