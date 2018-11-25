(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.core')
    .factory('ServerLoggerService', serverLoggerService);

  /* @ngInject */
  function serverLoggerService($q, $log, Restangular, appSettingsConst){

    return {
      logAppInfo: logAppInfo
    };

    function logAppInfo(){
      var self = this;
      var defer = $q.defer();

      var isMobileApp = (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1);
      var platform = (isMobileApp)? 'Cordova' : navigator.product;
      platform += '-'+navigator.platform;

      $log.debug('[ServerLoggerService] - CODE NAME: '+navigator.appCodeName);
      $log.debug('[ServerLoggerService] - APP NAME: '+navigator.appName);
      $log.debug('[ServerLoggerService] - PLATFORM: '+navigator.platform);
      $log.debug('[ServerLoggerService] - PRODUCT: '+navigator.product);
      if(window.device) {
        $log.debug('[ServerLoggerService] - DEVICE MODEL: '+window.device.model);
        $log.debug('[ServerLoggerService] - DEVICE VERSION: '+window.device.version);
        $log.debug('[ServerLoggerService] - DEVICE NAME: '+window.device.name);
      }

      $log.debug('[ServerLoggerService] - PLATFORM FOR SERVER: '+platform);

      var appData = {
        version: appSettingsConst.version+'.'+appSettingsConst.build,
        platform: platform
      };


      Restangular.one('profile/client-details').customPUT(appData).then(
        function(profileInfo) {
          defer.resolve();
        }, function(error) {
          defer.reject(error);
        }
      );
      return defer.promise;
    }
  }

})();
