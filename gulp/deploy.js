
var gulp          = require('gulp');
var helpers       = require("./gulp_helpers.js");
var cheerio       = require('gulp-cheerio');
var tag_version   = require('gulp-tag-version');
var argv          = require('yargs').argv;
var jeditor       = require("gulp-json-editor");
var gulpNgConfig  = require('gulp-ng-config');
var exec          = require('child_process').exec;
var runSequence   = require('run-sequence');

gulp.task('config:deploy:test', function(){
  runSequence('config:deploy:s3:test', 'config:deploy:cloudfront:test');
});

gulp.task('config:deploy:prod', function(){
  runSequence('config:deploy:s3:prod', 'config:deploy:cloudfront:prod');
});

gulp.task('config:deploy:s3:test', function (cb) {

  console.log('DEPLOYING S3 TEST');

  exec('cordova build android  --release', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('config:deploy:cloudfront:test', function (cb) {

  console.log('DEPLOYING CLOUDFRONT TEST');

  exec('cordova build android  --release', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('config:deploy:s3:prod', function (cb) {

  console.log('DEPLOYING S3 PRODUCTION');

  exec('cordova build android  --release', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('config:deploy:cloudfront:prod', function (cb) {

  console.log('DEPLOYING CLOUDFRONT PRODUCTION');

  exec('cordova build android  --release', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
