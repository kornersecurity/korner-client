(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.component')
    .directive('ksFobActionButtons', ksFobActionButtons);

  /* @ngInject */
  function ksFobActionButtons($rootScope) {
    return {
      restrict: 'E',
      scope: {
        fob: '=',
        isIntrusionScreen: '='

      },
      templateUrl: 'app/views/fob-action-buttons-widget.html',
      controller: ksFobActionButtonsWidget
    };
  }

  angular.module('app.component')
    .controller('ksFobActionButtonsWidget', ksFobActionButtonsWidget);


  /* @ngInject */
  function ksFobActionButtonsWidget($scope, $rootScope, $state, FobService2,
    fobActivityTransactionTypeConst, $ionicPopup, wizardType, $log, gettext,
    $interval, clientUpdateEventConst, KornerStateHelpers) {
    $scope.FobService2 = FobService2;
    $scope.wizardType = wizardType;
    var countdownInterval, armingDelayPopup;
    var stopListeningForFobStateChange = $rootScope.$on(clientUpdateEventConst.FOB_STATE_CHANGE, onFobStateChange);
    var isArming = false;
    $scope.canArmSystem = true; //used to stop mutliple clicks
    var armDisamrEnableInterval;//used to stop mutliple clicks

    $scope.$on('$destroy', onDestroy);

    $scope.goToHome = function() {
      $state.go('app.home.select', {}, {});
    };

    $scope.goToIntrusion = function() {
      $state.go('app.intrusion');
    };

    $scope.armDisarmCancelAlert = function(fob) {
      disableArmDisarmButton();

      if (fob.isArmPending()) {
        FobService2.disarm();
      } else if (fob.isDisarmed()) {
        if (!fob.isReadyToArm()) {
          $scope.tagsWithIssues = fob.tags.tagsWithIssues();

          var armingWarningPopup = $ionicPopup.confirm({
            templateUrl: 'app/views/arm-warning-popup.html',
            cssClass: '',
            title: gettext('Arming Home'),
            scope: $scope,
            cancelText: gettext('Cancel'),
            cancelType: 'button-positive',
            okText: gettext('Continue'),
            okType: 'button-energized'
          });
          armingWarningPopup.then(function(res) {
            console.log("RESPONSE: "+res);
            if(res) {
              // armingWarningPopup.close();
              // armingWarningPopup = null;
              // $interval(function(){
                armSystem(fob);
              // },300, 1);
            }
          });
        } else {
          armSystem(fob);
        }
      } else {
        FobService2.disarm();
      }
    };

    $scope.showFobSettings = function() {
      FobService2.disarm();
      closePopup();
      $rootScope.showSetupScreen({wizardType:wizardType.FOB_SETUP});
    };

    function disableArmDisarmButton() {
      $scope.canArmSystem = false;
      armDisamrEnableInterval = $interval(function(){
        console.log($scope.canArmSystem);
        $scope.canArmSystem = true;
        armDisamrEnableInterval = null;
      },2000, 1);
    }

    function armSystem(fob) {

      FobService2.arm();

      startCountdownTimer(fob.arm_delay);

      if (parseInt(fob.arm_delay) > 0) {
        armingDelayPopup = $ionicPopup.alert({
          // template: gettext('Arming system in {{armDelayTimeRemaming}} seconds...<br> <a ng-href="showFobSettings()">Change arm delay</a>'),//'app/views/daleyed-arming-popup.html',
          templateUrl: 'app/views/arm-delay-popup.html',
          title: gettext('Arming Home'),
          scope: $scope,
          okText: gettext('Cancel Arm Process'),
          okType: 'button-assertive',
        });
        armingDelayPopup.then(function(res) {
          if(res) {
            $log.debug('[ksFobActionButtons] CANCELING ARM PROCESS');
            // if (fob.isArmPending()) {
            FobService2.disarm();
            closePopup();
            // }
          }
        });
      }
    }

    function startCountdownTimer(delayInSeconds) {
      isArming = true;
      $scope.armDelayTimeRemaming = delayInSeconds;
      countdownInterval = $interval(function(){
        $scope.armDelayTimeRemaming--;
        console.log($scope.armDelayTimeRemaming);
        if($scope.armDelayTimeRemaming <= 0) {
          closePopup();
        }
      },1000, delayInSeconds);
    }

    function stopCountdownTimer() {
      isArming = false;
      if(countdownInterval) {
        $interval.cancel(countdownInterval);
        countdownInterval = undefined;
      }
    }

    function closePopup() {
      stopCountdownTimer();
      if(armingDelayPopup){
        armingDelayPopup.close();
      }

      if (stopListeningForFobStateChange !== null) {
        stopListeningForFobStateChange();
        stopListeningForFobStateChange = null;
      }
    }

    function onFobStateChange(event, fobId, state) {

      if (isArming === false || fobId !== FobService2.fob.fob_id) {
        return;
      }
      $log.debug('[ksFobActionButtons] FOB STATUS UPDATED: ' + state);
      // $log.debug('[tagSetupService] FOB STATE: ' + KornerMsgHelpers.getDescriptionForFobState(state));

      if (KornerStateHelpers.isFobStateConnected(state) === false) {
        closePopup();
      }
    }

    function onDestroy(){
      if (stopListeningForFobStateChange !== null) {
        stopListeningForFobStateChange();
        stopListeningForFobStateChange = null;
      }
    }
  }

})();
