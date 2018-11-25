(function() {
  'use strict';



  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobMessageCollection', fobMessageCollection);

  /* @ngInject */
  function fobMessageCollection(Restangular, $q, $log, KornerMsgHelpers, NotificationService, $rootScope) {


    function FobMessageCollection(fobID) {
      if (fobID) {
        this.fobID = fobID;
        this.messages = {};
        this._lastActivityID = -1;
        this._refreshEnabled = false;
        this._initializedDeferred = $q.defer();
      }
    }

    FobMessageCollection.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,
      getMessageByID: getMessageByID,
      postMessage: postMessage,
      updateMessage: updateMessage,
      deleteMessageByID: deleteMessageByID,
      refreshMessages: refreshMessages,
      refreshAllMessages: refreshAllMessages,
      enableRefresh: enableRefresh,
      disableRefresh: disableRefresh,

      //private
      _loadRefreshMessages: _loadRefreshMessages,
    };

    return FobMessageCollection;


    // initializer
    function onInitialize() {
      var self = this;
      self._initializedDeferred.resolve();
      // this.refreshMessages().then(function() {
      //   self._initializedDeferred.resolve();
      // }, function(status) {
      //   self._initializedDeferred.reject(status);
      // });
    }

    function hasInitialized() {
      return this._initializedDeferred;
    }


    function refreshMessages() {
      var defer = $q.defer();
      var self = this;

      if (this._refreshEnabled) {
        self._loadRefreshMessages(this._lastActivityID).then(function() {
          NotificationService.notify();
          defer.resolve();
        }, function(status) {
          defer.reject(status);
        });
      } else {
        defer.resolve();
      }

      return defer.promise;
    }

    function refreshAllMessages() {
      this._lastActivityID = -1;
      this.messages = {};

      this.refreshMessages();
    }

    function enableRefresh() {
      this._refreshEnabled = true;
    }

    function disableRefresh() {
      this._refreshEnabled = false;
    }

    function _loadRefreshMessages(lastMessageID) {

      var self = this;
      var defer = $q.defer();

      var queryCriteria = {};
      if (lastMessageID !== -1) {
        queryCriteria.lastID = lastMessageID;
      }


      Restangular.one('fobs', self.fobID).all('circle/messages/today').getList(queryCriteria)
        .then(function(items) {

            // raw list of items that need to be processed
            var plainItems = items.plain();
            for (var index in plainItems) {
              var message = plainItems[index];

              self.messages[message.fob_message_id] = message;

              if (message.fob_message_id > self._lastActivityID) {
                self._lastActivityID = message.fob_message_id;
              }
            }

            //check to see if we have 100 items
            if (items.length === 100) {
              offset += items.length;
              self.loadRefreshMessages(self.lastMessageID).then(function(messages) {

                // add messages from recusive call
                for (var index in messages) {
                  message = messages[index];
                  self.messages[message.fob_message_id] = message;


                  if (message.fob_message_id > self._lastActivityID) {
                    self._lastActivityID = message.fob_message_id;
                  }
                }

                defer.resolve();
              }, function(status) {
                defer.reject(status);
              });
            } else {
              // less than 100 items we're done

              defer.resolve();
            }
          },
          function(response) {
            $log.debug('[FobActivityCollection] ERROR LAODING CIRCLE MESSAGES: '+response.status);
            if(response.status === 404 || response.message === 'Not logged in') {
              $rootScope.logOut();
            } else if(response.status === 401 || response.status === 0 || response.status === 503){
              $rootScope.restart();
            }
            defer.reject(response.status);
          });

      return defer.promise;



    }

    function getMessageByID(messageId) {
      return this.messages[messageID];
    }


    function postMessage(message) {
      var self = this;
      var defer = $q.defer();

      var newMessage = {
        channel_type_id: 1, // TODO: lookup
        message: message,
        is_urgent: false
      };

      Restangular.one('fobs', self.fobID).all('messages').post(newMessage).then(function(theMessage) {
        message = theMessage.plain();
        self.messages[message.fob_message_id] = message;

        defer.resolve(message);
      }, function(response) {
        $log.debug('[FobActivityCollection] ERROR POSTING CIRCLE MESSAGE: '+response.status);
        if(response.status === 404 || response.message === 'Not logged in') {
          $rootScope.logOut();
        } else if(response.status === 401 || response.status === 0 || response.status === 503){
          $rootScope.restart();
        }
        defer.resolve(response.status);
      });

      return defer.promise;
    }


    function updateMessage(message) {
      var self = this;
      var defer = $q.defer();

      Restangular.one('fobs', self.fobID).one('messages', message.fob_message_id).customPUT(message).then(
        function() {
          self.messages[message.fob_message_id] = message;

          defer.resolve(message);
        },
        function(response) {
          $log.debug('[FobActivityCollection] ERROR UPDATING CIRCLE MESSAGE: '+response.status);
          if(response.status === 404 || response.message === 'Not logged in') {
            $rootScope.logOut();
          } else if(response.status === 401 || response.status === 0 || response.status === 503){
            $rootScope.restart();
          }
          defer.resolve(response.status);
        });

      return defer.promise;
    }

    function deleteMessageByID(messageId) {
      var self = this;
      var defer = $q.defer();

      Restangular.one('fobs', self.fobID).one('messages', messageId).remove()
        .then(function() {
          delete self.messages[messageId];

          defer.resolve();
        }, function(response) {
          $log.debug('[FobActivityCollection] ERROR DELETING CIRCLE MESSAGE: '+response.status);
          if(response.status === 404 || response.message === 'Not logged in') {
            $rootScope.logOut();
          } else if(response.status === 401 || response.status === 0 || response.status === 503){
            $rootScope.restart();
          }
          defer.resolve(response.status);
        });

      return defer.promise;
    }
  }

})();
