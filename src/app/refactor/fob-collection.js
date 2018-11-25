(function () {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.core')
    .service('FobCollection', fobCollection)
    .constant('DayOfWeekConst', {
      MONDAY: 0x1,
      TUESDAY: 0x2,
      WEDNESDAY: 0x4,
      THURSDAY: 0x8,
      FRIDAY: 0x10,
      SATURDAY: 0x20,
      SUNDAY: 0x40,
    })
    .constant('ScheduleActionConst', {
      ARM: 1,
      DISARM: 2
    });

  /* @ngInject */
  function fobCollection($q, $log, FobModel, FobService2, Restangular, ServerService2, NotificationService, $rootScope) {
    var self = this;



    $log.debug('>>> FobCollection');


    // list of exported public methods
    return {
      // session management
      onInitialize: onInitialize,
      onSessionPause: onSessionPause,
      onSessionResume: onSessionResume,
      onSessionDestroy: onSessionDestroy,

      // fob collection
      getFobList: getFobList,
      setActiveFobWithID: setActiveFobWithID,
      activateSingleFob: activateSingleFob,
      deactiveActiveFob: deactiveActiveFob,
      getCount: getCount,
      getUnsafeCount: getUnsafeCount,
      loadRefresh: loadRefresh,
      refreshState: refreshState,
      hasOwnedFobs: hasOwnedFobs,
      hasCircleFobs: hasCircleFobs,
      activateFobWithActiveIntrusion: activateFobWithActiveIntrusion,


      // help functions for finding and assigning fobs
      setFobOwner: setFobOwner,
      findUnregisteredFobByIPAddress: findUnregisteredFobByIPAddress,
      findUnregisteredFobByEUI64: findUnregisteredFobByEUI64,
    };


    // initializer
    function onInitialize() {
      onSessionDestroy();

      loadRefresh()
        .then(function () {
          self._initializedDeferred.resolve();
        }, function (status) {
          self._initializedDeferred.reject(status);
        });

      return self._initializedDeferredPromise;

    }

    function onSessionDestroy() {
      deactiveActiveFob();
      for (var fobIdx in self.fobs) {
        self.fobs[fobIdx].onDestroy();
      }
      self.fobs = {};

      self._initializedDeferred = $q.defer();
      self._initializedDeferredPromise = self._initializedDeferred.promise;
    }



    function getFobList() {
      var defer = $q.defer();

      self._initializedDeferredPromise.then(function () {
        defer.resolve(self.fobs);
      }, function () {
        defer.reject();
      });

      return defer.promise;
    }


    function loadRefresh() {
      var defer = $q.defer();

      _untagCollectionItems();

      Restangular.all('fobs').getList()
        .then(function (fobList) {

          var plainFobList = fobList.plain();
          var promises = [];

          // iterate across fobs and create fob Model
          for (var index in plainFobList) {
            // if (!_isKeyinCollection(plainFobList[index].fob_id)) {
            var newFob = new FobModel(plainFobList[index]);
            self.fobs[newFob.fob_id] = newFob;
            promises.push(newFob.onInitialize());
            // }
            // tag the item
            _tagCollectionItemByKey(plainFobList[index].fob_id);
          }
          $q.all(promises).then(function () {
            _pruneUntaggedCollectionItems();
            console.log(self.fobs);
            defer.resolve();
          });
        },
          function (response) {
            $log.debug('[FobActivityCollection] ERROR GETTING FOBS: ' + response.status);
            if (response.status === 404 || response.message === 'Not logged in') {
              $rootScope.logOut();
            } else if (response.status === 401 || response.status === 0 ||
              response.status === 503) {
              $rootScope.restart();
            }
            defer.reject(response.status);
          });

      return defer.promise;
    }

    function refreshState() {
      var defer = $q.defer();
      var promises = [];

      for (var fobIdx in self.fobs) {
        promises.push(self.fobs[fobIdx].refreshState());
      }

      $q.all(promises).then(function () {
        defer.resolve();
      });

      return defer.promise;
    }

    function getCount() {
      var defer = $q.defer();

      self._initializedDeferredPromise.then(function () {
        defer.resolve(Object.keys(self.fobs).length);
      }, function () {
        defer.reject(0);
      });


      return defer.promise;
    }

    function getUnsafeCount() {
      // dan - remove this!!!!
      return Object.keys(self.fobs).length;
    }

    function activateSingleFob() {

      if (Object.keys(self.fobs).length > 0) {
        setActiveFobWithID(Object.keys(self.fobs)[0]);
      }
    }

    function setActiveFobWithID(fobID) {
      // is this already the active fob?
      if (fobID === self.activeFobID) {

        return true;
      }

      // make sure the fobID is valid
      if (self.fobs[fobID] === undefined) {
        return false;
      }

      // deactivate old fob
      deactiveActiveFob();

      // activate new fob
      self.activeFobID = fobID;
      self.fobs[self.activeFobID].onActivate();
      FobService2.onActivateFob(self.fobs[self.activeFobID]);

      return true;
    }

    function deactiveActiveFob() {
      if (self.activeFobID !== undefined && self.activeFobID !== -1 && self.fobs[self.activeFobID] !== undefined) {
        FobService2.onDeactivate();
        self.fobs[self.activeFobID].onDeactivate();
      }

      self.activeFobID = -1;
    }

    function findUnregisteredFobByIPAddress() {
      var defer = $q.defer();

      $log.debug('[fob-service] FIND UNREGISTERED FOB BY IP ADDRESS');

      Restangular.one('setup', 'find-fob-by-ipaddress').get().then(function (
        theFob) {
        $log.debug('[fob-service] FOUND UNREGISTERED FOB BY IP ADDRESS');
        $log.debug('[fob-service] QUERY RESULT: ' + theFob, theFob.fob_id);
        defer.resolve(theFob);

      }, function (response) {
        defer.reject(response.status);
      });

      return defer.promise;
    }


    function findUnregisteredFobByEUI64(eui64) {
      var defer = $q.defer();

      $log.debug('[fob-service] QUERY: Unregistered fobs by eui64: ' + eui64);

      Restangular.one('setup').one('find-fob-by-eui64', eui64).get().then(
        function (theFob) {
          defer.resolve(theFob);
        },
        function (response) {
          defer.reject(response.status);
        });

      return defer.promise;
    }

    function activateFobWithActiveIntrusion() {
      for (var index in self.fobs) {
        if (self.fobs[index].isIntrusionActive()) {
          self.setActiveFobWithID(self.fobs[index].fob_id);
          return true;
        }
      }
      return false;
    }

    function setFobOwner(fobID, eui64) {
      var self = this;
      var defer = $q.defer();

      $log.debug('[fob-service] SET FOB OWNER: ' + fobID, eui64);

      Restangular.one('setup').one('set-owner', fobID).one(eui64).put().then(
        function () {

          _addFobToCollectionWithID(fobID).then(function () {
            // set active
            setActiveFobWithID(fobID);

            NotificationService.notify();

            defer.resolve();
            $log.debug('[fob-service] FOB OWNER SET SUCCESSFULY: ' + fobID,
              eui64);
          },
            function (status) {
              defer.reject(status);
            });

        },
        function (response) {
          defer.reject(response.status);
        });

      return defer.promise;
    }

    function _addFobToCollectionWithID(fobID) {
      var defer = $q.defer();
      // var self = this;

      Restangular.one('fobs', fobID).get()
        .then(function (theFob) {
          var newFob = new FobModel(theFob);
          newFob.onInitialize().then(function () {
            self.fobs[newFob.fob_id] = newFob;
            defer.resolve();
          });

        },
          function (response) {
            defer.reject(response.status);
          });

      return defer.promise;
    }

    function onSessionPause() {
      var defer = $q.defer();
      defer.resolve();
      return defer.promise;
    }

    function onSessionResume() {
      var defer = $q.defer();
      defer.resolve();
      return defer.promise;
    }


    // housekeeping methods
    function _untagCollectionItems() {
      for (var index in self.fobs) {
        self.fobs[index]._tagged = false;
      }
    }

    function _isKeyinCollection(key) {
      return (self.fobs[key] !== undefined);
    }

    function _pruneUntaggedCollectionItems() {
      for (var index in self.fobs) {
        if (self.fobs[index]._tagged === false) {
          delete self.fobs[index];
        }
      }
    }

    function _tagCollectionItemByKey(key) {
      self.fobs[key]._tagged = true;
    }

    function hasOwnedFobs() {
      for (var index in self.fobs) {
        if (self.fobs[index].fobUser.isOwner()) {
          return true;
        }
      }
      return false;
    }

    function hasCircleFobs() {
      for (var index in self.fobs) {
        if (!self.fobs[index].fobUser.isOwner()) {
          return true;
        }
      }
      return false;
    }

  }

})();
