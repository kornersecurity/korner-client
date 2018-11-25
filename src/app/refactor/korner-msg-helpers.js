(function() {
  'use strict';



  angular
    .module('app.core')
    .service('KornerMsgHelpers', kornerMsgHelpers);




  /* @ngInject */
  function kornerMsgHelpers(fobStateConst, gettext,
    tagPortalTypeConst, tagPortalMechanismConst, KornerUIHelpersSeverityConst, KornerStateHelpers) {

    // list of exported public methods
    return {

      getTagStateDescription: getTagStateDescription,
      getDescriptionForTagState: getDescriptionForTagState,
      getTagStateIssueDescriptions: getTagStateIssueDescriptions,
      getTagStatusDescriptions: getTagStatusDescriptions,

      getFobStateDescription: getFobStateDescription,

      getPortalTypeDescription: getPortalTypeDescription,
      getPortalMechanismDescription: getPortalMechanismDescription,

      getStateSeverityForFob: getStateSeverityForFob,
      getFobStateSeverity: getFobStateSeverity,

      getActivitySeverity: getActivitySeverity,


    };


    function getTagStateDescription(tag) {
      return getDescriptionForTagState(tag.state);
    }

    function getDescriptionForTagState(state) {

      if (KornerStateHelpers.isTagStateUnknown(state)) {
        return gettext('unknown');
      }
      if (KornerStateHelpers.isTagStateOpen(state)) {
        return gettext('open');
      }
      if (KornerStateHelpers.isTagStateClosed(state)) {
        return gettext('closed');
      }
      if (KornerStateHelpers.isTagStateMoving(state)) {
        return gettext('moving');
      }
      if (KornerStateHelpers.isTagStateStill(state)) {
        return gettext('still');
      }
      if (KornerStateHelpers.isTagStateTampered(state)) {
        return gettext('tampered');
      }
      if (KornerStateHelpers.isTagStateLowBattery(state)) {
        return gettext('low battery');
      }
      if (KornerStateHelpers.isTagStateSupervisionReports(state)) {
        return gettext('supervision reports');
      }
      if (KornerStateHelpers.isTagStateRestoreReports(state)) {
        return gettext('restore reports');
      }
      if (KornerStateHelpers.isTagStateRadioTrouble(state)) {
        return gettext('radio trouble');
      }
      if (KornerStateHelpers.isTagStateAC(state)) {
        return gettext('ac');
      }
      if (KornerStateHelpers.isTagStateTest(state)) {
        return gettext('test');
      }
      // if (KornerStateHelpers.isTagStateNoUpgrade(state)) {
      //   return gettext('no upgrade');
      // }
      // if (KornerStateHelpers.isTagStateLostNetwork(state)) {
      //   return gettext('lost network');
      // }
      // if (KornerStateHelpers.isTagStateNoOpenClose(state)) {
      //   return gettext('no open close');
      // }
      if (KornerStateHelpers.isTagStateMagneticDistortion(state)) {
        return gettext('magnetic distortion');
      }
      if (KornerStateHelpers.isTagStateExcessiveVibration(state)) {
        return gettext('excessive vibration');
      }
      if (KornerStateHelpers.istagStateInitializing(state)) {
        return gettext('initializing');
      }
      // if (KornerStateHelpers.isTagStateReset(state)) {
      //   return gettext('reset');
      // }
      if (KornerStateHelpers.isTagStateMissing(state)) {
        return gettext('missing');
      }
      if (KornerStateHelpers.isTagStateBypassed(state)) {
        return gettext('bypassed');
      }
      if (KornerStateHelpers.isTagStateWaitingForUpgradeOK(state)) {
        return gettext('waiting for upgrade ok');
      }

      return gettext('[unknown tag state]' + state);
    }


    function getTagStateIssueDescriptions(state) {
      var issues = [];

      if (KornerStateHelpers.isTagStateTampered(state)) {
        issues.push(gettext('tampered'));
      }
      if (KornerStateHelpers.isTagStateLowBattery(state)) {
        issues.push(gettext('low battery'));
      }
      if (KornerStateHelpers.isTagStateRadioTrouble(state)) {
        issues.push(gettext('radio trouble'));
      }
      // if (KornerStateHelpers.isTagStateNoUpgrade(state)) {
      //   issues.push(gettext('no upgrade'));
      // }
      // if (KornerStateHelpers.isTagStateLostNetwork(state)) {
      //   issues.push(gettext('lost network'));
      // }

      if (KornerStateHelpers.isTagStateMagneticDistortion(state)) {
        issues.push(gettext('magnetic distortion'));
      }
      if (KornerStateHelpers.isTagStateExcessiveVibration(state)) {
        issues.push(gettext('excessive vibration'));
      }
      if (KornerStateHelpers.istagStateInitializing(state)) {
        issues.push(gettext('initializing'));
      }
      // if (KornerStateHelpers.isTagStateReset(state)) {
      //   issues.push(gettext('reset'));
      // }
      if (KornerStateHelpers.isTagStateMissing(state)) {
        issues.push(gettext('missing'));
      }

      return issues.join(", ");
    }


    function getTagStatusDescriptions(state) {

      if (KornerStateHelpers.isTagStateMoving(state)) {
        return gettext('activity');
      }
      if (KornerStateHelpers.isTagStateOpen(state)) {
        return gettext('open');
      }
      if (!KornerStateHelpers.isTagStateHealthy(state)) {
        return gettext('not ready');
      }
      if (KornerStateHelpers.isTagStateClosed(state)) {
        return gettext('ready');
      }

      return gettext('ready');
    }


    function getFobStateDescription(fob) {

      if (fob.tags.getCount() === 0) {
        if (KornerStateHelpers.isFobStateFirmwareUpdating(fob.fob_state)) {
          return gettext('firmware updating');
        }
        // is Connected
        if (KornerStateHelpers.isFobStateConnected(fob.fob_state)) {
          return gettext('stick connected');
        } else {
          return gettext('stick disconnected');
        }
      }


      if (KornerStateHelpers.isFobStateUnknown(fob.fob_state)) {
        return gettext('unknown');
      }
      if (KornerStateHelpers.isFobStateDisarmed(fob.fob_state)) {
        return gettext('disarmed');
      }
      if (KornerStateHelpers.isFobStateArmed(fob.fob_state)) {
        return gettext('armed');
      }
      if (KornerStateHelpers.isFobStateArmPending(fob.fob_state)) {
        return gettext('arm pending');
      }
      if (KornerStateHelpers.isFobStateTriggered(fob.fob_state)) {
        return gettext('intrusion');
      }
      if (KornerStateHelpers.isFobStateTriggeredAlarming(fob.fob_state)) {
        return gettext('intrusion');
      }
      if (KornerStateHelpers.isFobStateTriggeredSilent(fob.fob_state)) {
        return gettext('intrusion');
      }
      if (KornerStateHelpers.isFobStatePairing(fob.fob_state)) {
        return gettext('pairing');
      }
      if (KornerStateHelpers.isFobStateFirmwareUpdating(fob.fob_state)) {
        return gettext('firmware updating');
      }
      if (KornerStateHelpers.isFobStateFirmwareUpdateCritical(fob.fob_state)) {
        return gettext('firmware updating (critical)');
      }
      if (KornerStateHelpers.isFobStateFirmwareUpdate(fob.fob_state)) {
        return gettext('firmware update');
      }
      if (KornerStateHelpers.hasFobStateFirmwareUpgradeFailed(fob.fob_state)) {
        return gettext('firmware upgrade (failed)');
      }
      if (KornerStateHelpers.hasFobStateFirmwareUpgradePending(fob.fob_state)) {
        return gettext('firmware upgrade (pending)');
      }
      if (KornerStateHelpers.isFobStateChimeEnabled(fob.fob_state)) {
        return gettext('chime enabled');
      }
      if (KornerStateHelpers.isFobStateBuzzerEnabled(fob.fob_state)) {
        return gettext('buzzer enabled');
      }
      if (KornerStateHelpers.hasFobStateTroubleWithLocalNet(fob.fob_state)) {
        return gettext('trouble with local network');
      }
      if (KornerStateHelpers.hasFobStateTroubleWithServerConnection(fob.fob_state)) {
        return gettext('trouble with server connection');
      }
      if (KornerStateHelpers.hasFobStateTroubleWithRadioConnect(fob.fob_state)) {
        return gettext('trouble with radio connection');
      }
      if (KornerStateHelpers.isFobStateDisconnected(fob.fob_state)) {
        return gettext('stick disconnected');
      }
      if (KornerStateHelpers.isFobStateConnected(fob.fob_state)) {
        return gettext('connected');
      }
      if (KornerStateHelpers.isFobStateMissing(fob.fob_state)) {
        return gettext('missing');
      }
      if (KornerStateHelpers.isFobStateArmDelayEnabled(fob.fob_state)) {
        return gettext('arm delay enabled');
      }

      return gettext('[unknown fob state]' + fob.fob_state);
    }

    function getPortalTypeDescription(portalTypeID) {
      switch (portalTypeID) {
        case tagPortalTypeConst.WINDOW:
          return gettext("window");
        case tagPortalTypeConst.DOOR:
          return gettext("door");
      }

      return gettext('UNKOWN PORTAL'); //('[unknown fob portal_type_id]');
    }

    function getPortalMechanismDescription(portalMechanismID) {
      switch (portalMechanismID) {
        case tagPortalMechanismConst.SLIDE_UP_DOWN:
        case tagPortalMechanismConst.SLIDE_LEFT_RIGHT:
          return gettext("sliding");
        case tagPortalMechanismConst.SWING_IN_OUT:
          return gettext("swinging");
        case tagPortalMechanismConst.UNKNOWN:
          return "";
      }

      return ""; //gettext('[unknown fob portal_type_id]');
    }

    function getStateSeverityForFob(fob) {
      return getFobStateSeverity(fob.fob_state);
    }


    function getFobStateSeverity(state) {


      if (KornerStateHelpers.isFobStateUnknown(state)) {
        return KornerUIHelpersSeverityConst.UNKNOWN;
      }
      if (KornerStateHelpers.isFobStateDisarmed(state)) {
        return KornerUIHelpersSeverityConst.BALANCED;
      }
      if (KornerStateHelpers.isFobStateArmed(state)) {
        return KornerUIHelpersSeverityConst.ASSERTIVE;
      }
      if (KornerStateHelpers.isFobStateTriggered(state)) {
        return KornerUIHelpersSeverityConst.TROUBLE;
      }
      if (KornerStateHelpers.isFobStateTriggeredAlarming(state)) {
        return KornerUIHelpersSeverityConst.TROUBLE;
      }
      if (KornerStateHelpers.isFobStateTriggeredSilent(state)) {
        return KornerUIHelpersSeverityConst.TROUBLE;
      }
      if (KornerStateHelpers.isFobStatePairing(state)) {
        return KornerUIHelpersSeverityConst.CALM;
      }
      if (KornerStateHelpers.isFobStateFirmwareUpdating(state)) {
        return KornerUIHelpersSeverityConst.CALM;
      }
      if (KornerStateHelpers.isFobStateFirmwareUpdateCritical(state)) {
        return KornerUIHelpersSeverityConst.ENERGIZED;
      }
      if (KornerStateHelpers.isFobStateFirmwareUpdate(state)) {
        return KornerUIHelpersSeverityConst.CALM;
      }
      if (KornerStateHelpers.isFobStateDisconnected(state)) {
        return KornerUIHelpersSeverityConst.ENERGIZED;
      }
      if (KornerStateHelpers.isFobStateConnected(state)) {
        return KornerUIHelpersSeverityConst.INFO;
      }
      if (KornerStateHelpers.isFobStateMissing(state)) {
        return KornerUIHelpersSeverityConst.TROUBLE;
      }



      return KornerUIHelpersSeverityConst.UNDEFINED;
    }

    function getActivitySeverity(activity) {

    }

  }

})();
