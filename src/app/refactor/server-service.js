(function() {
  'use strict';

  /*jshint validthis: true */

  angular
    .module('app.core')
    .service('ServerService2', serviceService);

  /* @ngInject */
  function serviceService($q, $log, Restangular) {
    var self = this;
    var serverVersion = "";
    var databaseVersion = "";
    var baseImageURL = "";
    var _initializedDeferred = $q.defer();
    var _initializedDeferredPromise = _initializedDeferred.promise;



    $log.debug('>>> ServerService');

    // list of exported public methods
    return {
      onInitialize: onInitialize,
      getBaseImageURL: getBaseImageURL,
      getImageURLForS3NameWithSize: getImageURLForS3NameWithSize,
      getFobImageURLForS3NameWithSize: getFobImageURLForS3NameWithSize,
      hasInitialized: hasInitialized,

    };

    // initializer
    function onInitialize() {
      var defer = $q.defer();
      _loadResources();
      // block until we have initialized
      _initializedDeferredPromise.then(function() {
        defer.resolve(true);
      }, function() {
        defer.reject(false);
      });

      return defer.promise;
    }

    function _loadResources() {
      $q.all([_queryServerVersion(), _queryDatabaseVersion, _queryImageUrl()])
        .then(function() {
          _initializedDeferred.resolve();
        }, function() {
          _initializedDeferred.reject();
          $log.debug("[server-service] - problem query for server settings");
        });


      return _initializedDeferredPromise;

    }

    function hasInitialized() {
      var defer = $q.defer();

      // block until we have initialized
      _initializedDeferredPromise.then(function() {
        defer.resolve(true);
      }, function() {
        defer.reject(false);
      });

      return defer.promise;
    }


    function getBaseImageURL() {
      return self.baseImageURL;
    }


    function getImageURLForS3NameWithSize(s3Name, imageSize) {
      if (imageSize === undefined) {
        imageSize = 'pm';
      }

      return self.baseImageURL + s3Name + '/' + imageSize + '.jpg';
    }

    function getFobImageURLForS3NameWithSize(s3Name, imageSize) {
      if (imageSize === undefined) {
        imageSize = 'pm';
      }

      if (s3Name === undefined || s3Name === '') {
        return self.baseImageURL + 'placeholder/home/' + imageSize + '.jpg';
      }

      return self.baseImageURL + s3Name + '/' + imageSize + '.jpg';
    }

    function _queryServerVersion() {
      var defer = $q.defer();

      Restangular.one('utils/server-version').get()
        .then(function(serverVersion) {
          self.serverVersion = serverVersion.response;
          defer.resolve();
        }, function(response) {
          $log.debug("[server-service] unable to get server-version: (" + response.status + ")");

          defer.reject(response.status);
        });

      return defer.promise;
    }

    function _queryDatabaseVersion() {
      var defer = $q.defer();

      Restangular.one('utils/database-version').get()
        .then(function(databaseVersion) {
          self.databaseVersion = databaseVersion.response;
          defer.resolve();
        }, function(response) {
          $log.debug("[server-service] unable to get database-version: (" + response.status + ")");

          defer.reject(response.status);
        });

      return defer.promise;
    }

    function _queryImageUrl() {
      var defer = $q.defer();

      Restangular.one('utils/image-base-url-path').get()
        .then(function(baseImageURL) {
          self.baseImageURL = baseImageURL.response;
          defer.resolve();
        }, function(response) {
          $log.debug("[server-service] unable to get image_base_url: (" + response.status + ")");
          defer.reject(response.status);
        });

      return defer.promise;
    }
  }

})();
