App.factory('uiLoadingService', [
  '$ionicLoading',
  '$interval',
  '$log',
  '$mdToast',
  function(
    $ionicLoading,
    $interval,
    $log,
    $mdToast
  ) {

    function show(message, parentID)
    {
       var el = angular.element(document.getElementById(parentID));
      // $mdToast.show({
      //    template:
      //      '<md-toast>' +
      //      '  <span flex><ion-spinner icon="lines" class="icon icon-light"></span>'+
      //      '  <span>'+message+'</span>'+
      //      '</md-toast>',
      //    hideDelay: 60000,
      //    position:'top right',
      //    parent: el
      // });
      // Show the loading overlay and text
      $ionicLoading.show({

        // The text to display in the loading indicator
        // content: message,
        template: '<ion-spinner icon="lines" class="icon icon-light"></ion-spinner><br /><span translate>'+message+'</span>',

        // The animation to use
        animation: 'fade-in',

        // Will a dark overlay or backdrop cover the entire view
        showBackdrop: false,

        // The maximum width of the loading indicator
        // Text will be wrapped if longer than maxWidth
        maxWidth: 200,

        // The delay in showing the indicator
        showDelay: 500
      });
    }

    function hide()
    {
      $ionicLoading.hide();
    }

    function showHideDelay(message, parentID, isSuccess, interval, callback)
    {
      var el = angular.element(document.getElementById(parentID));

      interval = (interval === undefined)? 1500 : interval;
      var icon = (isSuccess === true)? 'ion-checkmark-round' : 'ion-alert-circled';

      $log.debug('[ui-loading-service] IS SUCCESS: '+isSuccess, interval);

      hide();
      $ionicLoading.show({
        template: '<div class="icon large-icon '+icon+'"></div><br /><span translate>'+message+'</span>'
      });
      // $mdToast.show({
      //   template:
      //     '<md-toast layout="center center">' +
      //     '   <span flex class="icon large-icon '+icon+'"></span>'+
      //     '   <span translate>'+message+'</span>'+
      //     '</md-toast>',
      //   hideDelay: interval,
      //   position:'top right',
      //   parent: el
      // }).then(callback);

      $interval(function(){
        $ionicLoading.hide();
        if(callback !== undefined)
        {
          callback();
        }
      }, interval, 1);
    }

    var theService = {
      show:show,
      hide:hide,
      showHideDelay:showHideDelay
    };

    return theService;
  }
]);
