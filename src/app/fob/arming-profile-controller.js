(function() {
  'use strict';

  angular.module('app.fob.setup')
    .controller('armingProfileController', armingProfileController);

/************* THESE IS WHAT WE CALL 'ZONES' *************/

  /* @ngInject */
  function armingProfileController(
    $rootScope,
    $scope,
    $state,
    $timeout,
    ServerService2,
    FobService2,
    $ionicPopup,
    uiLoadingService,
    contentFobSetup,
    contentTagSetup,
    contentSetupWizards,
    pictureService,
    FobCollection,
    $log,
    gettext
  ) {
    var eventHandlerRemovers = [];
    // $scope.fobConfiguration.profileSetup = {};
    // $scope.fobConfiguration.fobProfiles = $scope.fobConfiguration.selectedFob.client_data.fobProfiles;



    $scope.fobConfiguration.addProfile = function(){
      $scope.fobConfiguration.selectedProfile = {
        profileName: gettext('Zone')+' '+($scope.fobConfiguration.selectedFob.client_data.fobProfiles.length+1),
        tags: [],
      };
      $scope.fobConfiguration.selectedProfileIndex = -1;
      $scope.fobConfiguration.editingProfile = true;
      $scope.fobConfiguration.profileValid = false;
      $scope.fobConfiguration.fobProfileChanged = false;
      for(var tag in $scope.fobConfiguration.tags) {
        $scope.fobConfiguration.tags[tag].isSelected = false;
      }
    };

    $scope.fobConfiguration.cancelProfileChanges = function(){
      $scope.fobConfiguration.selectedProfile = null;
      $scope.fobConfiguration.selectedProfileIndex = -1;
      $scope.fobConfiguration.editingProfile = false;
      $scope.fobConfiguration.fobProfileChanged = false;
    };

    $scope.fobConfiguration.editProfile = function(profile, profileIndex){
      $scope.fobConfiguration.selectedProfile = angular.copy($scope.fobConfiguration.selectedFob.client_data.fobProfiles[profileIndex]);
      $scope.fobConfiguration.selectedProfileIndex = profileIndex;

      selectTags($scope.fobConfiguration.selectedProfile);
      $scope.fobConfiguration.editingProfile = true;
      $scope.fobConfiguration.profileValid = true;
      $scope.fobConfiguration.fobProfileChanged = false;
    };

    $scope.fobConfiguration.setActiveProfile = function(profileIndex){
      $log.debug('[arming-profile-controller] SELECTED FOB : ', $scope.fobConfiguration.selectedFob, $scope.fobConfiguration.selectedFob.isArmed);
      if($scope.fobConfiguration.selectedFob.isArmed() === true){
        var armedPopUp = $ionicPopup.alert({
          title: gettext('System Armed'),
          template: gettext('You must disarm the system before changing zones.')
        });
        return;
      }

      uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");

      for(var p in $scope.fobConfiguration.selectedFob.client_data.fobProfiles){
        $scope.fobConfiguration.selectedFob.client_data.fobProfiles[p].isActive = false;
      }
      $scope.fobConfiguration.selectedFob.client_data.fobProfiles[profileIndex].isActive = true;

      selectTags($scope.fobConfiguration.selectedFob.client_data.fobProfiles[profileIndex]);

      $scope.fobConfiguration.selectedFob.includeExcludeTags($scope.fobConfiguration.tags).then(
        function(){
          $scope.fobConfiguration.saveFobProfileChanges(true, function(){
            setTimeout(function() {
              FobService2.fob.refreshState();
              FobService2.fob.activities.enableRefresh();
              FobService2.fob.activities.refreshActivities();
            }, 1000);
            $scope.fobConfiguration.cancelProfileChanges();
        });
      });
    };

    function selectTags(selectedProfile){
      for(var t in $scope.fobConfiguration.tags) {
        var tag = $scope.fobConfiguration.tags[t];
        tag.isSelected = false;
        for(var s in selectedProfile.tags) {
          if(selectedProfile.tags[s] === tag.eui64) {
            tag.isSelected = true;
          }
        }
      }
    }

    $scope.fobConfiguration.removeProfile = function(profileIndex){
      var confirmRemovePopup = $ionicPopup.confirm({
        title: contentFobSetup.REMOVE_SCHEDULE_TITLE,
        template: contentFobSetup.REMOVE_SCHEDULE_QUESTION,
        cancelText: contentTagSetup.NO,
        okText: contentTagSetup.YES
      });

      confirmRemovePopup.then(function(res) {

        if (res) {
          uiLoadingService.show(contentFobSetup.REMOVING_SCHEDULE, "kornerFobConfiguration");
          $scope.fobConfiguration.selectedFob.client_data.fobProfiles.splice(profileIndex, 1);
          $scope.fobConfiguration.saveFobProfileChanges(true);
          if($scope.fobConfiguration.selectedFob.client_data.fobProfiles[profileIndex].isActive){
            $scope.fobConfiguration.setActiveProfile(0);
          }
        }
      });
    };

    $scope.fobConfiguration.saveProfile = function(callback) {
      if($scope.fobConfiguration.selectedProfile === null){
        return;
      }

      uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");

      if($scope.fobConfiguration.selectedProfileIndex === -1) {
        $scope.fobConfiguration.selectedFob.client_data.fobProfiles.push($scope.fobConfiguration.selectedProfile);
      } else {
        $scope.fobConfiguration.selectedFob.client_data.fobProfiles[$scope.fobConfiguration.selectedProfileIndex] = $scope.fobConfiguration.selectedProfile;
      }

      setProfileTags();

      $log.debug('[armingProfileController] SELECTED TAGS: ', $scope.fobConfiguration.selectedProfile.tags);

      $scope.fobConfiguration.saveFobProfileChanges(false, callback);
    };

    function setProfileTags() {
      $scope.fobConfiguration.selectedProfile.tags = [];
      for(var t in $scope.fobConfiguration.tags){
        $log.debug('[armingProfileController] TAG SELECTED: '+$scope.fobConfiguration.tags[t].isSelected);
        if($scope.fobConfiguration.tags[t].isSelected){
          $scope.fobConfiguration.selectedProfile.tags.push($scope.fobConfiguration.tags[t].eui64);
        }
      }
    }
    $scope.fobConfiguration.saveFobProfileChanges = function(hideUiLoader, callback) {
      if(hideUiLoader !== true) {
        uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerFobConfiguration");
      }
      $scope.fobConfiguration.selectedFob.store().then(
        function(){
          $scope.fobConfiguration.cancelProfileChanges();
          uiLoadingService.showHideDelay(contentFobSetup.LOCATION_UPDATED_SUCCESSFUL, "kornerFobConfiguration", true);
          if(callback){
            callback();
          }
        },
        function(err){
          //Show error message
          uiLoadingService.showHideDelay(contentFobSetup.LOCATION_UPDATED_FAILED, "kornerFobConfiguration",
            false);
        }
      );
    };

    $scope.fobConfiguration.checkProfileChanged = function() {
      $scope.fobConfiguration.profileValid = false;

      for(var t in $scope.fobConfiguration.tags) {
        if($scope.fobConfiguration.tags[t].isSelected) {
          $scope.fobConfiguration.profileValid = true;
          break;
        }
      }
      $scope.fobConfiguration.fobProfileChanged = true;
    };


    function destroyController() {
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[armingProfileController] DESTROYING');
    }

    (function() {

      $scope.$on('$destroy', destroyController);
      $scope.fobConfiguration.selectedProfile = null;
      $scope.fobConfiguration.editingProfile = false;
      $scope.fobConfiguration.tags = [];
      for(var t in $scope.fobConfiguration.selectedFob.tags.tags){
        var tag = $scope.fobConfiguration.selectedFob.tags.tags[t];
        $scope.fobConfiguration.tags.push(
          {
            tagFullName: tag.tagFullName,
            eui64: tag.eui64,
            isSelected: false
        });
      }
    })();
  }
})();
