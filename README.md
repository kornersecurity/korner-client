# Korner Client
The client is written using Javascript using the IonicFramework.


## Local Development

### First time setup
Install node.js 4.x

Install global npm packages:

`sudo npm install -g cordova@5.2.0`

`sudo npm install -g ionic@1.5`

`sudo npm install -g protractor`

`sudo npm install -g gulp`

### Prepare workspace
Perform these steps if building for the first time, or if doing a clean build. It takes quite a while, be patient!

`mkdir www`

`npm install`

`bower install --config.interactive=false`

`ionic platform add ios@3.8.0`

### Build (iOS)
`gulp build`

`ionic build ios --stacktrace --release --device`

### Manual changes
Open the project in Xcode and perform these manual changes. The project is located at `platforms/ios/Korner Security.xcodeproj`
* Set the development team
* Change deployment target from 6.0 to 7.0
* In the project navigator, find the 'Staging' subfolder. Make sure **config.xml** and **www** are included in the target. 
