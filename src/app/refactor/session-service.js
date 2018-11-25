(function() {
  'use strict';

  /*jshint validthis: true */

  angular
    .module('app.core')
    .service('SessionService2', sessionService);

  /* @ngInject */
  function sessionService($rootScope, connection, $q, $log, FobCollection, $state, wizardType,
    ServerService2, FobService2, PushNotificationService, clientUpdateEventConst,
    $mdDialog, invitationService, WebServerService) {
    var self = this;
    var eventHandlerRemovers =[];

    $log.debug('>>> SessionService2');
    init();

    // list of exported public methods
    return {
      onStartup: onStartup,
      onShutdown: onShutdown
    };

    // initializer
    function init() {}



    function onPause() {
      FobCollection.onSessionPause().then(function() {

      });
    }

    function onResume() {

      // Check to see if account-authentication-serive. hasCurrentUser is valid
      // if not then go to login screen.

      // FobCollection - need to add a refresh
      // load new fobs, and iterate across fobs and load any new data

      // FobService.fob still in the Fob Collection?
      // if not, do we have more than one house - go to Home Select
      // if not, only one house select and show dashboard
      // if no homes go to login screen



      // show spinner

      FobCollection.onSessionResume().then(function() {
        // do something amazing!!!!
        // hide spinner
      });

    }

    function _onIntrusionEvent(event, fobID) {
      FobCollection.setActiveFobWithID(fobID);
      $state.go('app.intrusion');
    }

    function onStartup() {

      var defer = $q.defer();


      ServerService2.onInitialize().then(function() {
        // WebServerService.onInitialize().then(function() {
          FobCollection.onInitialize().then(function() {

            FobCollection.getCount()
              .then(function(fobCount) {
                  
                  $log.debug('[session-service] onStartup');

                  if(connection.isConnected() === false){
                    connection.connect();
                  }

                  // IntrusionService.onInitialize();

                  PushNotificationService.onInitialize($rootScope.user.account_id);
                  PushNotificationService.register();

                  eventHandlerRemovers.push($rootScope.$on(clientUpdateEventConst.FOB_INTRUSION, _onIntrusionEvent));

                  // check for fobs with an intrusion that is active, and activate if found
                  var hasIntrusion = FobCollection.activateFobWithActiveIntrusion();
                  if (hasIntrusion) {
                    $state.go('app.intrusion');
                  }

                  if (!hasIntrusion) {
                    invitationService.getInvitations(true, function(invitations) {
                        if (invitations.length > 0) {
                          $mdDialog.show({
                            templateUrl: 'app/views/invitations.html',
                            controller: 'invitationsController'
                          });
                        } else {

                          switch (fobCount) {
                            case 0:
                              $log.debug('[session-service] onStartup');
                              // $mdDialog.show({
                              //   // template:'<md-dialog flex layout="column"> <ui-view flex="flex" layout="column" name="wizard-view"></ui-view></md-dialog>',
                              //   templateUrl: 'app/views/dialog.html',
                              //   controller: function($state) {
                              //     $state.go('wizard-manager', {
                              //       wizardType: wizardType.WELCOME
                              //     }, {});
                              //   }
                              // });
                              $state.go('app.home.select', {checkKornerNotices: true});
                              $rootScope.showSetupScreen({wizardType:wizardType.WELCOME});

                              // $state.go('wizard-manager', {
                              //   wizardType: wizardType.WELCOME
                              // });
                              break;
                            case 1:
                              FobCollection.activateSingleFob();
                              $rootScope.fobUser = FobService2.fobUser;

                              // $log.debug('[home-dashboard-controller] FOB:                       ' + $scope.fob);
                              $log.debug('[home-dashboard-controller] USER HAS ACTIVITY FEATURE: ' + $rootScope.fobUser.hasActivityBasicFeature());
                              $log.debug('[home-dashboard-controller] USER HAS CHAT FEATURE:     ' + $rootScope.fobUser.hasChatFeature());
                              $log.debug('[home-dashboard-controller] USER HAS CONFIG FEATURE:   ' + $rootScope.fobUser.hasConfigFeature());
                              if ($rootScope.fobUser.hasActivityBasicFeature()) {
                                $state.go('app.home.tabs.dashboard', {
                                  checkKornerNotices: true
                                });
                              } else if ($rootScope.fobUser.hasChatFeature()) {
                                $state.go('app.home.tabs.circle-feed', {
                                  checkKornerNotices: true
                                });
                              } else if ($rootScope.fobUser.hasConfigFeature()) {
                                $state.go('app.home.tabs.config', {
                                  checkKornerNotices: true
                                });
                              }
                              break;
                            default:
                              $log.debug('[session-service] CHANGING STATE TO home.select');
                              $state.go('app.home.select', {
                                checkKornerNotices: true
                              });
                          }
                        }
                      },
                      function(res) {
                        defer.reject(res);
                      }
                    );

                  }

                  document.addEventListener('pause', onPause, false);
                  document.addEventListener('resume', onResume, false);

                  defer.resolve();
                },
                function(res) {
                  defer.reject(res);
                });

          },
          function(res) {
            defer.reject(res);
            // REVIEW - WHAT HAPPENS WHEN THINGS DON"T WORK OUT?????
            $log.debug("[sessions-serivce] FobCollection.onInitialize() - something went wrong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            $state.go('app.startup.splash');
          });



        // },
        // function(res) {
        //   defer.resolve();
        //   // REVIEW - WHAT HAPPENS WHEN THINGS DON"T WORK OUT?????
        //   $log.debug("[sessions-serivce] WebServerService.onInitialize() - something went wrong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //   $state.go('app.startup.splash');
        // }
        // );
      },
      function(res) {
        defer.reject(res);
        // REVIEW - WHAT HAPPENS WHEN THINGS DON"T WORK OUT?????
        $log.debug("[sessions-serivce] ServerService2.onInitialize() - something went wrong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        $state.go('app.startup.splash');
      });



      return defer.promise;
    }

    function onShutdown() {

      for(var handler in eventHandlerRemovers){
        eventHandlerRemovers[handler]();
      }
      eventHandlerRemovers = [];

      $log.debug('[sessions-serivce] DESTROYING');

      connection.disconnect();

      PushNotificationService.onFinalize();

      document.removeEventListener('pause', onPause, false);
      document.removeEventListener('resume', onResume, false);

      FobCollection.onSessionDestroy();
    }

  }

})();
