(function() {
  'use strict';

  angular.module('app.circlefeed')
    .controller('editMessageController', editMessageController);

  /* @ngInject */
  function editMessageController($scope, $mdDialog, action, message) {

    switch (action) {
      case "new":
        $scope.prompt = "Please enter a new message.";
        $scope.readonly = false;
        $scope.button = "Post";
        $scope.messageText = "";
        break;

      case "edit":
        $scope.prompt = "Please update your message below.";
        $scope.button = "Update";
        $scope.readonly = false;
        $scope.message = message;
        $scope.messageText = message.message;
        break;

      case "delete":
        $scope.prompt = "Are you sure you want to remove this message?";
        $scope.button = "Remove";
        $scope.readonly = true;
        $scope.message = message;
        $scope.messageText = message.message;
        break;
    }



    $scope.cancel = function() {
      $mdDialog.hide();
    };

    $scope.post = function() {
      $mdDialog.hide({
        message: $scope.message,
        messageText: $scope.messageText
      });
    };
  }

})();
