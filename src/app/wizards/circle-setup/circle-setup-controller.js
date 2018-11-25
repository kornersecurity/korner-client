(function() {
  'use strict';

  angular.module('app.wizard.circle')
    .controller('circleSetupController', circleSetupController);

  /* @ngInject */
  function circleSetupController(
    $scope,
    $state,
    $ionicModal,
    FobService2,
    fobUserStatusConst,
    $ionicScrollDelegate,
    $ionicListDelegate,
    contentCircleSetup,
    $ionicPopup,
    uiLoadingService,
    $ionicActionSheet,
    wizardType,
    $log
  ) {
    $scope.wizard.circleSetup = {};

    function nextPage() {
      $log.debug('[circleSetupController] SHOW NEXT PAGE');

      if ($scope.wizard.wizardManagerData.currentWizard.currentPage === 1) {
        if ($scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
          if ($scope.wizard.circleSetup.users.length > 1) {
            $scope.wizard.wizardManagerData.setWizardCompleted(
              $scope.wizard.wizardManagerData.currentWizard.type, true);

            $scope.wizard.skipWizard();
          } else {
            showSkipPopup();
          }
        } else {
          $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
          $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
          $scope.wizard.changeState();
        }
        // $scope.wizard.wizardManagerData.currentWizard.currentPage++;
      } else if ($scope.wizard.wizardManagerData.currentWizard.currentPage === 2 && $scope.wizard.circleSetup.countNewUsers() === 0 &&
        $scope.wizard.wizardManagerData.wizardType === wizardType.WELCOME) {
        showSkipPopup();
      } else if ($scope.wizard.wizardManagerData.currentWizard.currentPage === 3 && $scope.wizard.circleSetup.countNewUsers() > 0) {
        var uninvitedUsersPopup = $ionicPopup.confirm({
          title: contentCircleSetup.SKIP_INVITES_TITLE,
          template: contentCircleSetup.SKIP_INVITES_MESSAGE,
          cancelText: contentCircleSetup.NO,
          okText: contentCircleSetup.YES
        });

        uninvitedUsersPopup.then(function(res) {
          if (res) {
            $log.debug('You are sure');
            // $scope.wizard.wizardManagerData.setCurrentWizardPage(4);
            // $scope.wizard.changeState();
            // $scope.wizard.goToNextPage();
            $scope.wizard.wizardManagerData.setWizardCompleted(
              $scope.wizard.wizardManagerData.currentWizard.type, true);
            $scope.wizard.skipWizard();
          } else {
            $log.debug('You are not sure');
          }
        });
      } else {
        if ($scope.wizard.wizardManagerData.currentWizard.currentPage < 4) {
          //   $scope.CurrentPage = 4;
          // }
          // else
          // {
          //   $scope.currentPage++;
          $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
        }
        $scope.wizard.changeState();
      }
    }

    function showSkipPopup() {
      var confirmClosePopup = $ionicPopup.confirm({
        title: contentCircleSetup.SKIP_WIZARD_TITLE,
        template: contentCircleSetup.SKIP_WIZARD_MESSAGE,
        cancelText: contentCircleSetup.NO,
        okText: contentCircleSetup.YES
      });

      confirmClosePopup.then(function(res) {
        if (res) {
          $scope.wizard.wizardManagerData.setWizardCompleted(
            $scope.wizard.wizardManagerData.currentWizard.type, true);

          $scope.wizard.skipWizard();
        } else {
          // $log.debug('You are not sure');
        }
      });
    }

    function previousPage() {
      $log.debug('[circle-setup-controller] SHOW PREVIOUS PAGE - CURRENT PAGE: ' + $scope.wizard.wizardManagerData
        .currentWizard.currentPage + " | USERS: " + $scope.wizard.circleSetup.users);
      if ($scope.wizard.wizardManagerData.currentWizard.currentPage === 3 && $scope.wizard.circleSetup.users.length > 1) {
        // $scope.wizard.wizardManagerData.currentWizard.currentPage++;
        $scope.wizard.wizardManagerData.decreaseCurrentWizardPage();
        $scope.wizard.wizardManagerData.decreaseCurrentWizardPage();
        $scope.wizard.changeState();
      } else if ($scope.wizard.wizardManagerData.currentWizard.currentPage === 4 && $scope.wizard.circleSetup.countNewUsers() === 0) {
        $scope.wizard.wizardManagerData.setCurrentWizardPage(2);
        $scope.wizard.changeState();
      } else {
        if ($scope.wizard.wizardManagerData.currentWizard.currentPage > 1) {
          //   $scope.CurrentPage = 1;
          // }
          // else
          // {
          // $scope.currentPage--;
          $scope.wizard.wizardManagerData.decreaseCurrentWizardPage();
        }
        $scope.wizard.changeState();
      }
      $log.debug('[circle-setup-controller] SHOW PREVIOUS PAGE - CURRENT PAGE: ' +
        $scope.wizard.wizardManagerData.currentWizard.currentPage,
        $scope.wizard.wizardManagerData.currentWizard.pages.length);
      $log.debug('[circle-setup-controller] CAN EXIT WIZARD: ' + $scope.wizard.canExitWizard);

    }

    $scope.toggleHelp = function() {
      $scope.$broadcast('toggleHelp');
    };

    $scope.getScrollHeight = function(height) {
      var scrollHeight = window.innerHeight - height;
      return scrollHeight + 'px';
    };

    // $scope.currentPage = function() {
    //   return getSlideBoxDelegate().currentIndex() + 1;
    // };

    // $scope.totalPages = function() {
    //   return getSlideBoxDelegate().slidesCount();
    // };

    // $scope.pageHasChanged = function(index) {
    //   $ionicScrollDelegate.scrollTop();
    // };

    $scope.userName = function(fobUserId) {
      return userService.getChatName(fobUserId);
    };

    // PHONE CONTACTS
    $scope.data = {
      selectedContacts: []
    };

    // MODAL STUFF
    $scope.dismiss = function() {
      $scope.$dismiss();
    };

    $scope.setState = function(templateName) {
      $scope.templateName = templateName;
    };

    $scope.save = function() {
      //						item.update().then(function() {
      //						  $scope.$close(true);
      //						});
    };

    $scope.hasUsersWithStatus = function(status) {
      if (status === fobUserStatusConst.STATUS_NEW) {
        for (var userIdx in $scope.wizard.circleSetup.users) {
          if ($scope.wizard.circleSetup.users[userIdx].fob_user_status_id === status) {
            return true;
          }
        }
        return false;
      }

      return $scope.wizard.circleSetup.fob.users.hasUsersWithStatus(status);
    };

    $scope.hasUsersWithStatuses = function(status1, status2) {
      // $log.debug("FINDING USERS WITH STATUS: "+status1, status2);
      return $scope.wizard.circleSetup.fob.users.hasUsersWithStatus(status1) || $scope.wizard.circleSetup.fob.users.hasUsersWithStatus(status2);
    };

    $scope.hasPendingInvites = function() {
      // $log.debug("[wizard-circle-setup-controller] FINDING PENDING INVITES: "+$scope.wizard.circleSetup.countPendingInvites());
      // return userService.hasUsersWithStatus(fobUserStatusConst.STATUS_INVITED) || userService.hasUsersWithStatus(fobUserStatusConst.STATUS_CREATED) || userService.hasUsersWithStatus(fobUserStatusConst.STATUS_NEW);
      return ($scope.wizard.circleSetup.countPendingInvites() > 0);
    };

    $scope.wizard.circleSetup.countPendingInvites = function() {
      var counter = $scope.wizard.circleSetup.fob.users.countUsersByStatus(fobUserStatusConst.STATUS_INVITED);
      counter += $scope.wizard.circleSetup.fob.users.countUsersByStatus(fobUserStatusConst.STATUS_CREATED);
      counter += $scope.wizard.circleSetup.countNewUsers();

      return counter;
    };

    $scope.wizard.circleSetup.countNewUsers = function() {
      var userCount = 0;
      for (var userIdx in $scope.wizard.circleSetup.users) {
        if ($scope.wizard.circleSetup.users[userIdx].fob_user_status_id === fobUserStatusConst.STATUS_NEW) {
          userCount++;
        }
      }

      return userCount;
    };

    $scope.wizard.circleSetup.reloadUsers = function() {
      uiLoadingService.show('', "wizardToast");
      $scope.wizard.circleSetup.fob.users.loadRefreshFobUsers().then(
        function() {
          setCircleData();
          uiLoadingService.hide();
        },
        function(err){
          $log.debug("[circleSetupController] ERROR RELOADING USERS");
          uiLoadingService.hide();
        }
      );
    };

    function setCircleData() {
      $scope.wizard.circleSetup.users = $scope.wizard.circleSetup.fob.users.getFobUsersArray(); //userService.getUsers();

      $scope.wizard.circleSetup.invitedUsersCount = $scope.wizard.circleSetup.countPendingInvites();
      $scope.wizard.circleSetup.activeUsersCount = $scope.wizard.circleSetup.fob.users.countUsersByStatus(fobUserStatusConst.STATUS_ACTIVE);
      $scope.wizard.circleSetup.declinedUsersCount = $scope.wizard.circleSetup.fob.users.countUsersByStatus(fobUserStatusConst.STATUS_DECLINED);
      $scope.wizard.circleSetup.newUsersCount = $scope.wizard.circleSetup.countNewUsers();
      $scope.wizard.circleSetup.hasNewUser = ($scope.wizard.circleSetup.newUsersCount > 0) ? true : false;
            
      //$log.debug("[I AM MAD MAN]");
      var continuePopUp = $ionicPopup.alert({
        title: "Korner Credit", 
        template: "You will get a $10 Credit towards any future Korner purchase or annual fee for every Security Circle invitee that makes a purchase"
      }); 
   

    }

    (function() {
      $scope.wizard.circleSetup.fob = FobService2.fob; // $log.debug('[fob-user-collection] USER IS OWNER: '+this.fobUsers[index].isOwner());


      $log.debug('[wizard-circle-setup-controller] ' + $scope.wizard.circleSetup.fob);

      // $log.debug('[wizard-circle-setup-controller] SELECTED FOB ID: '+$scope.wizard.circleSetup.fob.fob_id);

      setCircleData();
      $scope.currentPage = 1;
      $scope.totalPages = 4;

      $scope.$on('wizardEvent::showNextPage', nextPage);
      $scope.$on('wizardEvent::showPreviousPage', previousPage);

      $log.debug("[circleSetupController] USERS: " + $scope.wizard.circleSetup.users.length);
      if ($scope.wizard.circleSetup.users.length === 1) {
        $log.debug("[circleSetupController] NO MORE THAN 1 USERS: " + $scope.wizard.circleSetup.users.length);

        $scope.wizard.circleSetup.canGoBack = false;
        // $scope.wizard.wizardManagerData.increaseCurrentWizardPage();
        // nextPage();
        $scope.wizard.wizardManagerData.setCurrentWizardPage(2);
        $scope.wizard.changeState();
      } else {
        $scope.wizard.circleSetup.canGoBack = true;
      }



      // FROM P1 CONTROLLER

      $scope.showAddImportActionSheet = function() {

        var hideSheet = $ionicActionSheet.show({
          buttons: [{
            text: contentCircleSetup.IMPORT_CONTACT
          }, {
            text: contentCircleSetup.ADD_CONTACT
          }],
          titleText: contentCircleSetup.ACTIVITY_SHEET_TITLE,
          cancelText: contentCircleSetup.CANCEL,
          cancel: function() {
            // add cancel code..
          },
          buttonClicked: function(index) {
            // $log.debug("[circle-setup-p1-controller] BUTTON CLICKED: " + index);
            if (index === 0) {
              showImportContacts();
            }

            if (index === 1) {
              showAddContact();
            }

            return true;

          }
        });

      };

      $scope.showImportContacts = function() {
        uiLoadingService.show(contentCircleSetup.LOADING_CONTACTS, "wizardToast");

        $scope.wizard.modalTitle = 'Import Contacts';
        $scope.wizard.showModal = true;
        $scope.wizard.stateBeforeModal = $state.current;
        $state.go('wizard-manager.circle-setup.import-contacts', {}, {});
        // $ionicModal.fromTemplateUrl('app/views/import-contacts.html', {
        //     scope: $scope,
        //     animation: 'slide-in-up',
        //   })
        //   .then(function(modal) {
        //     // $log.debug("SHOWING IMPORT CONTACTS POPUP");
        //     $scope.modal = modal;
        //     modal.show();
        //   });
      };

      $scope.showAddContact = function(title, actionType) {
        $ionicListDelegate.closeOptionButtons();
        $scope.wizard.modalTitle = title + ' Contact';
        $scope.modalActionType = actionType;
        $scope.wizard.showModal = true;
        $scope.wizard.stateBeforeModal = $state.current;
        $state.go('wizard-manager.circle-setup.add-contacts', {}, {});
        $log.debug('[circle-setup-controller] CURRENT STATE: ' + $state.current);

        
        //   $ionicModal.fromTemplateUrl('app/views/add-contacts.html', {
        //       scope: $scope,
        //       animation: 'slide-in-up',
        //     })
        //     .then(function(modal) {
        //       $scope.modal = modal;
        //       modal.show();
        //
        //       $log.debug("SHOWING ADD CONTACTS POPUP");
        //
        //     });
      };

      // List
      $scope.editUser = function(user) {
        $log.debug('[circle-setup-controller] EDIT ITEM: ' + $scope.wizard.circleSetup.fob.fob_id, user.account_id);
        $scope.userToEdit = user;
        $scope.showAddContact('Edit', 'edit');
        // $scope.modalActionType = 'edit';
      };

      // List
      $scope.resendInvitation = function(user) {
        $log.debug('RESEND INVITATION: ' + user);

        uiLoadingService.show(contentCircleSetup.RESEND_INVITATION_TITLE, "wizardToast");


        user.resendInvitation().then(
          function() {
            uiLoadingService.showHideDelay(contentCircleSetup.INVITATION_RESENT_SUCCESS_TITLE, "wizardToast", true);
          },
          function(error) {
            uiLoadingService.showHideDelay(contentCircleSetup.INVITATION_RESENT_FAIL_TITLE, "wizardToast", false);
          }
        );
      };

      $scope.removeUser = function(user) {
        $log.debug("REMOVE USER: " + $scope.wizard.circleSetup.fob.fob_id, user.account_id);

        var confirmRemovePopup = $ionicPopup.confirm({
          title: contentCircleSetup.REMOVE_USER,
          template: contentCircleSetup.REMOVE_USER_QUESTION_1 + user.fullName() + contentCircleSetup.REMOVE_USER_QUESTION_2,
          cancelText: contentCircleSetup.NO,
          okText: contentCircleSetup.YES
        });

        confirmRemovePopup.then(function(res) {
          if (res) {
            $log.debug('You are sure');

            if (user.fob_user_status_id === fobUserStatusConst.STATUS_NEW) {

              $scope.wizard.circleSetup.users.splice($scope.wizard.circleSetup.users.indexOf(user), 1);

              $scope.wizard.circleSetup.hasNewUser = $scope.hasUsersWithStatus(fobUserStatusConst.STATUS_NEW);
              $scope.wizard.circleSetup.invitedUsersCount = $scope.wizard.circleSetup.countPendingInvites();
              $scope.wizard.circleSetup.activeUsersCount = $scope.wizard.circleSetup.fob.users.countUsersByStatus(fobUserStatusConst.STATUS_ACTIVE);
              $scope.wizard.circleSetup.declinedUsersCount = $scope.wizard.circleSetup.fob.users.countUsersByStatus(fobUserStatusConst.STATUS_DECLINED);
              $scope.wizard.circleSetup.newUsersCount = $scope.wizard.circleSetup.countNewUsers();

              if ($scope.wizard.wizardManagerData.wizardType !== wizardType.WELCOME && !$scope.wizard.circleSetup.hasNewUser) {
                $scope.wizard.disableNextButton();
              }
            } else {
              uiLoadingService.show(contentCircleSetup.REMOVING_USER, "wizardToast");

              $scope.wizard.circleSetup.fob.users.removeCircleMember(user).then(
                function() {
                  $scope.wizard.circleSetup.users = $scope.wizard.circleSetup.fob.users.getFobUsersArray();

                  $scope.wizard.circleSetup.hasNewUser = $scope.hasUsersWithStatus(fobUserStatusConst.STATUS_NEW);
                  $scope.wizard.circleSetup.invitedUsersCount = $scope.wizard.circleSetup.countPendingInvites();
                  $scope.wizard.circleSetup.activeUsersCount = $scope.wizard.circleSetup.fob.users.countUsersByStatus(fobUserStatusConst.STATUS_ACTIVE);
                  $scope.wizard.circleSetup.declinedUsersCount = $scope.wizard.circleSetup.fob.users.countUsersByStatus(fobUserStatusConst.STATUS_DECLINED);
                  $scope.wizard.circleSetup.newUsersCount = $scope.wizard.circleSetup.countNewUsers();

                  uiLoadingService.showHideDelay(contentCircleSetup.USER_REMOVED_SUCCESS, "wizardToast", true);
                },
                function(error) {
                  uiLoadingService.showHideDelay(contentCircleSetup.USER_REMOVED_FAIL, "wizardToast", false);
                }
              );
            }

          } else {
            $log.debug('You are not sure');
          }
        });
      };

      $scope.wizard.circleSetup.toggleGroup = function(group) {
        $log.debug("[circleSetupControllerPage1] TOGGLING GROUP: " + group);
        switch (group) {
          case 'active':
            $scope.showActiveGroup = !$scope.showActiveGroup;
            break;
          case 'pending':
            $scope.showPendingGroup = !$scope.showPendingGroup;
            break;
          case 'declined':
            $scope.showDeclinedGroup = !$scope.showDeclinedGroup;
            break;
        }
      };

      $scope.closeModal = function() {
        $log.debug('$closeModal()');
        // $ionicLoading.show({
        //   template: '<div class="icon ion-loading-b"></div><br /><span translate>Adding contact...</span>',
        // });
        // $scope.modal.hide();
        $scope.wizard.showModal = false;
        $state.go($scope.wizard.stateBeforeModal, {}, {});
        // $ionicLoading.hide();

        $scope.wizard.circleSetup.hasNewUser = $scope.hasUsersWithStatus(fobUserStatusConst.STATUS_NEW);
        $scope.wizard.circleSetup.newUsersCount = $scope.wizard.circleSetup.countNewUsers();
        $scope.wizard.circleSetup.invitedUsersCount = $scope.wizard.circleSetup.countPendingInvites();

        if ($scope.wizard.circleSetup.hasNewUser) {
          $scope.wizard.circleSetup.toggleGroup('pending');
        }

        $log.debug("HAS NEW USER: " + $scope.wizard.circleSetup.hasNewUser);
        if ($scope.wizard.circleSetup.newUsersCount > 0) {
          $scope.wizard.enableNextButton();
          $log.debug("[circle-setup-p1-controller] ENABLING NEXT BUTTON ");
        } else {
          $scope.wizard.disableNextButton();
        }
        $log.debug("[circle-setup-p1-controller] UNINVITED USERS: " + $scope.wizard.circleSetup.newUsersCount, $scope.wizard.circleSetup.invitedUsersCount);

      };

    })();
  }
})();
