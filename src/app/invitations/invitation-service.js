//
// invitation-service.js
//
(function() {
  'use strict';

  angular.module('app.invitation')
    .service('invitationService', [
      '_',
      'Restangular',
      'userService',
      'invitationStatus',
      'contentInvites',
      '$log',
      function(
        _,
        Restangular,
        userService,
        invitationStatus,
        contentInvites,
        $log
      ) {

        var invitations = [];

        function setStatusDescriptions() {
          for (var i in invitations) {
            setStatusDescriptionById(invitations[i].fob_id, invitations[i].fob_user_id);
          }
        }

        function setStatusDescriptionById(fobId, fobUserId) {
          var invitation = getInvitationById(fobId, fobUserId);

          switch (invitation.status) {
            case invitationStatus.ACCEPTED:
              invitation.invitationstatusDesc = contentInvites.STATUS_ACCEPTED;
              break;
            case invitationStatus.DECLINED:
              invitation.invitationstatusDesc = contentInvites.STATUS_DECLINED;
              break;
            case invitationStatus.PENDING:
              invitation.invitationstatusDesc = contentInvites.STATUS_PENDING;
              break;
          }
        }

        function getInvitationById(fobId, fobUserId) {
          for (var i in invitations) {
            if (invitations[i].fob_id === fobID && invitations[i].fob_user_id === fobUserId) {
              return invitations[i];
            }
          }
        }

        function removeInvitation(invitation) {
          for (var i in invitations) {
            if (invitations[i].fob_id === invitation.fob_id &&
              invitations[i].fob_user_id === invitation.fob_user_id) {
              invitations.splice(i, 1);
              $log.debug('[invitation-service] REMOVED INVITATION: ', invitation.fob_id, invitation.fob_user_id);
              return;
            }
          }
        }


        function getInvitations(loadRemote, successCallback, failCallback) {
          // /api/v1/circle/circle-invitations

          // if(loadRemote === false)
          // {
          //   successCallback(invitations);
          //   return;
          // }

          Restangular.all('circle/circle-invitations').getList().then(
            function(response) {
              $log.debug('[invitation-service] RESPONSE: ', response.plain().length);
              invitations = response.plain();
              successCallback(response.plain());
            },
            function(error) {
              failCallback(error);
            });
        }

        function acceptInvitation(invitation, successCallback, failCallback) {
          // /api/v1/fobs/{fobID}/users/{fobUserID}/accept
          $log.debug('[invitation-service] ACCEPTING INVITATION: ', invitation, invitations.length);

          Restangular.one('fobs', invitation.fob_id).one('users',
            invitation.fob_user_id).one('accept').put().then(
            function() {
              removeInvitation(invitation);
              $log.debug('[invitation-service] INVITATION ACCEPTED: ', invitations.length);
              successCallback(invitations);
            },
            function(error) {
              failCallback(error);
            });
        }

        function declineInvitation(invitation, successCallback, failCallback) {
          // /api/v1/fobs/{fobID}/users/{fobUserID}/decline
          $log.debug('[invitation-service] DECLINING INVITATION: ', invitation, invitations.length);

          Restangular.one('fobs', invitation.fob_id).one('users',
            invitation.fob_user_id).one('decline').put().then(
            function() {
              removeInvitation(invitation);
              $log.debug('[invitation-service] INVITATION DECLINED: ', invitations.length);
              successCallback(invitations);
            },
            function(error) {
              failCallback(error);
            });

        }

        return {
          getInvitations: getInvitations,
          acceptInvitation: acceptInvitation,
          declineInvitation: declineInvitation
        };

      }
    ]);
})();


App.constant('invitationStatus', {
  ACCEPTED: 0,
  DECLINED: 1,
  PENDING: 2
});
