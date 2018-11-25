(function() {
  'use strict';

  angular.module('app.core')
  .service('pictureService', pictureService);

  /* @ngInject */
  function pictureService(
    $q,
    server,
    connection,
    $cordovaCamera,
    userService
  ) {

    var theService = {

      // use an existing photo from the library:
      useExistingPhoto: function(successCallback, failCallback) {
        this.capture(Camera.PictureSourceType.SAVEDPHOTOALBUM, successCallback, failCallback);
      },

      // take a new photo:
      takePhoto: function(successCallback, failCallback) {
        this.capture(Camera.PictureSourceType.CAMERA, successCallback, failCallback);
      },

      // capture either new or existing photo:
      capture: function(sourceType, successCallback, failCallback) {
        navigator.camera.getPicture(successCallback, failCallback, {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: sourceType,
          correctOrientation: true
        });
      },

    };

    return theService;
  }
})();
