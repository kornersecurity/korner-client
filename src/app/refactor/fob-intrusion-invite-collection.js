(function() {
  'use strict';


  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobIntrusionInviteCollection', fobIntrusionInviteCollection)
    .constant('intrusionInviteResponseConst', {
      unknown: 0,
      cantHelp: 1,
      responding: 2,
      available: 3,
    });





  /* @ngInject */
  function fobIntrusionInviteCollection(FobUserModel, FobUserFeatureMaskConst, $q, $log,
    Restangular) {

    function FobIntrusionInviteCollection(fobID, intrusionID) {
      if (fobID) {
        this.fobID = fobID;
        this.intrusionID = intrusionID;
        this.invitees = {};

        this._initializedDeferred = $q.defer();
      }
    }

    FobIntrusionInviteCollection.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,

      // public methods
      loadRefreshIntrusionInvites: loadRefreshIntrusionInvites,
      addInvitees: addInvitees,
      updateInviteResponse: updateInviteResponse,
      isInvited: isInvited

      // private methods
    };


    return FobIntrusionInviteCollection;


    // initializer
    function onInitialize() {

      var self = this;

      this.loadRefreshIntrusionInvites().then(function() {
        self._initializedDeferred.resolve();
      }, function(status) {
        self._initializedDeferred.reject(status);
      });

      return this._initializedDeferred.promise;
    }


    function hasInitialized() {
      return this._initializedDeferred;
    }



    // private functions

    function loadRefreshIntrusionInvites() {
      var self = this;
      var defer = $q.defer();


      Restangular.one('fobs', self.fobID).one('intrusion', self.intrusionID).getList('invites')
        .then(function(invitees) {
            var plainInvitees = invitees.plain();
            var promises = [];
            // iterate across invitees
            for (var index in plainInvitees) {
              self.invitees[plainInvitees[index].fob_user_id] = plainInvitees[index];
            }

            defer.resolve();

          },
          function(response) {
            defer.reject(response.status);
          });

      return defer.promise;
    }

    function addInvitees(message, invitees) {
      var self = this;
      var defer = $q.defer();

      // Message    string `json:"message"`
      // FobUserIDs []int  `json:"fob_user_ids"`

      var inviteMessage = {
        message: message,
        fob_user_ids: invitees
      };


      Restangular.one('fobs', self.fobID).one('intrusion', self.intrusionID).all('invites').customPUT(inviteMessage).then(function(theInvite) {

          // reload invitees
          self.loadRefreshIntrusionInvites().then(function() {
            defer.resolve(message);

          }, function(status) {
            defer.resolve(status);
          });

        },
        function(response) {
          defer.resolve(response.status);
        });

      return defer.promise;
    }

    // post repsonse to invitation
    function updateInviteResponse(invitationID, responseID) {
      var self = this;
      var defer = $q.defer();

      var responseMessage = {
        response_id: responseID,
      };

      Restangular.one('fobs', self.fobID).one('intrusion', self.intrusionID).all('invites').one('intrusion', self.intrusionID).one('invite-response').customPUT(responseMessage).then(
        function(theMessages) {
          defer.resolve(message);
        },
        function(response) {
          defer.resolve(response.status);
        });

      return defer.promise;
    }

    function isInvited(fobUserID) {
      if (this.invitees[fobUserID] !== undefined) {
        return true;
      }
      return false;
    }

  }

})();
