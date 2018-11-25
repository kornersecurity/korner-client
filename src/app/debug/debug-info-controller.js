(function () {
  'use strict';

  angular.module('app.debug')
    .controller('debug.info.controller', debugInfoController);


  /* @ngInject */
  function debugInfoController(
    $rootScope,
    $scope,
    $state,
    $ionicHistory,
    gettextCatalog,
    $log
  ) {

    // $scope.serverVersion = sessionService.getServerVersion();
    // $scope.databaseVersion = sessionService.getDatabaseVersion();
    // $scope.webServiceUrl = server.getBaseUrl();
    // $scope.webSocketUri = server.getSocketUri();
    // $scope.isConnected = connection.isConnected() ? 'Connected' :
    //   'Not connected';
    // $scope.imageServerUrl = sessionService.getImageServerUrl();
    // $scope.currentLanguage = gettextCatalog.currentLanguage;
    // $scope.onBack = function() {
    //   if ($ionicHistory.backView()) {
    //     $ionicHistory.goBack();
    //   } else {
    //     $state.go('app.home.select', {}, {});
    //   }
    // };
    //
    // $scope.setLanguage = function(lang) {
    //   gettextCatalog.setCurrentLanguage(lang);
    //   $log.debug("CURRENT LANGUAGE: " + gettextCatalog.currentLanguage);
    // };
    //
    //
    // $scope.getFobInfo = function() {
    //   clientProtocolService.sendGetFobInfo(sessionService.getSelectedFob());
    // };
    //
    // $scope.getFobStatus = function() {
    //   clientProtocolService.sendGetFobStatus(sessionService.getSelectedFob());
    // };
    //
    // $scope.getTags = function() {
    //   clientProtocolService.sendGetTags(sessionService.getSelectedFob());
    // };
    //
    // $scope.removeTags = function() {
    //   clientProtocolService.sendRemoveTags(sessionService.getSelectedFob());
    // };
    //
    // $scope.includeTags = function() {
    //   clientProtocolService.sendIncludeTags(sessionService.getSelectedFob());
    // };
    //
    // $scope.excludeTags = function() {
    //   clientProtocolService.sendExcludeTags(sessionService.getSelectedFob());
    // };
    //
    // $scope.getFobSettings = function() {
    //   clientProtocolService.sendGetFobSettings(sessionService.getSelectedFob());
    // };
    //
    // $scope.setFobSettings = function() {
    //   clientProtocolService.sendSetFobSettings(sessionService.getSelectedFob());
    // };
    //
    // $scope.startPairing = function() {
    //   clientProtocolService.sendStartPairing(sessionService.getSelectedFob());
    // };
    //
    // $scope.stopPairing = function() {
    //   clientProtocolService.sendStopPairing(sessionService.getSelectedFob());
    // };
    //
    // $scope.armFob = function() {
    //   clientProtocolService.sendArmFob(sessionService.getSelectedFob());
    // };
    //
    // $scope.disarmFob = function() {
    //   clientProtocolService.sendDisarmFob(sessionService.getSelectedFob());
    // };
    //
    // $scope.silenceFob = function() {
    //   clientProtocolService.sendSilenceFob(sessionService.getSelectedFob());
    // };
    //
    // $scope.pauseResumeRefresh = function() {
    //   $scope.onBack();
    //
    //   $rootScope.$emit(clientUpdateEventConst.DATA_REFRESH_BEGIN);
    //
    //   homeService.refresh(sessionService.getSelectedFob(), function() {
    //       $rootScope.$emit(clientUpdateEventConst.DATA_REFRESH_END);
    //   });
    // };
    //
    // $scope.dialSimon = function() {
    //   window.open('tel:7145551234', '_system');
    // };
  }

})();
