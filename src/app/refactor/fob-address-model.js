(function () {
  'use strict';


  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobAddressModel', fobAddressModel);


  /* @ngInject */
  function fobAddressModel($q, $log, Restangular) {

    function FobAddressModel(fobID) {
      this.fobID = fobID;
      this.address_id = "";
      this.line_1 = "";
      this.line_2 = "";
      this.city = "";
      this.state = "";
      this.zipcode = "";
      this.country = "";

      this._initializedDeferred = $q.defer();

    }

    FobAddressModel.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,

      // public methods
      store: store,
      load: load
      // sebIsCool: sebIsCool

      // private methods
    };

    return FobAddressModel;


    // initializer
    function onInitialize() {
      this.load();
      return this._initializedDeferred.promise;
    }

    function hasInitialized() {
      return this._initializedDeferred;
    }

    function load() {
      var self = this;

      Restangular.one('fobs', self.fobID).one('address').get()
        .then(function (address) {
          angular.extend(self, address);
          self._initializedDeferred.resolve();
        },
          function (err) {
            // its ok that there is no address.
            self._initializedDeferred.resolve();
          });
    }

    function store(address) {

      var self = this;
      var defer = $q.defer();

      // local copy of the fields we want to send
      var attributes = {};
      attributes.line_1 = address.line_1;
      attributes.line_2 = address.line_2;
      attributes.city = address.city;
      attributes.state = address.state;
      attributes.zipcode = address.zipcode;
      attributes.country = address.country;

      $log.debug('fob-address-model::store] ADDRESS ID: ' + address.address_id);

      if (!address.address_id || address.address_id === "") {
        $log.debug('fob-address-model::store] CREATING NEW ADDRESS');
        // create
        Restangular.one('fobs', self.fobID).one('address').customPOST(attributes)
          .then(function () {
            self.load();
            defer.resolve();
          }, function (response) {
            defer.reject(response.status);
          });

      } else {
        $log.debug('fob-address-model::store] UPDATING EXISTING ADDRESS');
        attributes.address_id = address.address_id;
        // update
        Restangular.one('fobs', self.fobID).one('address').customPUT(attributes)
          .then(function () {
            // angular.extend(this, address);
            self.load();
            defer.resolve();
          }, function (response) {
            defer.reject(response.status);
          });

      }

      return defer.promise;
    }
  }

})();
