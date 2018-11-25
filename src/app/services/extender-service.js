//
// fob-service.js
//
(function() {
  'use strict';

  angular.module('app.core')
  .service('extenderServiceOld', extenderServiceOld);

  /* @ngInject */
  function extenderServiceOld(Restangular, _, $log) {

    var extenders = {};

    function getFobExtenders(fobId, successCallback, failCallback) {

      if (!extenders[fobId]) {
        $log.debug('[extender-service] QUERY: extenders for fob ' + fobId);


        Restangular.one('fobs', fobId).getList('extenders').then(
          function(fobExtenders) {
            $log.debug('[extender-service] RESPONSE: ', fobExtenders, fobExtenders.plain());
            var receivedExtenders = fobExtenders.plain();
            if (!receivedExtenders || receivedExtenders === undefined || receivedExtenders.length === 0) {
              failCallback('no extenders found');
              return;
            }
            extenders[fobId] = receivedExtenders;
            $log.debug('[extender-service] EXTENDERS: ' + extenders[fobId]);
            successCallback(fobId, extenders[fobId]);
          },
          function(error) {
            failCallback(error);
          });
      } else {
        successCallback(fobId, extenders[fobId]);
      }
    }

    function getNewFobExtenders(fobId, successCallback, failCallback) {

      $log.debug('[extender-service] QUERY: extenders for fob ' + fobId);

      var currentCount = (extenders[fobId] === undefined) ? 0 : extenders[fobId].length;

      Restangular.one('fobs', fobId).getList('extenders').then(
        function(fobExtenders) {
          $log.debug('[extender-service] RESPONSE: ', fobExtenders, fobExtenders.plain());

          var receivedExtenders = fobExtenders.plain();

          if (!receivedExtenders || receivedExtenders === undefined || receivedExtenders.length === 0) {
            failCallback('no extenders found');
            return;
          }

          var newExtender;

          if (extenders[fobId] === undefined || extenders[fobId].length === 0) {
            extenders[fobId] = receivedExtenders;
            newExtender = receivedExtenders[0];
          } else {
            newExtender = findNewExtender(fobId, receivedExtenders);
            extenders[fobId] = receivedExtenders;
          }

          $log.debug('[extender-service] EXTENDERS: ' + extenders[fobId]);

          successCallback(fobId, extenders[fobId], extenders[fobId].length - currentCount, newExtender);
        },
        function(error) {
          failCallback(error);
        });
    }


    function findNewExtender(fobId, newExtenders) {
      var newExtender;
      for (var n in newExtenders) {
        var tmpExtender = newExtenders[n];

        for (var e in extenders[fobId]) {
          var extender = extenders[fobId][e];
          if (tmpExtender.extender_id === extender.extender_id) {
            continue;
          }
          $log.debug('[extender-service] NEW EXTENDER: ' + tmpExtender);
          newExtender = tmpExtender;
        }

        if (newExtender) {
          return newExtender;
        }
      }

      return null;
    }

    function getExtenderById(fobId, extenderId) {
      for (var e in extenders[fobId]) {
        if (extenderId === extenders[fobId][e].extender_id) {
          return extenders[fobId][e];
        }
      }
    }

    function updateExtenderData(fobId, extenderId, extenderData, successCallback, failCallback) {

      $log.debug('[extender-service] UPDATING EXTENDER DATA - NAME: ' + extenderData.extenderName);

      Restangular.one('fobs', fobId).one('extenders', extenderId).customPUT({
        "extender_name": extenderData.extenderName
      }).then(function(theExtender) {
        $log.debug('[extender-service] UPDATING EXTENDER NAME');

        var extender = getExtenderById(fobId, extenderId);
        extender.extender_name = extenderData.extenderName;

        successCallback(theExtender);
      }, function(error) {
        failCallback(error);
      });

    }


    return {
      getFobExtenders: getFobExtenders,
      getNewFobExtenders: getNewFobExtenders,
      updateExtenderData: updateExtenderData
    };

  }

})();
