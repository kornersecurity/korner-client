(function() {
  'use strict';

  angular.module('app.wizard.fob')
    .controller('fobSetupControllerPage2', fobSetupControllerPage2);

  /* @ngInject */
  function fobSetupControllerPage2(
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
    FobService2,
    FobCollection,
    $log,
    LocationService,
    countries,
    usStates,
    ProfileService,
    gettext
  ) {
    if(window.cordova && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }
    // $log.debug('[fobSetupControllerPage2] P2 CONTROLLER');
    $scope.wizard.fobSetup.p2 = {};
    $scope.wizard.fobSetup.p2.notRegistered = true;
    $scope.wizard.fobSetup.p2.newPic = false;

    $scope.wizard.fobSetup.p2.a = false;
    $scope.wizard.fobSetup.p2.b = true;
    $scope.wizard.fobSetup.p2.c = 50;

    $scope.wizard.fobSetup.countries = countries;
    $scope.wizard.fobSetup.states = usStates;

    var findingLocation = false;
    var eventHandlerRemovers = [];
    var _pictureClickingEnabled = false;


    $scope.catchEnter = function(keyEvent) {
      if (keyEvent.which === 13) {
        keyEvent.preventDefault();
        if(window.cordova && cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.close();
        }
        keyEvent.target.blur();
        checkChangesAndClose();
      }
    };

    $scope.nextPage = function() {
      $log.debug('[fobSetupControllerPage2] SAVE NEW FOB: '+($scope.wizard.fobSetup.p2.notRegistered && validateNameAddressAndPhone()));

      if ($scope.wizard.fobSetup.p2.notRegistered && validateNameAddressAndPhone()) {
        $scope.wizard.fobSetup.p2.registerFob();
      } else if(validateNameAddressAndPhone() === false) {
        $ionicPopup.alert({
          title: contentFobSetup.INVALID_FORM,
          templateUrl: 'app/views/fob-setup-error-messages.html',
          scope: $scope
        });
      }
    };

    function resetFormStatus() {
      $scope.wizard.fobSetup.p2.invalidName = false;
      $scope.wizard.fobSetup.p2.invalidAddressLine1 = false;
      $scope.wizard.fobSetup.p2.invalidAddressCity = false;
      $scope.wizard.fobSetup.p2.invalidAddressState = false;
      $scope.wizard.fobSetup.p2.invalidAddressZipcode = false;
      $scope.wizard.fobSetup.p2.invalidAddressCountry = false;
      $scope.wizard.fobSetup.p2.invalidPolicePhoneNumber = false;
    }

    function validateNameAddressAndPhone() {
      var isValidForm = true;
      resetFormStatus();

      if ($scope.wizard.fobSetup.editableFob.fob_name === undefined || $scope.wizard.fobSetup.editableFob.fob_name ===
        '') {
        $scope.wizard.fobSetup.p2.invalidName = true;
        isValidForm = false;
      }
      // $log.debug('[fobSetupControllerPage2] VALID FORM NAME:     '+isValidForm);
      if ($scope.wizard.fobSetup.editableFob.address.line_1 === undefined) {
        $scope.wizard.fobSetup.p2.invalidAddressLine1 = true;
        isValidForm = false;
      }
      // $log.debug('[fobSetupControllerPage2] VALID FORM LINE1:    '+isValidForm);
      if ($scope.wizard.fobSetup.editableFob.address.city === undefined) {
        $scope.wizard.fobSetup.p2.invalidAddressCity = true;
        isValidForm = false;
      }
      // $log.debug('[fobSetupControllerPage2] VALID FORM CITY:     '+isValidForm);
      if ($scope.wizard.fobSetup.editableFob.address.state === undefined) {
        $scope.wizard.fobSetup.p2.invalidAddressState = true;
        isValidForm = false;
      }
      // $log.debug('[fobSetupControllerPage2] VALID FORM STATE:    '+isValidForm);
      if ($scope.wizard.fobSetup.editableFob.address.zipcode === undefined) {
        $scope.wizard.fobSetup.p2.invalidAddressZipcode = true;
        isValidForm = false;
      }
      // $log.debug('[fobSetupControllerPage2] VALID FORM ZIP CODE: '+isValidForm);
      if ($scope.wizard.fobSetup.editableFob.address.country === undefined ||
          $scope.wizard.fobSetup.editableFob.address.country === '') {
        $scope.wizard.fobSetup.p2.invalidAddressCountry = true;
        isValidForm = false;
      }

      $log.debug('[fobSetupControllerPage2] POLICE #: '+$scope.wizard.fobSetup.editableFob.client_data.police_phone_number);
      if($scope.wizard.fobSetup.editableFob.client_data.police_phone_number === undefined ||
         $scope.wizard.fobSetup.editableFob.client_data.police_phone_number === '') {
         $scope.wizard.fobSetup.p2.invalidPolicePhoneNumber = true;
        isValidForm = false;
      }
      $log.debug('[fobSetupControllerPage2] VALID FORM:       '+isValidForm);

      return isValidForm;
    }

    function checkChangesAndClose() {
      $log.debug('[fobSetupControllerPage2] CHECKING FOR CHANGES AND CLOSING - VALID: '+validateNameAddressAndPhone());
      $log.debug('[fobSetupControllerPage2] ADDRESS NOT CHANGED:  '+(angular.equals($scope.wizard.fobSetup.editableFob.address, $scope.wizard.fobSetup.selectedFob.address)));
      $log.debug('[fobSetupControllerPage2] PIC NOT CHANGED:      '+($scope.wizard.fobSetup.p2.newPic === false));
      $log.debug('[fobSetupControllerPage2] SETTINGS NOT CHANGED: '+($scope.wizard.fobSetup.p2.fobSettingsChanged === false));
      $log.debug('[fobSetupControllerPage2] NAME NOT CHANGED:     '+($scope.wizard.fobSetup.editableFob.fob_name === FobService2.fob.fob_name));
      $log.debug('[fobSetupControllerPage2] PHONE NOT CHANGED:    '+(  $scope.wizard.fobSetup.editableFob.client_data.police_phone_number === FobService2.fob.client_data.police_phone_number));
      if (angular.equals($scope.wizard.fobSetup.editableFob.address, $scope.wizard.fobSetup
          .selectedFob.address) && $scope.wizard.fobSetup.p2.newPic === false && $scope.wizard.fobSetup.p2.fobSettingsChanged === false &&
          $scope.wizard.fobSetup.editableFob.fob_name === FobService2.fob.fob_name &&
          $scope.wizard.fobSetup.editableFob.client_data.police_phone_number === FobService2.fob.client_data.police_phone_number) {
        // $log.debug('[fobSetupControllerPage2] CLOSING WITHOUT SAVING');
        $scope.wizard.wizardCompleted(false);
      } else if(validateNameAddressAndPhone() === false) {
        $ionicPopup.alert({
          title: contentFobSetup.INVALID_FORM,
          templateUrl: 'app/views/fob-setup-error-messages.html',
          scope: $scope
        });
      } else {
        $log.debug('[fobSetupControllerPage2] CLOSING WITH SAVING CONFIRMATION: '+validateNameAddressAndPhone(), $scope.wizard.fobSetup.p2.fobSettingsChanged);
        var confirmClosePopup = $ionicPopup.confirm({
          title: contentFobSetup.CLOSE_WIZARD_TITLE,
          template: contentFobSetup.SAVE_CHANGES_MESSAGE,
          cancelText: contentSetupWizards.NO,
          okText: contentSetupWizards.YES
        });

        confirmClosePopup.then(function(yes) {
          if (yes) {
            uiLoadingService.show(contentFobSetup.UPDATING_LOCATION, "wizardToast");

            saveNameAndAddress();
          } else {
            $scope.wizard.wizardCompleted(false);
          }
        });
      }
    }

    function saveNameAndAddress() {
      FobService2.fob.fob_name = $scope.wizard.fobSetup.editableFob.fob_name;
      FobService2.fob.client_data = {police_phone_number: $scope.wizard.fobSetup.editableFob.client_data.police_phone_number};
      FobService2.fob.store()
        .then(function() {

          FobService2.fob.address.store($scope.wizard.fobSetup.editableFob.address)
            .then(function() {
              $log.debug("ADDRESS SAVED: saved address success");
              if ($scope.wizard.fobSetup.p2.newPic) {
                var picUploadService = ($rootScope.appRuntime.isMobileApp && window.cordova)? 'mobilePictureUpload' : 'webPictureUpload';

                FobService2.fob[picUploadService]($scope.wizard.fobSetup.p2.picUrl, $scope.wizard.fobSetup.p2.picData).then(
                  function(res) {
                    if($scope.wizard.fobSetup.p2.fobSettingsChanged) {
                      updateFobSettings();
                    } else {
                      // everything was saves
                      uiLoadingService.showHideDelay(
                        contentFobSetup.LOCATION_UPDATED_SUCCESSFUL, "wizardToast", true, 1500,
                        function() {
                          $scope.wizard.wizardCompleted(false);
                        });
                    }
                  },
                  function(err) {
                    uiLoadingService.showHideDelay(contentFobSetup.LOCATION_UPDATED_FAILED, "wizardToast",
                      false);
                  }
                );
              } else {
                if($scope.wizard.fobSetup.p2.fobSettingsChanged) {
                  updateFobSettings();
                } else {
                  // everything was saved
                  uiLoadingService.showHideDelay(
                    contentFobSetup.LOCATION_UPDATED_SUCCESSFUL, "wizardToast", true, 1500,
                    function() {
                      $scope.wizard.wizardCompleted(false);
                    }
                  );
                }
              }


            }, function() {
              $log.debug("save address failed");
              uiLoadingService.showHideDelay(contentFobSetup.LOCATION_UPDATED_FAILED, "wizardToast", false);
            });

        }, function() {
          $log.debug("save fob name failed");
          uiLoadingService.showHideDelay(contentFobSetup.LOCATION_UPDATED_FAILED, "wizardToast", false);
        });
    }

    function updateFobSettings() {
      FobService2.fob.arm_delay         = parseInt($scope.wizard.fobSetup.editableFob.arm_delay);
      FobService2.fob.doorchime_enabled = $scope.wizard.fobSetup.editableFob.doorchime_enabled;
      FobService2.fob.buzzer_enabled    = $scope.wizard.fobSetup.editableFob.buzzer_enabled;

      FobService2.fob.updateFobSettings().then(
        function(res) {
          // everything was save
          uiLoadingService.showHideDelay(
            contentFobSetup.LOCATION_UPDATED_SUCCESSFUL, "wizardToast", true, 1500,
            function() {
              $scope.wizard.wizardCompleted(false);
            }
          );
        },
        function(err) {
          uiLoadingService.showHideDelay(contentFobSetup.LOCATION_UPDATED_FAILED,
            "wizardToast", false);
        }
      );
    }

    function setPicUrl(fob) {
      if (fob) {
        return fob.imageUrl; //ServerService2.getFobImageURLForS3NameWithSize(fob.image_name);
      }
      return '';
    }

    $scope.wizard.fobSetup.p2.findUserLocation = function() {
      $scope.wizard.fobSetup.disableAutoFind = true;
      resetFormStatus();
      $log.debug('[fobSetupControllerPage2] FINDING USER LOCATION: ' +
        contentFobSetup.FINDING_USER_LOCATION);
      uiLoadingService.show(contentFobSetup.FINDING_USER_LOCATION, "wizardToast");
      // In web replace "navigator.geolocation.getCurrentPosition(function(data)" with the line below
      // geolocation.getLocation().then(function(data
      $scope.wizard.fobSetup.p2.findUserLocationTimer = $timeout(
        onLocationNotShared, 60*1000);
        findingLocation = true;

      LocationService.findUserLocation().then(function(address) {
        $timeout.cancel($scope.wizard.fobSetup.p2.findUserLocationTimer);
        uiLoadingService.hide();

        if(findingLocation === false) {
          return;
        }

        $scope.wizard.fobSetup.editableFob.address.line_1 = address.line_1;
        $scope.wizard.fobSetup.editableFob.address.line_2 = address.line_2;
        $scope.wizard.fobSetup.editableFob.address.city = address.city;
        $scope.wizard.fobSetup.editableFob.address.state = address.state;
        $scope.wizard.fobSetup.editableFob.address.zipcode = address.zipcode;
        $scope.wizard.fobSetup.editableFob.address.country = address.country;
        findingLocation = false;

        // $scope.$apply();
      }, function() {
        $log.debug('[fobSetupControllerPage2] Geocoder failed');
        uiLoadingService.showHideDelay(contentFobSetup.USER_LOCATION_NOT_FOUND,
          "wizardToast", false);
        $scope.wizard.fobSetup.disableAutoFind = false;
        findingLocation = false;
      });

    };

    function onLocationNotShared() {
      $log.debug('[fobSetupControllerPage2] LOCATION NOT SHARED');
      // $timeout.cancel($scope.wizard.fobSetup.findUnregisteredFobTimer);
      $timeout.cancel($scope.wizard.fobSetup.p2.findUserLocationTimer);
      // $scope.wizard.fobSetup.disableAutoFind = true;
      $scope.wizard.fobSetup.disableAutoFind = false;
      findingLocation = false;

      uiLoadingService.showHideDelay(contentFobSetup.USER_LOCATION_NOT_FOUND,
        "wizardToast", false);
      // uiLoadingService.hide(); //(contentFobSetup.USER_LOCATION_NOT_FOUND, false);
    }

    $scope.wizard.fobSetup.p2.checkFobSettings = function() {
      $log.debug('[fob-setup-p2-controller] FOB SETTINGS CHANGED');
      if(parseInt($scope.wizard.fobSetup.editableFob.arm_delay) !== $scope.wizard.fobSetup.selectedFob.arm_delay ||
         $scope.wizard.fobSetup.editableFob.doorchime_enabled !== $scope.wizard.fobSetup.selectedFob.doorchime_enabled ||
         $scope.wizard.fobSetup.editableFob.buzzer_enabled !== $scope.wizard.fobSetup.selectedFob.buzzer_enabled){

        $scope.wizard.fobSetup.p2.fobSettingsChanged = true;
      }
      if(parseInt($scope.wizard.fobSetup.editableFob.arm_delay) === 0) {
        $scope.wizard.fobSetup.p2.noArmDelay = true;
      } else {
        $scope.wizard.fobSetup.p2.noArmDelay = false;
      }

      $log.debug('[fob-setup-p2-controller] FOB BUZZER ENABLED: '+$scope.wizard.fobSetup.editableFob.buzzer_enabled);
      if($scope.wizard.fobSetup.editableFob.buzzer_enabled === 0){
        $scope.wizard.fobSetup.editableFob.doorchime_enabled = 0;
      }
      $log.debug('[fob-setup-p2-controller] FOB DOORCHIME ENABLED: '+$scope.wizard.fobSetup.editableFob.doorchime_enabled);

    };

    $scope.wizard.fobSetup.p2.toggleArmDelay = function() {
      if($scope.wizard.fobSetup.p2.noArmDelay === false)
      {
        $scope.wizard.fobSetup.editableFob.arm_delay = $scope.wizard.fobSetup.selectedFob.arm_delay;
      } else {
        $scope.wizard.fobSetup.editableFob.arm_delay = "0";
      }
      $scope.wizard.fobSetup.p2.fobSettingsChanged = true;
    };

    $scope.wizard.fobSetup.p2.registerFob = function() {
      $scope.wizard.fobSetup.setupError = false;
      $log.debug('[fobSetupControllerPage2] REGISTERING FOB');
      uiLoadingService.show(contentFobSetup.REGISTERING_FOB, "wizardToast");
      $timeout.cancel($scope.wizard.fobSetup.p2.findUserLocationTimer);

      // Set the Fob Owner
      FobCollection.setFobOwner($scope.wizard.fobSetup.editableFob.fob_id, $scope.wizard.fobSetup.editableFob.eui64)
        .then(function() {
          // success on setting fob owner

          // set the fob name
          FobService2.fob.fob_name = $scope.wizard.fobSetup.editableFob.fob_name;
          FobService2.fob.client_data = {police_phone_number: $scope.wizard.fobSetup.editableFob.client_data.police_phone_number};

          FobService2.fob.arm_delay = parseInt($scope.wizard.fobSetup.editableFob.arm_delay);
          FobService2.fob.doorchime_enabled = $scope.wizard.fobSetup.editableFob.doorchime_enabled;
          FobService2.fob.buzzer_enabled = $scope.wizard.fobSetup.editableFob.buzzer_enabled;

          FobService2.fob.store()
            .then(function() {
                //success on setting fob name

                FobService2.fob.address.store($scope.wizard.fobSetup.editableFob.address)
                  .then(function() {
                      // succes - address saved
                      $scope.wizard.fobSetup.fobRegistered = true;
                      $scope.wizard.canExitWizard = true;
                      $scope.wizard.wizardManagerData.setWizardCompleted($scope.wizard.wizardManagerData.currentWizard.type);


                      $scope.wizard.fobSetup.selectedFob = angular.copy($scope.wizard.fobSetup.editableFob);
                      if ($scope.wizard.fobSetup.p2.newPic) {
                        var picUploadService = ($rootScope.appRuntime.isMobileApp && window.cordova)? 'mobilePictureUpload' : 'webPictureUpload';

                        FobService2.fob[picUploadService]($scope.wizard.fobSetup.p2.picUrl, $scope.wizard.fobSetup.p2.picData).then(
                          function(res) {
                            if($scope.wizard.fobSetup.p2.fobSettingsChanged) {
                              FobService2.fob.updateFobSettings().then(
                                function(res) {
                                  // everything has saved
                                  uiLoadingService.showHideDelay(
                                    contentFobSetup.REGISTRATION_SUCCESSFUL,
                                    "wizardToast", true, 1500,
                                    function() {
                                      $scope.wizard.fobSetup.p2.notRegistered = false;
                                      $scope.wizard.goToNextPage();
                                    }
                                  );
                                },
                                function(err) {
                                  $scope.wizard.fobSetup.setupError = true;
                                  uiLoadingService.showHideDelay(
                                    contentFobSetup.REGISTRATION_FAILED,
                                    "wizardToast",
                                    false);
                                }
                              );
                            } else {
                              uiLoadingService.showHideDelay(
                                contentFobSetup.REGISTRATION_SUCCESSFUL,
                                "wizardToast", true, 1500,
                                function() {
                                  $scope.wizard.fobSetup.p2.notRegistered = false;
                                  $scope.wizard.goToNextPage();
                                }
                              );
                            }
                          },
                          function(err) {
                            $scope.wizard.fobSetup.setupError = true;
                            uiLoadingService.showHideDelay(
                              contentFobSetup.REGISTRATION_FAILED,
                              "wizardToast",
                              false);
                          }
                        );
                      } else {
                        // if($scope.wizard.fobSetup.p2.fobSettingsChanged) {
                          FobService2.fob.updateFobSettings().then(
                            function(res) {
                              // everything has save
                              uiLoadingService.showHideDelay(
                                contentFobSetup.REGISTRATION_SUCCESSFUL,
                                "wizardToast", true, 1500,
                                function() {
                                  $scope.wizard.fobSetup.p2.notRegistered = false;
                                  $scope.wizard.goToNextPage();
                                }
                              );
                            },
                            function(err) {
                              $scope.wizard.fobSetup.setupError = true;
                              uiLoadingService.showHideDelay(
                                contentFobSetup.REGISTRATION_FAILED,
                                "wizardToast",
                                false);
                            }
                          );
                        // } else {
                        //   // everything has save
                        //   uiLoadingService.showHideDelay(
                        //     contentFobSetup.REGISTRATION_SUCCESSFUL,
                        //     "wizardToast", true, 1500,
                        //     function() {
                        //       $scope.wizard.fobSetup.p2.notRegistered = false;
                        //       $scope.wizard.goToNextPage();
                        //     }
                        //   );
                        // }

                      }

                    },
                    function(err) {
                      $scope.wizard.fobSetup.setupError = true;
                      uiLoadingService.showHideDelay(
                        contentFobSetup.REGISTRATION_FAILED,
                        "wizardToast",
                        false);
                      $log.debug('[fobSetupControllerPage2] CREATE FOB ADDRESS ERROR: ' + err);
                    });
              },
              function(err) {
                $scope.wizard.fobSetup.setupError = true;
                uiLoadingService.showHideDelay(
                  contentFobSetup.REGISTRATION_FAILED,
                  "wizardToast",
                  false);
                $log.debug('[fobSetupControllerPage2] CREATE FOB INFORMATION ERROR: ' + err);
              });



        }, function(status) {
          $scope.wizard.fobSetup.setupError = true;
          uiLoadingService.showHideDelay(contentFobSetup.REGISTRATION_FAILED,
            "wizardToast", false);
          $log.debug('[fobSetupControllerPage2] CREATE FOB INFORMATION ERROR: ' + status);
        });

    };

    function destroyController() {
      // $log.debug('[fobSetupControllerPage2] P2 CONTROLLER DESTROYED');
      if ($scope.wizard.fobSetup) {
        $timeout.cancel($scope.wizard.fobSetup.p2.findUserLocationTimer);
      }

      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[fobSetupControllerPage2] DESTROYING');
    }

    function showPic(imageURI) {
      $scope.wizard.fobSetup.p2.newPic = true;
      $log.debug("[fobSetupControllerPage2] IMAGE URI: " + imageURI);
      $scope.wizard.fobSetup.p2.picUrl = imageURI;
    }

    function picCaptureError(message) {
      $log.debug('[fobSetupControllerPage2] IMAGE CAPTURE ERROR: ' + message);
    }

    $scope.wizard.fobSetup.p2.showImageFromFileSelect = function (elem) {
        $log.debug('[fob-setup-p2-controller] FILE TO UPLOAD: ' + (elem.files[0].webkitRelativePath || elem.files[0].name));
        var reader = new FileReader();

        reader.onload = function (e) {
          $scope.$apply(function() {
            showPic(e.target.result);
            $scope.wizard.fobSetup.p2.picData = elem.files[0];
          });
        };
        reader.readAsDataURL(elem.files[0]);

    };

    $scope.NoArmDelay = function() {
      FobService2.fob.updateFobSettings();
    };

    $scope.wizard.fobSetup.p2.showPictureActionSheet = function() {
      if(_pictureClickingEnabled === false) {
        return;
      }

      if(window.cordova && cordova.plugins.Keyboard) {
        var hideSheet = $ionicActionSheet.show({
          buttons: [{
            text: contentFobSetup.TAKE_PICTURE
          }, {
            text: contentFobSetup.GALLERY_PICTURE
          }],
          // titleText: contentFobSetup.PICTURE_ACTION_SHEET_TITLE,
          cancelText: contentFobSetup.CANCEL,
          cancel: function() {
            // add cancel code..
            // $log.debug("[fobSetupControllerPage2] CANCEL CLICKED");
          },
          buttonClicked: function(index) {
            // $log.debug("[fobSetupControllerPage2] BUTTON CLICKED: " + index);
            if (index === 0) {
              pictureService.takePhoto(showPic, picCaptureError);
            }

            if (index === 1) {
              pictureService.useExistingPhoto(showPic, picCaptureError);
            }

            return true;

          }
        });
      } else {
        var fileuploader = angular.element("#fileInput");
        fileuploader.on('click',function(){
            $log.debug('[fob-setup-p2-controller] FILE UPLOAD TRIGGERED PROGRAMATICALLY');
        });
        fileuploader.trigger('click');
      }

    };


    (function() {
      $scope.wizard.pageCode = '204';
      $scope.wizard.fobSetup.disableAutoFind = false;

      $timeout(function(){
        _pictureClickingEnabled = true;
      }, 2*1000);

      if ($scope.wizard.fobSetup.selectedFob.isNewFob === true) {
        $scope.wizard.fobSetup.editableFob = angular.copy($scope.wizard.fobSetup
          .selectedFob);
        $scope.wizard.fobSetup.editableFob.address = {};
        $scope.wizard.fobSetup.editableFob.fob_name = gettext('Home');

        //Added to overwrite default fob arm_delay
        $scope.wizard.fobSetup.editableFob.arm_delay = "0";
        $scope.wizard.fobSetup.editableFob.client_data = {police_phone_number:'911'};

        $scope.wizard.fobSetup.fobRegistered = false;
        $scope.wizard.fobSetup.p2.noArmDelay = true;
        uiLoadingService.show(" ", "kornerProfile");
        ProfileService.getProfileAddress().then(
          function(address){
            $scope.wizard.fobSetup.editableFob.address = angular.copy(address);
            $log.debug('[fob-setup-p2-controller] LOADED PORIFLE ADDRESS - COUNTRY: '+  $scope.wizard.fobSetup.editableFob.address.country);
            if($scope.wizard.fobSetup.editableFob.address.country === 'US') {
              $scope.wizard.fobSetup.editableFob.address.country = '';
            }
            uiLoadingService.hide();
          },
          function(err){
            $log.debug('[fob-setup-p2-controller] LOAD PORIFLE ADDRESS ERROR: '+err);
            uiLoadingService.hide();
          }
        );

        // $scope.wizard.enableNextButton();
        // $scope.wizard.disableNextButton();

      } else {
        // uiLoadingService.show(contentFobSetup.LOADING_FOB_ADDRESS);
        $log.debug('[fob-setup-controller] LOADING FOB ADDRESS FOR FOB: ' +
          $scope.wizard.fobSetup.selectedFob.fob_id);

        $scope.wizard.fobSetup.editableFob = angular.copy(FobService2.fob);
        if($scope.wizard.fobSetup.editableFob.client_data.police_phone_number === undefined ||
           $scope.wizard.fobSetup.editableFob.client_data.police_phone_number === '') {
           $scope.wizard.fobSetup.editableFob.client_data.police_phone_number = '911';
         }

        $log.debug('[fob-setup-p2-controller] LOADED FOB ADDRESS - COUNTRY: '+  $scope.wizard.fobSetup.editableFob.address.country);
        if($scope.wizard.fobSetup.editableFob.address.country === 'US') {
          $scope.wizard.fobSetup.editableFob.address.country = '';
        }

        if($scope.wizard.fobSetup.selectedFob.arm_delay === 0) {
          $scope.wizard.fobSetup.p2.noArmDelay = true;
        } else {
          $scope.wizard.fobSetup.p2.noArmDelay = false;
        }

      }

      $scope.wizard.fobSetup.p2.fobSettingsChanged = false;

      $scope.wizard.fobSetup.p2.picUrl = setPicUrl($scope.wizard.fobSetup.editableFob);
      $log.debug("[fobSetupControllerPage2] PIC URL: " + $scope.wizard.fobSetup.p2.picUrl);
      if ($scope.wizard.fobSetup.canGoBack === false) {
        $scope.wizard.disablePreviousButton();
      }

      $scope.$on('wizardEvent::doneClicked', checkChangesAndClose);
      $scope.$on('wizardEvent::showNextPage', $scope.nextPage);
      $scope.$on('$destroy', destroyController);
      eventHandlerRemovers.push($rootScope.$on('error', onLocationNotShared));
    })();
  }
})();
