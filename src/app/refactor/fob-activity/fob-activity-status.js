(function() {
  'use strict';


  /*jshint validthis: true */




  angular
    .module('app.core')
    .factory('FobActivityStatus', fobActivityStatus);

  /* @ngInject */
  function fobActivityStatus($log, gettext, FobActivityBase, fobActivityTransactionTypeConst,
    fobMessageTypeConst, KornerStateHelpers) {

    // [fob icon] Connected  [time]
    // [warning icon] Disconnected [...]  [time]
    // [alert icon] Missing  [time]


    function FobActivityStatus(fob) {
      angular.extend(this, new FobActivityBase($log));
      this.fob = fob;
      this.activityType = fobActivityTransactionTypeConst.status;
    }

    // this implementation
    FobActivityStatus.prototype.isActivityAppendable = isActivityAppendable;
    FobActivityStatus.prototype._generateDescriptions = _generateDescriptions;
    FobActivityStatus.prototype.isReportable = isReportable;
    FobActivityStatus.prototype._hasHadMissingEvents = _hasHadMissingEvents;

    // base class prototype
    FobActivityStatus.prototype.onFinalize = FobActivityBase.prototype.onFinalize;
    FobActivityStatus.prototype.appendActivity = FobActivityBase.prototype.appendActivity;
    FobActivityStatus.prototype.hasContent = FobActivityBase.prototype.hasContent;



    return FobActivityStatus;


    function isActivityAppendable(activity) {
      // nothing so far, so sure its appendable
      if (this._rawActivities.length === 0) {
        return true;
      }



      if (activity.data.MsgID === fobMessageTypeConst.STATUS) {
        if (KornerStateHelpers.isFobStateConnected(activity.data.Payload.State)) {
          if (this._hasHadMissingEvents()) {
            return false;
          } else {
            return true;
          }
        }
      }
      return false;
    }


    // private functions

    function _generateDescriptions() {
      if (this._rawActivities.length === 0 || this._rawActivities[this._rawActivities.length - 1] === undefined) {
        return;
      }


      // TODO: update state & values
      this.occurredAt = this._rawActivities[this._rawActivities.length - 1].updated_at;

      this.description = this._rawActivities[0].description + "(" + this._rawActivities.length + ")";

      if (this._rawActivities[0].data.MsgID === fobMessageTypeConst.STATUS) {
        var currentState = this._rawActivities[this._rawActivities.length - 1].data.Payload.State;

        if (KornerStateHelpers.isFobStateDisconnected(currentState)) {
          this.description = "System has " + gettext("Disconnected");
          this.imageUrl = "app/img/status_issue.png";
          this.isPending = true;
        } else if (KornerStateHelpers.isFobStateMissing(currentState)) {
          this.description = "System is " + gettext("Missing");
          this.imageUrl = "app/img/status_missing.png";
          this.isPending = false;
        } else if (KornerStateHelpers.isFobStateConnected(currentState)) {
          this.description = "System has " + gettext("Connected");
          this.imageUrl = "app/img/activity_fob.png";
          this.isPending = false;
        }
      }
    }

    function isReportable(activity) {


      if (activity.data.MsgID === fobMessageTypeConst.STATUS) {
        if (KornerStateHelpers.isFobStateDisconnected(activity.data.Payload.State)) {
          return false;
        }

        if (KornerStateHelpers.isFobStateConnected(activity.data.Payload.State) && !this._hasHadMissingEvents()) {
          return false;
        }
      }

      return true;
    }

    function _hasHadMissingEvents() {
      for (var item = 0; item < this._rawActivities.length; item++) {
        if (KornerStateHelpers.isFobStateMissing(this._rawActivities[item].data.Payload.State)) {
          return true;
        }
      }
      return false;
    }

  }


})();
