(function() {
  'use strict';
  angular.module('app.wizard.circle')
    .controller('circleSetupControllerPage3', circleSetupControllerPage3);

  /* @ngInject */
  function circleSetupControllerPage3(
    $scope,
    $state,
    contentCircleSetup,
    fobUserStatusConst,
    uiLoadingService,
    $ionicPopup,
    CircleSetupService,
    userService,
    $interval,
    $log
  ) {
    // $log.debug('P3 CONTROLLER');

    function isNewUser(user){
        return (user.fob_user_status_id === fobUserStatusConst.STATUS_NEW);
    }

    function setInviteesForCheckboxes()
    {
      $scope.inviteesForCheckbox = [];
      for(var i in $scope.wizard.circleSetup.users)
      {
        var user = $scope.wizard.circleSetup.users[i];
        if(isNewUser(user) === true)
        {
          $scope.inviteesForCheckbox.push({
            fullname:   user.fullName(),
            first_name:  user.first_name,
            last_name:   user.last_name,
            email:      user.email,
            checked:  true
          });
        }
      }
    }


    $scope.updateInviteesSelected = function(inviteeClicked)
    {
      $scope.inviteesSelected = false;

      angular.forEach($scope.inviteesForCheckbox, function(invitee) {
        // $log.debug('INVITEE CHECKED: '+invitee.checked);
        if(inviteeClicked === invitee)
        {
          invitee.checked = !invitee.checked;
        }
        if(invitee.checked)
        {
          $scope.inviteesSelected = true;
        }
      });
      // $log.debug('AT LEAST ONE INVITE SELECTED: '+$scope.inviteesSelected);
    };

    $scope.toggleCheckboxes = function()
    {
      angular.forEach($scope.inviteesForCheckbox, function(invitee) {
        invitee.checked = $scope.checkoxesState;
        $log.debug("UPDATING CHECKBOXES: "+invitee.checked);
      });
      $scope.updateInviteesSelected();
      $scope.checkoxesState = !$scope.checkoxesState;
    };

    $scope.inviteCircleMembers = function()
    {
      // $log.debug("INVITING CIRCLE MEMBERS: ");
      uiLoadingService.show(contentCircleSetup.PROCESS_SENDING_INVITATIONS, "wizardToast");

      var selectedInvitees = [];
      angular.forEach($scope.inviteesForCheckbox, function(invitee) {
        if(invitee.checked)
        {
          $log.debug('[circle-setup-p3-controller] INVITING: '+invitee.first_name, invitee.last_name);
          selectedInvitees.push(invitee);
        }
      });

      var postData = {
        invitees:selectedInvitees,
        message:$scope.message,
        fob_id:$scope.wizard.circleSetup.fob.fob_id
        };
      CircleSetupService.inviteCircleMembers(postData).then(
        function()
        {
          $scope.wizard.circleSetup.fob.users.loadRefreshFobUsers().then(
            function() {
              $scope.wizard.circleSetup.users = $scope.wizard.circleSetup.fob.users.getFobUsersArray();//userService.getUsers();
              $scope.hasActiveUsers     = $scope.hasUsersWithStatus(fobUserStatusConst.STATUS_ACTIVE);


              setInviteesForCheckboxes();

              uiLoadingService.showHideDelay(contentCircleSetup.PROCESS_INVITATIONS_SENT, "wizardToast", true, 1500, function(){
                if($scope.wizard.circleSetup.countNewUsers() === 0)
                {
                  $scope.wizard.wizardManagerData.setWizardCompleted(
                  $scope.wizard.wizardManagerData.currentWizard.type, true);
                  // $scope.wizard.goToNextPage();
                  $scope.wizard.wizardCompleted(false);
                }
              });

            },
            function(err){
              uiLoadingService.showHideDelay(contentCircleSetup.PROCESS_INVITATIONS_NOT_SENT, "wizardToast", true);
            }
          );
        },
        function(error)
        {
          uiLoadingService.showHideDelay(contentCircleSetup.PROCESS_INVITATIONS_NOT_SENT, "wizardToast", true);
        }
      );
    };


    function onDoneClicked() {
      $scope.wizard.nextButtonDisplayed = true;
      if($scope.wizard.circleSetup.countNewUsers() > 0)
      {
        var uninvitedUsersPopup = $ionicPopup.confirm({
          title:      contentCircleSetup.SKIP_INVITES_TITLE,
          template:   contentCircleSetup.SKIP_INVITES_MESSAGE,
          cancelText: contentCircleSetup.NO,
          okText:     contentCircleSetup.YES
        });

        uninvitedUsersPopup.then(function(res)
        {
          if(res)
          {
            $log.debug('You are sure');
            $scope.wizard.wizardManagerData.setCurrentWizardPage(1);
            $scope.wizard.changeState();
            // $scope.wizard.goToNextPage();
          }
          else
          {
            $log.debug('You are not sure');
          }
        });
      }
      else
      {
        $scope.wizard.wizardCompleted(false);
      }
    }


    $scope.$on('$destroy', function() {
      $scope.wizard.nextButtonDisplayed = true;
    });

    (function(){

      $scope.wizard.pageCode = '504';

      $scope.checkoxesState       = false;
      $scope.inviteesForCheckbox  = [];
      $scope.inviteesSelected     = true;
      $scope.message              = contentCircleSetup.INVITATION_MESSAGE;
      $scope.wizard.circleSetup.newUsersCount        = $scope.wizard.circleSetup.countNewUsers();
      $scope.showHelp             = ($scope.wizard.circleSetup.users.length > 1)? false : true;

      $log.debug("[circle-setup-p3-controller] USERS TO INVITE: "+$scope.wizard.circleSetup.newUsersCount);
      $log.debug('[circle-setup-p3-controller] CURRENT PAGE ',
                  $scope.wizard.wizardManagerData.currentWizard.currentPage,
                  $scope.wizard.wizardManagerData.currentWizard.pages.length);

      $scope.$on('toggleHelp', function(e) {
          $scope.showHelp =!$scope.showHelp;
      });

      $scope.wizard.disableDoneButton();
      $scope.wizard.disableNextButton();

      setInviteesForCheckboxes();
      $scope.updateInviteesSelected();

      $scope.$on('wizardEvent::doneClicked', onDoneClicked);
      $scope.wizard.nextButtonDisplayed = false;
    })();
  }
})();
