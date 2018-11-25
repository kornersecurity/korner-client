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
 * Compiles the necessary vendor files into a single minified js file
 * so that the browser only needs to request a single file on startup
 *
 */

var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var flatten = require('gulp-flatten');
var helpers = require("./gulp_helpers.js");
// var inject = require('gulp-inject');
// var angularFilesort = require('gulp-angular-filesort');
var mainBowerFiles = require('main-bower-files');
var wiredep = require('wiredep').stream;
var config = require("./config.json");
var settingsJson = require('../src/config/settings-config.json');
var shouldUglify = settingsJson[settingsJson.selectedEnvironment].appSettingsConst.uglify;


gulp.task("web:bower", function () {

  var components = mainBowerFiles({
    paths: {
      bowerDirectory: config.web.bower.base
    }
  });

  var splittedComponents = helpers.splitComponentFilesByType(components);
  //{jsComponents: jsComponents, cssComponents: cssComponents, fontsComponents:
  var jsComponents = splittedComponents.jsComponents;
  var cssComponents = splittedComponents.cssComponents;
  var fontsComponents = splittedComponents.fontsComponents;

  // for(var j in jsComponents)
  // {
  //   console.log( 'JS: '+jsComponents[j]);
  // }
  //
  // for(var c in cssComponents)
  // {
  //   console.log( 'CSS: '+cssComponents[c]);
  // }
  //
  // for(var f in fontsComponents)
  // {
  //   console.log( 'FONTS: '+fontsComponents[f]);
  // }

  gulp.src(jsComponents).pipe(sourcemaps.init({
    loadMaps: true
  }))
    // .pipe(concat(config.web.bower.output)).on("error", helpers.handleError)
    .pipe(gulpif(shouldUglify, uglify())).on("error", helpers.handleError)
    // .pipe(rename({
    //   extname: '.min.js'
    // }))
    // .pipe(sourcemaps.write('.'))
    .pipe(flatten())
    .pipe(gulp.dest(config.web.bower.dest));

  gulp.src(cssComponents).pipe(flatten())
    .pipe(gulp.dest(config.web.css.dest));

  gulp.src(fontsComponents).pipe(flatten())
    .pipe(gulp.dest(config.web.fonts.dest));

});





gulp.task("web:inject_delayed", function () {
  setTimeout(function () {
    gulp.start('web:inject');
  }, 1000);

});

gulp.task("web:inject", function () {

  gulp.src('./www/index.html')
    .pipe(wiredep({
      fileTypes: {
        html: {
          replace: {
            js: function (filePath) {
              // console.log(filePath);
              return '<script src="lib/' + filePath.split("/").pop() + '"></script>';
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('./www'));
});
