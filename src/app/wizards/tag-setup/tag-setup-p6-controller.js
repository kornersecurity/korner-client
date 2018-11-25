(function() {
  'use strict';

  angular.module('app.wizard.tag')
    .controller('tagSetupControllerPage6', tagSetupControllerPage6);


  /* @ngInject */
  function tagSetupControllerPage6(
    $rootScope,
    $scope,
    $state,
    $timeout,
    WizardModel,
    wizardType,
    clientUpdateEventConst,
    KornerStateHelpers,
    FobService2,
    TagSetupService,
    $log,
    $window,
    uiLoadingService,
    contentSetupWizards,
    contentTagSetup,
    $ionicPopup
  ) {
    $scope.wizard.tagSetup.p6 = {};

    $scope.wizard.tagSetup.p6.activatingTag = false;
    $scope.wizard.tagSetup.p6.fobMissing = false;
    $scope.wizard.tagSetup.p6.tagFound = false;
    $scope.wizard.tagSetup.p6.canRetry = false;

    FobService2.tagSetupStart();

    var eventHandlerRemovers = [];

    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[tagSetupControllerPage6] DESTROYING');
    }

    $scope.wizard.tagSetup.p6.startActivation = function() {


      if(FobService2.fob.isFirmwareUpdating() === true){
        uiLoadingService.show(contentSetupWizards.FOB_FIRMWARE_UPDATING, 'wizardToast');
      } else if(FobService2.fob.isArmed() === true ||
                FobService2.fob.isArmPending() === true) {
        var continuePopUp = $ionicPopup.confirm({
          title: contentSetupWizards.FOB_ARMED_TITLE,
          template: contentSetupWizards.FOB_ARMED,
          cancelText: contentSetupWizards.CANCEL_TAG_ACTIVATION,
          okText: contentSetupWizards.DISARM_AND_ACTIVATE_TAG
        });

        continuePopUp.then(function(res) {
          if (res) {
            FobService2.disarm();
            TagSetupService.startActivation();
          } else {
            $scope.wizard.wizardClose();
          }
        });
      } else {
        $scope.wizard.tagSetup.p6.activatingTag = true;
        TagSetupService.startActivation();
      }

    };

    function updateTagType(showNextPage) {
      var tag = TagSetupService.getCurrentTag();
      tag.portal_type_id = parseInt($scope.wizard.tagSetup.portalTypeId);
      tag.portal_mechanism_id = parseInt($scope.wizard.tagSetup.portalMechanismId);
      tag.setPortalEnvironmentBlindsBit($scope.wizard.tagSetup.hasBlinds);
      tag.setPortalEnvironmentHorizontalBlindsBit($scope.wizard.tagSetup.hasHorizontalBlinds);
      tag.setPortalEnvironmentScreenBit($scope.wizard.tagSetup.hasScreen);
      $scope.wizard.tagSetup.tag.setDefaultTagName();
      $log.debug($scope.wizard.tagSetup.tag);
      $log.debug('[tagSetupControllerPage6] PORTAL TYPE ID:      ' + tag.portal_type_id);
      $log.debug('[tagSetupControllerPage6] PORTAL MECHANISM ID: ' + tag.portal_mechanism_id);
      $log.debug('[tagSetupControllerPage6] PORTAL ENV MASK:     ' + tag.portal_environment_mask);
      $log.debug('[tagSetupControllerPage6] TAG NAME:            ' + tag.tag_name);


      // save the tag
      tag.store().then(function() {
        $log.debug('[tagSetupControllerPage6] TAG PORTAL TYPE ID SUCCESSFULLY UPDATED');
        $log.debug(TagSetupService.getCurrentTag());
        $scope.wizard.tagSetup.tags = FobService2.fob.tags.getTagsArray();
        $scope.wizard.tagSetup.tag = TagSetupService.getCurrentTag(); //FobService2.fob.tags.tags[$scope.wizard.tagSetup.tag.tag_id];

        $log.debug($scope.wizard.tagSetup.tag);

        if (showNextPage) {
          setTimeout(function() {
            $scope.wizard.enableNextButton();
            $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
            $scope.wizard.changeState();
          }, 1500);
        }

      }, function(status) {
        $log.debug('[tagSetupControllerPage6] TAG PORTAL TYPE ID UPDATE ERROR: ' +
          status);

      });

    }

    function onTagServiceEvent(event, response) {
      // $log.debug('[tagSetupControllerPage6] TAG SERVICE EVENT RECEIVED');
      if ($scope.$$phase) {
        $scope.$apply(function() {
          setTagSetupProperties(response);
        });
      } else {
        setTagSetupProperties(response);
      }
    }

    function setTagSetupProperties(response) {
      $scope.wizard.tagSetup.p6.activatingTag = response.activatingTag;
      $scope.wizard.tagSetup.p6.fobMissing = response.fobMissing;
      $scope.wizard.tagSetup.p6.tagFound = response.tagFound;
      $scope.wizard.tagSetup.p6.canRetry = response.canRetry;

      // $log.debug('[tagSetupControllerPage6] ACTIVATING TAG: '+$scope.wizard.tagSetup.p6.activatingTag);
      // $log.debug('[tagSetupControllerPage6] FOB MISSING:    '+$scope.wizard.tagSetup.p6.fobMissing);
      // $log.debug('[tagSetupControllerPage6] TAG FOUND:      '+$scope.wizard.tagSetup.p6.tagFound);
      // $log.debug('[tagSetupControllerPage6] CAN RETRY:      '+$scope.wizard.tagSetup.p6.canRetry);

      if(response.extenderPaired) {
        var continuePopUp = $ionicPopup.alert({
          title: contentTagSetup.EXTENDER_PAIRED_TITLE,
          template: contentTagSetup.EXTENDER_PAIRED_DESC
        });

        continuePopUp.then(function(res) {
          $scope.wizard.tagSetup.p6.startActivation();
        });
        return;
      }

      if (response.tagFound) {
        $scope.wizard.tagSetup.tag = TagSetupService.getCurrentTag();
        $log.debug('[tagSetupControllerPage6] TAG ACTIVATED: ' + $scope.wizard.tagSetup.tag.tag_name);
        updateTagType(true);
      }
    }

    function stopActivation() {
      $log.debug('[tagSetupControllerPage6] STOPPING TAG ACTIVATION');
      TagSetupService.stopActivation();

      // $scope.$apply(function() {
      $scope.wizard.tagSetup.p6.activatingTag = false;

      $scope.wizard.tagSetup.p6.canRetry = TagSetupService.canRetry;
    }


    // add by dan to handle closing the wizard
    function onCloseWizard() {
      stopActivation();

      TagSetupService.reset();

      setTimeout(function() {
        FobService2.tagSetupCancel();
      }, 1000);
    }

    $scope.closeWizard = function(templateName) {
      $log.debug('[tagSetupControllerPage6] CLOSING WIZARD');
      stopActivation();
      $scope.wizard.tagSetup.p6.canRetry = false;

    };


    (function() {
      $scope.wizard.pageCode = '405';
      $scope.wizard.tagSetup.p6.includeSource = ($scope.wizard.tagSetup.selectedSetupType
          .toLowerCase() === 'window') ? 'app/views/window-step2.html' :
        'app/views/door-step2.html';

      eventHandlerRemovers.push($rootScope.$on('TagSetupSerivceEvent', onTagServiceEvent));

      $scope.$on('wizardEvent::closeWizard', onCloseWizard);
      $scope.$on('wizardEvent::showNextPage', stopActivation);
      $scope.$on('$destroy', destroyController);

      // $scope.$on('wizardEvent::showPreviousPage', stopActivation);
      eventHandlerRemovers.push($rootScope.$on('AppEvent:Restart', $scope.wizard.tagSetup.stopTagSetup));
      if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
        eventHandlerRemovers.push($rootScope.$on('AppEvent:Pause', stopActivation));
      } else {
        eventHandlerRemovers.push($rootScope.$on('AppEvent:Pause', $scope.wizard.tagSetup.stopTagSetup));
      }

      $window.onbeforeunload = $scope.wizard.tagSetup.stopTagSetup;

      // $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);

      $scope.wizard.tagSetup.p6.fobMissing = TagSetupService.fobMissing;
      $scope.wizard.tagSetup.tags = FobService2.fob.tags.getTagsArray();
      $scope.wizard.tagSetup.tag = TagSetupService.getCurrentTag();

      // $log.debug('[tagSetupControllerPage6] FOB STATE: ' + FobService2.fob.fob_state);
      // $log.debug('[tagSetupControllerPage6] isConnected: ' + FobService2.fob.isConnected());
      // $log.debug('[tagSetupControllerPage6] TAG PAIRED: ' + $scope.wizard.tagSetup.tag);
      $scope.wizard.disableNextButton();

      if ($scope.wizard.tagSetup.tag) {
        $scope.wizard.tagSetup.p6.fobMissing = false;
        $scope.wizard.tagSetup.p6.activatingTag = false;
        $scope.wizard.tagSetup.p6.canRetry = false;
        $scope.wizard.tagSetup.p6.tagFound = true;

        updateTagType(true);

      } else if (FobService2.fob.isConnected()) {
        $scope.wizard.tagSetup.p6.fobMissing = false;
        $scope.wizard.tagSetup.p6.startActivation();

      } else {
        $scope.wizard.tagSetup.p6.fobMissing = true;
      }
    })();

  }
})();
