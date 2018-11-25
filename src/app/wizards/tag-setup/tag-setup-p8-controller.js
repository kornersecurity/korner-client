(function() {
  'use strict';

  angular.module('app.wizard.tag')
    .controller('tagSetupControllerPage8', tagSetupControllerPage8);

  /* @ngInject */
  function tagSetupControllerPage8(
    $rootScope,
    $scope,
    $state,
    $timeout,
    WizardModel,
    WizardService,
    contentTagSetup,
    clientUpdateEventConst,
    $log,
    FobService2,
    $ionicPopup,
    uiLoadingService,
    TagSetupService
  ) {
    $scope.wizard.tagSetup.p8 = {};
    var eventHandlerRemovers = [];

    function init() {
      $scope.wizard.tagSetup.p8.steps = [];

      if ($scope.wizard.tagSetup.selectedSetupType === 'Door') {
        $scope.wizard.tagSetup.p8.steps.push(
          WizardService.getTagSetupValidationStepByType('initializingPortal'));

        $scope.wizard.tagSetup.p8.steps.push(
          WizardService.getTagSetupValidationStepByType('doorOpenPortal'));

        $scope.wizard.tagSetup.p8.steps.push(
          WizardService.getTagSetupValidationStepByType('analyzingPortal'));

        $scope.wizard.tagSetup.p8.steps.push(
          WizardService.getTagSetupValidationStepByType('doorClosePortal'));
      }

      if ($scope.wizard.tagSetup.selectedSetupType === 'Window') {
        $scope.wizard.tagSetup.p8.steps.push(
          WizardService.getTagSetupValidationStepByType('initializingPortal'));

        $scope.wizard.tagSetup.p8.steps.push(
          WizardService.getTagSetupValidationStepByType('windowOpenPortal'));

        $scope.wizard.tagSetup.p8.steps.push(
          WizardService.getTagSetupValidationStepByType('analyzingPortal'));

        $scope.wizard.tagSetup.p8.steps.push(
          WizardService.getTagSetupValidationStepByType('windowClosePortal'));
      }

      $scope.wizard.tagSetup.p8.totalSteps = $scope.wizard.tagSetup.p8.steps.length;
      $scope.wizard.tagSetup.p8.currentStepIndex = 0;

      $log.debug('[tagSetupControllerPage8] STEPS: ' + $scope.wizard.tagSetup.p8
        .totalSteps);
    }

    function resetActivationData() {
      for (var s in $scope.wizard.tagSetup.p8.steps) {
        var step = $scope.wizard.tagSetup.p8.steps[s];
        step.started = false;
        step.completed = false;
        step.failed = false;
      }
      $scope.wizard.tagSetup.p8.currentStepIndex = 0;
    }

    $scope.wizard.tagSetup.p8.restartActivation = function() {
      resetActivationData();
      startValidation();
    };

    function startValidation() {
      $log.debug('[tagSetupControllerPage8] STARTED VALIDATION FOR STEP: ' + (
        $scope.wizard.tagSetup.p8.currentStepIndex));

      $scope.wizard.tagSetup.p8.currentStep = $scope.wizard.tagSetup.p8.steps[
        $scope.wizard.tagSetup.p8.currentStepIndex];
      $scope.wizard.tagSetup.p8.currentStep.started = true;
      $scope.wizard.tagSetup.p8.timer = $timeout(stopOnFail, $scope.wizard.tagSetup
        .p8.openCloseStepTimeout);

      var step = $scope.wizard.tagSetup.p8.currentStep;
      if (step.requiredState($scope.wizard.tagSetup.tag.tag_state) !== step.negateState &&
         (step.requiredState2 === undefined ||  step.requiredState2($scope.wizard.tagSetup.tag.tag_state) !== step.negateState2)) {
          step.completed = true;
          nextStep();
      }
      else if($scope.wizard.tagSetup.p8.currentStep.uiStyle === 'pop') {
        uiLoadingService.show(
          $scope.wizard.tagSetup.p8.currentStep.description, "wizardToast");
      }
    }

    function nextStep() {
      if($scope.wizard.tagSetup.p8.currentStep.uiStyle === 'pop') {
        uiLoadingService.hide();
      }

      $scope.wizard.tagSetup.p8.currentStepIndex++;

      stopTimer();

      if ($scope.wizard.tagSetup.p8.currentStepIndex >= $scope.wizard.tagSetup
        .p8.steps.length) {
        $log.debug('[tagSetupControllerPage8] ALL STEPS COMPLETED');

        $scope.$apply(function() {
          $scope.wizard.tagSetup.p8.removeTagStateEventHandler();
          $scope.wizard.tagSetup.p8.stepsCompleted = true;
          $scope.wizard.enableNextButton();
          $scope.wizard.enableDoneButton();
          $scope.wizard.wizardManagerData.setWizardCompleted($scope.wizard.wizardManagerData
            .currentWizard.type);
          resetActivationData();
          $scope.wizard.tagSetup.tag = null;
          reloadTagsData();
          $scope.wizard.disablePreviousButton();
          showContinuePopUp();
        });

      } else {
        var setStepFn = function() {
          $scope.wizard.tagSetup.p8.currentStep = $scope.wizard.tagSetup.p8.steps[
            $scope.wizard.tagSetup.p8.currentStepIndex];
          $scope.wizard.tagSetup.p8.currentStep.started = true;
          $scope.wizard.tagSetup.p8.timer = $timeout(stopOnFail, $scope.wizard.tagSetup
            .p8.openCloseStepTimeout);
        };

        if($scope.$$phase) {
          $scope.$apply(
            setStepFn()
          );
        } else {
          setStepFn();
        }

        if($scope.wizard.tagSetup.p8.currentStep.uiStyle === 'pop') {
          uiLoadingService.show(
            $scope.wizard.tagSetup.p8.currentStep.description, "wizardToast");
        }

        $log.debug('[tagSetupControllerPage8] CURRENT STEP: ' + $scope.wizard.tagSetup
          .p8.currentStepIndex);
      }
    }

    function reloadTagsData() {
      FobService2.fob.tags.loadRefreshTags().then(
        function() {
          $scope.wizard.tagSetup.tags = FobService2.fob.tags.getTagsArray();
        },
        function(err) {

        }
      );
    }

    function showContinuePopUp() {

      // close out tag setup - added by dan.
      FobService2.tagSetupComplete();

      $log.debug('[tag-setup-p8-controller] SHOWING CONTINUE POPUP');
      var continuePopUp = $ionicPopup.confirm({
        title: contentTagSetup.ADD_ANOTHER_TITLE,
        cancelText: contentTagSetup.ADD_ANOTHER_NO,
        okText: contentTagSetup.ADD_ANOTHER_YES
      });

      continuePopUp.then(function(res) {

        TagSetupService.reset();
        $scope.wizard.tagSetup.resetNewTagProps();
        $scope.wizard.enablePreviousButton();
        if (res) {
          $scope.wizard.wizardManagerData.setCurrentWizardPage(2);
          $scope.wizard.changeState();
        } else {
          $scope.wizard.goToNextPage();
          // $log.debug('You are not sure');
        }
      });
    }

    function stopOnFail() {
      if($scope.wizard.tagSetup.p8.currentStep.uiStyle === 'pop') {
        uiLoadingService.hide();
      }
      stopTimer();
      $scope.wizard.tagSetup.p8.currentStep.failed = true;
    }

    function stopTimer() {
      $timeout.cancel($scope.wizard.tagSetup.p8.timer);
      $scope.wizard.tagSetup.p8.timer = null;
    }

    function onValidationMessageReceived(event, fobId, tagId, state) {
      // $log.debug('[tagSetupControllerPage8] TAG MESSAGE RECEIVED: ', fobId,
        // tagId, state);

      $log.debug('[tagSetupControllerPage8] IS CORRECT STATE: '+
        $scope.wizard.tagSetup.p8.currentStep.requiredState(state));

      if($scope.wizard.tagSetup.p8.currentStep.requiredState2 !== undefined){
        $log.debug('[tagSetupControllerPage8] IS CORRECT STATE 2: '+
          $scope.wizard.tagSetup.p8.currentStep.requiredState2(state));
      }

      if (fobId === $scope.wizard.tagSetup.tag.fob_id && tagId === $scope.wizard
        .tagSetup.tag.tag_id) {
        // $log.debug('[tagSetupControllerPage8] ACTIVE TAG FOUND');

        if ($scope.wizard.tagSetup.p8.currentStep.requiredState(state) !== $scope.wizard.tagSetup.p8.currentStep.negateState &&
           ($scope.wizard.tagSetup.p8.currentStep.requiredState2 === undefined || $scope.wizard.tagSetup.p8.currentStep.requiredState2(state) !== $scope.wizard.tagSetup.p8.currentStep.negateState2)) {
            // $log.debug('[tagSetupControllerPage8] ACTIVE TAG STATUS: ' + $scope.wizard
            //   .tagSetup.p8.currentStep.completed);
            $log.debug(
              '[tagSetupControllerPage8] ACTIVE TAG STATUS: CORRECT STATUS');

            if($scope.$$phase) {
              $scope.$apply(
                function() {
                  $scope.wizard.tagSetup.p8.currentStep.completed = true;
                }
              );
            } else {
                $scope.wizard.tagSetup.p8.currentStep.completed = true;
            }
            $log.debug('[tagSetupControllerPage8] STEP COMPLETED: ' +
              $scope.wizard.tagSetup.p8.currentStep.completed);
            nextStep();
        } else {
          $log.debug(
            '[tagSetupControllerPage8] ACTIVE TAG STATUS: INCORRECT STATUS');
          // stopOnFail();
        }
      }
    }

    function onDoneClicked() {
      FobService2.fob.tags.loadRefreshTags().then(
        function() {
          $scope.wizard.tagSetup.tags = FobService2.fob.tags.getTagsArray();
          resetActivationData();
          $scope.wizard.wizardCompleted(false);

        },
        function(err) {

          // $scope.wizard.tagSetup.tags = FobService2.fob.tags.getTagsArray();
          resetActivationData();
          $scope.wizard.wizardCompleted(false);
        }
      );
    }

    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      if($scope.wizard.tagSetup.p8.removeTagStateEventHandler){
        $scope.wizard.tagSetup.p8.removeTagStateEventHandler();
        $scope.wizard.tagSetup.p8.removeTagStateEventHandler = null;
      }
      $log.debug('[intrusionController] DESTROYING');
    }

    (function() {
      $scope.wizard.pageCode = '407';
      $scope.wizard.tagSetup.p8.includeSource = ($scope.wizard.tagSetup.selectedSetupType
          .toLowerCase() === 'window') ? 'app/views/window-step4.html' :
        'app/views/door-step4.html';

      $scope.wizard.tagSetup.p8.stepsCompleted = false;

      $scope.wizard.tagSetup.p8.openCloseStepTimeout = $scope.wizard.wizardModel
        .tagSetup.openCloseStepTimeout;

      resetActivationData();

      $scope.wizard.disableNextButton();
      $scope.wizard.disableDoneButton();

      $scope.wizard.tagSetup.p8.removeTagStateEventHandler = $rootScope.$on(
        clientUpdateEventConst.TAG_STATE_CHANGE, onValidationMessageReceived
      );

      init();
      startValidation();

      $scope.$on('wizardEvent::doneClicked', onDoneClicked);
      $scope.$on('wizardEvent::showPreviousPage', resetActivationData);
      $scope.$on('$destroy', destroyController);
    })();
  }
})();
