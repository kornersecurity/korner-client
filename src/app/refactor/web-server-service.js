

(function() {
  'use strict';

  /*jshint validthis: true */

  // Restangular service that uses App Web Server
  angular
    .module('app.core')
    .factory('WebServerRestangular',
      function(Restangular, appSettingsConst) {
        return Restangular.withConfig(function(RestangularConfigurer) {
          RestangularConfigurer.setBaseUrl(appSettingsConst.httpProtocol+appSettingsConst.webEndPoint);
        }
      );
    }
  );

  angular
    .module('app.core')
    .service('WebServerService', webServerService);

  /* @ngInject */
  function webServerService($q, $log, WebServerRestangular) {
    var self = this;
    var _version = '0.0.0';
    var _build = 0;


    $log.debug('>>> WebServerService');

    // list of exported public methods
    return {
      queryServerVersion: queryServerVersion,
      getRequiredVersionNumber: getRequiredVersionNumber,
      getRequiredBuildNumber: getRequiredBuildNumber
    };

    function getRequiredVersionNumber() {
      return self._version;
    }

    function getRequiredBuildNumber() {
      return self._build;
    }

    function queryServerVersion() {
      var defer = $q.defer();

      WebServerRestangular.one('app/config/build-config.json').get()
        .then(function(response) {
          $log.debug('[web-server-service] BUILD CONFIG: ', response);
          self._version = response.version;
          self._build = response.build;
          defer.resolve({version: self._version, build: self._build});
        }, function(response) {
          $log.debug("[web-server-service] unable to get web-server-version: (" + response.status + ")");
          self._version = '0.0.0';
          self._build = 0;
          // defer.resolve();
          defer.reject(response.status);
        });

      return defer.promise;
    }
  }

})();
