(function() {
  'use strict';


  /*jshint validthis: true */


  angular
    .module('app.core')
    .factory('FobActivitySecurity', fobActivitySecurity);

  /* @ngInject */
  function fobActivitySecurity($log, gettext, FobActivityBase, fobActivityTransactionTypeConst,
    fobCmdMessageConst, fobMessageTypeConst, KornerStateHelpers) {


    // [user image] [name] is arming  [...]  [time]
    // [user image] [name] has armed  [time]

    // [user image] [name] is disarming  [...]  [time]
    // [user image] [name] has disarmed  [time]

    // [alert image] Intrusion Detected  [time]

    // [user image] [name] is silencing the alarm sound  [...]  [time]
    // [user image] [name] has silenced the alarm sound  [time]

    // [ok/healthy image] Intrusion Closed (tbd)  [time]




    function FobActivitySecurity(fob) {
      angular.extend(this, new FobActivityBase($log));
      this.fob = fob;
      this.activityType = fobActivityTransactionTypeConst.security;
      this.isPending = true;
      this.fobUserImageUrl = undefined;
    }

    FobActivitySecurity.prototype.isActivityAppendable = isActivityAppendable;
    FobActivitySecurity.prototype._generateDescriptions = _generateDescriptions;

    FobActivitySecurity.prototype._isArmCompleted = _isArmCompleted;
    FobActivitySecurity.prototype._isDisarmCompleted = _isDisarmCompleted;
    FobActivitySecurity.prototype._isSilenceCompleted = _isSilenceCompleted;
    FobActivitySecurity.prototype._isFobRequestPending = _isFobRequestPending;
    FobActivitySecurity.prototype._isFobArmPending = _isFobArmPending;
    FobActivitySecurity.prototype.isReportable = isReportable;

    FobActivitySecurity.prototype._getDescription = _getDescription;
    FobActivitySecurity.prototype._getFobUserInfo = _getFobUserInfo;
    FobActivitySecurity.prototype._setUserImageUrl = _setUserImageUrl;
    FobActivitySecurity.prototype._hasUserSecurityEvent = _hasUserSecurityEvent;
    FobActivitySecurity.prototype._isEqualToKnownState = _isEqualToKnownState;

    // base class prototype
    FobActivitySecurity.prototype.onFinalize = FobActivityBase.prototype.onFinalize;
    FobActivitySecurity.prototype.appendActivity = appendActivity;
    FobActivitySecurity.prototype.hasContent = FobActivityBase.prototype.hasContent;



    return FobActivitySecurity;


    function isActivityAppendable(activity) {

      if (this.isPending) {

        // nothing so far, so sure its appendable
        if (this._rawActivities.length === 0) {
          return true;
        }

        // is this a duplicate event  i.e. multi arming request
        else if (this._rawActivities[0].data.MsgID === activity.data.MsgID || this._rawActivities[this._rawActivities.length - 1].data.MsgID === activity.data.MsgID) {
          return true;
        }


        // Is the person planning to disarm the system?
        else if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.DISARM_FOB) {
          // has the system disarmed?
          if (activity.data.MsgID === fobMessageTypeConst.STATUS && KornerStateHelpers.isFobStateDisarmed(activity.data.Payload.State)) {
            return true;
          }
        }

        // Is the person planning to silence the system?
        else if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.SILENCE_FOB) {
          // has the system silenced?
          if (activity.data.MsgID === fobMessageTypeConst.STATUS && KornerStateHelpers.isFobStateTriggeredSilent(activity.data.Payload.State)) {
            return true;
          }
        }

        // Is the person planning to arm the system?
        else if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.ARM_FOB) {

          // is the system pending?
          if (activity.data.MsgID === fobMessageTypeConst.STATUS && KornerStateHelpers.isFobStateArmPending(activity.data.Payload.State)) {
            return true;
          }

          // is the user now trying to disarm?
          if (activity.data.MsgID === fobCmdMessageConst.DISARM_FOB) {
            return true;
          }

          // has the system armed?
          if (activity.data.MsgID === fobMessageTypeConst.STATUS && KornerStateHelpers.isFobStateArmed(activity.data.Payload.State)) {
            this.isPending = false;
            return true;
          }

          // has the system disarmed?
          if (activity.data.MsgID === fobMessageTypeConst.STATUS && KornerStateHelpers.isFobStateDisarmed(activity.data.Payload.State)) {
            return true;
          }
        }

        // was this just the status
        else if (this._rawActivities[0].data.MsgID === fobMessageTypeConst.STATUS) {
          return true;
        }
      }

      if (this._rawActivities.length > 0 && activity.data.MsgID === fobMessageTypeConst.STATUS && this._isEqualToKnownState(activity.data.Payload.State)) {
        console.log("KNOWN STATE!!!");
        return true;
      }



      // // is this a duplicate event  i.e. multi arming request
      // if (this._rawActivities[0].data.MsgID === activity.data.MsgID) {
      //   return true;
      // }
      //
      // // we have an arming request and fob has armed
      // if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.ARM_FOB && this._isArmCompleted(activity)) {
      //   return true;
      // }
      //
      // // we have a disarming request and fob has disarmed
      // if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.DISARM_FOB && this._isDisarmCompleted(activity)) {
      //   return true;
      // }
      //
      // // we have silence request and fob has silenced
      // if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.SILENCE_FOB && this._isSilenceCompleted(activity)) {
      //   return true;
      // }
      //
      //
      // // we have an arming request and fob is pending
      // if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.ARM_FOB && this._isArmCompleted(activity)) {
      //   return true;
      // }
      // if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.ARM_DISARM && this._isArmCompleted(activity)) {
      //   return true;
      // }

      this.isPending = false;
      return false;
    }

    function appendActivity(activity) {
      this._rawActivities.push(activity);
      this._generateDescriptions();

      if (this._rawActivities.length === 1) {
        this._getFobUserInfo();
      }
    }


    function _isArmCompleted(activity) {
      if (activity.data.MsgID === fobMessageTypeConst.STATUS &&
        KornerStateHelpers.isFobStateArmed(activity.data.Payload.State)) {
        return true;
      }
      return false;
    }

    function _isDisarmCompleted(activity) {
      if (activity.data.MsgID === fobMessageTypeConst.STATUS &&
        KornerStateHelpers.isFobStateDisarmed(activity.data.Payload.State)) {
        return true;
      }
      return false;
    }

    function _isSilenceCompleted(activity) {
      if (activity.data.MsgID === fobMessageTypeConst.STATUS &&
        KornerStateHelpers.isFobStateTriggeredSilent(activity.data.Payload.State)) {
        return true;
      }
      return false;
    }


    function _isFobRequestPending() {
      var pending = false;

      if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.ARM_FOB ||
        this._rawActivities[0].data.MsgID === fobCmdMessageConst.DISARM_FOB ||
        this._rawActivities[0].data.MsgID === fobCmdMessageConst.SILENCE_FOB) {
        pending = true;
      }

      if (!pending || this._rawActivities.length === 1) {
        return pending;
      }

      var activity = this._rawActivities[this._rawActivities.length - 1];

      if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.ARM_FOB) {
        return !this._isArmCompleted(activity);
      }
      if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.DISARM_FOB) {
        return !this._isDisarmCompleted(activity);
      }
      if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.SILENCE_FOB) {
        return !this._isSilenceCompleted(activity);
      }

      return pending;
    }

    function _isFobArmPending() {

      if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.ARM_FOB &&
        KornerStateHelpers.isFobStateArmPending(activity.data.Payload.State)) {
        return true;
      }

      return false;
    }

    function _getDescription() {




      // if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.ARM_FOB) {
      //   return this.isPending ? gettext("System is Arming") : gettext("System was Armed");
      // }
      // if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.DISARM_FOB) {
      //   return this.isPending ? gettext("System is Disarming") : gettext("System was Disarmed");
      // }
      // if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.SILENCE_FOB) {
      //   return this.isPending ? gettext("System is Silencing") : gettext("System was Silenced");
      // }
      //
      // if (this._rawActivities[0].data.MsgID === fobMessageTypeConst.STATUS) {
      //   var currentState = this._rawActivities[this._rawActivities.length - 1].data.Payload.State;
      //   if (KornerStateHelpers.isFobStateTriggered(currentState)) {
      //     this.imageUrl = 'app/img/status_missing.png';
      //     return gettext("System has detected an Intrusion");
      //   }
      //   if (KornerStateHelpers.isFobStateArmed(currentState)) {
      //     this.imageUrl = 'app/img/activity_armed.png';
      //     return gettext("System is Armed");
      //   }
      //   if (KornerStateHelpers.isFobStateDisarmed(currentState)) {
      //     this.imageUrl = 'app/img/activity_disarmed.png';
      //     return gettext("System is Disarmed");
      //   }
      //
      //   if (KornerStateHelpers.isFobStateArmPending(currentState)) {
      //     this.imageUrl = 'app/img/activity_armed.png';
      //     return gettext("System Arm Pending");
      //
      //   }
      // }
      //
      // console.log(this._rawActivities);
      //
      // return this._rawActivities[this._rawActivities.length - 1].description + "security (" + this._rawActivities.length + ")";
    }


    function _generateDescriptions() {
      if (this._rawActivities.length === 0 || this._rawActivities[this._rawActivities.length - 1] === undefined) {
        return;
      }

      this.occurredAt = this._rawActivities[this._rawActivities.length - 1].updated_at;
      var activity = this._rawActivities[this._rawActivities.length - 1];

      var message = gettext("unknown");

      // is this just single status message
      if (this._rawActivities.length === 1 && activity.data.MsgID === fobMessageTypeConst.STATUS) {
        this.isPending = false;

        if (KornerStateHelpers.isFobStateArmed(activity.data.Payload.State)) {
          message = gettext("System Armed");
          this.imageUrl = 'app/img/activity_armed.png';
        } else if (KornerStateHelpers.isFobStateDisarmed(activity.data.Payload.State)) {
          message = gettext("System Disarmed");
          this.imageUrl = 'app/img/activity_disarmed.png';
        } else if (KornerStateHelpers.isFobStateTriggeredSilent(activity.data.Payload.State)) {
          message = gettext("System Silenced");
          this.imageUrl = 'app/img/status_missing.png';
        } else if (KornerStateHelpers.isFobStateTriggered(activity.data.Payload.State)) {
          message = gettext("Intrusion Detected");
          this.imageUrl = 'app/img/status_missing.png';
        } else if (KornerStateHelpers.isFobStateArmPending(activity.data.Payload.State)) {
          message = gettext("System is Arming...");
          this.imageUrl = 'app/img/activity_armed.png';

        }
      }


      // Is the person planning to arm the system?
      else if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.ARM_FOB) {

        message = gettext("System is Arming");
        this.imageUrl = 'app/img/activity_armed.png';

        // is the system pending?
        if (activity.data.MsgID === fobMessageTypeConst.STATUS && KornerStateHelpers.isFobStateArmPending(activity.data.Payload.State)) {
          message = gettext("System is Arming");
          this.imageUrl = 'app/img/activity_armed.png';

        }

        // is the user now trying to disarm?
        if (activity.data.MsgID === fobCmdMessageConst.DISARM_FOB) {
          message = gettext("System is Disarming");
          this.imageUrl = 'app/img/activity_disarmed.png';

        }

        // has the system armed?
        if (activity.data.MsgID === fobMessageTypeConst.STATUS && KornerStateHelpers.isFobStateArmed(activity.data.Payload.State)) {
          message = gettext("System was Armed");
          this.imageUrl = 'app/img/activity_armed.png';
          this.isPending = false;
          this._setUserImageUrl();
        }

        // has the system disarmed?
        if (activity.data.MsgID === fobMessageTypeConst.STATUS && KornerStateHelpers.isFobStateDisarmed(activity.data.Payload.State)) {
          message = gettext("Arming was Cancelled");
          this.imageUrl = 'app/img/status_issue.png';
          this.isPending = false;
          this._setUserImageUrl();
        }
      }

      // Is the person planning to disarm the system?
      else if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.DISARM_FOB) {
        message = gettext("System is Disarming");
        this.imageUrl = 'app/img/activity_disarmed.png';
        // has the system disarmed?
        if (activity.data.MsgID === fobMessageTypeConst.STATUS && KornerStateHelpers.isFobStateDisarmed(activity.data.Payload.State)) {
          message = gettext("System was Disarmed");
          this.imageUrl = 'app/img/activity_disarmed.png';
          this.isPending = false;
          this._setUserImageUrl();
        }
      }

      // Is the person planning to silence the system?
      else if (this._rawActivities[0].data.MsgID === fobCmdMessageConst.SILENCE_FOB) {
        message = gettext("System is Silencing");
        this.imageUrl = 'app/img/activity_armed.png';
        // has the system silenced?
        if (activity.data.MsgID === fobMessageTypeConst.STATUS && KornerStateHelpers.isFobStateTriggeredSilent(activity.data.Payload.State)) {
          message = gettext("System was Silenced");
          this.imageUrl = 'app/img/activity_armed.png';
          this.isPending = false;
          this._setUserImageUrl();
        }

      }



      if (this.userName !== undefined) {
        this.description = message + gettext(" by ") + this.userName;
      } else {
        this.description = message;
      }
    }

    function _getFobUserInfo() {

      var fobUser = this.fob.users.getFobUserByID(this._rawActivities[0].src_id);
      if (fobUser !== undefined) {
        this.fobUserImageUrl = fobUser.imageUrl;
        this.userName = fobUser.chatName();
      }
    }

    function _setUserImageUrl() {
      if (this.fobUserImageUrl !== undefined) {
        this.imageUrl = this.fobUserImageUrl;
      }
    }

    function isReportable(activity) {

      if ((activity.data.MsgID === fobCmdMessageConst.ARM_FOB || activity.data.MsgID === fobCmdMessageConst.DISARM_FOB ||
          activity.data.MsgID === fobCmdMessageConst.SILENCE_FOB)) {

        return true;
      }

      if (activity.data.MsgID === fobMessageTypeConst.STATUS && (
          KornerStateHelpers.isFobStateTriggeredSilent(activity.data.Payload.State) ||
          KornerStateHelpers.isFobStateTriggered(activity.data.Payload.State)
        )) {
        return true;
      }

      // add support to show automatic arm and disarm messages
      if (activity.data.MsgID === fobMessageTypeConst.STATUS&& (
          KornerStateHelpers.isFobStateArmed(activity.data.Payload.State) ||
          KornerStateHelpers.isFobStateDisarmed(activity.data.Payload.State) ||
          KornerStateHelpers.isFobStateArmPending(activity.data.Payload.State)

        )) {

        return true;
      }

      if (this._rawActivities.length > 0 && this._hasUserSecurityEvent()) {
        return true;
      }

      // if (this._rawActivities.length > 0 && this._hasUserSecurityEvent() && (
      //     KornerStateHelpers.isFobStateArmed(activity.data.Payload.State) ||
      //     KornerStateHelpers.isFobStateDisarmed(activity.data.Payload.State) ||
      //     KornerStateHelpers.isFobStateArmPending(activity.data.Payload.State)
      //   )) {
      //   return true;
      // }

      return false;
    }

    function _hasUserSecurityEvent() {
      for (var item = 0; item < this._rawActivities.length; item++) {
        if (this._rawActivities[item].data.MsgID === fobCmdMessageConst.ARM_FOB || this._rawActivities[item].data.MsgID === fobCmdMessageConst.DISARM_FOB ||
          this._rawActivities[item].data.MsgID === fobCmdMessageConst.SILENCE_FOB) {
          return true;
        }
      }
      return false;
    }

    function _isEqualToKnownState(state) {

      var knownState = 0;

      for (var item = 0; item < this._rawActivities.length; item++) {
        if (this._rawActivities[item].data.MsgID === fobMessageTypeConst.STATUS) {
          knownState = this._rawActivities[item].data.Payload.State;
        }
      }
      console.log("isEqual:" + state + "===" + knownState);
      return (state === knownState);
    }

  }



})();
