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
 * iterates across all the fonts files
 *
 */

var gulp = require('gulp');
var flatten = require('gulp-flatten');


var config = require("./config.json");


gulp.task("fonts", function () {
  return gulp.src(config.web.fonts.src)
    .pipe(flatten())
    .pipe(gulp.dest(config.web.fonts.dest));
});
