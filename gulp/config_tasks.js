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
* iterates across all the config files
*
*/

var gulp = require('gulp');

var config = require("./config.json");

gulp.task("config", function () {
  return gulp.src(config.web.config.src)
    .pipe(gulp.dest(config.web.config.dest));
});
