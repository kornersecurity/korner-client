(function() {
  'use strict';


  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobUserCollection', fobUserCollection)
    .constant('FobUserFeatureMaskConst', {
      BIT_SECURITY_ARMDISARM: 0x1,
      BIT_INTRUSION: 0x2,
      BIT_ACTIVITY_BASIC: 0x10,
      BIT_ACTIVITY_ADVANCED: 0x20,
      BIT_CHAT_BASIC: 0x100,
      BIT_CONFIG_SYSTEM: 0x1000,
      BIT_CONFIG_INVITEES: 0x2000,
      BIT_HOUSEHOLD_MEMBER: 0x4000,
      BIT_IMMEDIATE_INTRUSION_NOTIFICATION: 0x8000,
    })
    .constant('fobUserStatusConst', {
      STATUS_CREATED: 0x1,
      STATUS_INVITED: 0x2,
      STATUS_DECLINED: 0x3,
      STATUS_ACTIVE: 0x4,
      STATUS_DISABLED: 0x5,
      STATUS_NEW: 0x6
    })
    .constant('fobUserTypeConst', {
      TYPE_OWNER: 0x1,
      TYPE_USER: 0x2,
      TYPE_ADMIN: 0x3,
      TYPE_CIRCLE: 0x4,
    });



  /* @ngInject */
  function fobUserCollection(FobUserModel, FobUserFeatureMaskConst, $q, $log,
    Restangular, $rootScope) {

    function FobUserCollection(fobID) {
      if (fobID) {
        this.fobID = fobID;
        this.fobUsers = {};

        this._initializedDeferred = $q.defer();
      }
    }

    FobUserCollection.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,

      // public methods
      isFobUser: isFobUser,
      getFobUserByID: getFobUserByID,
      loadRefreshFobUsers: loadRefreshFobUsers,
      getCount: getCount,
      getUserByAccountID: getUserByAccountID,
      countUsersByStatus: countUsersByStatus,
      hasUsersWithStatus: hasUsersWithStatus,
      removeCircleMember: removeCircleMember,
      getFobUsersArray: getFobUsersArray,
      getIntrusionUsersArray: getIntrusionUsersArray,

      // private methods
      _addUserToCollection: _addUserToCollection,
      _untagCollectionItems: _untagCollectionItems,
      _isKeyinCollection: _isKeyinCollection,
      _pruneUntaggedCollectionItems: _pruneUntaggedCollectionItems,
      _tagCollectionItemByKey: _tagCollectionItemByKey,

    };


    return FobUserCollection;


    // initializer
    function onInitialize() {

      var self = this;

      this.loadRefreshFobUsers().then(function() {
        self._initializedDeferred.resolve();
      }, function(status) {
        self._initializedDeferred.reject(status);
      });

      return this._initializedDeferred.promise;
    }


    function hasInitialized() {
      return this._initializedDeferred;
    }


    function isFobUser(fobUserID) {
      return (this.fobUsers[fobUserID] !== undefined);
    }

    function getFobUserByID(fobUserID) {
      var fobUser = this.fobUsers[fobUserID];
      if (fobUser === undefined) {
        // $log.debug('[FobUserCollection::getFobUserByID] invalid fobUserID:' + fobUserID);
      }

      return this.fobUsers[fobUserID];
    }

    function removeCircleMember(user) {
      var defer = $q.defer();
      var self = this;
      // $log.debug('[circleSetupService] REMOVING USER: '+'fobs/'+user.fob_id+'/users/'+user.fob_user_id);
      Restangular.one('fobs/' + user.fob_id + '/users/' + user.fob_user_id).remove().then(
        function() {
          self.loadRefreshFobUsers().then(function() {
            defer.resolve();
          });
        },
        function(res) {
          $log.debug('[FobActivityCollection] ERROR REMOVING CIRCLE MEMBER: '+response.status);
          if(response.status === 404 || response.message === 'Not logged in') {
            $rootScope.logOut();
          } else if(response.status === 401 || response.status === 0 || response.status === 503){
            $rootScope.restart();
          }
          defer.reject(res);
        }
      );
      return defer.promise;
    }

    function getCount() {
      return Object.keys(this.fobUsers).length;
    }

    function getFobUserKeys() {
      return Object.keys(this.fobUsers);
    }

    function getFobUsersArray() {
      var fobUsersArray = [];
      for (var index in this.fobUsers) {
        fobUsersArray.push(this.fobUsers[index]);
      }
      // $log.debug('[fob-user-collection] FOB USERS IN ARRAY: '+fobUsersArray.length);
      return fobUsersArray;
    }

    function getIntrusionUsersArray() {
      var fobUsersArray = [];
      for (var index in this.fobUsers) {
        if (this.fobUsers[index].hasIntrusionFeature() && !this.fobUsers[index].isOwner()) {
          fobUsersArray.push(this.fobUsers[index]);
        }
      }
      // $log.debug('[fob-user-collection] FOB USERS IN ARRAY: '+fobUsersArray.length);
      return fobUsersArray;
    }

    function getUserByAccountID(accountID) {
      for (var index in this.fobUsers) {
        if (this.fobUsers[index].account_id === accountID) {
          return this.fobUsers[index];
        }
      }

      return undefined;
    }

    function countUsersByStatus(statusID) {
      var userCount = 0;
      for (var index in this.fobUsers) {
        // $log.debug('[fob-user-collection] USER IS OWNER: '+this.fobUsers[index].isOwner());
        if (this.fobUsers[index].fob_user_status_id === statusID && !this.fobUsers[index].isOwner()) {
          userCount++;
        }
      }
      // $log.debug('[fob-user-collection] USER WITH STATUS: '+userCount+" ("+statusID+")");
      return userCount;
    }

    function hasUsersWithStatus(statusID) {

      for (var index in this.fobUsers) {
        if (this.fobUsers[index].fob_user_status_id === statusID && !this.fobUsers[index].isOwner()) {
          // $log.debug('FOUN AT LEAST ONE USER WITH STATUS '+status);
          return true;
        }
      }
      // $log.debug('NO USERS WITH STATUS '+status);
      return false;
    }


    // private functions

    function loadRefreshFobUsers() {
      var self = this;
      var defer = $q.defer();

      this._untagCollectionItems();

      Restangular.one('fobs', self.fobID).getList('users')
        .then(function(fobUsers) {
          var plainFobUsers = fobUsers.plain();
          var promises = [];
          // iterate across fob users
          for (var index in plainFobUsers) {

            promises.push(self._addUserToCollection(plainFobUsers[index]));

          }

          $q.all(promises).then(function() {
            self._pruneUntaggedCollectionItems();
            // $log.debug('[fob-user-collection] USERS: '+self.getCount());
            defer.resolve();
          });

        }, function(response) {
          $log.debug('[FobActivityCollection] ERROR LOADING CIRCLE MEMBERS: '+response.status);
          if(response.status === 404 || response.message === 'Not logged in') {
            $rootScope.logOut();
          } else if(response.status === 401 || response.status === 0 || response.status === 503){
            $rootScope.restart();
          }
          defer.reject(response.status);
        });

      return defer.promise;
    }

    function _addUserToCollection(fobUser) {
      var self = this;
      var defer = $q.defer();

      var newFobUser = new FobUserModel(fobUser);
      newFobUser.onInitialize()
        .then(function() {
          self.fobUsers[newFobUser.fob_user_id] = newFobUser;
          self._tagCollectionItemByKey(newFobUser.fob_user_id);
          // $log.debug('[fob-user-collection] USER TAGGED: '+newFobUser._tagged);
          defer.resolve();
        }, function(status) {
          defer.reject(status);
        });
      return defer;
    }

    function _untagCollectionItems() {
      for (var index in this.fobUsers) {
        this.fobUsers[index]._tagged = false;
        // $log.debug('[fob-user-collection] USER UNTAGGED: '+index);
      }
    }

    function _isKeyinCollection(key) {
      return (this.fobUsers[key] !== undefined);
    }

    function _pruneUntaggedCollectionItems() {
      for (var index in this.fobUsers) {
        if (this.fobUsers[index]._tagged === false) {
          delete this.fobUsers[index];
          // $log.debug('[fob-user-collection] USER PRUNED: '+index);
        }
      }
      // $log.debug('[fob-user-collection] USERS PRUNED');
    }

    function _tagCollectionItemByKey(key) {
      this.fobUsers[key]._tagged = true;
      // $log.debug('[fob-user-collection] USER TAGGED: '+key);
    }


  }

})();
