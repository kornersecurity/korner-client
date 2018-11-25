(function() {
  'use strict';

  /*jshint validthis: true */
  angular.module('app.wizard')
  .factory('WizardModel', WizardService);

  /* @ngInject */
  function WizardService($q, $log) {


    function WizardModel() {
      $log.debug('[wizard-model] INITIALIZING');
      this.fobSetup = {};
      this.circleSetup = {};
      this.extenderSetup = {};
      this.tagSetup = {};

      // $log.debug('[wizard-model] WIZARD:    '+this.wizard);
      // $log.debug('[wizard-model] FOB SETUP: '+this.fobSetup);

      this.fobSetup.fobSearchRetryLoops = 5; // Make 5 http requests
      this.fobSetup.fobSearchRetryTimes = 3*100; // Allow 3 retries
      this.fobSetup.fobSearchRetryDelay = 7000; // wait 7 seconds between calls
      this.fobSetup.ksMacAddress1 = 'DC:E0:26:';
      this.fobSetup.ksMacAddress2 = ':00:00';

      this.extenderSetup.extenderPairingRetryTimes = 3*100; // try 5 times
      this.extenderSetup.extenderPairingTimeout = 120000; // wait 3 milliseconds between calls

      this.circleSetup.invitationMessageLength = 500; // max chars allowed in message
      this.circleSetup.maxCircleMembers = 10;

      this.tagSetup.openCloseStepTimeout = 60000;
      this.tagSetup.tagPairingRetryTimes = 3*100; // try 5 times
      this.tagSetup.tagPairingTimeout = 120000; // wait 3 milliseconds between calls
      this.tagSetup.getOpeningMechanisms = _getOpeningMechanisms;

      this._initializedDeferred = $q.defer();
    }

    // list of exported public methods
    WizardModel.prototype = {
      setFobSearchRetryLoops: setFobSearchRetryLoops,
      setFobSearchRetryTimes: setFobSearchRetryTimes,
      setFobSearchRetryDelay: setFobSearchRetryDelay,
      setExtenderSearchRetryTimes: setExtenderSearchRetryTimes,
      setInvitationMessageLength: setInvitationMessageLength,
      setMaxCircleMembers: setMaxCircleMembers
    };

    return WizardModel;

    function onInitialize() {}

    function _getOpeningMechanisms(type) {
      var openingMechanisms = [];


      if (type.toLowerCase() === 'window') {
        openingMechanisms.push({id: 1, name: 'slide up & down', suffix: 'sliding'});
      }
      openingMechanisms.push({id: 2, name: 'slide left & right', suffix: 'sliding'});
      openingMechanisms.push({id: 3, name: 'swing in & out', suffix: 'swinging'});
      openingMechanisms.push({id: 0, name: 'other', suffix: ''});

      return openingMechanisms;
    }

    function setFobSearchRetryLoops(value) {
      this.fobSetup.fobSearchRetryLoops = value;
    }

    function setFobSearchRetryTimes(value) {
      this.fobSetup.fobSearchRetryTimes = value;
    }

    function setFobSearchRetryDelay(value) {
      this.fobSetup.fobSearchRetryDelay = value;
    }

    function setExtenderSearchRetryTimes(value) {
      this.extenderSetup.extenderSearchRetryTimes = value;
    }

    function setInvitationMessageLength(value) {
      this.fobSetup.invitationMessageLength = value;
    }

    function setMaxCircleMembers(value) {
      this.fobSetup.maxCircleMembers = value;
    }

  }
})();
