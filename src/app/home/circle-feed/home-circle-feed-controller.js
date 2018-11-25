(function() {
  'use strict';


  angular.module('app.circlefeed')
    .controller('home.circle.feed.controller', homeCircleFeedController);

  /* @ngInject */
  function homeCircleFeedController(
    $rootScope,
    $scope,
    $mdDialog,
    $ionicListDelegate,
    FobService2,
    $log
  ) {

    $scope.fob = FobService2.fob;
    $scope.newMessage = '';

    $scope.home.showChatMessageButton = true;
    $scope.home.onNewMessage = onNewMessage;

    $scope.checkingForUpdates = true;

    // delay until the screen is shown
    setTimeout(function() {
      $scope.checkingForUpdates = false;
      $scope.refreshMessages();
    }, 1000);

    // // refresh messages every x minutes
    // setInterval(function() {
    //   $scope.refreshMessages();
    // }, 1 * 60 * 1000);


    $scope.refreshMessages = function() {
      if (!$scope.checkingForUpdates) {
        $scope.checkingForUpdates = true;

        FobService2.fob.messages.enableRefresh();
        FobService2.fob.messages.refreshMessages()
          .then(function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.checkingForUpdates = false;
          }, function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.checkingForUpdates = false;
          });
      }
    };


    function onNewMessage(targetEvent) {
      showMessagePopup(targetEvent, "new");
    }

    $scope.onEditMessage = function(message) {
      $ionicListDelegate.closeOptionButtons();
      showMessagePopup(document.body, "edit", message);
    };

    $scope.onDeleteMessage = function(message) {
      $ionicListDelegate.closeOptionButtons();
      showMessagePopup(document.body, "delete", message);
    };


    function showMessagePopup(targetEvent, action, message) {
      $mdDialog.show({
          controller: 'editMessageController',
          templateUrl: 'app/views/edit-message-popup.html',
          targetEvent: targetEvent,
          locals: {
            action: action,
            message: message
          }
        })
        .then(function(response) {

          switch (action) {
            case "new":
              postMessage(response.messageText);
              break;
            case "edit":
              updateMessage(response.message, response.messageText);
              break;
            case "delete":
              deleteMessage(response.message);
              break;
          }
        }, function() {});
    }

    function postMessage(newMessage) {
      $log.debug('[home-circle-feed-controller] POSTING MESSAGE');
      $scope.disableInput = true;
      $scope.checkingForUpdates = true;
      FobService2.fob.messages.postMessage(newMessage)
        .then(function() {
          $scope.checkingForUpdates = false;
          $scope.disableInput = false;
          // $scope.$apply();
        });
    }

    function updateMessage(message, messageText) {
      $log.debug('[home-circle-feed-controller] UPDATING MESSAGE');
      message.message = messageText;
      FobService2.fob.messages.updateMessage(message);
        // .then(function() {
        //   $scope.$apply();
        // });
    }

    function deleteMessage(message) {
      $log.debug('[home-circle-feed-controller] DELETING MESSAGE');
      FobService2.fob.messages.deleteMessageByID(message.fob_message_id);
      // .then(function() {
      //   $scope.$apply();
      // });
    }


  }
})();
