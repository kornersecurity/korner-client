(function() {
  'use strict';

  // IsReadyToArm



  /*jshint validthis: true */

  angular
    .module('app.core')
    .factory('FobTagCollection', fobTagCollection);

  /* @ngInject */
  function fobTagCollection(FobTagModel, Restangular, $q, $log, KornerMsgHelpers, $rootScope, NotificationService) {


    function FobTagCollection(fobID) {
      if (fobID) {
        this.fobID = fobID;
        this.tags = {};
        this.hasIssue = false;

        this._initializedDeferred = $q.defer();
      }
    }

    FobTagCollection.prototype = {
      onInitialize: onInitialize,
      hasInitialized: hasInitialized,

      processTagStatusMsg: processTagStatusMsg,
      loadRefreshTags: loadRefreshTags,
      addTagToCollectionWithID: addTagToCollectionWithID,
      getCount: getCount,
      getTagsArray: getTagsArray,
      tagsWithIssues: tagsWithIssues,
      removeTagFromCollectionWithID: removeTagFromCollectionWithID,
      getTagsEUI64Array: getTagsEUI64Array,

      //private
      _updateInternalState: _updateInternalState,
      _untagCollectionItems: _untagCollectionItems,
      _isKeyinCollection: _isKeyinCollection,
      _pruneUntaggedCollectionItems: _pruneUntaggedCollectionItems,
      _tagCollectionItemByKey: _tagCollectionItemByKey,


    };

    return FobTagCollection;


    // initializer
    function onInitialize() {
      var self = this;

      this.loadRefreshTags().then(function() {
        self._initializedDeferred.resolve();
      }, function(status) {
        self._initializedDeferred.reject(status);
      });
    }

    function hasInitialized() {
      return this._initializedDeferred;
    }


    function loadRefreshTags() {
      var self = this;
      var defer = $q.defer();

      self._untagCollectionItems();

      Restangular.one('fobs', self.fobID).all('tags').getList()
        .then(function(tagList) {
          var tagsListPlain = tagList.plain();
          var promises = [];

          for (var index in tagsListPlain) {

            var newFobTag = new FobTagModel(tagsListPlain[index]);
            self.tags[tagsListPlain[index].tag_id] = newFobTag;
            self.tags[tagsListPlain[index].tag_id].setTagFullName();
            promises.push(newFobTag.onInitialize());

            self._tagCollectionItemByKey(tagsListPlain[index].tag_id);

          }

          $q.all(promises).then(function() {
            self._pruneUntaggedCollectionItems();
            self._updateInternalState();
            NotificationService.notify();
            defer.resolve();
          });
        }, function(response) {
          $log.debug('[FobTagCollection] ERROR LOADING TAGS: '+response.status);
          if(response.status === 404 || response.message === 'Not logged in') {
            $rootScope.logOut();
          } else if(response.status === 401 || response.status === 0 || response.status === 503){
            $rootScope.restart();
          }
          defer.reject(response.status);
        });


      return defer.promise;
    }


    function processTagStatusMsg(msg) {
      var tag = this.tags[msg.Payload.DeviceID];
      if (tag !== undefined) {
        tag.processTagStatusMsg(msg);
      }

      this._updateInternalState();
    }


    function addTagToCollectionWithID(tagID) {
      var defer = $q.defer();
      var self = this;

      Restangular.one('fobs', self.fobID).one('tags', tagID).get()
        .then(function(theTag) {
            var fobTag = new FobTagModel(theTag);
            fobTag.onInitialize().then(function() {
              self.tags[fobTag.tag_id] = fobTag;
              defer.resolve();
            });

          },
          function(response) {
            $log.debug('[FobTagCollection] ERROR ADDING TAG: '+response.status);
            if(response.status === 404 || response.message === 'Not logged in') {
              $rootScope.logOut();
            } else if(response.status === 401 || response.status === 0 || response.status === 503){
              $rootScope.restart();
            }
            defer.reject(response);
          });

      return defer.promise;
    }

    function removeTagFromCollectionWithID(tagID) {
      var defer = $q.defer();
      var self = this;

      Restangular.one('fobs', self.fobID).one('tags', tagID).remove()
        .then(function() {

            // remove the tag from collection
            delete self.tags[tagID];

            defer.resolve();

          },
          function(response) {
            $log.debug('[FobTagCollection] ERROR REMOVING TAG: '+response.status);
            if(response.status === 404 || response.message === 'Not logged in') {
              $rootScope.logOut();
            } else if(response.status === 401 || response.status === 0 || response.status === 503){
              $rootScope.restart();
            }
            defer.reject(response);
          });

      return defer.promise;
    }

    function getCount() {
      return Object.keys(this.tags).length;
    }

    function getTagsArray() {
      var tagsArray = [];
      for (var index in this.tags) {
        tagsArray.push(this.tags[index]);
      }
      // $log.debug('[fob-tag-collection] TAGS IN ARRAY: ' + tagsArray.length);
      return tagsArray;
    }


    function getTagsEUI64Array() {
      var tagsArray = [];
      for (var index in this.tags) {
        tagsArray.push(this.tags[index].eui64);
      }
      $log.debug('[fob-tag-collection] TAGS IN ARRAY: ', tagsArray);
      return tagsArray;
    }

    function tagsWithIssues() {
      var issueTags = [];
      for (var index in this.tags) {
        if (this.tags[index].hasIssue) {
          issueTags.push(this.tags[index]);
        }
      }
      return issueTags;
    }

    // private methods

    function _updateInternalState() {
      for (var index in this.tags) {
        if (this.tags[index].hasIssue) {
          this.hasIssue = true;
          return;
        }
      }
      this.hasIssue = false;
    }
  }


  function _untagCollectionItems() {
    for (var index in self.fobs) {
      this.tags[index]._tagged = false;
    }
  }

  function _isKeyinCollection(key) {
    return (this.tags[key] !== undefined);
  }

  function _pruneUntaggedCollectionItems() {
    for (var index in self.tags) {
      if (this.tags[index]._tagged === false) {
        delete this.tags[index];
      }
    }
  }

  function _tagCollectionItemByKey(key) {
    this.tags[key]._tagged = true;
  }

})();
