(function() {
  'use strict';

  angular.module('app.invitation')
    .controller('invitationsController', invitationsController);


  /* @ngInject */
  function invitationsController(
    $scope,
    $state,
    $mdDialog,
    invitationService,
    contentInvites,
    invitationStatus,
    $interval,
    uiLoadingService,
    SessionService2,
    $log
  ) {
    // $log.debug('P1 CONTROLLER');
    $scope.invitationScreen = {};
    $scope.invitationScreen.loadingInvitations = true;
    $scope.invitationScreen.showCloseButton = true;


    $scope.invitationScreen.closeModal = function() {
      $log.debug('[invitations-controller] CLOSING MODAL');
      // $rootScope.profileModal.hide();
      $mdDialog.hide();
    };

    $scope.invitationScreen.acceptInvitation = function(invitation) {
      uiLoadingService.show(contentInvites.ACCEPTING, "kornerInvitations");
      invitationService.acceptInvitation(invitation, function(invitations){
        $scope.invitationScreen.invitations = invitations;
        uiLoadingService.showHideDelay(contentInvites.ACCEPTED, "kornerInvitations", true);
        // $log.debug('[invitations-controller] INVITATIONS LOADED: '+invitations.length, $scope.invitationScreen.loadingInvitations);
        if(invitations.length === 0) {
          $scope.invitationScreen.closeModal();
        }
        // $log.debug('[invitations-controller] CURRENT STATE: '+$state.current.name);
        if($state.is('app.startup.splash') === true) {
          SessionService2.onStartup();
        }
        else {
          $state.go('app.startup.splash', {}, {});
        }
      },function(err){

      });
    };

    $scope.invitationScreen.declineInvitation = function(invitation) {
      uiLoadingService.show(contentInvites.DECLINING, "kornerInvitations");
      invitationService.declineInvitation(invitation, function(invitations){
        $scope.invitationScreen.invitations = invitations;
        uiLoadingService.showHideDelay(contentInvites.DECLINED, "kornerInvitations", true);
        // $log.debug('[invitations-controller] INVITATIONS LOADED: '+invitations.length, $scope.invitationScreen.loadingInvitations);
        if(invitations.length === 0) {
          $scope.invitationScreen.closeModal();
        }
        // $log.debug('[invitations-controller] CURRENT STATE: '+$state.current.name);
        if($state.is('app.startup.splash') === true) {
          SessionService2.onStartup();
        }
        else {
          $state.go('app.startup.splash', {}, {});
        }
      },function(err){

      });
    };

    (function() {
      $interval(function(){
        uiLoadingService.show(contentInvites.LOADING, "kornerInvitations");
        if($state.is('app.startup.splash') === true) {
          $scope.invitationScreen.showCloseButton = false;
        }
        // $scope.$on('wizardEvent::showNextPage', nextPage);
        // $log.debug('[invitations-controller] LOADING INVITATIONS: '+$scope.invitationScreen.loadingInvitations);
        invitationService.getInvitations(true, function(invitations){
          $scope.invitationScreen.invitations = invitations;
          $scope.invitationScreen.loadingInvitations = false;
          uiLoadingService.hide();
          // $log.debug('[invitations-controller] INVITATIONS LOADED: '+invitations.length, $scope.invitationScreen.loadingInvitations);
        },function(err){

        });
      }, 200, 1);

    })();
  }
})();
