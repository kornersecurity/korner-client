
var gulp          = require('gulp');
var helpers       = require("./gulp_helpers.js");
var cheerio       = require('gulp-cheerio');
var tag_version   = require('gulp-tag-version');
var argv          = require('yargs').argv;
var jeditor       = require("gulp-json-editor");
var gulpNgConfig  = require('gulp-ng-config');
// var exec          = require('gulp-exec');
var exec          = require('child_process').exec;
var runSequence   = require('run-sequence');
var config        = require("./config.json");

gulp.task('config:version:get', function () {
  var pjson = require('../package.json');
  console.log('PACKAGE.JSON VERSION: '+pjson.version);
  console.log('PACKAGE.JSON BUILD:   '+pjson.build);

  return gulp.src(['./config.xml'])
    .pipe(cheerio({
      run: function ($, file) {
        console.log('CONFIG.XML VERSION: '+$('widget').attr('version'));
        console.log('CONFIG.XML BUILD:   '+$('widget').attr('build'));
      },
      parserOptions: {
        xmlMode: true
      }
    })
  );

});

gulp.task('config:version:update', function () {

  runSequence('config:version:update:pkg',
              'config:version:update:conf',
              'config:version:update:int',
              'config:settings:update',
              'config:version:copy:json');
});

gulp.task('config:version:update:pkg', function () {

  console.log('NEW VERSION: '+argv.version);
  console.log('NEW BUILD:   '+argv.build);

  return gulp.src("./package.json")
    .pipe(jeditor({
      'version': argv.version,
      'build': argv.build
    })).on("error", helpers.handleError)
    .pipe(gulp.dest("."));
});

gulp.task('config:version:update:conf', function () {
  return gulp.src(['./config.xml'])
    .pipe(cheerio({
      run: function ($, file) {
        $('widget').attr('version', argv.version);
        $('widget').attr('build', argv.build);
        $('widget').attr('android-versionCode', argv.version.split('.').join("")+argv.build);
      },
      parserOptions: {
        xmlMode: true
      }
    })).on("error", helpers.handleError)
    .pipe(gulp.dest('.'));
});

gulp.task('config:version:update:int', function () {
  //internal config file loaded by app at runtime
  return gulp.src("./src/config/build-config.json")
    .pipe(jeditor({
      'version': argv.version,
      'build': argv.build
    })).on("error", helpers.handleError)
    .pipe(gulp.dest("./src/config/"));
});

gulp.task('config:version:copy:json', function () {
  //internal config file loaded by app at runtime
  return gulp.src("./src/config/build-config.json")
    .pipe(gulp.dest(config.web.config.dest));
});


gulp.task('config:settings:get', function () {
  var buildJson     = require('../src/config/build-config.json');
  var settingsJson  = require('../src/config/settings-config.json');
  console.log('VERSION:         '+buildJson.version);
  console.log('BUILD:           '+buildJson.build);

  console.log('ENVIRONMENT:     '+settingsJson.selectedEnvironment);
  console.log('HTTP PROTOCOL:   '+settingsJson[settingsJson.selectedEnvironment].appSettingsConst.httpProtocol);
  console.log('SOCKET PROTOCOL: '+settingsJson[settingsJson.selectedEnvironment].appSettingsConst.socketProtocol);
  console.log('END POINT:       '+settingsJson[settingsJson.selectedEnvironment].appSettingsConst.endPoint);
  console.log('DEBUG:           '+settingsJson[settingsJson.selectedEnvironment].appSettingsConst.debug);
});

gulp.task('config:settings:update', function () {

  runSequence('config:settings:update:src',
              'config:settings:update:out');
});

gulp.task('config:settings:update:src', function () {
  console.log('NEW ENVIRONMENT:   '+argv.env);

  return gulp.src("./src/config/settings-config.json")
    .pipe(jeditor({
      'selectedEnvironment': argv.env
    }))
    .pipe(gulp.dest("./src/config/"));

});

gulp.task('config:settings:update:out', function () {
  setTimeout(function() {
    console.log('UPDATING src/app/settings-config');
    var buildJson     = require('../src/config/build-config.json');
    var settingsJson  = require('../src/config/settings-config.json');
    gulp.src("./src/config/settings-config.json")
      .pipe(gulpNgConfig('app',
        { environment:  argv.env,
          createModule: false,
          wrap: true,
          constants: {appSettingsConst:{version: buildJson.version, build: buildJson.build} }
        }).on("error", helpers.handleError)
      ).pipe(gulp.dest('./src/app/'));
  }, 1000);

});


gulp.task('config:build:debug', function () {

  if(argv.platform === 'android'){
    runSequence('clean',
                'config:settings:update',
                'build',
                'config:build:debug:android');//,

  } else if(argv.platform === 'ios'){
    runSequence('clean',
                'config:settings:update',
                'build',
                'config:build:debug:ios');

  } else {
    runSequence('clean',
                'config:settings:update',
                'build',
                'config:build:debug:android',
                'config:build:debug:ios');
  }
});

gulp.task('config:build:release', function () {

  if(argv.platform === 'android'){
    runSequence('clean',
                'config:settings:update',
                'build',
                'config:build:release:android',
                'config:build:sign:android',
                'config:build:zipalign:android',
                'config:build:sign:android86',
                'config:build:zipalign:android86');//,

  } else if(argv.platform === 'ios'){
    runSequence('clean',
                'config:settings:update',
                'build',
	  			'config:build:release:ios');//,
                // 'config:build:open:xcode');

  } else {
    runSequence('clean',
                'config:settings:update',
                'build',
                'config:build:release:android',
                'config:build:sign:android',
                'config:build:zipalign:android',
                'config:build:sign:android86',
                'config:build:zipalign:android86',
 	 		          'config:build:release:ios');//,
                // 'config:build:open:xcode');
  }

});


gulp.task('config:build:debug:android', function (cb) {

  console.log('BUILDING ANDROID DEBUG');

  exec('cordova build android', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('config:build:debug:ios', function (cb) {

  console.log('BUILDING iOS DEBUG');

  exec('cordova build ios', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});


gulp.task('config:build:release:android', function (cb) {

  console.log('BUILDING ANDROID RELEASE');

  exec('cordova build android  --release', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('config:build:sign:android', function (cb) {

    console.log('SIGNING ANDROID APK armv7');
    console.log('JKS LOCATION: '+argv.keystore);

  exec('jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1'+
       ' -storepass '+argv.storepass+
       ' -keystore '+argv.keystore+
       ' platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk'+
       ' KornerSafeKey', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('config:build:sign:android86', function (cb) {

    console.log('SIGNING ANDROID APK x86');
    console.log('JKS LOCATION: '+argv.keystore);

  exec('jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1'+
       ' -storepass '+argv.storepass+
       ' -keystore '+argv.keystore+
       ' platforms/android/build/outputs/apk/android-x86-release-unsigned.apk'+
       ' KornerSafeKey', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('config:build:zipalign:android', function (cb) {

  console.log('ZIPALIGNING ANDROID APK armv7');
  var buildJson     = require('../src/config/build-config.json');
  var settingsJson  = require('../src/config/settings-config.json');

  exec('zipalign -f -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk  platforms/android/build/outputs/apk/korner-security-armv7-release-'+buildJson.version+'.'+buildJson.build+'.apk', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('config:build:zipalign:android86', function (cb) {

  console.log('ZIPALIGNING ANDROID APK x86');
  var buildJson     = require('../src/config/build-config.json');
  var settingsJson  = require('../src/config/settings-config.json');

  exec('zipalign -f -v 4 platforms/android/build/outputs/apk/android-x86-release-unsigned.apk  platforms/android/build/outputs/apk/korner-security-x86-release-'+buildJson.version+'.'+buildJson.build+'.apk', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('config:build:release:ios', function (cb) {

  console.log('BUILDING iOS RELEASE');

  exec('cordova build ios --release', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
// open platforms/ios/Korner.xcodeproj
gulp.task('config:build:open:xcode', function (cb) {

  console.log('OPENING XCODE PROJECT');

  exec('open platforms/ios/Korner.xcodeproj', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
// Assuming there's "version: 1.2.3" in package.json,
// tag the last commit as "v1.2.3"
gulp.task('config:git:tag', function() {
  return gulp.src(['./package.json']).pipe(tag_version());
});
