(function() {
  'use strict';



  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobExtenderCollection', fobExtenderCollection);

  /* @ngInject */
  function fobExtenderCollection(Restangular, $q, $log, core, KornerMsgHelpers, FobExtenderModel, $rootScope) {


    function FobExtenderCollection(fobID) {
      if (fobID) {
        this.fobID = fobID;
        this.extenders = {};
        this.lastKeys = [];


        this._initializedDeferred = $q.defer();
      }
    }

    FobExtenderCollection.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,
      loadRefreshExtenders: loadRefreshExtenders,
      getListOfNewExtenderIDSinceLastTime: getListOfNewExtenderIDSinceLastTime,
      getCount: getCount,
      getExtenderKeys: getExtenderKeys,

      //private
      _untagCollectionItems: _untagCollectionItems,
      _isKeyinCollection: _isKeyinCollection,
      _pruneUntaggedCollectionItems: _pruneUntaggedCollectionItems,
      _tagCollectionItemByKey: _tagCollectionItemByKey

    };

    return FobExtenderCollection;


    // initializer
    function onInitialize() {
      var self = this;
      this.loadRefreshExtenders()
        .then(function() {
          self._initializedDeferred.resolve();
        }, function(status) {
          self._initializedDeferred.reject(status);
        });
    }

    function hasInitialized() {
      return this._initializedDeferred;
    }

    function loadRefreshExtenders() {

      var self = this;
      var defer = $q.defer();

      this.lastKeys = Object.keys(this.extenders);

      self._untagCollectionItems();

      Restangular.one('fobs', self.fobID).getList('extenders')
        .then(function(fobExtenders) {
          var plainExtenders = fobExtenders.plain();
          var promises = [];
          for (var index in plainExtenders) {

            // $log.debug('[FobExtenderCollection] EXTENDER: ', plainExtenders[index]);
            if(plainExtenders[index] === undefined) {
              continue;
            }
            // is the extender already in the map?

            if (!self._isKeyinCollection(plainExtenders[index].extender_id)) {

              var newExtender = new FobExtenderModel(plainExtenders[index]);

              promises.push(newExtender.onInitialize());
              self.extenders[newExtender.extender_id] = newExtender;
            }

            self._tagCollectionItemByKey(plainExtenders[index].extender_id);
          }


          $q.all(promises).then(function() {
            // $log.debug('[FobExtenderCollection::onInitialize] EXTENDERS LOADED: ' + self.getCount());
            self._pruneUntaggedCollectionItems();
            defer.resolve();
          });

        }, function(response) {
          $log.debug('[FobActivityCollection] ERROR GETTING EXTENDERS: '+response.status);
          if(response.status === 404 || response.message === 'Not logged in') {
            $rootScope.logOut();
          } else if(response.status === 401 || response.status === 0 || response.status === 503){
            $rootScope.restart();
          }
          defer.reject(response.status);
        });

      return defer.promise;

    }


    function getListOfNewExtenderIDSinceLastTime() {
      // iterate across and find anyone after the last load time

      var extenderKeys = Object.keys(this.extenders);
      var newKeys = [];

      for (var e in extenderKeys) {
        var newKey = true;
        for (var l in this.lastKeys) {
          if (extenderKeys[e] === this.lastKeys[l]) {
            newKey = false;
            continue;
          }
        }
        if (newKey) {
          newKeys.push(extenderKeys[e]);
        }
      }

      return newKeys;
    }

    function getExtenderKeys() {
      return Object.keys(this.extenders);
    }

    function getCount() {
      return Object.keys(this.extenders).length;
    }


    function _untagCollectionItems() {
      for (var index in self.fobs) {
        this.extenders[index]._tagged = false;
      }
    }

    function _isKeyinCollection(key) {
      return (this.extenders[key]);
    }

    function _pruneUntaggedCollectionItems() {
      for (var index in self.extenders) {
        if (this.extenders[index]._tagged === false) {
          delete this.extenders[index];
        }
      }
    }

    function _tagCollectionItemByKey(key) {
      this.extenders[key]._tagged = true;
    }

  }

})();
