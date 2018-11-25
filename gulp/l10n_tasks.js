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
 * Creates the Compiles the translations file used by AngularJS-GetText
 *
 */


var gulp = require("gulp");
var gettext = require("gulp-angular-gettext");
var config = require("./config.json");

// Iterates across all the html files in the server/public/view directory
// and extracts all the strings that have been identified to be localized
// | translate or <translate>
gulp.task("l10n:extract", function () {
  return gulp.src(config.web.l10n.extract.src)
    .pipe(gettext.extract(config.web.l10n.extract.output, {}))
    .pipe(gulp.dest(config.web.l10n.extract.dest));
});

// Iterates across all the poedit files and compiles them into language
// specific json files that can be loaded by AngularJS-GetText
gulp.task("l10n:translate", function () {
  return gulp.src(config.web.l10n.translate.src)
    .pipe(gettext.compile({
      format: "json"
    }))
    .pipe(gulp.dest(config.web.l10n.translate.dest));
});