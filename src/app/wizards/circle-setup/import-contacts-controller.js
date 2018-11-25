(function() {
    'use strict';
    angular.module('app.wizard.circle')
    .controller('importContactsModalController', importContactsModalController);

  /* @ngInject */
  function importContactsModalController(
    $scope,
    $ionicPopup,
    uiLoadingService,
    contactsService,
    fobUserStatusConst,
    contentCircleSetup,
    $log,
    FobUserModel
  ) {
    $log.debug('[import-contacts-controller] INITIALIZING CONTROLLER');

    $scope.wizard.pageCode = '503';
    $scope.data = {};
    $scope.contactsForCheckbox  = [];
    $scope.contactsSelected     = true;
    // $scope.circleSetup = {};
    $scope.maxContactsToLoad = 20;
    $scope.contactsLoaded = 0;

    // $log.debug('CAN IMPORT CONTACTS: ' + navigator);
    $scope.noMoreContactsAvailable = false;

    $scope.loadMore = function() {
      if($scope.contacts)
      {
        setContactsForCheckboxes();
      }
    };


    function setContactsForCheckboxes()
    {
      for(var c = $scope.contactsLoaded;
          c < $scope.contactsLoaded + $scope.maxContactsToLoad;
          c++)
      {
        if(c >= $scope.contacts.length) {
          $scope.noMoreContactsAvailable = true;
          break;
        }
        var contact = $scope.contacts[c];

        if(isEmailValid(contact.email) === false)
        {
          continue;
        }

        $scope.contactsForCheckbox.push({
          fullname:   contact.fullname,
          first_name:  contact.first_name,
          last_name:   contact.last_name,
          email:      contact.email,
          checked:    false,
          enabled:    isEmailUnique(contact.email)
        });

        if($scope.contactsLoaded === $scope.contacts.length)
        {
          $scope.noMoreContactsAvailable = true;
        }
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.contactsLoaded += $scope.maxContactsToLoad;
      // $log.debug('importContactsModalController] CONTACTS LOADED: '+$scope.contactsLoaded);


      // for(var i in $scope.contacts)
      // {
      //   var contact = $scope.contacts[i];
      //
      //   if(isEmailValid(contact.email) === false)
      //   {
      //     continue;
      //   }
      //
      //   $scope.contactsForCheckbox.push({
      //     fullname:   contact.fullname,
      //     first_name:  contact.first_name,
      //     last_name:   contact.last_name,
      //     email:      contact.email,
      //     checked:    false,
      //     enabled:    isEmailUnique(contact.email)
      //   });
      //   $log.debug("[import-contacts-controller] CONTACT FOR CHECKBOX: "+$scope.contactsForCheckbox[$scope.contactsForCheckbox.length - 1].enabled);
      // }
    }

    $scope.updateContactsSelected = function(contactClicked)
    {
      $scope.contactsSelected = false;
      $scope.totalContactsSelected = 0;
      // $log.debug('[import-contacts-controller] CONTACTS FOR CHECKBOX: '+$scope.contactsForCheckbox);
      angular.forEach($scope.contactsForCheckbox, function(contact)
      {

        if(contactClicked === contact)
        {
          contact.checked = !contact.checked;
        }
        if(contact.checked)
        {
          $scope.totalContactsSelected++;
          $scope.contactsSelected = true;
        }
      });
    };


    $scope.addContacts = function()
    {
      for(var c in $scope.contactsForCheckbox)
      {
        var contact = $scope.contactsForCheckbox[c];

        if(contact.checked === false)
        {
          continue;
        }

        if(isEmailUnique(contact.email) === false)
        {
          showAlertPopup(contentCircleSetup.DUPLICATE_EMAIL_ALERT_TITLE, contentCircleSetup.DUPLICATE_IMPORT_EMAIL_ALERT_MESSAGE);
          return;
        }
        var newFobUser = new FobUserModel({
          first_name: contact.first_name,
          last_name: contact.last_name,
          email: contact.email,
          fob_user_status_id: fobUserStatusConst.STATUS_NEW
        });
        $scope.wizard.circleSetup.users.unshift(newFobUser);
      }
      $scope.wizard.circleSetup.hasNewUser = $scope.hasUsersWithStatus(fobUserStatusConst.STATUS_NEW);
      $scope.closeModal();
    };

    function isEmailUnique(email)
    {
      for(var i in $scope.wizard.circleSetup.users)
      {
        var user = $scope.wizard.circleSetup.users[i];
        if(user.email === email)
        {
          return false;
        }
      }
      return true;
    }

    function isEmailValid(email)
    {
      var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

      return filter.test(email);
    }

    function showAlertPopup(title, description)
    {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: description
      });

      alertPopup.then(function(res)
      {
        // There is nothing to do...
      });
    }

    $scope.clearSearch = function()
    {
      $scope.data.query = '';
      $scope.loadContacts('');
    };

    $scope.searchContacts = function()
    {
      $scope.data.query = '';
      $scope.loadContacts('');
    };

    $scope.loadContacts = function(findFilter) {
      $scope.contactsLoaded = 0;
      $scope.totalContactsSelected = 0;
      $scope.contactsForCheckbox  = [];
      contactsService.loadContacts().then(
        function(contacts) {
          $scope.contacts = contacts;//data.selectedContacts.push(contact);
          // $log.debug("[import-contacts-controller] CONTACTS FOR IMPORT: "+$scope.contacts);
          setContactsForCheckboxes();
          $scope.updateContactsSelected();
          uiLoadingService.hide();
        },
        function(failure) {
          $log.debug("Bummer.  Failed to pick a contact: "+failure);
        }
      );
    };

    $scope.$on('$destroy', function() {
      $log.debug('[import-contacts-controller] $destroy()');
      if ($scope.modal !== undefined)
        $scope.modal.remove();
    });

    (function(){
      if(navigator === undefined || navigator.contacts === undefined)
      {
        uiLoadingService.showHideDelay(contentCircleSetup.LOAD_CONTACT_FAIL, "wizardToast", false, 1500, $scope.closeModal);
      }
      else
      {
        uiLoadingService.show('', "wizardToast");
        $scope.loadContacts('');
      }
    })();
  }
})();
