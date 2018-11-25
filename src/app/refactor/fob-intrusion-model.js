(function() {
  'use strict';


  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobIntrusionModel', fobIntrusionModel)
    .constant('fobIntrusionStateConst', {
      unknown: 0x1,
      active: 0x2,
      resolved: 0x3
    });




  /* @ngInject */
  function fobIntrusionModel($q, $log, KornerMsgHelpers, Restangular, KornerStateHelpers, gettext,
    FobIntrusionMessageCollection, FobIntrusionInviteCollection, fobIntrusionStateConst, core) {

    function FobIntrusionModel(fobID) {
      this.messages = {};
      this.invites = {};
      this.fobID = fobID;

      this._initializedDeferred = $q.defer();
    }

    FobIntrusionModel.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,

      // public methods
      loadRefreshIntrusion: loadRefreshIntrusion,
      isIntrusionActive: isIntrusionActive,
      isUserInvited: isUserInvited,

      // private methods

    };

    return FobIntrusionModel;


    // initializer
    function onInitialize() {

      var self = this;

      this.loadRefreshIntrusion().then(function() {
        self._initializedDeferred.resolve();
      }, function(status) {
        self._initializedDeferred.reject(status);
      });

      return this._initializedDeferred.promise;
    }



    function hasInitialized() {
      return this._initializedDeferred;
    }

    function loadRefreshIntrusion() {
      var self = this;
      var defer = $q.defer();


      Restangular.one('fobs', self.fobID).one('intrusion').get()
        .then(function(intrusion) {
            angular.extend(self, intrusion.plain());
            //
            // console.log(self.updated_at);
            // console.log(self.start_time);

            // HACK HACK - hack to show tag activity for intrusion.
            //  set start time back 5 seconds to include original activity
            var x = self.start_time.replace('T', ' ');
            var d = new Date(x.split('.')[0]);
            d.setSeconds(d.getSeconds() - 5);
            // var y = "{0}-{1}-{2}T{3}:{4}:{5}T".format(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes() - 1, d.getSeconds());
            self.start_time = "" + d.getFullYear().toString() + "-" + core.stringAs02d((d.getMonth() + 1)) + "-" + core.stringAs02d(d.getDate()) + "T" + core.stringAs02d(d.getHours()) + ":" + core.stringAs02d(d.getMinutes()) + ":" + core.stringAs02d(d.getSeconds());

            // console.log(self.start_time);


            self.messages = new FobIntrusionMessageCollection(self.fob_id, self.fob_intrusion_id);
            self.invites = new FobIntrusionInviteCollection(self.fob_id, self.fob_intrusion_id);

            var promises = [];

            promises.push(self.messages.onInitialize());
            promises.push(self.invites.onInitialize());

            $q.all(promises).then(
              function() {
                defer.resolve();
              },
              function(error) {
                $log.debug(error);
                defer.reject(error);
              });

          },
          function(err) {
            // no intrusion for fob
            defer.resolve();
          });

      return defer.promise;

    }

    function isIntrusionActive() {
      if (this.intrusion_status_id === fobIntrusionStateConst.resolved) {
        return true;
      }
      return false;
    }

    function isUserInvited(fobUserID) {

      if (this.invites !== undefined) {
        return this.invites.isInvited(fobUserID);
      }

      return false;
    }

  }

})();
