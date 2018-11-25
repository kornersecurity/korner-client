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
 * iterates across all the jade templates and compiles them into html files
 *
 */

var gulp = require('gulp');
var jade = require('gulp-jade');
var prettify = require('gulp-html-prettify');
var flatten = require('gulp-flatten');
var helpers = require("./gulp_helpers.js");
var config = require("./config.json");
var helpers = require("./gulp_helpers.js");


gulp.task('views:index', function () {
  return gulp.src(config.web.views.index.src)
    .pipe(jade({})).on("error", helpers.handleError)
    .pipe(gulp.dest(config.web.views.index.dest));
});

gulp.task('views:templates', function () {
  return gulp.src(config.web.views.src)
    .pipe(flatten())
    .pipe(jade({})).on("error", helpers.handleError)
    .pipe(gulp.dest(config.web.views.dest));
});

gulp.task('views', ['views:index', 'views:templates']);