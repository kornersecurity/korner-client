(function() {
  'use strict';

  /*jshint validthis: true */
  angular.module('app.component').directive('focus', focusMe);

  /* @ngInject */
  function focusMe($timeout) {
    console.log("FOCUSING INPUT");

    return {
      scope : { trigger : '@focus' },

      link : function(scope, element) {
        scope.$watch('trigger', function(value) {
          console.log("FOCUSING INPUT");
          if (value === "true") {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
      }
    };
  }
})();
