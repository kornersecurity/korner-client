(function() {
  'use strict';

  /*jshint validthis: true */

  angular.module('app.profile.service')
    .factory('ProfileService', profileService);

  /* @ngInject */
  function profileService($rootScope, $q, server, $log, Restangular, ServerService2, Upload, $state){

    return {
      getProfileInformation: getProfileInformation,
      getProfileAddress: getProfileAddress,
      updateProfileInformation: updateProfileInformation,
      updateProfileAddress: updateProfileAddress,
      changeProfilePassowrd: changeProfilePassowrd
    };

    function getProfileInformation(){
      var self = this;
      var defer = $q.defer();

      Restangular.one('profile').get().then(function(profileInfo) {

          var profile = profileInfo.plain();
          $log.debug(profile);
          // profile['address'] = {};
          profile.imageUrl = _generateImageUrl(profile.image_url);
          Restangular.one('profile/address').get().then(
            function(profileAddress) {
              if(profileAddress === undefined) {
                profile.address = {
                  line_1: '',
                  line_2: '',
                  city: '',
                  state: '',
                  zipcode: '',
                  country: ''
                };
              }
              else {
                $log.debug('[profile-service] RESPONSE STATUS: ',profileAddress);
                profile.address = profileAddress.plain();
              }

              defer.resolve(profile);
            }, function(error) {
              defer.reject(error);
            }
          );
        }, function(error) {
          if(error.status === 401 || error.status === 404){
            // accountAuthService.logout();
            $state.go('app.account.login', {}, {});
            // $state.go('app.startup.splash', {}, {});
          } else if(error.status === 0 || error.status === 503) {
            $rootScope.restart();
          }
          defer.reject(error);
        }
      );
      return defer.promise;
    }

    function getProfileAddress(){
      var self = this;
      var defer = $q.defer();

      var address = {};

      Restangular.one('profile/address').get().then(
        function(profileAddress) {
          if(profileAddress === undefined) {
            address = {
              line_1: '',
              line_2: '',
              city: '',
              state: '',
              zipcode: '',
              country: ''
            };
          }
          else {
            console.log(profileAddress);
            $log.debug('[profile-service] RESPONSE STATUS: '+profileAddress);
            address = profileAddress.plain();
          }
          defer.resolve(address);
        }, function(error) {
          defer.reject(error);
        }
      );
      return defer.promise;
    }

    function updateProfileInformation(updatedProfile, imageUri, newImage, imageData){
      var self = this;
      var defer = $q.defer();

      Restangular.one('profile').customPUT(updatedProfile).then(function(profileInfo) {

          var profile = updatedProfile;

          if(newImage) {
            var uploadService = ($rootScope.appRuntime.isMobileApp && window.cordova)? mobilePictureUpload : webPictureUpload;

            uploadService(imageUri, imageData).then(
              function(fileName){
                profile.image_url = fileName.s3_name; //res.response.split('"')[1].split('"')[0];
                profile.imageUrl = _generateImageUrl(profile.image_url);
                $log.debug('[profile-service] PIC UPLOADED: ' + profile.imageUrl+" ("+profile.image_url+")");
                defer.resolve(profile);
              },
              function(error){
                defer.reject(error);
              }
            );
          } else {
            profile.imageUrl = _generateImageUrl(profile.image_url);
            defer.resolve(profile);
          }

        }, function(error) {
          defer.reject(error);
        }
      );
      return defer.promise;
    }

    function _generateImageUrl(imageName) {
      var imageUrl = ServerService2.getImageURLForS3NameWithSize(imageName);
      imageUrl += '?nocache=' + Math.floor((Math.random() * 10000) + 1);
      return imageUrl;
    }

    function mobilePictureUpload(picUri, imageData) {
      var self = this;
      var defer = $q.defer();

      $log.debug('[profile-service] QUERY: UPLOAD FOB PIC: ' + picUri);

      var options = new FileUploadOptions();
      var fileTransfer = new FileTransfer();
      var serverUri = encodeURI(server.getBaseUrl() + "/profile/image-upload");

      options.fileKey = "file";
      options.fileName = picUri.substr(picUri.lastIndexOf('/') + 1).split('?')[0]; // getFobByFobId(fobId).image_name;
      options.mimeType = "image/*";
      options.chunkedMode = false;

      fileTransfer.upload(picUri, serverUri, function(res) {

        var fileName = JSON.parse(res.response);

        if (res.response && fileName.s3_name) {
        //   self.image_name = fileName.s3_name; //res.response.split('"')[1].split('"')[0];
        //   profile.imageUrl = _generateImageUrl(profile.image_url);
        //   self._generateImageUrl();
          defer.resolve(fileName);
        } else {
          defer.reject();
        }

      }, function(err) {

        for (var e in err) {
          $log.debug('[profile-service] PIC UPLOAD ERROR: ' + e + ": " + err[e]);
        }
        defer.reject(err);

      }, options, false);


      return defer.promise;
    }

    function webPictureUpload(picUri, imageData) {
      var self = this;
      var defer = $q.defer();

      // optional: set default directive values
      //Upload.setDefaults( {ngf-keep:false ngf-accept:'image/*', ...} );
      Upload.setDefaults( {
        'ngf-keep': false,
        'ngf-accept': 'image/*',
      } );


      Upload.upload({
          url: encodeURI(server.getBaseUrl() + "/profile/image-upload"),
          file: imageData,
          // fileName: picUri.substr(picUri.lastIndexOf('/') + 1).split('?')[0],
          chunkedMode: false,
          mimeType: "image/*"
        }
      ).progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          $log.debug('[profile-service] WEB PIC UPLOAD PROGRESS: ' + progressPercentage + '% ' + evt.config.file.name);
        }
      ).success(function (data, status, headers, config) {
          if (data && data.s3_name) {
            defer.resolve(data);
            $log.debug('[profile-service] WEB PIC UPLOADED: ' + config.file.name + ' - RESPONSE: ' + data.s3_name);
          } else {
            defer.reject();
          }
        }
      ).error(function (data, status, headers, config) {
          defer.reject(status);
          $log.debug('[profile-service] WEB PIC UPLOAD ERROR: ' + status);
        }
      );

      return defer.promise;
    }

    function updateProfileAddress(updatedAddress){
      var self = this;
      var defer = $q.defer();

      Restangular.one('profile/address').customPUT(updatedAddress).then(
        function(profileInfo) {
          defer.resolve(updatedAddress);
        }, function(error) {
          defer.reject(error);
        }
      );
      return defer.promise;
    }

    function changeProfilePassowrd(passwordData){
      var self = this;
      var defer = $q.defer();

      Restangular.all('profile/change-password').customPUT(
        {
          'old-password': passwordData.old_password,
          'new-password': passwordData.new_password
        }).then(
          function() {
            defer.resolve();
          },
          function(error) {
            defer.reject(error);
          }
      );
      return defer.promise;
    }
  }

})();
