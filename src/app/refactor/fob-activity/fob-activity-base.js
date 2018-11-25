(function() {
  'use strict';


  /*jshint validthis: true */


  angular
    .module('app.core')
    .factory('FobActivityBase', fobActivityBase)

  .constant('fobActivityTransactionTypeConst', {
    unknown: 0,
    security: 1,
    status: 2,
    tag: 3,
  });

  /* @ngInject */
  function fobActivityBase($log, fobActivityTransactionTypeConst) {

    function FobActivityBase() {
      this.activityType = fobActivityTransactionTypeConst.unknown;
      this.occurredAt = undefined;
      this.imageUrl = "";
      this.description = "";
      this.issueDescription = "";
      this.infoDescription = "";
      this.isPending = false;

      this.eventCount = 0;

      this._rawActivities = [];
    }

    FobActivityBase.prototype = {
      onFinalize: onFinalize,
      appendActivity: appendActivity,
      hasContent: hasContent,

    };

    return FobActivityBase;


    // finalizer
    function onFinalize() {
      this._generateDescriptions();
      this.isPending = false;
      this._rawActivities = [];
    }

    function appendActivity(activity) {
      this._rawActivities.push(activity);
      this._generateDescriptions();
    }

    function hasContent() {
      return (this._rawActivities.length > 0);
    }

  }



})();
