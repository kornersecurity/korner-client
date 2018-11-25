(function() {
  'use strict';
  angular.module('app.wizard.tag')
    .controller('editTagNameModalController', editTagNameModalController);

  /* @ngInject */
  function editTagNameModalController(
    $scope,
    $state,
    $ionicPopup,
    contentTagSetup,
    uiLoadingService,
    $log,
    FobService2,
    gettext
  ) {
    if(window.cordova && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }
    $scope.wizard.tagSetup.editTagName = $scope.wizard.tagSetup.editedTag.tagFullName;
    $scope.wizard.tagSetup.editPortalTypeId = $scope.wizard.tagSetup.editedTag.portal_type_id;
    $scope.wizard.tagSetup.editPortalMechanismId = $scope.wizard.tagSetup.editedTag.portal_mechanism_id;
    $scope.wizard.tagSetup.hasScreen = $scope.wizard.tagSetup.editedTag.tagPortalHasScreen($scope.wizard.tagSetup.editedTag.portal_environment_mask);
    $scope.wizard.tagSetup.hasBlinds = $scope.wizard.tagSetup.editedTag.tagPortalHasBlinds($scope.wizard.tagSetup.editedTag.portal_environment_mask);
    $scope.wizard.tagSetup.hasHorizontalBlinds = $scope.wizard.tagSetup.editedTag.tagPortalHasHorizontalBlinds($scope.wizard.tagSetup.editedTag.portal_environment_mask);
    if($scope.wizard.tagSetup.editPortalTypeId && $scope.wizard.tagSetup.editPortalTypeId !== 0) {
      $scope.wizard.tagSetup.openingMechanisms = $scope.wizard.wizardModel.tagSetup.getOpeningMechanisms(getportalTypeById($scope.wizard.tagSetup.editPortalTypeId));
    }
    var firstTime = true;
    $scope.wizard.tagSetup.canSaveEditedTag = false;
    $scope.wizard.modalTitle = gettext('Edit Tag');

    $log.debug($scope.wizard.tagSetup.editedTag);
    $log.debug('[editTagNameModalController] ENVIRONMENT MASK: '+$scope.wizard.tagSetup.editedTag.portal_mechanism_id);
    $log.debug('[editTagNameModalController] HAS BLINDS: '+$scope.wizard.tagSetup.editedTag.tagPortalHasBlinds($scope.wizard.tagSetup.editedTag.portal_environment_mask));
    $log.debug('[editTagNameModalController] HAS HORIZONTAL BLINDS: '+$scope.wizard.tagSetup.editedTag.tagPortalHasHorizontalBlinds($scope.wizard.tagSetup.editedTag.portal_environment_mask));
    $log.debug('[editTagNameModalController] HAS SCREEN: '+$scope.wizard.tagSetup.editedTag.tagPortalHasScreen($scope.wizard.tagSetup.editedTag.portal_environment_mask));


    $scope.catchEnter = function(keyEvent) {
      if (keyEvent.which === 13) {
        keyEvent.preventDefault();
        if(window.cordova && cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.close();
        }
        keyEvent.target.blur();
        $scope.wizard.tagSetup.canSave();
        if($scope.wizard.tagSetup.canSaveEditedTag){
          $scope.wizard.tagSetup.updateTag();
        }
      }
    };

    $scope.wizard.tagSetup.canSave = function() {
      // console.log($scope.wizard.tagSetup.editPortalTypeId, $scope.wizard.tagSetup.editedTag.portal_type_id,
      //               $scope.wizard.tagSetup.editPortalMechanismId, $scope.wizard.tagSetup.editedTag.portal_mechanism_id);
      // console.log(parseInt($scope.wizard.tagSetup.editPortalTypeId) === parseInt($scope.wizard.tagSetup.editedTag.portal_type_id));
      // console.log(parseInt($scope.wizard.tagSetup.editPortalMechanismId) === parseInt($scope.wizard.tagSetup.editedTag.portal_mechanism_id));
      console.log('TAG NAME: '+$scope.wizard.tagSetup.editTagName);
      $scope.wizard.tagSetup.canSaveEditedTag = false;
      console.log($scope.wizard.tagSetup.editTagName === '' || $scope.wizard.tagSetup.editTagName === undefined);
      console.log($scope.wizard.tagSetup.editTagName === $scope.wizard.tagSetup.editedTag.tagFullName && $scope.wizard.tagSetup.editedTag.tagFullName  !== '');
      console.log($scope.wizard.tagSetup.editTagName === $scope.wizard.tagSetup.editedTag.tagFullName);
      if ($scope.wizard.tagSetup.editTagName !== '' && $scope.wizard.tagSetup.editTagName !== undefined &&
          $scope.wizard.tagSetup.editTagName !== $scope.wizard.tagSetup.editedTag.tagFullName){
        $scope.wizard.tagSetup.canSaveEditedTag = true;
      }
      $log.debug('[edit-tag-name-controller] CAN SAVE: '+$scope.wizard.tagSetup.canSaveEditedTag);

      if(parseInt($scope.wizard.tagSetup.editPortalTypeId) !== parseInt($scope.wizard.tagSetup.editedTag.portal_type_id) ||
         parseInt($scope.wizard.tagSetup.editPortalMechanismId) !== parseInt($scope.wizard.tagSetup.editedTag.portal_mechanism_id) ||
         $scope.wizard.tagSetup.hasScreen !== $scope.wizard.tagSetup.editedTag.tagPortalHasScreen($scope.wizard.tagSetup.editedTag.portal_environment_mask) ||
         $scope.wizard.tagSetup.hasBlinds !== $scope.wizard.tagSetup.editedTag.tagPortalHasBlinds($scope.wizard.tagSetup.editedTag.portal_environment_mask) ||
         $scope.wizard.tagSetup.hasHorizontalBlinds !== $scope.wizard.tagSetup.editedTag.tagPortalHasHorizontalBlinds($scope.wizard.tagSetup.editedTag.portal_environment_mask)) {
        $scope.wizard.tagSetup.canSaveEditedTag = true;
      }
      $log.debug('[edit-tag-name-controller] CAN SAVE: '+$scope.wizard.tagSetup.canSaveEditedTag);
    };

    function getportalTypeById(typeId){
      for(var i in $scope.wizard.tagSetup.setupTypes) {
        var portalType = $scope.wizard.tagSetup.setupTypes[i];
        // $log.debug('[edit-tag-name-controller] PORTAL TYPE: '+portalType.id +' ('+typeId+')');
        // console.log(portalType.id === typeId.toString());

        if(typeId.toString() === portalType.id){
          return portalType.type;
        }
      }
      return null;
    }

    $scope.wizard.tagSetup.portalTypeChanged = function() {
      // $log.debug('[editTagNameModalController] ENTRY TYPE ID: '+$scope.wizard.tagSetup.editPortalTypeId);
      if(firstTime) {
        firstTime = false;
        $scope.wizard.tagSetup.editPortalMechanismId = $scope.wizard.tagSetup.editedTag.portal_mechanism_id;
      } else {
        $scope.wizard.tagSetup.editPortalMechanismId = 0;
      }
      if($scope.wizard.tagSetup.editPortalTypeId && $scope.wizard.tagSetup.editPortalTypeId !== 0) {
        $scope.wizard.tagSetup.openingMechanisms = $scope.wizard.wizardModel.tagSetup.getOpeningMechanisms(getportalTypeById($scope.wizard.tagSetup.editPortalTypeId));
        $log.debug('[editTagNameModalController] OPENING MECHANISMS: '+$scope.wizard.tagSetup.openingMechanisms.length);
      }
      $scope.wizard.tagSetup.canSave();
    };
    //
    // $scope.wizard.tagSetup.setPortalEnvironmentScreenBit = function() {
    //   console.log('[editTagNameModalController] HAS SCREEN: '+$scope.wizard.tagSetup.hasScreen);
    //
    //   $scope.wizard.tagSetup.editedTag.setPortalEnvironmentScreenBit();
    //   $scope.wizard.tagSetup.canSave();
    // };
    //
    // $scope.wizard.tagSetup.setPortalEnvironmentBlindsBit = function() {
    //   console.log('[editTagNameModalController] HAS BLINDS: '+$scope.wizard.tagSetup.hasBlinds);
    //
    //   $scope.wizard.tagSetup.editedTag.setPortalEnvironmentBlindsBit();
    //   $scope.wizard.tagSetup.canSave();
    // };

    $scope.wizard.tagSetup.updateTag = function() {
      $log.debug('$editName()');

      if ($scope.wizard.tagSetup.editTagName === '' || $scope.wizard.tagSetup.editTagName === undefined) {
        showAlertPopup(contentTagSetup.BLANK_NAME_ALERT_TITLE, contentTagSetup.BLANK_NAME_ALERT_MESSAGE);
        return;
      }

      uiLoadingService.show(contentTagSetup.UPDATING_TAG_NAME, "wizardToast");

      $scope.wizard.tagSetup.editedTag.portal_type_id = parseInt($scope.wizard.tagSetup.editPortalTypeId);
      $scope.wizard.tagSetup.editedTag.portal_mechanism_id = parseInt($scope.wizard.tagSetup.editPortalMechanismId);

      $scope.wizard.tagSetup.editedTag.setPortalEnvironmentBlindsBit($scope.wizard.tagSetup.hasBlinds);
      $scope.wizard.tagSetup.editedTag.setPortalEnvironmentHorizontalBlindsBit($scope.wizard.tagSetup.hasHorizontalBlinds);
      $scope.wizard.tagSetup.editedTag.setPortalEnvironmentScreenBit($scope.wizard.tagSetup.hasScreen);

      // get the tag
      // var tag = FobService2.fob.tags.getTagByIds($scope.wizard.tagSetup.editedTag.tag_id);

      // update properties
      $scope.wizard.tagSetup.editedTag.tagFullName = $scope.wizard.tagSetup.editTagName;
      $scope.wizard.tagSetup.editedTag.tag_name = $scope.wizard.tagSetup.editTagName;
      // tag.portal_type_id = $scope.wizard.tagSetup.editedTag.portal_type_id;

      // save the tag
      $scope.wizard.tagSetup.editedTag.store().then(function() {
        $log.debug('[tagSetupControllerPage7] TAG NAME SUCCESSFULLY UPDATED');
        // $scope.wizard.tagSetup.editedTag = $scope.wizard.tagSetup.editTagName;
        uiLoadingService.showHideDelay(contentTagSetup.TAG_NAME_UPDATE_SUCCESS, "wizardToast", true);

        $scope.wizard.tagSetup.closeModal();

      }, function(status) {
        $log.debug('[tagSetupControllerPage7] TAG NAME UPDATE ERROR: ' +
          status);
        uiLoadingService.showHideDelay(contentTagSetup.TAG_NAME_UPDATE_FAIL, "wizardToast", false);
        $scope.wizard.tagSetup.closeModal();

      });

    };


    function showAlertPopup(title, description) {
      $log.debug("[add-contacts-controller] ALERT POPUP: " + title, description);
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: description
      });

      alertPopup.then(function(res) {
        // There is nothing to do...
      });
    }

    $scope.$on('$destroy', function() {
      $log.debug('$destroy()');
      if ($scope.modal !== undefined) {
        $scope.modal.remove();
      }
    });

  }
})();
