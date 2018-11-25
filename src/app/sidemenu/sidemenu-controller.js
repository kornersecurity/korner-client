(function() {
  'use strict';


  angular.module('app.core')
    .controller('sidemenuController', sidemenuController);

  /* @ngInject */
  function sidemenuController(
    $rootScope,
    $scope,
    $state,
    $mdDialog,
    $mdSidenav,
    $mdMedia,
    $ionicListDelegate,
    accountAuthService,
    invitationService,
    noticeService,
    creditsService,
    FobCollection,
    $log,
    wizardType,
    $window,
    $ionicPopup
  ) {

    $rootScope.sideMenu = {}; // namespace for side menu stuff
    $scope.$state = $state;

    $scope.hasMultipleHomes = function() {
      return (FobCollection.getUnsafeCount() > 1);
    };

    $scope.onLogout = function() {
      FobCollection.deactiveActiveFob();
      accountAuthService.logout();
      $state.go('app.account.login', {}, {});
    };

    $scope.onEditMessage = function(message) {
      $ionicListDelegate.closeOptionButtons();
      showMessagePopup(document.body, "edit", message);
    };

    $scope.showHomes = function(){
      FobCollection.deactiveActiveFob();
      $state.go('app.home.select');
      if($mdMedia('sm') || $mdMedia('md')) {
        $mdSidenav('left').close();
      }
    };
    $scope.showProfile = function() {
      $mdDialog.show({
        templateUrl:'app/views/profile.html',
        controller: 'profileController'
      });
      if($mdMedia('sm') || $mdMedia('md')) {
        $mdSidenav('left').close();
      }
    };

    $scope.showNotices = function() {
      $mdDialog.show({
        templateUrl:'app/views/notices.html',
        controller: 'noticesController'
      });
      if($mdMedia('sm') || $mdMedia('md')) {
        $mdSidenav('left').close();
      }
    };

    $scope.showInvitations = function() {
      $mdDialog.show({
        templateUrl:'app/views/invitations.html',
        controller: 'invitationsController'
      });
      if($mdMedia('sm') || $mdMedia('md')) {
        $mdSidenav('left').close();
      }
    };

  $scope.showCredits = function() {
      $mdDialog.show({
        templateUrl:'app/views/credits.html',
        controller: 'creditsController'
      });
      if($mdMedia('sm') || $mdMedia('md')) {
        $mdSidenav('left').close();
      }
    };

    $scope.goToHelpSite = function(){
      $log.debug('[sidemenu-controller] SHOWING HELP IN NEW WINDOW');
      $window.open('http://support.kornersafe.com', '_system');
    };


    function loadInvitations() {
      $scope.sideMenu.loadingInvitations = true;

      $log.debug('[home-controller] LOADING INVITATIONS: ' + $scope.sideMenu.loadingInvitations);
      invitationService.getInvitations(true, function(invitations) {
        // $scope.$apply(function() {
        $scope.sideMenu.invitationsPending = invitations.length;
        $scope.sideMenu.loadingInvitations = false;
        // $log.debug('[home-controller] INVITATIONS LOADED: ' +
        // $scope.sideMenu.invitationsPending,
        // $scope.sideMenu.loadingInvitations);
        // });
      }, function(err) {
        $scope.sideMenu.loadingInvitations = false;
      });
      // ++;
    }

    function loadKornerNotices(callback) {
      $scope.sideMenu.loadingMaintenanceNotices = true;

      // $log.debug('[home-controller] LOADING KORNER NOTICES: ' + $scope.sideMenu.loadingMaintenanceNotices);
      noticeService.getNotices(function(theNotices) {
        $scope.sideMenu.maintenanceNotesPending = theNotices.length;
        $scope.sideMenu.loadingMaintenanceNotices = false;

        if (callback) {
          callback(theNotices);
        }
        // $log.debug('[home-controller] KORNER NOTICES LOADED: ' +
        // $scope.sideMenu.maintenanceNotesPending,
        // $scope.sideMenu.loadingMaintenanceNotices);
      });
    }
    function loadKornerCredits(){
      $log.debug('[home-controller] CHECKING KORNER CREDITS');
      creditsService.getCredits(function(theCredits){
         $log.debug('[TANMOY] Credits '+JSON.stringify(theCredits)); 
         $rootScope.sideMenu.credits = theCredits.balance;
      });
    }

    function loadKornerCreditActivity(){
      $log.debug('[home-controller] CHECKING KORNER CREDITS');
      creditsService.getActivity(function(theActivity){
         $log.debug('[TANMOY] Activity '+JSON.stringify(theActivity)); 
  
      });
    }

    $rootScope.sideMenu.checkKornerNotices = function() {

      $log.debug('[home-controller] CHECKING KORNER NOTICES');
      loadKornerNotices(function(theNotices) {
        // $log.debug('[home-select-controller] CHECKING IF WE SHOULD OPEN KORNER ALERT POP UP');

        if (theNotices.length === 1) {
          // $log.debug('[home-select-controller] KORNER ALERT POP UP OPENED');
          var alertPopup = $ionicPopup.alert({
            title: theNotices[0].title,
            template: '<div style="text-align:center;"><div class="icon large-icon fa fa-4x ' +
              theNotices[0].icon + '"></div><br /><span>' + theNotices[0].message + '</span></div>'
          });
          alertPopup.then(function(res) {
            // $log.debug('[home-select-controller] KORNER ALERT POP UP CLOSED');
          });
        } else if (theNotices.length > 1) {
          $scope.showNotices();
        }
      });
    };

    (function() {
      $rootScope.sideMenu.loadingInvitations = false;
      $rootScope.sideMenu.loadingMaintenanceNotices = false;
      $rootScope.sideMenu.invitationsPending = 2;
      $rootScope.sideMenu.maintenanceNotesPending = 5;
      $rootScope.sideMenu.loadInvitations = loadInvitations;
      loadInvitations();
      loadKornerNotices();
      loadKornerCredits();
      loadKornerCreditActivity();
      // $rootScope.sideMenu.checkKornerNotices();

      // tab badge support
      $scope.issuesBadge = ''; // TODO $scope.fob.tags.tagsWithIssues().length;
      $scope.messagesBadge = ''; // TODO
      $scope.firmwareUpdateBadge = $scope.firmwareUpdate ? '!' : '';


      // Added By tanmoy@imaginei.in
      
      $rootScope.sideMenu.loadingCredits = false;

    })();
  }
})();
