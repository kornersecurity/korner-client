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
 * iterates across all the sass files and compiles them into css files
 *
 */

var gulp = require("gulp");
var less = require('gulp-less');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var flatten = require('gulp-flatten');
var helpers = require("./gulp_helpers.js");

var config = require("./config.json");

gulp.task("css:hack", function () {
  gulp.src('src/material_hacks/**/*.scss')
    .pipe(gulp.dest('src/bower_components/ionic/scss'));
});

// Application Less Files
gulp.task("css:app", function () {
  return gulp.src(config.web.css.sass.src)
    .pipe(flatten())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sass()).on("error", helpers.handleError)
    .pipe(minifyCss({
      keepSpecialComments: 0
    })).on("error", helpers.handleError)
    .pipe(rename({
      extname: '.min.css'
    }))
    // .pipe(sourcemaps.write("."))

    .pipe(gulp.dest(config.web.css.sass.dest));
});


gulp.task("css:vendor", function () {
  return gulp.src(config.web.css.vendor.src)
    .pipe(flatten())
    .pipe(gulp.dest(config.web.css.vendor.dest));
});


gulp.task("css", ['css:hack', 'css:app', 'css:vendor']);