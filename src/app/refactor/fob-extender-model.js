(function() {
  'use strict';


  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobExtenderModel', fobExtenderModel);


  /* @ngInject */
  function fobExtenderModel($q, $log, KornerMsgHelpers, Restangular) {

    function FobExtenderModel(extender) {
      angular.extend(this, extender);
      this._initializedDeferred = $q.defer();

    }

    FobExtenderModel.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,

      // public methods
      setDefaultExtenderName: setDefaultExtenderName,
      store: store

      // private methods
    };

    return FobExtenderModel;


    // initializer
    function onInitialize() {
      this._initializedDeferred.resolve();
      return this._initializedDeferred.promise;
    }

    function hasInitialized() {
      return this._initializedDeferred;
    }

    function store() {
      var defer = $q.defer();
      var self = this;

      var attributes = {
        "extender_name": self.extender_name
      };

      Restangular.one('fobs', self.fob_id).one('extenders', self.extender_id).customPUT(attributes)
        .then(function() {
          defer.resolve();
        }, function(error) {
          defer.reject(error);
        });

      return defer.promise;

    }


    function setDefaultExtenderName(count) {
      this.extender_name = 'Extender '+count;
    }

    // private functions



  }

})();
