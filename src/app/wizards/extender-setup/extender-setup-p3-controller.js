(function() {
  'use strict';

  angular.module('app.wizard.extender')
    .controller('extenderSetupControllerPage3', extenderSetupControllerPage3);


  /* @ngInject */
  function extenderSetupControllerPage3(
    $rootScope,
    $scope,
    $state,
    $timeout,
    WizardModel,
    wizardType,
    clientUpdateEventConst,
    KornerStateHelpers,
    FobService2,
    ExtenderSetupService,
    $log,
    $window,
    uiLoadingService,
    contentSetupWizards,
    contentTagSetup,
    lookupService,
    $ionicPopup,
    $ionicListDelegate
  ) {
    $scope.wizard.extenderSetup.p3 = {};

    $scope.wizard.extenderSetup.p3.activatingExtender = false;
    $scope.wizard.extenderSetup.p3.fobMissing = false;
    $scope.wizard.extenderSetup.p3.extenderFound = false;
    $scope.wizard.extenderSetup.p3.canRetry = false;

    var eventHandlerRemovers = [];

    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[extenderSetupControllerPage3] DESTROYING');
    }


    FobService2.extenderSetupStart();


    $scope.wizard.extenderSetup.p3.startActivation = function() {


      if(FobService2.fob.isFirmwareUpdating() === true){
        uiLoadingService.show(contentSetupWizards.FOB_FIRMWARE_UPDATING, 'wizardToast');
      } else if(FobService2.fob.isArmed() === true ||
                FobService2.fob.isArmPending() === true) {
        var continuePopUp = $ionicPopup.confirm({
          title: contentSetupWizards.FOB_ARMED_TITLE,
          template: contentSetupWizards.FOB_ARMED,
          cancelText: contentSetupWizards.CANCEL_EXTENDER_ACTIVATION,
          okText: contentSetupWizards.DISARM_AND_ACTIVATE_EXTENDER
        });

        continuePopUp.then(function(res) {
          if (res) {
            FobService2.disarm();
            setTimeout(function() {
              $scope.wizard.extenderSetup.p3.activatingExtender = true;
              ExtenderSetupService.startActivation();
              $log.debug('[extenderSetupControllerPage3] STARTING EXTENDER ACTIVATION 1');
          }, 1000);

          } else {
            $scope.wizard.wizardClose();
          }
        });
      } else {
        $scope.wizard.extenderSetup.p3.activatingExtender = true;
        ExtenderSetupService.startActivation();
        // $log.debug('[extenderSetupControllerPage3] STARTING EXTENDER ACTIVATION 2');
      }

      // $log.debug('[extenderSetupControllerPage3] CAN RETRY: '+$scope.wizard.extenderSetup.p3.canRetry);
      // $log.debug('[extenderSetupControllerPage3] ACTIVATING EXTENDER: '+$scope.wizard.extenderSetup.p3.activatingExtender);
      // $log.debug('[extenderSetupControllerPage3] FOB MISSING: '+$scope.wizard.extenderSetup.p3.fobMissing);
    };

    function updateExtenderType(showNextPage) {
      var extender = ExtenderSetupService.getCurrentExtender();
      $scope.wizard.extenderSetup.extender.setDefaultExtenderName(FobService2.fob.extenders.getCount());
      $log.debug($scope.wizard.extenderSetup.extender);
      $log.debug('[extenderSetupControllerPage3] EXTENDER NAME:            ' + extender.extender_name);


      // save the extender
      extender.store().then(function() {
        $log.debug('[extenderSetupControllerPage3] EXTENDER SUCCESSFULLY UPDATED');
        $log.debug(ExtenderSetupService.getCurrentExtender());
        $scope.wizard.extenderSetup.extenders = FobService2.fob.extenders.extenders;
        // This is done to make ngRepeat work (ngRepeat does not work on maps)
        $scope.wizard.extenderSetup.extenderKeys = FobService2.fob.extenders.getExtenderKeys();
        $scope.wizard.extenderSetup.extender = ExtenderSetupService.getCurrentExtender(); //FobService2.fob.extenders.extenders[$scope.wizard.extenderSetup.extender.extender_id];

        $log.debug($scope.wizard.extenderSetup.extender);

        if (showNextPage) {
          setTimeout(function() {
            $scope.wizard.enableNextButton();
            $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
            $scope.wizard.changeState();
          }, 1500);
        }

      }, function(status) {
        $log.debug('[extenderSetupControllerPage3] EXTENDER PORTAL TYPE ID UPDATE ERROR: ' +
          status);

      });

    }

    function onExtenderServiceEvent(event, response) {
      // $log.debug('[extenderSetupControllerPage3] EXTENDER SERVICE EVENT RECEIVED');
      if ($scope.$$phase) {
        $scope.$apply(function() {
          setExtenderSetupProperties(response);
        });
      } else {
        setExtenderSetupProperties(response);
      }
    }

    function setExtenderSetupProperties(response) {
      $scope.wizard.extenderSetup.p3.activatingExtender = response.activatingExtender;
      $scope.wizard.extenderSetup.p3.fobMissing = response.fobMissing;
      $scope.wizard.extenderSetup.p3.extenderFound = response.extenderFound;
      $scope.wizard.extenderSetup.p3.canRetry = response.canRetry;

      // $log.debug('[extenderSetupControllerPage3] ACTIVATING EXTENDER: '+$scope.wizard.extenderSetup.p3.activatingExtender);
      // $log.debug('[extenderSetupControllerPage3] FOB MISSING:    '+$scope.wizard.extenderSetup.p3.fobMissing);
      // $log.debug('[extenderSetupControllerPage3] EXTENDER FOUND:      '+$scope.wizard.extenderSetup.p3.extenderFound);
      // $log.debug('[extenderSetupControllerPage3] CAN RETRY:      '+$scope.wizard.extenderSetup.p3.canRetry);

      if(response.tagPaired) {
        $log.debug('[extenderSetupControllerPage3] TAG FOUND:      '+FobService2.fob.tags.tags[response.tagId]);

        setTagProperties(FobService2.fob.tags.tags[response.tagId]);
        return;
      }

      if (response.extenderFound) {
        $scope.wizard.extenderSetup.extender = ExtenderSetupService.getCurrentExtender();
        $log.debug('[extenderSetupControllerPage3] EXTENDER ACTIVATED: ' + $scope.wizard.extenderSetup.extender.extender_name);
        updateExtenderType(true);
      }
    }


    function setTagProperties(tag) {
      // $scope.wizard.tagSetup = {};
      $scope.wizard.extenderSetup.editedTag = tag;

      $ionicListDelegate.closeOptionButtons();
      $scope.wizard.showModal = true;
      // $ionicModal.fromTemplateUrl('app/views/edit-tag-name.html', {
      //     scope: $scope,
      //     animation: 'slide-in-up',
      //   })
      //   .then(function(modal) {
      //     $scope.modal = modal;
      //     modal.show();
      //
      //     $log.debug("SHOWING EDIT TAG NAME POPUP");
      //
      //   });
      // $log.debug('[extender-setup-p3-controller] TAG FULL NAME: '+$scope.wizard.tagSetup.editedTag.tagFullName)
      $log.debug("SHOWING EDIT TAG PROPERTIES");
      $state.go('wizard-manager.extender-setup.setTag', {}, {});
    }


    $scope.wizard.extenderSetup.closeTagSetup = function() {
      $scope.wizard.showModal = false;
      $log.debug('[extenderSetupControllerPage3] CLOSING TAG SETUP');
      // $scope.modal.hide();
      $state.go('wizard-manager.extender-setup.p3', {}, {});
      $scope.wizard.extenderSetup.editedTag = null;
    };

    function stopActivation() {
      $log.debug('[extenderSetupControllerPage3] STOPPING EXTENDER ACTIVATION');
      ExtenderSetupService.stopActivation();

      // $scope.$apply(function() {
      $scope.wizard.extenderSetup.p3.activatingExtender = false;

      $scope.wizard.extenderSetup.p3.canRetry = ExtenderSetupService.canRetry;
    }


    // add by dan to handle closing the wizard
    function onCloseWizard() {
      stopActivation();

      ExtenderSetupService.reset();

      setTimeout(function() {
        FobService2.extenderSetupCancel();
      }, 1000);
    }

    $scope.closeWizard = function(templateName) {
      $log.debug('[extenderSetupControllerPage3] CLOSING WIZARD');
      stopActivation();
      $scope.wizard.extenderSetup.p3.canRetry = false;
      if($scope.wizard.extenderSetup.p3.destroyExtenderServiceEventListener) {
        $scope.wizard.extenderSetup.p3.destroyExtenderServiceEventListener();
      }
    };



    (function() {
      $scope.wizard.pageCode = '312';

      eventHandlerRemovers.push($rootScope.$on('ExtenderSetupSerivceEvent', onExtenderServiceEvent));

      $scope.$on('wizardEvent::closeWizard', onCloseWizard);
      $scope.$on('wizardEvent::showNextPage', stopActivation);
      // $scope.$on('wizardEvent::showPreviousPage', stopActivation);
      $scope.$on('$destroy', destroyController);
      eventHandlerRemovers.push($rootScope.$on('AppEvent:Restart', $scope.wizard.extenderSetup.stopExtenderSetup));
      if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
        eventHandlerRemovers.push($rootScope.$on('AppEvent:Pause', stopActivation));
      } else {
        eventHandlerRemovers.push($rootScope.$on('AppEvent:Pause', $scope.wizard.extenderSetup.stopExtenderSetup));
      }

      $window.onbeforeunload = $scope.wizard.extenderSetup.stopExtenderSetup;

      // $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);

      $scope.wizard.extenderSetup.p3.fobMissing = ExtenderSetupService.fobMissing;
      // $scope.wizard.extenderSetup.extenders = FobService2.fob.extenders.getExtendersArray();
      $scope.wizard.extenderSetup.extender = ExtenderSetupService.getCurrentExtender();

      // $log.debug('[extenderSetupControllerPage3] FOB STATE: ' + FobService2.fob.fob_state);
      // $log.debug('[extenderSetupControllerPage3] isConnected: ' + FobService2.fob.isConnected());
      $log.debug('[extenderSetupControllerPage3] EXTENDER PAIRED: ' + $scope.wizard.extenderSetup.extender);
      $scope.wizard.disableNextButton();

      if ($scope.wizard.extenderSetup.extender) {
        $scope.wizard.extenderSetup.p3.fobMissing = false;
        $scope.wizard.extenderSetup.p3.activatingExtender = false;
        $scope.wizard.extenderSetup.p3.canRetry = false;
        $scope.wizard.extenderSetup.p3.extenderFound = true;

        updateExtenderType(true);

      } else if (FobService2.fob.isConnected()) {
        $scope.wizard.extenderSetup.p3.fobMissing = false;
        $scope.wizard.extenderSetup.p3.extenderFound = false;
        $scope.wizard.extenderSetup.p3.canRetry = true;
        $scope.wizard.extenderSetup.p3.startActivation();

      } else {
        $scope.wizard.extenderSetup.p3.fobMissing = true;
      }
      // console.log('TAG: ');
      // console.log(FobService2.fob.tags.getTagsArray()[0]);
      // setTimeout(function() {
      // setTagProperties(FobService2.fob.tags.getTagsArray()[0]);
      // }, 1000);
    })();




  }
})();
