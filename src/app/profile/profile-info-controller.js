(function() {
  'use strict';

  angular.module('app.profile')
    .controller('profileInfoController', profileInfoController);


  /* @ngInject */
  function profileInfoController(
    $rootScope,
    $scope,
    $state,
    $ionicActionSheet,
    contentFobSetup,
    contentProfile,
    pictureService,
    ProfileService,
    uiLoadingService,
    $log
  ) {
    // if(window.cordova && cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.close();
    // }

    function showPic(imageURI) {
      $scope.profile.newPic = true;
      $scope.profile.profileModified = true;
      $log.debug("[profileController] IMAGE URI: " + imageURI);
      $scope.profile.data.imageUrl = imageURI;
    }

    function picCaptureError(message) {
      $log.debug('[fobSetupControllerPage2] IMAGE CAPTURE ERROR: ' + message);
    }

    $scope.profile.showPictureActionSheet = function() {
      if(window.cordova && cordova.plugins.Keyboard) {
        var hideSheet = $ionicActionSheet.show({
          buttons: [{
            text: contentFobSetup.TAKE_PICTURE
          }, {
            text: contentFobSetup.GALLERY_PICTURE
          }],
          // titleText: contentFobSetup.PICTURE_ACTION_SHEET_TITLE,
          cancelText: contentFobSetup.CANCEL,
          cancel: function() {
            // add cancel code..
            // $log.debug("[fobSetupControllerPage2] CANCEL CLICKED");
          },
          buttonClicked: function(index) {
            // $log.debug("[fobSetupControllerPage2] BUTTON CLICKED: " + index);
            if (index === 0) {
              pictureService.takePhoto(showPic, picCaptureError);
            }

            if (index === 1) {
              pictureService.useExistingPhoto(showPic, picCaptureError);
            }

            return true;

          }
        });
      }else {
        var fileuploader = angular.element("#fileInput");
        fileuploader.on('click',function(){
            $log.debug('[profile-controller] FILE UPLOAD TRIGGERED PROGRAMATICALLY');
        });
        fileuploader.trigger('click');
      }
    };

    $scope.profile.showImageFromFileSelect = function (elem) {
        $log.debug('[profile-controller] FILE TO UPLOAD: ' + (elem.files[0].webkitRelativePath || elem.files[0].name));
        var reader = new FileReader();

        reader.onload = function (e) {
          $scope.$apply(function() {
            showPic(e.target.result);
            $scope.profile.imageData = elem.files[0];
          });
        };
        reader.readAsDataURL(elem.files[0]);

    };

    $scope.profile.setProfileModified = function(){
      $log.debug('[profile-controller] PROFILE MODIFIED - FIRST NAME: '+$scope.profile.data.first_name);
      if($scope.profile.data.first_name === undefined || $scope.profile.data.first_name === '') {
        $scope.profile.profileModified = false;
      } else {
        $scope.profile.profileModified = true;
      }
    };

    $scope.profile.updateProfile = function(callback){
      $log.debug('[profile-controller] UPDATE PROFILE');

      uiLoadingService.show('', "kornerProfile");

      ProfileService.updateProfileInformation($scope.profile.data, $scope.profile.data.imageUrl, $scope.profile.newPic, $scope.profile.imageData).then(
        function(updatedProfile){
          uiLoadingService.showHideDelay(
            contentProfile.UPDATE_SUCCESSFUL, "kornerProfile", true, 1500, function(){
              $log.debug('[profile-controller] PROFILE UPDATED - PIC URL: '+$scope.profile.data.imageUrl);
              // $scope.$apply(function(){
              $scope.profile.data = updatedProfile;
              $scope.profile.newPic = false;
              $scope.profile.profileModified = false;
              if(callback) {
                callback();
              }
              // $scope.profile.closeModal();
              // });
            });
        },
        function(err){
          $log.debug('[profile-controller] err: '+err);
          uiLoadingService.showHideDelay(
            contentProfile.UPDATE_FAILED, "kornerProfile", false);
        }
      );
    };

  }
})();
