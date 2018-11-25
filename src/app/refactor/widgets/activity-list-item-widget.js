(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.component')
    .directive('ksActivityListItem', function() {
      return {
        restrict: 'E',
        scope: {
          activity: '='
        },
        templateUrl: 'app/views/activity-list-item-widget.html',
        controller: ksActivityListItemWidget
      };
    })
    .controller('ksActivityListItemWidget', ksActivityListItemWidget);


  /* @ngInject */
  function ksActivityListItemWidget($scope, FobService2, fobActivityTransactionTypeConst) {



  }

})();
