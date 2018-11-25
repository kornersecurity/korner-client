(function() {
  'use strict';


  /*jshint validthis: true */


  angular
    .module('app.core')
    .factory('FobActivitySetup', fobActivitySetup);

  /* @ngInject */
  function fobActivitySetup($log, gettext, FobActivityBase, fobActivityTransactionTypeConst,
    fobCmdMessageConst, fobMessageTypeConst, KornerStateHelpers, serverMessageConst, core) {



    function FobActivitySetup(fob) {
      angular.extend(this, new FobActivityBase($log));
      this.fob = fob;
      this.activityType = fobActivityTransactionTypeConst.security;
      this.isPending = true;
    }

    FobActivitySetup.prototype.isActivityAppendable = isActivityAppendable;
    FobActivitySetup.prototype._generateDescriptions = _generateDescriptions;
    FobActivitySetup.prototype._isCapturing = _isCapturing;
    FobActivitySetup.prototype.isReportable = isReportable;


    // base class prototype
    FobActivitySetup.prototype.onFinalize = onFinalize;
    FobActivitySetup.prototype.appendActivity = appendActivity;
    FobActivitySetup.prototype.hasContent = FobActivityBase.prototype.hasContent;



    return FobActivitySetup;


    function isActivityAppendable(activity) {
      // are we capturing
      if (this.isPending) {

        // is this the stop?
        if (activity.data.ServerMsgID === serverMessageConst.TagSetupCompleted ||
          activity.data.ServerMsgID === serverMessageConst.TagSetupCancelled ||
          activity.data.ServerMsgID === serverMessageConst.ExtenderSetupCancelled ||
          activity.data.ServerMsgID === serverMessageConst.ExtenderSetupCompleted) {
          this.isPending = false;
        }

        return true;
      }

      return false;
    }

    // finalizer
    function onFinalize() {
      this.isPending = false;
      this._generateDescriptions();
      this._rawActivities = [];
    }


    function appendActivity(activity) {
      this._rawActivities.push(activity);

      if (this._rawActivities.length === 1) {
        this.startEpoch = core.stringToEpoch(activity.updated_at);
      }
      this._generateDescriptions();
    }



    function _generateDescriptions() {
      var currentEpoch = (new Date().valueOf()) / 1000;
      // time has expired since we created this setup (5 minutes) - can not append anymore
      if ((currentEpoch - this.startEpoch) > 300) {
        this.isPending = false;
      }

      if (this.isPending) {
        // $log.debug('CURRENT EPOCH: '+currentEpoch);
        // $log.debug('START EPOCH: '+this.startEpoch);
        // $log.debug('EPOCH DIF: '+(currentEpoch - this.startEpoch));
        this.description = "Korner Setup Starting...";
      } else {
        if (this._rawActivities[this._rawActivities.length - 1].data.ServerMsgID == serverMessageConst.TagSetupCompleted ||
          this._rawActivities[this._rawActivities.length - 1].data.ServerMsgID == serverMessageConst.ExtenderSetupCompleted) {
          this.description = "Korner Setup Complete";
        } else {
          this.description = "Korner Setup Cancelled";
        }

      }
      this.imageUrl = 'app/img/activity_korner.png';
      this.occurredAt = this._rawActivities[this._rawActivities.length - 1].updated_at;
    }

    function _isCapturing() {
      return this.isPending;
    }

    // function _getFobUserInfo() {
    //   var fobUser = this.fob.users.getFobUserByID(this._rawActivities[0].src_id);
    //   if (fobUser !== undefined) {
    //     this.imageUrl = fobUser.imageUrl;
    //     this.userName = fobUser.chatName();
    //   }
    // }
    function isReportable(state) {
      return true;
    }

  }



})();
