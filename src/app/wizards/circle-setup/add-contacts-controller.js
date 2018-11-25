(function() {
  'use strict';

  angular.module('app.wizard.circle')
    .controller('addContactModalController', addContactModalController);

  /* @ngInject */
  function addContactModalController (
    $scope,
    $state,
    userService,
    fobUserStatusConst,
    $ionicPopup,
    contentCircleSetup,
    $log,
    FobUserModel,
    uiLoadingService
  )
  {
    if(window.cordova && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }
    $scope.wizard.pageCode = '502';
    // $log.debug("EDIT MODE: "+($scope.modalActionType === 'edit'));
    $scope.newUserData = ($scope.modalActionType === 'edit')? angular.copy($scope.userToEdit): {};
    $scope.fobUserStatusConst = fobUserStatusConst;

    // $log.debug('ADD CONTACT MODAL CONTROLLER: '+$scope.modalTitle, $scope.modalActionType, $scope.newUserData);
    var previousEmail;
    var originalFeatureMask;

    if($scope.modalActionType === 'edit')
    {
      previousEmail = $scope.userToEdit.email;
      originalFeatureMask = $scope.userToEdit.home_feature_mask;
      $scope.featureMaskData = {};
      $scope.featureMaskData.armDisarmFeature = $scope.userToEdit.hasArmDisarmFeature();
      $scope.featureMaskData.basicActivityFeature = $scope.userToEdit.hasActivityBasicFeature();
      $scope.featureMaskData.IntrusionFeature = $scope.userToEdit.hasIntrusionFeature();
      $scope.featureMaskData.householdMemberFeature = $scope.userToEdit.hasHouseholdMemberFeature();
      $scope.featureMaskData.immediateIntrusionNotificationFeature = $scope.userToEdit.hasImmediateIntrusionNotificationFeature();
    }

    $scope.addContact = function()
    {
      $log.debug('[addContactModalController] $addUser()');
      $scope.newUserData.email = $scope.newUserData.email.toLowerCase();
      if(isEmailUnique($scope.newUserData.email) === false)
      {
        showAlertPopup(contentCircleSetup.DUPLICATE_EMAIL_ALERT_TITLE, contentCircleSetup.DUPLICATE_EMAIL_ALERT_MESSAGE);
        return;
      }

      if($scope.newUserData.last_name === undefined)
      {
        $scope.newUserData.last_name = '';
      }

      if($scope.modalActionType === 'edit') {

         if($scope.newUserData.fob_user_status_id === fobUserStatusConst.STATUS_ACTIVE) {
             if($scope.userToEdit.home_feature_mask !== originalFeatureMask) {
             uiLoadingService.show('', "wizardToast");
             $scope.userToEdit.updateFeatureMaskSettings().then(
               function(){
                 $log.debug("[addContactModalController] FEATURE MASK UPDATED");
                 uiLoadingService.showHideDelay(
                   contentCircleSetup.FEATURE_MASK_UPDATED_SUCCESSFULLY, "wizardToast", true, 2500,
                   function() {
                     $scope.closeModal();
                   }
                 );
               },
               function(err){
                 uiLoadingService.showHideDelay(
                   contentCircleSetup.FEATURE_MASK_UPDATE_ERROR, "wizardToast", false, 3500,
                   function() {
                    //  do nothing...
                   }
                 );
               }
             );

          } else {
            $log.debug("[addContactModalController] FEATURE MASK NOT UPDATED - NO CHANGES");
            $scope.userToEdit.home_feature_mask = originalFeatureMask;
            $scope.closeModal();
          }
        } else {
          $scope.userToEdit.first_name = $scope.newUserData.first_name;
          $scope.userToEdit.last_name = $scope.newUserData.last_name;
          $scope.userToEdit.email = $scope.newUserData.email;
          $scope.closeModal();
          $log.debug("[addContactModalController] FEATURE MASK NOT UPDATED - NEW USER");
        }
      }
      else
      {
        var newFobUser = new FobUserModel({
          first_name: $scope.newUserData.first_name,
          last_name: $scope.newUserData.last_name,
          email: $scope.newUserData.email,
          fob_user_status_id: fobUserStatusConst.STATUS_NEW
        });
        $scope.wizard.circleSetup.users.unshift(newFobUser);

        $log.debug("HAS NEW USER BEFORE ADDING: "+$scope.wizard.circleSetup.hasNewUser);
        // $scope.wizard.circleSetup.users = userService.addUser($scope.newUserData);
        $scope.wizard.circleSetup.hasNewUser = $scope.hasUsersWithStatus(fobUserStatusConst.STATUS_NEW);
        $log.debug("HAS NEW USER AFTER ADDING: "+$scope.wizard.circleSetup.hasNewUser);
        $scope.closeModal();
      }

    };

    function isEmailUnique(email)
    {
      $log.debug("[addContactModalController] CHECKING EMAIL UNIQUENESS");
      for(var i in $scope.wizard.circleSetup.users)
      {
        var user = $scope.wizard.circleSetup.users[i];
        $log.debug("[addContactModalController] CHECKING "+user.email+" AGAINST "+email);
        if(user.email === email && email !== previousEmail)
        {
          return false;
        }
      }
      return true;
    }

    function showAlertPopup(title, description)
    {
      $log.debug("[addContactModalController] ALERT POPUP: " + title, description);
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: description
      });

      alertPopup.then(function(res)
      {
        // There is nothing to do...
      });
    }

    $scope.$on('$destroy', function()
    {
      $log.debug('$destroy()');
      if ($scope.modal !== undefined)
      {
        $scope.modal.remove();
      }
    });


    $scope.toggleArmDisarmFeature = function() {
      // $log.debug("[addContactModalController] FEATURE MASK BEFORE: " + $scope.userToEdit.home_feature_mask);
      $scope.userToEdit.toggleArmDisarmFeatureBit();
      // $log.debug("[addContactModalController] FEATURE MASK AFTER:  " + $scope.userToEdit.home_feature_mask);
    };

    $scope.toggleBasicActivityFeature = function() {
      // $log.debug("[addContactModalController] FEATURE MASK BEFORE: " + $scope.userToEdit.home_feature_mask);
      $scope.userToEdit.toggleActivityFeatureBit();
      // $log.debug("[addContactModalController] FEATURE MASK AFTER:  " + $scope.userToEdit.home_feature_mask);
    };

    $scope.toggleIntrusionFeature = function() {
      // $log.debug("[addContactModalController] FEATURE MASK BEFORE: " + $scope.userToEdit.home_feature_mask);
      $scope.userToEdit.toggleIntrusionFeatureBit();
      // $log.debug("[addContactModalController] FEATURE MASK AFTER:  " + $scope.userToEdit.home_feature_mask);
    };

    $scope.toggleHouseholdMemberFeature = function() {
      // $log.debug("[addContactModalController] FEATURE MASK BEFORE: " + $scope.userToEdit.home_feature_mask);
      $scope.userToEdit.toggleHouseholdMemberFeatureBit();
      // $log.debug("[addContactModalController] FEATURE MASK AFTER:  " + $scope.userToEdit.home_feature_mask);
    };

    $scope.toggleImmediateIntrusionNotificationFeature = function() {
      // $log.debug("[addContactModalController] FEATURE MASK BEFORE: " + $scope.userToEdit.home_feature_mask);
      $scope.userToEdit.toggleImmediateIntrusionNotificationFeatureBit();
      // $log.debug("[addContactModalController] FEATURE MASK AFTER:  " + $scope.userToEdit.home_feature_mask);
    };


  }
})();
