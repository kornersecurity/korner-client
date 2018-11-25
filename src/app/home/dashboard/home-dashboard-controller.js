(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.home')
    .controller('homeDashboardController', homeDashboardController);

  /* @ngInject */
  function homeDashboardController(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    FobService2,
    KornerUIHelpers,
    $log,
    clientUpdateEventConst,
    $mdMedia,
    $window
  ) {
    $scope.toggleControl = {};
    var eventHandlerRemovers = [];


    $scope.home.checkingForActivityUpdates = true;
    $scope.home.checkingForTagUpdates = false;
    $scope.home.showChatMessageButton = false;



    $rootScope.toolbar.title = FobService2.fob.fob_name;
    $rootScope.toolbar.showLogo = ($mdMedia('gt-sm') === true) ? true : false;

    $scope.$on('$destroy', destroyController);

    if (FobService2.fob === undefined || FobService2.fob === null) {
      $state.go('app.startup.splash');
      return;
    }

    // Forces home image reload
    FobService2.fob._generateImageUrl();

    if ($stateParams.checkKornerNotices === 'true') {
      $rootScope.sideMenu.checkKornerNotices();
    }


    $log.debug('[home-dashboard-controller] SHOW TAGS: ' + $scope.home.showTags);
    $log.debug('[home-dashboard-controller] EXTENDERS: ', $scope.fob.extenders);
    $log.debug('[home-dashboard-controller] EXTENDERS LIST: ', $scope.fob.extenders.extenders);

    // angular.element($window).bind('resize', function() {
    //
    //   if ($scope.$$phase) {
    //     $scope.$apply(function() {
    //       if($mdMedia('gt-sm')){
    //         $scope.dashboardActivityHeight = $scope.iframeHeight - 340;
    //       }
    //     });
    //   } else {
    //     if($mdMedia('gt-sm')){
    //       $scope.dashboardActivityHeight = $scope.iframeHeight - 340;
    //     }
    //   }
    //   if ($mdMedia('gt-sm') !== true) {
    //     // show tags based on if they have issues or not
    //     $scope.home.showTags = true;//FobService2.fob.tags.hasIssue;
    //   } else {
    //     $scope.home.showTags = true;
    //   }
    // });

    // delay until the screen is shown
    setTimeout(function() {
      $scope.home.refreshActivities();
    }, 1000);


    eventHandlerRemovers.push($rootScope.$on(clientUpdateEventConst.FOB_STATE_CHANGE, onFobStateChange));

    function destroyController(){
      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[home-dashboard-controller] DESTROYING');
    }

    function onFobStateChange(event, fobId, state) {
      if (FobService2.fob.fob_id !== fobId) {
        return;
      }

      $scope.refreshAll();
    }


    $scope.backgroundStyle = function(fob) {
      return KornerUIHelpers.backgroundStyleForFobStatusOrSeverity(fob);
    };

    $scope.refreshStatus = function() {
      $scope.home.checkingForActivityUpdates = true;
      $scope.$broadcast('scroll.refreshComplete');
      setTimeout(function() {
        $scope.refreshAll();
      }, 1000);

    };

    // if ($stateParams.checkKornerNotices === 'true') {
    //   $rootScope.sideMenu.checkKornerNotices();
    // }

    $scope.refreshAll = function() {
      $scope.home.refreshActivities();
      // $scope.refreshTags();
    };


    $scope.toggleShowTags = function() {
      if ($mdMedia('gt-sm') !== true && $mdMedia('sm') === true) {
        $scope.home.showTags = !$scope.home.showTags;
        $scope.toggleControl.swapIcon();
      }
      $log.debug('[home-dashboard-controller] SHOW TAGS: ' + $scope.home.showTags);

    };

  }
})();
