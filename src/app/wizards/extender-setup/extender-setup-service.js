(function() {
  'use strict';

  angular.module('app.wizard.service').constant('ExtenderSetupSerivceEvent', {
    EXTENDER_FOUND: 0,
    FOB_MISSING: 1,
    PAIRING_TIME_EXCEEDED: 2,
    ACTIVATING_EXTENDER: 3
  });

  /*jshint validthis: true */
  angular.module('app.wizard.service')
    .factory('ExtenderSetupService', extenderSetupService);

  /* @ngInject */
  function extenderSetupService(
    $rootScope,
    clientUpdateEventConst,
    $timeout,
    FobService2,
    KornerStateHelpers,
    KornerMsgHelpers,
    $log
  ) {
    var self = this;
    var _currentExtender;
    var _stopListeningForExtenderPairing = null;
    var _stopListeningForFobStateChange = null;
    var _stopListeningForTagPairing = null;
    var _extenderPairingRetryTimes;
    var _extenderPairingTimeout;
    var _fobMissing = false;
    var _fobUpdating = false;
    var _activatingExtender = false;
    var _canRetry = true;
    var _extenderFound = false;
    var _currentRetries;
    var _activateExtenderTimer;
    var _initialized = false;
    var _tagPaired = false;
    var _tagId = null;

    return {
      init: init,
      // setCurrentExtender: setCurrentExtender,
      getCurrentExtender: getCurrentExtender,
      startActivation: startActivation,
      stopActivation: stopActivation,
      fobMissing: _fobMissing,
      canRetry: _canRetry,
      activatingExtender: _activatingExtender,
      extenderFound: _extenderFound,
      reset: reset
    };

    function getCurrentExtender() {
      // return angular.copy(_currentExtender);
      return _currentExtender;
    }

    function reset() {
      if (_stopListeningForFobStateChange !== null) {
        _stopListeningForFobStateChange();
      }

      if (_stopListeningForExtenderPairing) {
        _stopListeningForExtenderPairing();
      }

      if (_stopListeningForTagPairing) {
        _stopListeningForTagPairing();
      }

      if(_activatingExtender === true) {
        FobService2.stopPairing();
      }

      _currentExtender = null;
      _stopListeningForExtenderPairing = null;
      _stopListeningForFobStateChange = null;
      _stopListeningForTagPairing = null;
      _fobMissing = false;
      _fobUpdating = false;
      _activatingExtender = false;
      _canRetry = true;
      _extenderFound = false;
      _activateExtenderTimer = null;
      _initialized = false;
      _tagPaired = false;
      _tagId = null;
    }

    function startActivation() {
      if (_extenderFound) {
        $rootScope.$emit('ExtenderSetupSerivceEvent', generateResponseObject());
        return;
      }
      $log.debug('[ExtenderSetupService] EXTENDER NOT FOUND');

      if (_activatingExtender) {
        $rootScope.$emit('ExtenderSetupSerivceEvent', generateResponseObject());
        return;
      }
      $log.debug('[ExtenderSetupService] NOT ACTIVATING EXTENDER');

      _stopListeningForExtenderPairing = $rootScope.$on(clientUpdateEventConst.EXTENDER_PAIRED, onExtenderPaired);
      _stopListeningForTagPairing = $rootScope.$on(clientUpdateEventConst.TAG_PAIRED, onTagPaired);

      if (_stopListeningForFobStateChange === null) {
        _stopListeningForFobStateChange = $rootScope.$on(clientUpdateEventConst.FOB_STATE_CHANGE, onFobStateChange);
      }

      if (_currentRetries >= _extenderPairingRetryTimes) {
        $rootScope.$emit('ExtenderSetupSerivceEvent', generateResponseObject());
        return;
      }

      $log.debug('[ExtenderSetupService] STARTING ACTIVATION');

      _activateExtenderTimer = $timeout(onExtenderPairingTimeout, _extenderPairingTimeout);
      _currentRetries++;
      _activatingExtender = true;

      FobService2.startPairing();
    }

    function generateResponseObject() {
      return {
        fobUpdating: _fobUpdating,
        fobMissing: _fobMissing,
        activatingExtender: _activatingExtender,
        canRetry: _canRetry,
        extenderFound: _extenderFound,
        tagPaired: _tagPaired,
        tagId: _tagId
      };
    }

    function onExtenderPairingTimeout() {
          $log.debug('[ExtenderSetupService] EXTENDER PAIRING TIMED OUT');
      stopActivation();
      $rootScope.$emit('ExtenderSetupSerivceEvent', generateResponseObject());
    }

    function onExtenderPaired(event, fobId, extenderId, extenderEui64) {
      $log.debug('[ExtenderSetupService] EXTENDER PAIRED: ' + FobService2.fob.extenders.extenders[extenderId] + ' ('+extenderId+')');
      console.log(FobService2.fob.extenders);

      if (!FobService2.fob.extenders.extenders[extenderId]) {
        return;
      }

      if (_extenderFound === true) {
        return;
      }
      if (_stopListeningForFobStateChange) {
        _stopListeningForFobStateChange();
        _stopListeningForFobStateChange = null;
      }

      stopActivation();

      // extenders = FobService2.fob.extenders.getExtendersArray();
      _currentExtender = FobService2.fob.extenders.extenders[extenderId];

      $log.debug('[ExtenderSetupService] EXTENDER PAIRED');
      $log.debug(_currentExtender);


      _canRetry = false;
      _extenderFound = true;

      // updateExtenderType();

      $rootScope.$emit('ExtenderSetupSerivceEvent', generateResponseObject());
    }


    function onTagPaired(event, fobId, tagId, tagEui64) {
      // $log.debug('[tagSetupService] TAG PAIRED: ' + FobService2.fob.tags.tags[tagId]);

      stopActivation();

      $log.debug('[ExtenderSetupService] TAG PAIRED: '+tagId);
      // $log.debug(_currentExtender);


      _canRetry = true;
      _extenderFound = false;
      _tagPaired = true;
      _tagId = tagId;
      $rootScope.$emit('ExtenderSetupSerivceEvent', generateResponseObject());
      _tagPaired = false;
    }


    function onFobStateChange(event, fobId, state) {

      if (fobId !== FobService2.fob.fob_id || _extenderFound === true) {
        return;
      }

      $log.debug('[ExtenderSetupService] FOB STATUS UPDATED: ' + state);
      // $log.debug('[ExtenderSetupService] FOB STATE: ' + KornerMsgHelpers.getDescriptionForFobState(state));

      if (KornerStateHelpers.isFobStateConnected(state) === false) {
        stopActivation();
        _activatingExtender = false;
        _fobMissing = true;

        $log.debug('[ExtenderSetupService] FOB STATUS CHANGE - TEST 1');
        $rootScope.$emit('ExtenderSetupSerivceEvent', generateResponseObject());
        return;
      }

      if ((KornerStateHelpers.isFobStateArmPending(state) === true ||
          KornerStateHelpers.isFobStateArmed(state) === true) &&
          _activatingExtender === true) {

        $log.debug('[ExtenderSetupService] FOB STATUS CHANGE - TEST 2');
        stopActivation();
        _activatingExtender = false;
        // _fobMissing = true;

        $rootScope.$emit('ExtenderSetupSerivceEvent', generateResponseObject());
        return;
      }

      if (KornerStateHelpers.isFobStateDisarmed(state) === true &&
          _fobMissing === true) {

        $log.debug('[ExtenderSetupService] FOB STATUS CHANGE - TEST 3');
        _fobMissing = false;
        if (_activatingExtender === false) {
          startActivation();
          $rootScope.$emit('ExtenderSetupSerivceEvent', generateResponseObject());
        }
        return;
      }


      if (KornerStateHelpers.isFobStateDisarmed(state) === true &&
          _fobMissing === false && _activatingExtender === true) {

        $log.debug('[ExtenderSetupService] FOB STATUS CHANGE - TEST 4');
        stopActivation();

        $rootScope.$emit('ExtenderSetupSerivceEvent', generateResponseObject());
        return;
      }
    }

    function stopActivation() {

      if (FobService2.fob.isPairing() === true){
        FobService2.stopPairing();
      }

      // $scope.$apply(function() {
      _activatingExtender = false;
      $timeout.cancel(_activateExtenderTimer);
      _activateExtenderTimer = null;

      $log.debug('[ExtenderSetupService] STOPPING EXTENDER ACTIVATION');
      if (_currentRetries < _extenderPairingRetryTimes) {
        _canRetry = true;
      } else {
        _canRetry = false;
      }
      // $log.debug('[ExtenderSetupService] CURRENT RETRIES: ' + _currentRetries);
      // $log.debug('[ExtenderSetupService] MAX RETRIES:     ' + _extenderPairingRetryTimes);
      // $log.debug('[ExtenderSetupService] CAN RETRY:       ' + _canRetry);
      // $log.debug('[ExtenderSetupService] ACTIVATING EXTENDER:  ' + _activatingExtender);

      /*
       * Commenting out to stop timming issue
      if (_stopListeningForExtenderPairing) {
        _stopListeningForExtenderPairing();
        _stopListeningForExtenderPairing = null;
      }
      */

      // setTimeout(function() {
      //   FobService2.extenderSetupCancel();
      // }, 1000);
      // });
      // if(_stopListeningForFobStateChange) {
      //   _stopListeningForFobStateChange();
      //   _stopListeningForFobStateChange = null;
      // }
    }

    function init(wizardModel) {
      $log.debug('[ExtenderSetupService] INITIALIZING...');
      if (_initialized || FobService2.fob === undefined || FobService2.fob === null) {
        return;
      }
      _extenderPairingRetryTimes = wizardModel.extenderSetup.extenderPairingRetryTimes;
      _extenderPairingTimeout = wizardModel.extenderSetup.extenderPairingTimeout;
      _stopListeningForFobStateChange = $rootScope.$on(clientUpdateEventConst.FOB_STATE_CHANGE, onFobStateChange);

      $log.debug('[ExtenderSetupService] MAX RETRIES: ' + _extenderPairingRetryTimes);

      _fobMissing = false;

      if (_currentExtender) {
        _activatingExtender = false;
        _canRetry = false;
        _extenderFound = true;
      } else {
        _currentRetries = 0;
        _activatingExtender = false;
        _canRetry = false;
        _extenderFound = false;

        // $log.debug('[ExtenderSetupService] FOB STATE: ' + FobService2.fob.fob_state);
        // $log.debug('[ExtenderSetupService] isConnected: ' + FobService2.fob.isConnected());

        if (FobService2.fob.isConnected()) {
          _fobMissing = false;
          // startActivation();
        } else {
          _fobMissing = true;
        }
      }
      _initialized = true;
    }


  }
})();
