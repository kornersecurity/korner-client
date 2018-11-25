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
 * Compiles the necessary web app moduels into a single minified js file
 *
 */

var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require("gulp-ng-annotate");
var helpers = require("./gulp_helpers.js");
var angularFilesort = require('gulp-angular-filesort');
var config = require("./config.json");
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');


gulp.task('js', function () {

  var settingsJson = require('../src/config/settings-config.json');
  var shouldUglify = settingsJson[settingsJson.selectedEnvironment].appSettingsConst.uglify;
  var writeSourceMaps = settingsJson[settingsJson.selectedEnvironment].appSettingsConst.maps;

  gulp.src(config.web.js.src)
    .pipe(ngAnnotate()).on("error", helpers.handleError)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(inject(
      gulp.src(config.web.js.src)
        .pipe(angularFilesort()).on("error", helpers.handleError)
    )).on("error", helpers.handleError)

    .pipe(gulpif(writeSourceMaps, sourcemaps.init({
      loadMaps: true
    })))

    .pipe(concat(config.web.js.output)).on("error", helpers.handleError)

    .pipe(gulpif(shouldUglify, uglify())).on("error", helpers.handleError)

    .pipe(rename({ extname: '.min.js' }))

    .pipe(gulpif(writeSourceMaps, sourcemaps.write()))
    .pipe(gulpif(writeSourceMaps, sourcemaps.write('.')))

    .pipe(gulp.dest(config.web.js.dest));
});
