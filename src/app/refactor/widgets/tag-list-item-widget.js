(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.component')
    .directive('ksTagListItem', function() {
      return {
        restrict: 'E',
        scope: {
          tag: '='
        },
        templateUrl: 'app/views/tag-list-item-widget.html',
        controller: ksTagListItemWidget
      };
    })
    .controller('ksTagListItemWidget', ksTagListItemWidget);


  /* @ngInject */
  function ksTagListItemWidget($scope, $rootScope, clientUpdateEventConst, $log) {
    var eventHandlerRemovers = [];

    $scope.$on('$destroy', destroyController);
    eventHandlerRemovers.push($rootScope.$on(clientUpdateEventConst.UI_REFRESH_REQUIRED,onUiRefreshRequired));

    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[tag-list-item-widget] DESTROYING');
    }

    function onUiRefreshRequired(){
      if ($scope.$$phase) {
        $scope.$apply(function() {
          $log.debug('APPLYING ON PHASE - TAG STATE: '  + $scope.tag.tag_state);
        });
      } else {
        $log.debug('APPLYING OUT OF PHASE - TAG STATE: '  + $scope.tag.tag_state);
      }
    }

    $scope.tagStateImage = function() {
      if ($scope.tag.hasIssue) {
        return 'app/img/status_issue.png';
      }

      if ($scope.tag.isMissing) {
        return 'app/img/status_missing.png';
      }

      return "app/img/status_healthy.png";
    };

  }


})();
