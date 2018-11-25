(function() {
  'use strict';

  /*jshint validthis: true */

  angular
    .module('app.core')
    .service('PushNotificationService', pushNotificationService)

  .constant('smartDeviceTypeConst', {
    IOS: 1,
    ANDROID: 2,
    WINDOWS: 3,
  });


  /* @ngInject */
  function pushNotificationService($rootScope, $localStorage, $cordovaPush, Restangular, smartDeviceTypeConst, $log) {

    var accountID = 0;
    var deviceTypeID = 0;
    var pushNotificationNotifyFunction;

    $rootScope.$storage = $localStorage.$default({
      deviceIdent: '',
      registeredAccountIDs: [],
    });

    // list of exported public methods
    return {
      onInitialize: onInitialize,
      onFinalize: onFinalize,
      register: register,

      _registerIOS: _registerIOS,
      _registerAndroid: _registerAndroid,

      _createSmartDevice: _createSmartDevice,
    };


    function onInitialize(userAccountID) {
      var self = this;

      self.accountID = userAccountID;
      self.deviceTypeID = 0;

      if(this.pushNotificationNotifyFunction){
        this.pushNotificationNotifyFunction();
        this.pushNotificationNotifyFunction = null;
      }

      if (ionic.Platform.is("browser") === false) {

        if (ionic.Platform.isIOS()) {
          this.deviceTypeID = smartDeviceTypeConst.IOS;

          this.pushNotificationNotifyFunction =
            $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
              console.log(notification);
              if (notification.alert) {
                // TODO intrusion
                $log.debug("push message: " + notification.alert);
              }
              if (notification.sound) {
                // TODO intrusion?
              }
              if (notification.badge) {
                // TODO intrusion?
              }
            });

        } else if (ionic.Platform.isAndroid()) {
          this.deviceTypeID = smartDeviceTypeConst.ANDROID;

          this.pushNotificationNotifyFunction =
            $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
              console.log(notification);
              switch (notification.event) {
                case 'registered':
                  if (notification.regid.length > 0) {
                    $log.debug("push device ident: " + notification.regid);
                    $rootScope.$storage.deviceIdent = notification.regid;
                    $rootScope.$storage.registeredAccountIDs.push(self.accountID);

                    self._createSmartDevice(smartDeviceTypeConst.ANDROID, notification.regid);
                  }
                  break;
                case 'message':
                  // TODO intrusion
                  $log.debug("push message: " + notification.alert);
                  break;
                case 'error':
                  $log.error("push error: " + notification.msg);
                  break;
                default:
                  $log.error("unknown push event: " + notification.event);
                  break;
              }
            });

        }
      }
    }


    function onFinalize() {
      if (this.pushNotificationNotifyFunction !== undefined) {
        this.pushNotificationNotifyFunction();

        this.pushNotificationNotifyFunction = undefined;
        this.deviceTypeID = 0;
      }
    }


    function register() {
      if ($rootScope.$storage.registeredAccountIDs.indexOf(this.accountID) === -1) {
        switch (this.deviceTypeID) {
          case smartDeviceTypeConst.IOS:
            this._registerIOS();
            break;

          case smartDeviceTypeConst.ANDROID:
            this._registerAndroid();
            break;
        }
      }
    }


    function _registerIOS() {
      var self = this;

      var deviceConfig = {
        "alert": true,
        "sound": true,
        "badge": true,
      };

      $cordovaPush.register(deviceConfig)
        .then(function(deviceIdent) {
          $log.debug("push device ident: " + deviceIdent);
          $rootScope.$storage.deviceIdent = deviceIdent;
          $rootScope.$storage.registeredAccountIDs.push(self.accountID);

          self._createSmartDevice(smartDeviceTypeConst.IOS, deviceIdent);
        }, function(err) {
          $log.error(err);
        });

    }


    function _registerAndroid() {
      var deviceConfig = {
        "senderID": "607585651835", // TODO GCM project number... from server?
      };

      $cordovaPush.register(deviceConfig)
        .then(function() {},
          function(err) {
            $log.error(err);
          });
    }


    function _createSmartDevice(deviceTypeID, deviceIdent) {
      var postData = {
        "account_smart_device_type_id": deviceTypeID,
        "device_ident": deviceIdent,
      };

      Restangular.all('account/smartdevices').post(postData)
        .then(function(res) {
            $log.debug(res);
          },
          function(err) {
            $log.debug(err);
          }
        );
    }

  }

})();
