(function() {
  'use strict';



  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobActivityCollection', fobActivityCollection)

  .constant('fobActivityTypeConst', {
    UNKNOWN: 0,
    CONFIGURE: 1,
    SECURITY: 2,
    PORTAL: 3,
    ISSUE: 4,
    STATUS: 5,
    INTERNAL: 6,
    CIRCLE: 7,
    INTRUSION: 8,
    USER: 9,
    SETUP: 10,
  })

  .constant('fobActivitySrcConst', {
    UNKNOWN: 0,
    FOB: 1,
    TAG: 2,
    EXTENDER: 3,
    USER: 4,
    SYSTEM: 5,
  });


  /* @ngInject */
  function fobActivityCollection(Restangular, $q, FobActivitySecurity, FobActivityTag, FobActivityStatus,
    FobActivitySetup, fobActivityTypeConst, KornerMsgHelpers, NotificationService, $log, KornerStateHelpers,
    fobCmdMessageConst, fobMessageTypeConst, $rootScope) {


    function FobActivityCollection(fob) {
      this.fob = fob;
      this.activities = [];
      this._initializedDeferred = $q.defer();
      this._refreshEnabled = false;
      this._highestActivityIDProcessed = 0;
      this._lastActivityID = -1;
      this._isRefreshing = false;

      this._transactions = {}; // map by type or type_deviceID of pending transactions
    }

    FobActivityCollection.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,
      refreshActivities: refreshActivities,
      getCount: getCount,
      enableRefresh: enableRefresh,
      disableRefresh: disableRefresh,


      // private
      _loadRefreshActivities: _loadRefreshActivities,
      _processRawActivities: _processRawActivities,
      _appendActivityToTransaction: _appendActivityToTransaction,
      _pruneActivitiesExpiredItems: _pruneActivitiesExpiredItems,

      _getTransactionTypeForActivity: _getTransactionTypeForActivity,
      _isStartingSession: _isStartingSession,
      _isActivityAppendable: _isActivityAppendable,
      _hasOpenTransaction: _hasOpenTransaction,
      _closeTransaction: _closeTransaction,
      _closeAllTransactions: _closeAllTransactions,
      _createTransaction: _createTransaction,
      _closeAllTagTransactions: _closeAllTagTransactions,
      _cleanUpTagEventHistoryOnArmOrDisarm: _cleanUpTagEventHistoryOnArmOrDisarm,
      _shouldUserSeeActivity: _shouldUserSeeActivity,

    };

    return FobActivityCollection;


    // initializer
    function onInitialize() {
      var self = this;
      self._initializedDeferred.resolve();
      // this.refreshActivities()
      //   .then(function(rawActivities) {
      //     self._processRawActivities(rawActivities);
      //     self._initializedDeferred.resolve();
      //   }, function(status) {
      //     self._initializedDeferred.reject(status);
      //   });
    }

    function hasInitialized() {
      return this._initializedDeferred;
    }


    function refreshActivities() {
      var defer = $q.defer();
      var self = this;
      if (this._refreshEnabled) {
        if (!this._isRefreshing) {
          this._isRefreshing = true;
          self._loadRefreshActivities(this._lastActivityID)
            .then(function(rawActivities) {
              self._pruneActivitiesExpiredItems();
              self._processRawActivities(rawActivities);
              NotificationService.notify();
              self._isRefreshing = false;
              defer.resolve();
            }, function(response) {
              $log.debug('[FobActivityCollection] ERROR GETTING ACTIVITIES: ' + response.status + ' (' + response.message + ')');

              self._isRefreshing = false;
              defer.reject(response);
            });
        } else {

          defer.reject();
        }
      } else {
        defer.reject();
      }

      return defer.promise;
    }


    function getCount() {
      return this.activities.length;
    }

    function enableRefresh() {
      this._refreshEnabled = true;
    }

    function disableRefresh() {
      this._refreshEnabled = false;
    }

    // privates

    function _loadRefreshActivities(lastActivityID) {

      var self = this;
      var defer = $q.defer();
      var startTime = new Date();
      var rawActivities = {};
      var queryCriteria = {};

      if (lastActivityID !== -1) {
        queryCriteria.lastID = lastActivityID;
      }

      Restangular.one('fobs', self.fob.fob_id).all('basic-activity').getList(queryCriteria)
        .then(function(items) {

            // raw list of items that need to be processed
            var plainItems = items.plain();
            for (var index in plainItems) {
              var activity = plainItems[index];
              if (activity.fob_activity_id > self._lastActivityID) {
                self._lastActivityID = activity.fob_activity_id;
              }
              rawActivities[activity.fob_activity_id] = activity;
            }

            $log.debug('[FobActivityCollection] ACTIVITIES LOADED: ' + items.length);
            // check to see if we have 100 items
            if (items.length === 100) {
              self._loadRefreshActivities(self._lastActivityID)
                .then(function(activities) {

                  // add activities from recursive call
                  for (var index in activities) {
                    activity = activities[index];
                    rawActivities[activity.fob_activity_id] = activity;
                  }

                  defer.resolve(rawActivities);
                }, function(status) {
                  defer.reject(status);
                });
            } else {
              // less than 100 items we're done

              defer.resolve(rawActivities);
            }
          },
          function(response) {
            console.log(response);
            $log.debug('[FobActivityCollection] ERROR GETTING ACTIVITIES: ' + response.status + ' (' + response.message + ')');
            // if(response.status === 404 || response.message === 'Not logged in') {
            //   $state.go('app.account.login', {}, {});
            // } else if(response.status === 401){
            //   $state.go('app.startup.splash', {}, {});
            // }
            if (response.status === 404 || response.status === 401) {
              $rootScope.logOut();
            } else if (response.status === 0 || response.status === 503) {
              $rootScope.restart();
            }
            defer.reject(response.status);
          });

      return defer.promise;
    }


    function _processRawActivities(rawActivities) {
      var self = this;

      $q.all([this.fob.tags.hasInitialized(), this.fob.users.hasInitialized()])
        .then(function() {

          for (var index in rawActivities) {
            if (rawActivities[index].fob_activity_id > self._highestActivityIDProcessed) {
              self._highestActivityIDProcessed = rawActivities[index].fob_activity_id;
              if (self._shouldUserSeeActivity(rawActivities[index])) {
                self._appendActivityToTransaction(rawActivities[index]);
              }

            } else {
              $log.debug("skipping activity id:" + rawActivities[index].fob_activity_id);
            }

          }
        }, function() {
          // something went wrong
        });

    }


    function _appendActivityToTransaction(activity) {
      var transactionType = this._getTransactionTypeForActivity(activity);

      if (this._isStartingSession(activity)) {
        this._closeAllTransactions();
      }

      this._cleanUpTagEventHistoryOnArmOrDisarm(activity);



      // is there a transaction already?
      if (this._transactions[transactionType] === undefined) {
        this._createTransaction(transactionType, activity);
      }

      // is this a reportable action?
      if (this._transactions[transactionType].isReportable(activity)) {

        // is this appendable?
        if (this._isActivityAppendable(transactionType, activity)) {
          this._transactions[transactionType].appendActivity(activity);
        } else {

          if (this._hasOpenTransaction(transactionType)) {
            this._closeTransaction(transactionType);
            this._createTransaction(transactionType, activity);
          }

          this._transactions[transactionType].appendActivity(activity);
        }
      }

      if (this._transactions[transactionType].hasContent() && this.activities.indexOf(this._transactions[transactionType]) == -1) {
        this.activities.push(this._transactions[transactionType]);
      }
    }


    function _getTransactionTypeForActivity(activity) {

      switch (activity.fob_activity_type_id) {
        case fobActivityTypeConst.SECURITY:
          // arming, armed, disarming, disarmed, silencing, silenced, triggered
          return "security";
        case fobActivityTypeConst.PORTAL:
          // time based

          if (this._hasOpenTransaction("setup") && this._transactions.setup._isCapturing()) {
            return "setup";
          }

          return "tag_" + activity.data.Payload.DeviceID;
        case fobActivityTypeConst.ISSUE:
          $log.log("GOT HERE!!!!!!!!!!!!!!!!!!!!!!!!!");
          break;
        case fobActivityTypeConst.STATUS:
          // connect, disconnect, missing
          return "status";
        case fobActivityTypeConst.SETUP:
          // setup
          return "setup";
        default:
          $log.error("unknown activity type:" + activity.fob_activity_type_id);
      }

      return "notHandled";
    }

    function _isStartingSession(activity) {
      if (activity.fob_activity_type_id === fobActivityTypeConst.STATUS &&
        KornerStateHelpers.isFobStateConnected(activity.data.Payload.State)) {
        return true;
      }
      return false;
    }

    function _closeAllTransactions() {
      for (var key in this._transactions) {
        if (key !== 'status') {
          this._closeTransaction(key);
        }
      }
    }

    function _cleanUpTagEventHistoryOnArmOrDisarm(activity) {
      //is this a security message?
      if (activity.fob_activity_type_id === fobActivityTypeConst.SECURITY) {
        // are we arming or disarming?
        if (KornerStateHelpers.isFobStateArmed(activity.data.Payload.State) ||
          KornerStateHelpers.isFobStateDisarmed(activity.data.Payload.State)) {

          this._closeAllTagTransactions();
        }
      }
    }

    function _closeAllTagTransactions() {
      for (var key in this._transactions) {
        if (key.substring(0, 4) === "tag_") {
          this._closeTransaction(key);
        }
      }
    }

    function _isActivityAppendable(transactionType, activity) {
      if (this._hasOpenTransaction(transactionType)) {
        return this._transactions[transactionType].isActivityAppendable(activity);
      }
      return false;
    }


    function _hasOpenTransaction(transactionType) {
      return (this._transactions && this._transactions[transactionType]);
    }


    function _closeTransaction(transactionType) {

      if (this._transactions[transactionType].hasContent() && this.activities.indexOf(this._transactions[transactionType]) == -1) {
        this.activities.push(this._transactions[transactionType]);
      }

      this._transactions[transactionType].onFinalize();
      delete this._transactions[transactionType];
    }


    function _createTransaction(transactionType, activity) {

      if (transactionType === "security") {
        this._transactions[transactionType] = new FobActivitySecurity(this.fob);
      } else if (transactionType === "status") {
        this._transactions[transactionType] = new FobActivityStatus(this.fob);
      } else if (transactionType.substring(0, 4) === "tag_") {
        this._transactions[transactionType] = new FobActivityTag(this.fob);
      } else if (transactionType === "setup") {
        this._transactions[transactionType] = new FobActivitySetup(this.fob);
      }

      // if (this._transactions[transactionType].isReportable(activity)) {
      //   this.activities.push(this._transactions[transactionType]);
      // }
      // } else {
      //   delete this._transactions[transactionType];
      // }
    }



    function _pruneActivitiesExpiredItems() {
      // set the expiration date to now - 1 day.
      var now = new Date();
      var expirationDate = (now.getTime() - (24 * 60 * 60 * 1000));
      for (var index in this.activities) {
        if (this.activities[index].update_at < expirationDate) {
          delete this.activities[index];
        }
      }
    }

    function _shouldUserSeeActivity(activity) {

      if (activity.data === undefined || activity.data.MsgID === undefined) {
        return false;
      }
      // filter out commands the user should not see
      switch (activity.data.MsgID) {

        case fobMessageTypeConst.EXTENDER:
        case fobMessageTypeConst.TAGS:
        case fobMessageTypeConst.EXTENDERS:
        case fobMessageTypeConst.SETTINGS:
        case fobMessageTypeConst.FIRMWARE:
        case fobMessageTypeConst.INFO:
        case fobMessageTypeConst.FIRMWARE_REQUEST:
        case fobMessageTypeConst.EXTENDER_EXT_STATUS:

        case fobCmdMessageConst.GET_TAGS:
        case fobCmdMessageConst.INCLUDE_TAGS:
        case fobCmdMessageConst.EXCLUDE_TAGS:
        case fobCmdMessageConst.REMOVE_TAGS:
        case fobCmdMessageConst.GET_EXTENDERS:
        case fobCmdMessageConst.GET_SETTINGS:
        case fobCmdMessageConst.SET_SETTINGS:
        case fobCmdMessageConst.UPDATE_FOB_FIRMWARE:
        case fobCmdMessageConst.UPDATE_TAG_FIRMWARE:
        case fobCmdMessageConst.UPDATE_EXTENDER_FIRMWARE:
        case fobCmdMessageConst.UPDATE_SYSTEM_FIRMWARE:
        case fobCmdMessageConst.DOWNLOAD_FIRMWARE:
          return false;
      }
      return true;
    }

  }

})();
