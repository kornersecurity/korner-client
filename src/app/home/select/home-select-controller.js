angular.module('app.home')
  .controller('home.select.controller', homeSelectController);


/* @ngInject */
function homeSelectController(
  $rootScope,
  $scope,
  $state,
  $stateParams,
  wizardType,
  FobCollection,
  FobModel,
  clientUpdateEventConst,
  $log,
  accountAuthService
) {

  $scope.fobs = {};
  $scope.wizardType = wizardType;
  $rootScope.toolbar.title = ''; //'Homes';
  $scope.home.showChatMessageButton = false;

  $scope.select = function(fob) {
    FobCollection.setActiveFobWithID(fob.fob_id);
    $scope.goToHomeDashboard();
  };

  FobCollection.getFobList()
    .then(function(fobs) {

      // hack to get the filter working some silly track by $index issue
      $scope.fobs = [];
      for (var index in fobs) {
        $scope.fobs.push(fobs[index]);
      }

      $scope.hasOwnedFobs = FobCollection.hasOwnedFobs();
      $scope.hasCircleFobs = FobCollection.hasCircleFobs();
    });

  if ($stateParams.checkKornerNotices === 'true') {
    $rootScope.sideMenu.checkKornerNotices();
  }




}
