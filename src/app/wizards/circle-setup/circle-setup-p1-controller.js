(function() {
  'use strict';
  angular.module('app.wizard.circle')
  .controller('circleSetupControllerPage1', circleSetupControllerPage1);

  /* @ngInject */
  function circleSetupControllerPage1(
    $rootScope,
    $scope,
    fobUserStatusConst,
    $ionicListDelegate,
    wizardType,
    $log
  ) {
    // $log.debug('[circleSetupControllerPage1] p1 CONTROLLER');
    var reloadTimer;

    function startReloadTimer() {
      stopReloadTimer();
      reloadTimer = setTimeout(reloadUsersAndRestartTimer, 45*1000); //reload every 45 sec
      $log.debug('[circleSetupControllerPage1] RELOAD TIMER STARTED');

    }

    function reloadUsersAndRestartTimer(){
      $scope.wizard.circleSetup.reloadUsers();
      restartReloadTimer();
    }

    function stopReloadTimer() {
      if(reloadTimer){
        clearTimeout(reloadTimer);
        reloadTimer = null;
      }
    }

    function restartReloadTimer() {
      $log.debug('[circleSetupControllerPage1] RESTARTING RELOAD TIMER');
      stopReloadTimer();
      startReloadTimer();
    }

    $scope.$on('$destroy', function() {
      stopReloadTimer();
    });

    $scope.wizard.circleSetup.activeNoOwner = function (user) {
      // $log.debug('[circleSetupControllerPage1] FOB USER STATUS ID: '+user.fob_user_status_id);
      if (user.fob_user_status_id === fobUserStatusConst.STATUS_ACTIVE && !user.isOwner()) {
        return true;
      }
      return false;
    };

    (function() {
      $scope.wizard.pageCode = '501';
      $scope.fobUserStatusConst = fobUserStatusConst;
      $scope.hasActiveUsers     = $scope.hasUsersWithStatus(fobUserStatusConst.STATUS_ACTIVE);
      $scope.wizard.circleSetup.hasNewUser         = $scope.hasUsersWithStatus(fobUserStatusConst.STATUS_NEW);
      $scope.wizard.circleSetup.invitedUsersCount  = $scope.wizard.circleSetup.countPendingInvites();
      $scope.wizard.circleSetup.newUsersCount      = $scope.wizard.circleSetup.countNewUsers();

      $scope.showHelp = ($scope.wizard.circleSetup.users.length > 1) ? false : true;
      $log.debug("[circleSetupControllerPage1] HAS NEW USER: " + $scope.wizard.circleSetup.hasNewUser);
      $log.debug("[circleSetupControllerPage1] UN/INVITED USERS (NEW, INVITED): " + $scope.wizard.circleSetup.newUsersCount, $scope.wizard.circleSetup.invitedUsersCount);

      $scope.showActiveGroup = $scope.hasUsersWithStatus(fobUserStatusConst.STATUS_ACTIVE);
      $scope.showPendingGroup = $scope.wizard.circleSetup.invitedUsersCount > 0;
      $scope.showDeclinedGroup = false;

      $scope.$on('toggleHelp', function(e) {
        $scope.showHelp = !$scope.showHelp;
      });

      if($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME)
      {
        $scope.wizard.enableNextButton();
      }
      else if($scope.wizard.wizardManagerData.wizardType !== wizardType.WELCOME && !$scope.wizard.circleSetup.hasNewUser)
      {
        $scope.wizard.disableNextButton();
      }

      if($scope.wizard.wizardManagerData.wizardType !== wizardType.WELCOME)
      {
        $scope.wizard.canExitWizard = true;
      }
      $log.debug('[circleSetupControllerPage1] CAN EXIT WIZARD: '+$scope.wizard.canExitWizard);

      startReloadTimer();
    })();

    $scope.wizard.circleSetup.toggleGroup = function(group) {
      $log.debug("[circleSetupControllerPage1] TOGGLING GROUP: " + group);
      switch (group) {
        case 'active':
          $scope.showActiveGroup = !$scope.showActiveGroup;
          break;
        case 'pending':
          $scope.showPendingGroup = !$scope.showPendingGroup;
          break;
        case 'declined':
          $scope.showDeclinedGroup = !$scope.showDeclinedGroup;
          break;
      }
    };

    $scope.isGroupShown = function(group)
    {
      switch (group) {
        case 'active':
          return $scope.showActiveGroup;
        case 'pending':
          return $scope.showPendingGroup;
        case 'declined':
          return $scope.showDeclinedGroup;
      }
    };


    // $scope.canShowEdit = function(user) {
    //   return user.status === fobUserStatusConst.STATUS_NEW || user.status === fobUserStatusConst.STATUS_INVITED || user.status === fobUserStatusConst.STATUS_ACTIVE;
    // };
  }

})();
