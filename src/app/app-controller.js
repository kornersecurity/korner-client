(function() {
  'use strict';

  angular.module('app')
    .controller('app.controller', appController);

  /* @ngInject */
  function appController(
    $rootScope,
    $scope,
    $state,
    $location,
    $ionicLoading,
    $ionicPopup,
    Restangular,
    clientUpdateEventConst,
    $log,
    FobService2,
    $mdDialog,
    $mdMedia,
    $mdSidenav,
    accountAuthService,
    FobCollection,
    $window,
    uiLoadingService,
    contentSetupWizards,
    wizardType,
    connection,
    WebServerService,
    appSettingsConst,
    gettext
  ) {
    $log.debug("[app-controller] INITIALIZING");
    var eventHandlerRemovers = [];
    var removeSocketStateChangeHandler;

    eventHandlerRemovers.push($rootScope.$on('$stateChangeStart', onStateChangeStart));

    $window.addEventListener("offline", onAppOffline, false);
    $window.addEventListener("online", onAppOnline, false);
    $scope.$on('$destroy', destroyController);

    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      checkAppVersion();
    }

    function onStateChangeStart(event, to, toParams, from, fromParams) {

      if(to.data){
        $log.debug("[accountAuthService] REQUIRED LEVEL: "+ to.data.accessLevel);
      }

      var currentUser = accountAuthService.getCurrentUser();

      if(currentUser){
        $log.debug("[app-controller] USER LEVEL: "+ currentUser.accessLevel);
      }

      if (to.data === undefined || to.data.accessLevel === undefined) {
        // should specify the route
        $log.debug("[app-controller] Route does not specify ACCESS LEVEL!!! " + to.data);
        event.preventDefault();
        $rootScope.$emit('$statePermissionError');

      } else if (to.data.accessLevel == accessLevels.none) {
        $log.debug("[app-controller] NO REQUIRED ACCESS LEVEL");
        angular.noop();
      } else if (currentUser === undefined || currentUser.accessLevel === undefined) {
        // no user, need to login
        $log.debug("[app-controller] NO USER");

        event.preventDefault();
        $rootScope.$emit('$statePermissionError');

        $state.go('app.startup.splash', {}, {});
      } else if (to.data.accessLevel <= currentUser.accessLevel) {
        $log.debug("[app-controller] USER HAS REQUIRED ACCESS LEVEL");

        angular.noop();
      } else {
        angular.noop();
        // TODO investigate this branch of the logic
        $log.debug("[app-controller] USER DOS NOT HAVE REQUIRED ACCESS LEVEL !!!!");

      }
    }

    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('Destroying app.controller...');
      offRefreshBegin();
      offRefreshEnd();
    }

    function onAppOffline() {
      $log.debug("[app-controller] APP OFFLINE");
      $rootScope.appTimeOffline = Date.now();
      $rootScope.$apply(function() {
          $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner><br /><span>Waiting for internet connection...</span>',
          });
      });
    }

    function onAppOnline() {
      $log.debug("[app-controller] APP ONLINE - APP OFFLINE FOR: "+(Date.now() - $rootScope.appTimeOffline)/1000+" SECONDS");
      $rootScope.$apply(function() {
        $ionicLoading.hide();
        if(Date.now() - $rootScope.appTimeOffline > 5 * 60 * 1000) {
          $rootScope.appTimeOffline = Date.now();
          // $rootScope.$apply(function() {
            $rootScope.$emit('AppEvent:Restart', true);
            $rootScope.restart();
          // });
        } else if(Date.now() - $rootScope.appTimeOffline > 45 * 1000) {
          // removeSocketStateChangeHandler = $rootScope.$on(clientUpdateEventConst.SOCKET_STATE_CHANGE, onSocketStateChange);
          // eventHandlerRemovers.push(removeSocketStateChangeHandler);
          // connection.disconnect();
          // connection.connect();


          if(connection.isConnected()) {
              // $log.debug('[app] DISPATCHING AppEvent:ReloadFobs');
            if(removeSocketStateChangeHandler){
              removeSocketStateChangeHandler();
              removeSocketStateChangeHandler = null;
            }

            connection.disconnect();
          }

          removeSocketStateChangeHandler = $rootScope.$on(clientUpdateEventConst.SOCKET_STATE_CHANGE, function(readyState) {
            $rootScope.$emit('AppEvent:ReloadFobs', true);
            $rootScope.$emit('AppEvent:ReloadActivity', true);
          });

          connection.connect();
        }
      });
    }

    function onSocketStateChange(readyState) {
      $log.debug('[app-controller] SOCKET CONNECTED: '+connection.isConnected());
      if(connection.isConnected()) {
        // $log.debug('[app] DISPATCHING AppEvent:ReloadFobs');
        if(removeSocketStateChangeHandler) {
          removeSocketStateChangeHandler();
        }
        $rootScope.$emit('AppEvent:ReloadFobs', true);
        // $rootScope.$emit('AppEvent:ReloadActivity', true);
      }
    }

    function checkAppVersion() {
      WebServerService.queryServerVersion().then(
        function(response){
          if(response.version !== '0.0.0' &&
             (response.version !== appSettingsConst.version ||
             response.build !== appSettingsConst.build)) {
             $log.debug('[app-controller] REQUIRED VERSION NUMBER: '+response.version);
             $log.debug('[app-controller] REQUIRED BUILD NUMBER:   '+response.build);
             var updateRequiredPopup = $ionicPopup.alert({
               // template: gettext('Arming system in {{armDelayTimeRemaming}} seconds...<br> <a ng-href="showFobSettings()">Change arm delay</a>'),//'app/views/daleyed-arming-popup.html',
               templateUrl: 'app/views/update-required-popup.html',
               title: gettext('Update Available'),
               scope: $scope,
              //  okText: gettext('Cancel Arm Process'),
              //  okType: 'button-positive',
             });
            //  updateRequiredPopup.then(function(res) {
            //    updateRequiredPopup.close();
            //    if(res) {
            //      $log.debug('[ksFobActionButtons] CANCELING ARM PROCESS');
            //      // if (fob.isArmPending()) {
            //      FobService2.disarm();
            //      closePopup();
            //      // }
            //    }
            //  });
           }
        }, 
        function(err){
          $log.debug("[app-controller] CANNOT GET VERSION NUMBER FROM SERVER");
        });
    }

    // sessionService.initialize(Restangular.configuration.baseUrl);
    //
    // $rootScope.gotoHomeDashboard = function(){
    //
    //   $scope.fob = FobService2.fob;
    //   $rootScope.fobUser = FobService2.fobUser;
    //
    //   // $log.debug('[home-dashboard-controller] FOB:                       ' + $scope.fob);
    //   $log.debug('[home-dashboard-controller] USER HAS ACTIVITY FEATURE: ' + $rootScope.fobUser.hasActivityBasicFeature());
    //   $log.debug('[home-dashboard-controller] USER HAS CHAT FEATURE:     ' + $rootScope.fobUser.hasChatFeature());
    //   $log.debug('[home-dashboard-controller] USER HAS CONFIG FEATURE:   ' + $rootScope.fobUser.hasConfigFeature());
    //
    //   if($rootScope.fobUser.hasActivityBasicFeature()){
    //
    //     $state.go('app.home.tabs.dashboard', {}, {});
    //
    //   } else if($rootScope.fobUser.hasChatFeature()){
    //
    //     $state.go('app.home.tabs.circle-feed', {}, {});
    //
    //   } else if($rootScope.fobUser.hasConfigFeature()){
    //
    //     $state.go('app.home.tabs.config', {}, {});
    //
    //   }
    // };

    function showWait() {
      $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner><br /><span>Please wait...</span>',
      });
    }

    function hideWait() {
      $ionicLoading.hide();
    }

    $rootScope.logOut = function() {
      $mdDialog.hide();
      FobCollection.deactiveActiveFob();
      accountAuthService.logout();
      $state.go('app.account.login', {}, {});
    };

    $rootScope.restart = function() {
      $mdDialog.hide();
      FobCollection.deactiveActiveFob();
      $state.go('app.startup.splash', {}, {});
    };

    $rootScope.showSetupScreen = function(params, hideMenu) {
      $log.debug('[homeConfigController] SHOW SETUP: '+params.wizardType);
      if(FobService2.fob && FobService2.fob.isFirmwareUpdating() === true &&
         (params.wizardType === wizardType.FOB_SETUP ||
          params.wizardType === wizardType.TAG_SETUP ||
          params.wizardType === wizardType.EXTENDER_SETUP)) {
        uiLoadingService.showHideDelay(contentSetupWizards.FOB_FIRMWARE_UPDATING, 'appView', false, 3000);
        return;
      }

      $mdDialog.show({
        // template:'<md-dialog flex layout="column"> <ui-view flex="flex" layout="column" name="wizard-view"></ui-view></md-dialog>',
        templateUrl: 'app/views/dialog.html',
        controller: function($state){
          $state.go('wizard-manager', params, {});
        }
      });
      if(hideMenu === true){
        if($mdMedia('sm') || $mdMedia('md')) {
          $mdSidenav('left').close();
        }
      }
    };

  }

})();
