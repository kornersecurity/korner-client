(function() {
  'use strict';

  angular.module('app.home')
    .controller('homeController', homeController);

  /* @ngInject */
  function homeController(
    _,
    $rootScope,
    $scope,
    $state,
    $ionicSideMenuDelegate,
    $ionicPopup,
    $ionicTabsDelegate,
    noticeService,
    accountAuthService,
    wizardType,
    invitationService,
    FobService2,
    FobCollection,
    clientUpdateEventConst,
    $log,
    $mdUtil,
    $mdSidenav,
    $mdMedia,
    $window
  ) {
    var eventHandlerRemovers = [];

    $scope.home = {}; // namespace for all home controllers
    $scope.$state = $state;
    $scope.$mdMedia = $mdMedia;
    $scope.wizardType = wizardType;

    $scope.home.checkingForActivityUpdates = false;
    $scope.home.checkingForTagUpdates = false;

    setDashboardActivityHeight();

    $rootScope.toolbar = {
      title: ''
    }; //{title: 'Homes'};
    $rootScope.toolbar.showLogo = true;
    $scope.home.showChatMessageButton = false;
    $scope.home.showMessagePopup = {};

    $scope.$on('$destroy', destroyController);
    eventHandlerRemovers.push($rootScope.$on('$stateChangeSuccess', onStateChangeSuccess));
    eventHandlerRemovers.push($rootScope.$on('$stateChangeStart', onStateChangeStart));
    eventHandlerRemovers.push($rootScope.$on(clientUpdateEventConst.CIRCLE_CHAT_REFRESH_REQUIRED, onCircleChatRefreshRequired));

    angular.element($window).bind('resize', onWindowResize);


    if (accountAuthService.isLoggedIn() === false) {
      $state.go('app.startup.splash');
    }

    if ($mdMedia('gt-md') !== true) {
      // show tags based on if they have issues or not
      $scope.home.showTags = true;//FobService2.fob.tags.hasIssue;
    } else {
      $scope.home.showTags = true;
    }

    $log.debug('[home-controller] SHOW TAGS: '+$scope.home.showTags);


    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[home-controller] DESTROYING');

      angular.element($window).unbind( "resize", onWindowResize );
    }

    function onWindowResize() {
      $log.debug('[home-controller] WINDOW RESIZED - HOME DASHBOARD STATE: ' + $state.is('app.home.tabs.dashboard'));
      if ($mdMedia('gt-sm') && $state.includes('app.home.tabs') && !$state.is('app.home.tabs.dashboard')) {
        $scope.goToHomeDashboard(); //$state.go('app.home.tabs.dashboard', {}, {});
      }

      if ($scope.$$phase) {
        $scope.$apply(function() {
          setDashboardActivityHeight();
        });
      } else {
        setDashboardActivityHeight();
      }
      $log.debug('[home-dashboard-controller] WINDOW RESIZED - HEIGH: ' + $scope.iframeHeight, $scope.dynamicHeightStyle);
    }

    function onStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      if ($state.is('app.home.select')) {
        $rootScope.toolbar.title = ''; //'Homes';
        $rootScope.toolbar.showLogo = true;
        $scope.fob = null;
      }
    }


    function onStateChangeStart(event, toState, toParams, fromState, fromParams) {
      // $log.debug('[home-controller] START STATE CHANGE - FROM STATE: ' + fromState.name);
      // $log.debug('[home-controller] START STATE CHANGE - TO STATE:   ' + toState.name);
      if (fromState.name === 'app.home.tabs.circle-feed') {
        $scope.home.showChatMessageButton = false;
      }
    }

    function setDashboardActivityHeight(){
      $scope.iframeHeight = calculateWindowHeight();
      if($mdMedia('gt-sm')){
        $scope.dashboardActivityHeight = $scope.iframeHeight - 307;
        if($rootScope.fobUser && $rootScope.fobUser.hasActivityBasicFeature() === false) {
          $scope.dashboardActivityHeight += 120;
        }
        $scope.dynamicHeightStyle = {'height':$scope.dashboardActivityHeight+'px'};
      }
    }

    function calculateWindowHeight() {
      if($mdMedia('gt-sm')) {
        return window.innerHeight - 100; //  30 to correct hidden card bottom
      } else {
        return window.innerHeight - 56; //  30 to correct hidden card bottom
      }
    }

    $scope.goToHomeDashboard = function() {

      $scope.fob = FobService2.fob;
      $rootScope.fobUser = FobService2.fobUser;

      // $log.debug('[home-dashboard-controller] FOB:                       ' + $scope.fob);
      $log.debug('[home-dashboard-controller] USER HAS ACTIVITY FEATURE: ' + $rootScope.fobUser.hasActivityBasicFeature());
      $log.debug('[home-dashboard-controller] USER HAS CHAT FEATURE:     ' + $rootScope.fobUser.hasChatFeature());
      $log.debug('[home-dashboard-controller] USER HAS CONFIG FEATURE:   ' + $rootScope.fobUser.hasConfigFeature());

      if ($mdMedia('gt-sm')) {

        $scope.hideChatButton();
        $state.go('app.home.tabs.dashboard', {}, {});

      } else if ($rootScope.fobUser.hasActivityBasicFeature()) {

        $scope.hideChatButton();
        $state.go('app.home.tabs.dashboard', {}, {});

      } else if ($rootScope.fobUser.hasChatFeature()) {

        $scope.gotoHomeCircleFeed();

      } else if ($rootScope.fobUser.hasConfigFeature()) {

        $scope.gotoHomeConfig();

      }
      setDashboardActivityHeight();
    };

    $scope.gotoHomeCircleFeed = function() {
      $scope.home.showChatMessageButton = true;
      $state.go('app.home.tabs.circle-feed', {}, {});
    };

    $scope.gotoHomeConfig = function() {
      $scope.hideChatButton();
      $state.go('app.home.tabs.config', {}, {});
    };

    $scope.hideChatButton = function() {
      $scope.home.showChatMessageButton = false;
    };

    $scope.silence = function() {
      FobService2.silence();
    };

    $rootScope.armDisarmCancelAlert = function(fob) {

      if (fob.isArmPending()) {
        FobService2.disarm();
      } else if (fob.isDisarmed()) {
        if (!fob.isReadyToArm()) {
          $scope.tagsWithIssues = fob.tags.tagsWithIssues();

          var armingWarningPopup = $ionicPopup.show({
            templateUrl: 'app/views/arm-warning-popup.html',
            cssClass: '',
            title: 'Arming Home',
            scope: $scope,
            buttons: [{
              text: 'Cancel',
              type: 'button-positive',
            }, {
              text: 'Continue',
              type: 'button-energized',
              onTap: function(e) {
                FobService2.arm();
              }
            }]
          });
          armingWarningPopup.then(function(res) {});
        } else {
          FobService2.arm();
        }
      } else {
        FobService2.disarm();
      }
    };


    // SIDE MENU
    $scope.toggleLeft = buildToggler('left');
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn = $mdUtil.debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function() {
            $log.debug("toggle " + navID + " is done");
            if ($mdSidenav('left').isOpen() === true) {
              $rootScope.sideMenu.loadInvitations();
            }
          });
      }, 300);
      return debounceFn;
    }

    // pending chat message badge notification
    function onCircleChatRefreshRequired(event, fobID, refreshAll) {
      if ($scope.fob !== undefined && $rootScope.fobUser !== undefined) {
        if ($rootScope.fobUser.hasChatFeature()) {
          var circleFeedTabIndex = $rootScope.fobUser.hasActivityBasicFeature() ? 1 : 0;
          if ($scope.fob.fob_id === fobID && $ionicTabsDelegate.selectedIndex() !== circleFeedTabIndex && refreshAll === false) {
            $scope.pendingMessageCount++;
            $scope.messagesBadge = $scope.pendingMessageCount.toString();
          }
        }
      }
    }

    $scope.onCircleFeedSelected = function() {
      $scope.pendingMessageCount = 0;
      $scope.messagesBadge = '';
    };


    $scope.home.refreshActivities = function() {
      $scope.home.checkingForActivityUpdates = true;
      FobService2.fob.activities.enableRefresh();
      FobService2.fob.activities.refreshActivities()
        .then(function() {
          $scope.home.checkingForActivityUpdates = false;
        }, function() {
          $scope.home.checkingForActivityUpdates = false;
        });
    };

    $scope.home.refreshFobs = function() {
      // $log.debug('[home-dashboard-controller] REFRESHING FOBS');
      $scope.home.checkingForTagUpdates = true;

      FobCollection.refreshState()
        .then(function() {
          if(FobService2.fob){
            var fobId = FobService2.fob.fob_id;
            FobCollection.deactiveActiveFob();
            FobCollection.setActiveFobWithID(fobId);
            $scope.home.refreshActivities();
          }

          // console.log(FobCollection.fobs);
          $scope.home.checkingForTagUpdates = false;
        }, function() {
          $scope.home.checkingForTagUpdates = false;
        });
    };


    (function() {
      $scope.firmwareUpdate = false; // TODO
      $scope.fob = FobService2.fob;

      // tab badge support
      $scope.issuesBadge = ''; // TODO $scope.fob.tags.tagsWithIssues().length;
      $scope.messagesBadge = '';
      $scope.pendingMessageCount = 0;
      $scope.firmwareUpdateBadge = $scope.firmwareUpdate ? '!' : '';

      eventHandlerRemovers.push($rootScope.$on('AppEvent:ReloadFobs', $scope.home.refreshFobs));
      // $rootScope.$on('AppEvent:ReloadActivity', $scope.home.refreshActivities);
    })();
  }
})();
