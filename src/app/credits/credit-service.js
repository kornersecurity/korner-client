//
// notice-service.js
//
(function() {
  'use strict';

  angular.module('app.credits')
  .service('creditsService', [
    'Restangular',
    '$log',
  function(
    Restangular,
    $log
  ) {

    var credits = [];
    var activities = [];

    function resetServiceData() {
      $log.debug("[notice-service] DATA RESET");
      credits = [];
      activities = [];
    }


    function getCredits(success) {

      // if (!notices) {
        $log.debug('[credits-service] QUERY: credits ');
        Restangular.one('account/credits/balance').get().then(function(theCredits) {
          credits = theCredits.plain();
          $log.debug('[credits-service] CACHE: credits '+credits);
          for(var n in credits){
            console.log("CREDITS: "+credits[n]);
          }
          success(credits);
        });
    }

    function getActivity(success){
        $log.debug('[credits-service] QUERY: Activity ');
        Restangular.one('account/credits/activity').get().then(function(theActivity) {
          activities = theActivity.plain();
          $log.debug('[credits-service] CACHE: activity '+activities);
          for(var n in activities){
            console.log("ACTIVITY: "+activities[n]);
          }
          success(activities);
        });
    }

    return {
      getCredits:       getCredits,
      getActivity:      getActivity, 
      resetServiceData: resetServiceData

    };

  }
  ]);
})();
