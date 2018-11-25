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
 * iterates across all the image files
 *
 */

var gulp = require('gulp');

var config = require("./config.json");





gulp.task("img", function () {
  return gulp.src(config.web.img.src)
    .pipe(gulp.dest(config.web.img.dest));
});