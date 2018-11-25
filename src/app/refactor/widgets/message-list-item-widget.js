(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.component')
    .directive('ksMessageListItem', function() {
      return {
        restrict: 'E',
        scope: {
          message: '=',
          onEditMethod: '&',
          onDeleteMethod: '&'
        },
        templateUrl: 'app/views/message-list-item-widget.html',
        controller: ksMessageListItemWidget
      };
    })
    .controller('ksMessageListItemWidget', ksMessageListItemWidget);


  /* @ngInject */
  function ksMessageListItemWidget($scope, FobService2) {

    $scope.userImageUrl = FobService2.fob.users.getFobUserByID($scope.message.fob_user_id).imageUrl;

    $scope.userName = FobService2.fob.users.getFobUserByID($scope.message.fob_user_id).chatName();

    $scope.isMessageOwner =  FobService2.fobUser.fob_user_id === $scope.message.fob_user_id;

  }

})();
