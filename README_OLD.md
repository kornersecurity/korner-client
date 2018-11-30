# Korner Client   [![Build Status](https://api.shippable.com/projects/5434733c7a7fb11eaa64a6ef/badge?branchName=master)](https://app.shippable.com/projects/5434733c7a7fb11eaa64a6ef/builds/latest)
The client is written using Javascript using the IonicFramework.  Below is a list of the packages used


## Local Development
The following steps will help you get going with build for korner.   This assume you already have NodeJS installed. http://nodejs.org/


#### Install Cordova and Ionic
`$ sudo npm install -g cordova`  
`$ sudo npm install -g ionic`  
`$ sudo npm install -g protractor`  
`$ sudo npm install -g gulp`  



#### Before You start
Run bower before trying to run anything else.

`$ npm install`
`$ bower install`

#### Adding Platforms
`$ ionic platform add android`
`$ ionic platform add ios`
`$ ionic browser add crosswalk`
`$ gulp clean`
`$ gulp build`
`$ ionic build android --stacktrace`
`$ ionic build ios --stacktrace`

### Development
Run each of the following tasks in a seperate terminal window  
`$ ionic server`  
`$ ionic server -l`  

#### Unit Tests
You should **always** run unit tests before check-in in any code changes.

`$ npm install karma --save-dev`  
`$ sudo npm install -g karma-cli`  
`$ npm install karma-jasmine karma-chrome-launcher --save-dev`  

`$ karma`  

#### More Info

####Issues when building for different platforms
Make sure you have the following versions:

`$ ionic plugin list`
com.ionic.keyboard 1.0.4 "Keyboard"
com.phonegap.plugins.PushPlugin 2.4.0 "PushPlugin"
com.phonegap.plugins.barcodescanner 2.0.1 "BarcodeScanner"
cordova-plugin-camera 1.1.0 "Camera"
cordova-plugin-crosswalk-webview 1.2.0 "Crosswalk WebView Engine"
cordova-plugin-file 2.0.0 "File"
cordova-plugin-file-transfer 1.1.0 "File Transfer"
cordova-plugin-splashscreen 2.0.0 "Splashscreen"
cordova-plugin-whitelist 1.0.0 "Whitelist"
org.apache.cordova.contacts 0.2.16 "Contacts"
org.apache.cordova.geolocation 0.3.12 "Geolocation"
org.apache.cordova.network-information 0.2.15 "Network Information"
uk.co.whiteoctober.cordova.appversion 0.1.7 "AppVersion"



'cordova-plugin-file-transfer' and 'cordova-plugin-crosswalk-webview' are known to cause build issues. If you have an older version of these plugins run
`$ ionic plugin rm cordova-plugin-file-transfer`
`$ ionic plugin add cordova-plugin-file-transfer --save`

If you still have issues building for ios or android try manually removing the following folders:

./node_modules
./plaftorms
./plugins
./src/bower_components

Then run
`$ npm install`
`$ bower install`
`$ ionic platform add android`
`$ ionic platform add ios`
`$ ionic browser add crosswalk`
`$ gulp clean`
`$ gulp build`
`$ ionic build android --stacktrace`
`$ ionic build ios --stacktrace`


#BUILD Tasks
`$ npm install`
`$ bower install`

`$ gulp config:version:get`
`$ gulp config:version:update --version=1.0.7 --build=100 --env=test`

`$ gulp config:settings:get`
`$ gulp config:settings:update --env=prod`

`$ gulp config:git:tag`

`$ gulp config:build:debug --env=dev`
`$ gulp config:build:release --env=prod --platform=all --keystore={path to keystore} --storepass={keystore password}`

`$ gulp config:deploy:test`
`$ gulp config:deploy:prod`

#Release Management Android
`$ gulp clean`
`$ gulp build`
`$ cordova build --release`
`$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /Volumes/Work/Clients/Korner/certificates/android.jks android-armv7-release-unsigned.apk KornerSafeKey`
`$ zipalign -f -v 4 android-armv7-release-unsigned.apk  korner-security-armv7-release-1.0.7.apk`

#Release Management iOS
`$ gulp clean`
`$ gulp build`
`$ cordova build ios`
start xcode
open platforms/ios/Korner Security.xcodeproj

Set Building Config to Ad hoc for test
1 Go to Project Korner Info
2 Add Ad Hoc Configuration

Set Archive Build Config to Ad Hoc for test
1 Got to Korner > Edit Scheme > Archive
2 Set Building Configuration to Ad Hoc
3 Close pop up

Set Cod Signing Identity
1 Go to  Korner Project > Code Signing > Code Signing Identity
2 Set Ad Hoc > Any iOS SDK to iPhone Distribution: PatrolTag...

Finally, Archive Project, Export it, and Save new ipa.


Add the following two lines to the 'main' object in bower_components/font-awesome/bower.json

	"css/font-awesome.css",
	"fonts/*"



Add the following code to the "android" object inside platforms/android/build.gradle

    lintOptions {
        checkReleaseBuilds false
        // Or, if you prefer, you can continue to check for errors in release builds,
        // but continue the build even when errors are found:
        abortOnError false
    }
