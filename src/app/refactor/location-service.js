(function() {
  'use strict';

  /*jshint validthis: true */

  angular
    .module('app.core')
    .service('LocationService', locationService);

  /* @ngInject */
  function locationService(
    $q,
    $log,
    contentFobSetup) {

    var self = this;


    // list of exported public methods
    return {
      findUserLocation: findUserLocation,


    };

    // initializer
    function init() {


    }

    function findUserLocation() {
      var defer = $q.defer();
      var address;

      $log.debug('[LocationService] FINDING USER LOCATION');
      // In web replace "navigator.geolocation.getCurrentPosition(function(data)" with the line below
      // geolocation.getLocation().then(function(data

      navigator.geolocation.getCurrentPosition(function(data) {

        $log.debug('[fobSetupControllerPage2] LOCATION FOUND: ' + data.coords
          .latitude, data.coords.longitude);
        $log.debug('[fobSetupControllerPage2] GOOGLE MAPS: ' + google, google
          .maps);

        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);

        $log.debug('[fobSetupControllerPage2] GOOGLE GEOCODER: ' + geocoder,
          latlng);

        geocoder.geocode({
          'latLng': latlng
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              var fullAddress = results[0].formatted_address;
              address = {};
              address.line_1 = fullAddress.split(',')[0];
              address.line_2 = '';
              address.city = fullAddress.split(',')[1];
              address.state = fullAddress.split(',')[2].split(' ')[1];
              address.zipcode = fullAddress.split(',')[2].split(' ')[2];
              address.country = fullAddress.split(',')[3];
              address.country = (address.country.indexOf('USA') > -1)? 'United States' : address.country;

              $log.debug('[fobSetupControllerPage2] ADDRESS: ' + fullAddress);
              $log.debug('[fobSetupControllerPage2] STREET ADDRESS: ' +
                address.line_1);
              $log.debug('[fobSetupControllerPage2] CITY:           ' +
                address.city);
              $log.debug('[fobSetupControllerPage2] STATE:          ' +
                address.state);
              $log.debug('[fobSetupControllerPage2] ZIP CODE:       ' +
                address.zipcode);
              $log.debug('[fobSetupControllerPage2] COUNTRY:       ' +
                address.country);
              defer.resolve(address);
            } else {
              $log.debug('[fobSetupControllerPage2] LOCATION NOT FOUND');
              defer.reject();
            }
          } else {
            $log.debug('[fobSetupControllerPage2] Geocoder failed due to: ' +
              status);
            uiLoadingService.showHideDelay(contentFobSetup.USER_LOCATION_NOT_FOUND, "wizardToast",
              false);
            defer.reject();
          }
        });

      }, function(error) {
        $log.debug('[fobSetupControllerPage2] GEOCODER ERROR CODE:    ' +
          error.code);
        defer.reject();
        for (var e in error) {
          $log.debug('[fobSetupControllerPage2] GEOCODER ERROR: ' + e + ': ' +
            error[e]);
        }
      });
      return defer.promise;
    }



  }

})();
