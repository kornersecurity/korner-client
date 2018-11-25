(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.component')
    .directive('ksExtenderListItem', function() {
      return {
        restrict: 'E',
        scope: {
          extender: '='
        },
        templateUrl: 'app/views/extender-list-item-widget.html',
        controller: ksExtenderListItemWidget
      };
    })
    .controller('ksExtenderListItemWidget', ksExtenderListItemWidget);


  /* @ngInject */
  function ksExtenderListItemWidget($scope, $rootScope, clientUpdateEventConst, $log) {
    var eventHandlerRemovers = [];

    $scope.$on('$destroy', destroyController);
    eventHandlerRemovers.push($rootScope.$on(clientUpdateEventConst.UI_REFRESH_REQUIRED,onUiRefreshRequired));

    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[extender-list-item-widget] DESTROYING');
    }

    function onUiRefreshRequired(){
    //   if ($scope.$$phase) {
    //     $scope.$apply(function() {
    //       $log.debug('APPLYING ON PHASE - TAG STATE: '  + $scope.tag.tag_state);
    //     });
    //   } else {
    //     $log.debug('APPLYING OUT OF PHASE - TAG STATE: '  + $scope.tag.tag_state);
    //   }
    }

    $scope.extenderStateImage = function() {
      if ($scope.extender.hasIssue) {
        return 'app/img/status_issue.png';
      }

      if ($scope.extender.isMissing) {
        return 'app/img/status_missing.png';
      }

      return "app/img/status_healthy.png";
    };

  }


})();
