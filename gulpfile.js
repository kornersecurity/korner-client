/**
 * Gulp Tasks
 *
 *  (c) 2014 PatrolTag Inc. All rights reserved. http://kornersafe.com
 *  Created by Dan Jones (dan@kornersafe.com)
 *
 */

/**
 * @description
 *
 * Builds the various componets of the Korner Web App
 *
 * please refer to the readme.md file for help with this tool
 *
 */

var gulp = require("gulp");
var taskListing = require("gulp-task-listing");
var requireDir = require("require-dir");
var dir = requireDir("./gulp");
var clean = require("gulp-clean");
var config = require("./gulp/config.json");
var gettext = require('gulp-angular-gettext');
var bower = require('bower');
var runSequence = require('run-sequence');
var errorsHelper = require("./gulp/errorsHelper.js");

// Major Gulp Commands
gulp.task('default', ['build']);

gulp.task("help", taskListing);
// gulp.task("build", ['css', 'fonts', 'config', 'img', 'js', 'views', 'web:bower', 'web:inject', 'translate']);
gulp.task('test', ['karma:inject', 'karma:test']);
gulp.task('test:tdd', ['karma:inject', 'karma:tdd']);

gulp.task('build', function (callback) {
  runSequence(['css', 'fonts', 'img', 'js', 'views', 'web:bower'],
    'web:inject',
    'translate',
    function () {
      if (errorsHelper.errors === '') {
        console.log('BUILD SUCCESSFULL - NO ERRORS');
      } else {
        console.log('BUILD ERRORS: ' + errorsHelper.errors);
      }
      callback();
    });
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.start('build');
  gulp.watch(config.web.css.watch, ['css']);
  gulp.watch(config.web.fonts.watch, ['fonts']);
  // gulp.watch(config.web.config.watch, ['config']);
  gulp.watch(config.web.img.watch, ['img']);
  gulp.watch(config.web.js.watch, ['js']);
  // gulp.watch(config.web.bower.watch, ['lib']);
  gulp.watch(config.web.views.watch, ['views', 'web:inject_delayed']);
  // gulp.watch(['./gulp/**/*.*', './gulpfile.js'], ['build']);

});

gulp.task('clean', function () {
  return gulp.src('www', {
    read: false
  })
    .pipe(clean());
});

gulp.task('showBuildErrors', function () {
  setTimeout(function () {
    if (errorsHelper.errors === '') {
      console.log('BUILD SUCCESSFULL - NO ERRORS');
    } else {
      console.log('BUILD ERRORS: ' + errorsHelper.errors);
    }
  }, 1500);
});

//Installs bower components
gulp.task('bower', function (cb) {
  bower.commands.install([], {
    save: true
  }, {})
    .on('end', function (installed) {
      cb(); // notify gulp that this task is finished
    });
});

// LOCALIZATION
gulp.task('pot', function () {
  return gulp.src(['src/app/**/*.jade', 'src/app/**/*.js', 'www/app/views/*.html'])
    .pipe(gettext.extract('korner_mobile_l10n.pot', {
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest('src/pot/'));
});

gulp.task('translate', function () {
  return gulp.src('src/pot/**/*.po')
    .pipe(gettext.compile({
      // options to pass to angular-gettext-tools...
      // format: 'json'
    }))
    .pipe(gulp.dest('www/app/js/'));
});
