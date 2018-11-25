(function() {
  'use strict';

  angular.module('app.profile')
    .controller('profileAddressController', profileAddressController);

  /* @ngInject */
  function profileAddressController(
    $rootScope,
    $scope,
    $state,
    $timeout,
    ServerService2,
    $ionicPopup,
    uiLoadingService,
    contentFobSetup,
    contentSetupWizards,
    pictureService,
    $ionicActionSheet,
    wizardType,
    ProfileService,
    FobCollection,
    $log,
    LocationService,
    countries,
    usStates
  ) {
    var eventHandlerRemovers = [];

    $scope.profileSetup.countries = countries;
    $scope.profileSetup.states = usStates;
    var findingLocation = false;


    function resetFormStatus() {
      $scope.profileSetup.invalidAddressLine1 = false;
      $scope.profileSetup.invalidAddressCity = false;
      $scope.profileSetup.invalidAddressState = false;
      $scope.profileSetup.invalidAddressZipcode = false;
      $scope.profileSetup.invalidAddressCountry = false;
    }

    function validateAddress() {
      var isValidForm = true;
      resetFormStatus();

      if ($scope.profileSetup.editableAddress.line_1 === undefined) {
        $scope.profileSetup.invalidAddressLine1 = true;
        isValidForm = false;
      }
      if ($scope.profileSetup.editableAddress.city === undefined) {
        $scope.profileSetup.invalidAddressCity = true;
        isValidForm = false;
      }
      if ($scope.profileSetup.editableAddress.state === undefined) {
        $scope.profileSetup.invalidAddressState = true;
        isValidForm = false;
      }
      if ($scope.profileSetup.editableAddress.zipcode === undefined) {
        $scope.profileSetup.invalidAddressZipcode = true;
        isValidForm = false;
      }
      if ($scope.profileSetup.editableAddress.country === undefined ||
          $scope.profileSetup.editableAddress.country === '') {
        $scope.profileSetup.invalidAddressCountry = true;
        isValidForm = false;
      }

      return isValidForm;
    }

    $scope.checkForChanges = function(){
      if (angular.equals($scope.profileSetup.editableAddress,
          $scope.profile.data.address)) {
        $scope.profileSetup.addressChanged = false;
      } else {
    $scope.profileSetup.addressChanged = true;
      }
    };

    $scope.profileSetup.updateProfileAddress = function(callback) {
      $log.debug('[profileAddressController] CHECKING FOR CHANGES AND CLOSING');
      if (angular.equals($scope.profileSetup.editableAddress,
          $scope.profile.data.address)) {
            if(callback) {
              callback();
            }
        $log.debug('[profileAddressController] CLOSING WITHOUT SAVING');
      } else if (validateAddress()) {
        $log.debug('[profileAddressController] CLOSING WITH SAVING');

        saveAddress(callback);
      } else {
        $log.debug('[profileAddressController] CLOSING WITH ERROR - NOT SAVING');
        if(callback) {
          callback();
        }
      }
    };

    function saveAddress(callback) {
      uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "kornerProfile");

      ProfileService.updateProfileAddress($scope.profileSetup.editableAddress).then(
        function() {
          $log.debug("ADDRESS SAVED: saved address success");

            uiLoadingService.showHideDelay(
              contentFobSetup.LOCATION_UPDATED_SUCCESSFUL, "kornerProfile", true);

            if(callback) {
              callback();
            }
            $scope.profileAddressForm.$setPristine();
          $scope.profileSetup.addressChanged = false;
        },
        function(err) {
          uiLoadingService.showHideDelay(contentFobSetup.LOCATION_UPDATED_FAILED, "wizardToast",
            false);
        }
      );
    }

    $scope.profileSetup.findUserLocation = function() {
      resetFormStatus();
      $log.debug('[profileAddressController] FINDING USER LOCATION: ' +
        contentFobSetup.FINDING_USER_LOCATION);
      uiLoadingService.show(contentFobSetup.FINDING_USER_LOCATION, "kornerProfile");
      // In web replace "navigator.geolocation.getCurrentPosition(function(data)" with the line below
      // geolocation.getLocation().then(function(data
      $scope.profileSetup.findUserLocationTimer = $timeout(
        onLocationNotShared, 60*1000);
      findingLocation = true;

      LocationService.findUserLocation().then(function(address) {
        $log.debug('[profileAddressController] USER ADDRESS: ' + address);
        $timeout.cancel($scope.profileSetup.findUserLocationTimer);
        uiLoadingService.hide();
        if(findingLocation === false) {
          return;
        }
        $scope.profileSetup.editableAddress.line_1 = address.line_1;
        $scope.profileSetup.editableAddress.line_2 = address.line_2;
        $scope.profileSetup.editableAddress.city = address.city;
        $scope.profileSetup.editableAddress.state = address.state;
        $scope.profileSetup.editableAddress.zipcode = address.zipcode;
        $scope.profileSetup.editableAddress.country = address.country;

        $scope.profileSetup.addressChanged = true;
        $scope.profileSetup.disableAutoFind = true;
        findingLocation = false;

        // $scope.$apply();
      }, function() {
        $log.debug('[profileAddressController] Geocoder failed');
        uiLoadingService.showHideDelay(contentFobSetup.USER_LOCATION_NOT_FOUND,
          "wizardToast", false);
        $scope.profileSetup.disableAutoFind = true;
        findingLocation = false;
      });

    };

    function onLocationNotShared() {
      $log.debug('[profileAddressController] LOCATION NOT SHARED');
      // $timeout.cancel($scope.profileSetup.findUnregisteredFobTimer);
      $timeout.cancel($scope.profileSetup.findUserLocationTimer);
      $scope.profileSetup.disableAutoFind = true;
      findingLocation = false;

      uiLoadingService.showHideDelay(contentFobSetup.USER_LOCATION_NOT_FOUND,
        "wizardToast", false);
      // uiLoadingService.hide(); //(contentFobSetup.USER_LOCATION_NOT_FOUND, false);
    }

    function destroyController() {
      if ($scope.profileSetup) {
        $timeout.cancel($scope.profileSetup.findUserLocationTimer);
      }
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[profileAddressController] DESTROYING');
    }

    (function() {
      $scope.profileSetup.disableAutoFind = false;

      $scope.$on('$destroy', destroyController);
      eventHandlerRemovers.push($rootScope.$on('error', onLocationNotShared));

    })();
  }
})();
