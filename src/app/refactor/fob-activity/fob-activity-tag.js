(function() {
  'use strict';


  /*jshint validthis: true */

  var EXPIRED_TAG_MESSAGE_IN_SECONDS = 8;

  angular
    .module('app.core')
    .factory('FobActivityTag', fobActivityTag);

  /* @ngInject */
  function fobActivityTag($log, gettext, FobActivityBase, fobActivityTransactionTypeConst, core,
    KornerStateHelpers, KornerMsgHelpers, tagStateConst, fobMessageTypeConst) {

    // [tag image] [Tag Name + Type] Event(s) [event count]   [time]
    // [tag image] [Tag Name + Type] [issue]  [time]
    // [tag image] [Tag Name + Type] healthy  [time]



    function FobActivityTag(fob) {
      angular.extend(this, new FobActivityBase($log));
      this.fob = fob;
      this.activityType = fobActivityTransactionTypeConst.tag;
    }

    // this implementation
    FobActivityTag.prototype.isActivityAppendable = isActivityAppendable;
    FobActivityTag.prototype.appendActivity = appendActivity;
    FobActivityTag.prototype._generateDescriptions = _generateDescriptions;
    FobActivityTag.prototype.isReportable = isReportable;
    FobActivityTag.prototype._hasHadMovementEvents = _hasHadMovementEvents;

    // base class prototype
    FobActivityTag.prototype.onFinalize = FobActivityBase.prototype.onFinalize;
    FobActivityTag.prototype.hasContent = FobActivityBase.prototype.hasContent;



    return FobActivityTag;

    function isActivityAppendable(activity) {
      // nothing so far, so sure its appendable
      if (this._rawActivities.length === 0) {
        // console.log("isActivityAppendable:1:true:" + activity.data.Payload.State);
        return true;
      }

      // is this movement and are we within 60 seconds?
      if ((core.stringToEpoch(activity.updated_at) - this.startEpoch) > 60 &&
        KornerStateHelpers.isTagsMovementStateIdentical(activity.data.Payload.State,
          this._rawActivities[0].data.Payload.State) &&
        KornerStateHelpers.isTagStateMoving(activity.data.Payload.State)) {
        // console.log("isActivityAppendable:2:false:" + activity.data.Payload.State);
        return false;
      }


      // user-visible state hasn't changed since the last activity, so it's appendable
      if (KornerStateHelpers.userRelevantTagState(activity.data.Payload.State) ===
        KornerStateHelpers.userRelevantTagState(
          this._rawActivities[this._rawActivities.length - 1].data.Payload.State)) {
        // console.log("isActivityAppendable:3:true:" + activity.data.Payload.State);

        return true;
      }

      // is this an unhealthy event - create new transaction?
      if (!KornerStateHelpers.isTagStateHealthy(activity.data.Payload.State)) {
        // console.log("isActivityAppendable:4:false:" + activity.data.Payload.State);
        return false;
      }


      // it's boring and we're still - create new
      if (KornerStateHelpers.userRelevantTagState(activity.data.Payload.State) === 0 &&
        KornerStateHelpers.isTagStateStill(this._rawActivities[0].data.Payload.State)) {
        // console.log("isActivityAppendable:7:false:" + activity.data.Payload.State);
        return false;
      }

      // it's boring (the idle, happy state), so it's appendable
      if (KornerStateHelpers.userRelevantTagState(activity.data.Payload.State) === 0) {
        // console.log("isActivityAppendable:5:true:" + activity.data.Payload.State);
        return true;
      }





      // console.log("isActivityAppendable:6:false:" + activity.data.Payload.State);
      return false;
    }

    function appendActivity(activity) {
      if (this.isReportable(activity)) {

        this._rawActivities.push(activity);

        if (this._rawActivities.length === 1) {
          this.startEpoch = core.stringToEpoch(this._rawActivities[0].updated_at);
        }
        this.eventCount++;

        this._generateDescriptions();
      }
    }


    // private functions

    function _generateDescriptions() {

      if (this._rawActivities.length === 0 || this._rawActivities[this._rawActivities.length - 1] === undefined) {
        return;
      }

      // TODO: update state & values
      this.occurredAt = this._rawActivities[this._rawActivities.length - 1].updated_at;

      var tag = this.fob.tags.tags[this._rawActivities[0].data.Payload.DeviceID];
      if (tag !== undefined) {
        this.tagName = tag.tagFullName;
      }
      this.imageUrl = 'app/img/activity_tag.png';

      this.description = this.tagName;
      this.infoDescription = "";
      this.issueDescription = "";

      // was there movement
      if (this._hasHadMovementEvents()) {
        this.description += " " + gettext("Activity");
      }

      // do we currently have an issue
      if (!KornerStateHelpers.isTagStateHealthy(this._rawActivities[this._rawActivities.length - 1].data.Payload.State)) {
        this.issueDescription = KornerMsgHelpers.getTagStateIssueDescriptions(this._rawActivities[this._rawActivities.length - 1].data.Payload.State);
      }
    }

    function _hasHadMovementEvents() {
      for (var item = 0; item < this._rawActivities.length; item++) {
        if (KornerStateHelpers.isTagStateOpenMoving(this._rawActivities[item].data.Payload.State)) {
          return true;
        }
      }
      return false;
    }

    function isReportable(activity) {
      // console.log(this._rawActivities);
      // New state has nothing interesting going on
      if (KornerStateHelpers.userRelevantTagState(activity.data.Payload.State) === 0) {
        // console.log("isReportable:1:false:" + activity.data.Payload.State);
        return false;
      }

      // check if this is a new extended tag message with a delay - if the delay is beyond
      // 8 seconds we don't care for this release.
      // TODO - NICK is this all the handling we need to-do?
      if (activity.data.MsgID ===fobMessageTypeConst.TAG_EXT_STATUS && activity.data.Payload.Delay >= EXPIRED_TAG_MESSAGE_IN_SECONDS) {
        return false;
      }

      // we have activity and previous and current activity are the same - not reportable
      // else if ((this._rawActivities.length) > 0 && KornerStateHelpers.userRelevantTagState(activity.data.Payload.State) ===
      //   KornerStateHelpers.userRelevantTagState(
      //     this._rawActivities[this._rawActivities.length - 1].data.Payload.State)) {
      //   // console.log("isReportable:2:false:" + activity.data.Payload.State);
      //
      //   return false;
      // }
      // console.log("isReportable:3:true:" + activity.data.Payload.State);
      return true;
    }
  }


})();
