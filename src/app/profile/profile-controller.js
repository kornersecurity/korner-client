(function() {
  'use strict';

  angular.module('app.profile')
    .controller('profileController', profileController);


  /* @ngInject */
  function profileController(
    $rootScope,
    $scope,
    $state,
    contentProfile,
    ProfileService,
    uiLoadingService,
    $mdDialog,
    FobCollection,
    $log,
    $ionicPopup
  ) {

    $scope.profile = {};
    $scope.profileSetup = {};
    $scope.profileSetup.addressChanged = false;


    $scope.profile.closeModal = function() {
      $log.debug('[profile-controller] CLOSING MODAL');

      if(window.cordova && cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.close();
      }

      if($scope.profile.profileModified) {
        var confirmProfilePopup = $ionicPopup.confirm({
          title: contentProfile.CLOSE_PROFILE_TITLE,
          template: contentProfile.SAVE_CHANGES_MESSAGE,
          cancelText: contentProfile.NO,
          okText: contentProfile.YES
        });

        confirmProfilePopup.then(function(res) {

          if (res) {
            // uiLoadingService.show(contentProfile.UPDATING_PROFILE, "kornerProfile");
            $scope.profile.updateProfile(function(){
              $mdDialog.hide();
            });
          } else {
            $mdDialog.hide();
          }
        });
      } else if($scope.profileSetup.addressChanged){

        var confirmProfileAddressPopup = $ionicPopup.confirm({
          title: contentProfile.CLOSE_PROFILE_TITLE,
          template: contentProfile.SAVE_CHANGES_MESSAGE,
          cancelText: contentProfile.NO,
          okText: contentProfile.YES
        });

        confirmProfileAddressPopup.then(function(res) {
          if (res) {
            // uiLoadingService.show(contentProfile.UPDATING_PROFILE, "kornerProfile");
            $scope.profileSetup.updateProfileAddress(function(){
              $mdDialog.hide();
            });
          } else {
            $mdDialog.hide();
          }
        });
      } else {
        $mdDialog.hide();
      }

      // $rootScope.profileModal.hide();
    };

    (function() {

      $log.debug('[profile-controller] INITIALIZING');
      uiLoadingService.show(" ", "kornerProfile");
      ProfileService.getProfileInformation().then(
        function(profile){
          $scope.profile.data = profile;
          $scope.profileSetup.editableAddress = angular.copy($scope.profile.data.address);

          if($scope.profileSetup.editableAddress === undefined ||
             $scope.profileSetup.editableAddress.line_1 === '') {
            FobCollection.getFobList().then(function(fobs) {
              for (var index in fobs) {
                var fob = fobs[index];
                if(fob.fobUser.isOwner() && fob.address !== undefined){
                  $scope.profileSetup.editableAddress.line_1   = fob.address.line_1;
                  $scope.profileSetup.editableAddress.line_2   = fob.address.line_2;
                  $scope.profileSetup.editableAddress.city     = fob.address.city;
                  $scope.profileSetup.editableAddress.state    = fob.address.state;
                  $scope.profileSetup.editableAddress.zipcode  = fob.address.zipcode;
                  $scope.profileSetup.editableAddress.country  = fob.address.country;
                  $scope.profileSetup.addressChanged = true;
                  break;
                }
              }
            });
          }
          $scope.profile.newPic = false;
          $scope.profile.profileModified = false;
          $log.debug('[profile-controller] PROFILE UPDATED - PIC URL: '+$scope.profile.data.imageUrl);

          uiLoadingService.hide();
        },
        function(err){
          $log.debug('[profile-controller] err');
          uiLoadingService.hide();
          $scope.profile.closeModal();
        }
      );
    })();
  }
})();
