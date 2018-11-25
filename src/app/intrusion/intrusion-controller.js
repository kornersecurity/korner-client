(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.intrusion')
    .controller('intrusionController', intrusionController);

  /* @ngInject */
  function intrusionController(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $mdDialog,
    $mdBottomSheet,
    $ionicModal,
    $ionicListDelegate,
    FobService2,
    FobCollection,
    serverMessageConst,
    KornerUIHelpers,
    $log,
    clientUpdateEventConst,
    KornerStateHelpers
  ) {
    var eventHandlerRemovers = [];
    $scope.fob = FobService2.fob;

    eventHandlerRemovers.push($rootScope.$on(clientUpdateEventConst.FOB_STATE_CHANGE, onFobStateChange));
    eventHandlerRemovers.push($rootScope.$on(clientUpdateEventConst.INTRUSION_CHAT_REFRESH_REQUIRED, onIntrusionChatRefreshRequired));
    $scope.$on('$destroy', destroyController);

    function onFobStateChange(event, fobId, state) {
      // if disarmed go back to homedashboard
      if (KornerStateHelpers.isFobStateDisarmed(state)) {
        if (FobService2.fob.fob_id === fobId) {
          FobCollection.setActiveFobWithID(FobService2.fob.fob_id);
          $rootScope.fobUser = FobService2.fobUser;
          // $scope.goToHomeDashboard();
          $state.go('app.home.tabs.dashboard', {}, {});
        } else {
          $state.go('app.home.select', {}, {});
        }

      }
    }


    function onIntrusionChatRefreshRequired(event, fobID, refreshAll) {
      if (FobService2.fob.fob_id === fobID) {
        if (refreshAll) {
          FobService2.fob.intrusion.messages.refreshAllMessages();
        } else {
          FobService2.fob.intrusion.messages.refreshMessages();
        }
      }
    }


    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[intrusionController] DESTROYING');
    }


    // delay until the screen is shown
    setTimeout(function() {
      $scope.refreshActivities();
      $scope.refreshMessages();
    }, 1000);

    $scope.refreshMessages = function() {
      if (!$scope.checkingForUpdates) {
        $scope.checkingForUpdates = true;

        FobService2.fob.intrusion.messages.enableRefresh();
        FobService2.fob.intrusion.messages.refreshMessages()
          .then(function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.checkingForUpdates = false;
          }, function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.checkingForUpdates = false;
          });
      }
    };

    $scope.refreshActivities = function() {
      FobService2.fob.activities.enableRefresh();
      FobService2.fob.activities.refreshActivities()
        .then(function() {
          $scope.checkingForUpdates = false;
        }, function() {
          $scope.checkingForUpdates = false;
        });
    };


    $scope.intrusionActivityCount = function() {
      var count = 0;
      for (var index in $scope.fob.activities.activities) {
        if ($scope.fob.activities.activities[index].occurredAt >= $scope.fob.intrusion.start_time) {
          count++;
        }
      }
      return count;
    };

    $scope.intrusionActivityFilter = function(activity) {
      return activity.occurredAt >= $scope.fob.intrusion.start_time;
    };


    $scope.silence = function() {
      FobService2.silence();
    };

    $scope.armDisarmCancelAlert = function(fob) {
      FobService2.disarm();
      // $scope.goToHomeDashboard();
      // $state.go('app.home.tabs.dashboard', {}, {});
      $state.go('app.startup.splash', {}, {});
    };



    $scope.showQuickActions = function($event) {
      $mdBottomSheet.show({
        templateUrl: 'app/views/intrusion-action-sheet.html',
        controller: 'intrusionController',
        targetEvent: $event
      }).then(function(clickedItem) {
        if (clickedItem.name === "Notify Circle") {
          $scope.showNotifyCircle();
        } else if (clickedItem.name == "Post Message") {
          $scope.showPostMessage();
        } else {
          $scope.postImmediateMessage(clickedItem.name);
        }
      });
    };


    $scope.showNotifyCircle = function() {
      // $ionicModal.fromTemplateUrl('app/views/notify-circle.html', {
      //     scope: $scope,
      //     animation: 'slide-in-up',
      //   })
      //   .then(function(modal) {
      //     $scope.modal = modal;
      //     modal.show();
      //   });
      $mdDialog.show({
          templateUrl: 'app/views/notify-circle.html',
          targetEvent: document.body
        })
        .then(function() {}, function() {});
    };


    $scope.callPolice = function() {
      var tel = $scope.fob.client_data.police_phone_number;
      window.open('tel:'+tel, '_system');
    };


    $scope.showPostMessage = function() {
      showMessagePopup("new");
    };

    $scope.postImmediateMessage = function(messageText) {
      postMessage(messageText);
    };


    $scope.onEditMessage = function(message) {
      $ionicListDelegate.closeOptionButtons();
      showMessagePopup("edit", message);
    };

    $scope.onDeleteMessage = function(message) {
      $ionicListDelegate.closeOptionButtons();
      showMessagePopup("delete", message);
    };


    function showMessagePopup(action, message) {
      $mdDialog.show({
          controller: 'editMessageController',
          templateUrl: 'app/views/edit-message-popup.html',
          targetEvent: document.body,
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
      $scope.fob.intrusion.messages.postMessage(newMessage);
      // .then(function() {
      //   $scope.$apply();
      // });
    }

    function updateMessage(message, messageText) {
      message.message = messageText;
      $scope.fob.intrusion.messages.updateMessage(message);
      // .then(function() {
      //   $scope.$apply();
      // });
    }

    function deleteMessage(message) {
      $scope.fob.intrusion.messages.deleteMessageByID(message.fob_intrusion_message_id);
      //  .then(function() {
      //   $scope.$apply();
      // });
    }


    function buildActionItemsForUser(isOwner) {
      var actionItems = [];
      if (isOwner) {
        actionItems.push({
          name: "Notify Circle",
          icon: "app/img/ic_people_black_24px.svg",
          action: $scope.showNotifyCircle,
        });
      }

      actionItems.push({
        name: "Post Message",
        icon: "app/img/ic_mode_edit_black_24px.svg",
        action: $scope.showPostMessage,
      });

      if (!isOwner) {
        actionItems.push({
          name: "Can't Help",
          icon: "app/img/ic_thumb_down_black_24px.svg",
          action: $scope.postImmediateMessage,
        });

        actionItems.push({
          name: "Responding",
          icon: "app/img/ic_thumb_up_black_24px.svg",
          action: $scope.postImmediateMessage,
        });
      }

      return actionItems;
    }

    $scope.actionItems = buildActionItemsForUser(FobService2.fob.fobUser.isOwner());


    $scope.listItemClick = function($index) {
      var clickedItem = $scope.actionItems[$index];
      $mdBottomSheet.hide(clickedItem);
    };


  }
})();
