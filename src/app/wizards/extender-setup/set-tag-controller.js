(function() {
  'use strict';
  angular.module('app.wizard.extender')
    .controller('setTagController', setTagController);

  /* @ngInject */
  function setTagController(
    $scope,
    $state,
    $ionicPopup,
    contentTagSetup,
    uiLoadingService,
    $log,
    FobService2,
    gettext,
    lookupService
  ) {
    if(window.cordova && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }

    $log.debug('[setTagController] TAG SETUP TYPES: ');
    $log.debug($scope.wizard.extenderSetup.setupTypes);
    $log.debug('[setTagController] TAG SETUP OBJ: '+$scope.wizard.extenderSetup);
    $log.debug('[setTagController] TAG: '+$scope.wizard.extenderSetup.editedTag);
    $log.debug('[setTagController] TAG FULL NAME: '+$scope.wizard.extenderSetup.editedTag.tagFullName);
    $log.debug('[setTagController] PORTAL TYPE ID: '+$scope.wizard.extenderSetup.editedTag.portal_type_id);
    $scope.wizard.extenderSetup.editTagName = $scope.wizard.extenderSetup.editedTag.tagFullName;
    $scope.wizard.extenderSetup.editPortalTypeId = $scope.wizard.extenderSetup.editedTag.portal_type_id;
    $scope.wizard.extenderSetup.editPortalMechanismId = $scope.wizard.extenderSetup.editedTag.portal_mechanism_id;
    $scope.wizard.extenderSetup.hasScreen = $scope.wizard.extenderSetup.editedTag.tagPortalHasScreen($scope.wizard.extenderSetup.editedTag.portal_environment_mask);
    $scope.wizard.extenderSetup.hasBlinds = $scope.wizard.extenderSetup.editedTag.tagPortalHasBlinds($scope.wizard.extenderSetup.editedTag.portal_environment_mask);
    $scope.wizard.extenderSetup.hasHorizontalBlinds = $scope.wizard.extenderSetup.editedTag.tagPortalHasHorizontalBlinds($scope.wizard.extenderSetup.editedTag.portal_environment_mask);
    if($scope.wizard.extenderSetup.editPortalTypeId === 0) {
      // $scope.wizard.extenderSetup.editPortalTypeId = 1;
    }

    if($scope.wizard.extenderSetup.editPortalTypeId && $scope.wizard.extenderSetup.editPortalTypeId !== 0) {
      $scope.wizard.extenderSetup.openingMechanisms = $scope.wizard.wizardModel.tagSetup.getOpeningMechanisms(getPortalTypeById($scope.wizard.extenderSetup.editPortalTypeId));
    }
    $log.debug('[setTagController] OPENING MECHANISMS: '+$scope.wizard.extenderSetup.openingMechanisms);

    var firstTime = true;
    $scope.wizard.extenderSetup.canSaveEditedTag = false;
    $scope.wizard.modalTitle = gettext('Edit Tag');

    $log.debug($scope.wizard.extenderSetup.editedTag);
    $log.debug('[setTagController] ENVIRONMENT MASK: '+$scope.wizard.extenderSetup.editedTag.portal_mechanism_id);
    $log.debug('[setTagController] HAS BLINDS: '+$scope.wizard.extenderSetup.editedTag.tagPortalHasBlinds($scope.wizard.extenderSetup.editedTag.portal_environment_mask));
    $log.debug('[setTagController] HAS HORIZONTAL BLINDS: '+$scope.wizard.extenderSetup.editedTag.tagPortalHasHorizontalBlinds($scope.wizard.extenderSetup.editedTag.portal_environment_mask));
    $log.debug('[setTagController] HAS SCREEN: '+$scope.wizard.extenderSetup.editedTag.tagPortalHasScreen($scope.wizard.extenderSetup.editedTag.portal_environment_mask));


    $scope.catchEnter = function(keyEvent) {
      if (keyEvent.which === 13) {
        keyEvent.preventDefault();
        if(window.cordova && cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.close();
        }
        keyEvent.target.blur();
        $scope.wizard.extenderSetup.canSave();
        if($scope.wizard.extenderSetup.canSaveEditedTag){
          $scope.wizard.extenderSetup.updateTag();
        }
      }
    };

    $scope.wizard.extenderSetup.canSave = function() {
      // console.log($scope.wizard.extenderSetup.editPortalTypeId, $scope.wizard.extenderSetup.editedTag.portal_type_id,
      //               $scope.wizard.extenderSetup.editPortalMechanismId, $scope.wizard.extenderSetup.editedTag.portal_mechanism_id);
      // console.log(parseInt($scope.wizard.extenderSetup.editPortalTypeId) === parseInt($scope.wizard.extenderSetup.editedTag.portal_type_id));
      // console.log(parseInt($scope.wizard.extenderSetup.editPortalMechanismId) === parseInt($scope.wizard.extenderSetup.editedTag.portal_mechanism_id));
      console.log('[set-tag-controller]: '+$scope.wizard.extenderSetup.editTagName);
      $scope.wizard.extenderSetup.canSaveEditedTag = false;
      console.log($scope.wizard.extenderSetup.editTagName === '' || $scope.wizard.extenderSetup.editTagName === undefined);
      console.log($scope.wizard.extenderSetup.editTagName === $scope.wizard.extenderSetup.editedTag.tagFullName && $scope.wizard.extenderSetup.editedTag.tagFullName  !== '');
      console.log($scope.wizard.extenderSetup.editTagName === $scope.wizard.extenderSetup.editedTag.tagFullName);
      if ($scope.wizard.extenderSetup.editTagName !== '' && $scope.wizard.extenderSetup.editTagName !== undefined &&
          $scope.wizard.extenderSetup.editTagName !== $scope.wizard.extenderSetup.editedTag.tagFullName){
        $scope.wizard.extenderSetup.canSaveEditedTag = true;
      }
      $log.debug('[set-tag-controller] CAN SAVE: '+$scope.wizard.extenderSetup.canSaveEditedTag);

      if(parseInt($scope.wizard.extenderSetup.editPortalTypeId) !== parseInt($scope.wizard.extenderSetup.editedTag.portal_type_id) ||
         parseInt($scope.wizard.extenderSetup.editPortalMechanismId) !== parseInt($scope.wizard.extenderSetup.editedTag.portal_mechanism_id) ||
         $scope.wizard.extenderSetup.hasScreen !== $scope.wizard.extenderSetup.editedTag.tagPortalHasScreen($scope.wizard.extenderSetup.editedTag.portal_environment_mask) ||
         $scope.wizard.extenderSetup.hasBlinds !== $scope.wizard.extenderSetup.editedTag.tagPortalHasBlinds($scope.wizard.extenderSetup.editedTag.portal_environment_mask) ||
         $scope.wizard.extenderSetup.hasHorizontalBlinds !== $scope.wizard.extenderSetup.editedTag.tagPortalHasHorizontalBlinds($scope.wizard.extenderSetup.editedTag.portal_environment_mask)) {
        $scope.wizard.extenderSetup.canSaveEditedTag = true;
      }
      $log.debug('[set-tag-controller] CAN SAVE: '+$scope.wizard.extenderSetup.canSaveEditedTag);
    };

    function getPortalTypeById(typeId){
      $log.debug('[set-tag-controller] PORTAL TYPES: ',$scope.wizard.extenderSetup.setupTypes);

      for(var i in $scope.wizard.extenderSetup.setupTypes) {
        var portalType = $scope.wizard.extenderSetup.setupTypes[i];
        console.log(portalType, i);
        $log.debug('[set-tag-controller] PORTAL TYPE: '+portalType.type_id +' ('+typeId+')');
        // console.log(portalType.type_id === typeId.toString());

        if(typeId.toString() === portalType.type_id){
          return portalType.type;
        }
      }
      return null;
    }

    $scope.wizard.extenderSetup.portalTypeChanged = function() {
      // $log.debug('[setTagController] ENTRY TYPE ID: '+$scope.wizard.extenderSetup.editPortalTypeId);
      if(firstTime) {
        firstTime = false;
        $scope.wizard.extenderSetup.editPortalMechanismId = $scope.wizard.extenderSetup.editedTag.portal_mechanism_id;
      } else {
        $scope.wizard.extenderSetup.editPortalMechanismId = 0;
      }
      if($scope.wizard.extenderSetup.editPortalTypeId && $scope.wizard.extenderSetup.editPortalTypeId !== 0) {
        $scope.wizard.extenderSetup.openingMechanisms = $scope.wizard.wizardModel.tagSetup.getOpeningMechanisms(getPortalTypeById($scope.wizard.extenderSetup.editPortalTypeId));
        $log.debug('[set-tag-controller] OPENING MECHANISMS: '+$scope.wizard.extenderSetup.openingMechanisms.length);
      }
      $scope.wizard.extenderSetup.canSave();
    };
    //
    // $scope.wizard.extenderSetup.setPortalEnvironmentScreenBit = function() {
    //   console.log('[setTagController] HAS SCREEN: '+$scope.wizard.extenderSetup.hasScreen);
    //
    //   $scope.wizard.extenderSetup.editedTag.setPortalEnvironmentScreenBit();
    //   $scope.wizard.extenderSetup.canSave();
    // };
    //
    // $scope.wizard.extenderSetup.setPortalEnvironmentBlindsBit = function() {
    //   console.log('[setTagController] HAS BLINDS: '+$scope.wizard.extenderSetup.hasBlinds);
    //
    //   $scope.wizard.extenderSetup.editedTag.setPortalEnvironmentBlindsBit();
    //   $scope.wizard.extenderSetup.canSave();
    // };

    $scope.wizard.extenderSetup.updateTag = function() {
      if ($scope.wizard.extenderSetup.editTagName === '' || $scope.wizard.extenderSetup.editTagName === undefined) {
        showAlertPopup(contentTagSetup.BLANK_NAME_ALERT_TITLE, contentTagSetup.BLANK_NAME_ALERT_MESSAGE);
        return;
      }

      uiLoadingService.show(contentTagSetup.UPDATING_TAG_NAME, "wizardToast");

      $scope.wizard.extenderSetup.editedTag.portal_type_id = parseInt($scope.wizard.extenderSetup.editPortalTypeId);
      $scope.wizard.extenderSetup.editedTag.portal_mechanism_id = parseInt($scope.wizard.extenderSetup.editPortalMechanismId);

      $scope.wizard.extenderSetup.editedTag.setPortalEnvironmentBlindsBit($scope.wizard.extenderSetup.hasBlinds);
      $scope.wizard.extenderSetup.editedTag.setPortalEnvironmentHorizontalBlindsBit($scope.wizard.extenderSetup.hasHorizontalBlinds);
      $scope.wizard.extenderSetup.editedTag.setPortalEnvironmentScreenBit($scope.wizard.extenderSetup.hasScreen);

      // get the tag
      // var tag = FobService2.fob.tags.getTagByIds($scope.wizard.extenderSetup.editedTag.tag_id);

      // update properties
      $scope.wizard.extenderSetup.editedTag.tagFullName = $scope.wizard.extenderSetup.editTagName;
      $scope.wizard.extenderSetup.editedTag.tag_name = $scope.wizard.extenderSetup.editTagName;
      // tag.portal_type_id = $scope.wizard.extenderSetup.editedTag.portal_type_id;

      // save the tag
      $scope.wizard.extenderSetup.editedTag.store().then(function() {
        $log.debug('[set-tag-controller] TAG SUCCESSFULLY UPDATED');
        // $scope.wizard.extenderSetup.editedTag = $scope.wizard.extenderSetup.editTagName;
        uiLoadingService.showHideDelay(contentTagSetup.TAG_NAME_UPDATE_SUCCESS, "wizardToast", true, 2000);

        $scope.wizard.extenderSetup.closeTagSetup();

      }, function(status) {
        $log.debug('[set-tag-controller] TAG NAME UPDATE ERROR: ' +
          status);
        uiLoadingService.showHideDelay(contentTagSetup.TAG_NAME_UPDATE_FAIL, "wizardToast", false);
        $scope.wizard.extenderSetup.closeModal();

      });

    };


    function showAlertPopup(title, description) {
      $log.debug("[set-tag-controller] ALERT POPUP: " + title, description);
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
