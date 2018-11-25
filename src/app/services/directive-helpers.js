/**=========================================================
 * Module: classy-loader.js
 * Enable use of classyloader directly from data attributes
 =========================================================*/

/* @ngInject */
App.directive('classyloader', function($timeout, $log) {
  'use strict';

  var $scroller = $(window),
    inViewFlagClass = 'js-is-in-view'; // a classname to detect when a chart has been triggered after scroll

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // run after interpolation
      $timeout(function() {

        var $element = $(element),
          options = $element.data();

        // At lease we need a data-percentage attribute
        if (options) {
          if (options.triggerInView) {

            $scroller.scroll(function() {
              checkLoaderInVIew($element, options);
            });
            // if the element starts already in view
            checkLoaderInVIew($element, options);
          } else
            startLoader($element, options);
        }

      }, 0);

      function checkLoaderInVIew(element, options) {
        var offset = -20;
        if (!element.hasClass(inViewFlagClass) &&
          $.Utils.isInView(element, {
            topoffset: offset
          })) {
          startLoader(element, options);
        }
      }

      function startLoader(element, options) {
        element.ClassyLoader(options).addClass(inViewFlagClass);
      }
    }
  };
});


/**
 * Loading Bar Spinner Directive
 *
 * This will allow the users to place the element anywhere in the DOM as per Issue #66
 */
App.directive('cfpLoadingIndicator', function($log) {

  return {
    template: '<p>Hello dan</p><div id="loading-bar-spinner"><div class="spinner-icon"></div></div>',
    replace: true,
    restrict: 'EA',
    link: function postLink(scope, element) {
      var startEvent = 'cfpLoadingBar:loading';
      var endEvent = 'cfpLoadingBar:completed';
      var eventHandlerRemovers = [];

      function startProgress() {
        $log.debug("cfpLoadingIndicator:startProgress");

        element.show();
      }

      function endProgress() {
        $log.debug("cfpLoadingIndicator:endProgress");

        element.hide();
      }

      function destroyController(){
        for(var handler in eventHandlerRemovers){
          eventHandlerRemovers[handler]();
        }
        eventHandlerRemovers = [];

        $log.debug('[directive-helpers - cfpLoadingIndicator] DESTROYING');
      }


      eventHandlerRemovers.push(scope.$on(startEvent, startProgress));
      eventHandlerRemovers.push(scope.$on(endEvent, endProgress));
      scope.$on('$destroy', destroyController);
    }
  };
});


App.directive('youtube', function($window, YT_event, $log) {
  return {
    restrict: "E",

    scope: {
      height: "@",
      width: "@",
      videoid: "@"
    },

    template: '<div></div>',

    link: function(scope, element, attrs, $rootScope) {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;

      $window.onYouTubeIframeAPIReady = function() {

        player = new YT.Player(element.children()[0], {
          playerVars: {
            autoplay: 0,
            html5: 1,
            theme: "light",
            modesbranding: 0,
            color: "white",
            iv_load_policy: 3,
            showinfo: 1,
            controls: 1
          },

          height: scope.height,
          width: scope.width,
          videoId: scope.videoid,

          events: {
            'onStateChange': function(event) {

              var message = {
                event: YT_event.STATUS_CHANGE,
                data: ""
              };

              switch (event.data) {
                case YT.PlayerState.PLAYING:
                  message.data = "PLAYING";
                  break;
                case YT.PlayerState.ENDED:
                  message.data = "ENDED";
                  break;
                case YT.PlayerState.UNSTARTED:
                  message.data = "NOT PLAYING";
                  break;
                case YT.PlayerState.PAUSED:
                  message.data = "PAUSED";
                  break;
              }

              scope.$apply(function() {
                scope.$emit(message.event, message.data);
              });
            }
          }
        });
      };

      scope.$watch('height + width', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }

        player.setSize(scope.width, scope.height);

      });

      scope.$watch('videoid', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }

        player.cueVideoById(scope.videoid);

      });

      eventHandlerRemovers.push(scope.$on(YT_event.STOP, function() {
        player.seekTo(0);
        player.stopVideo();
      }));

      eventHandlerRemovers.push(scope.$on(YT_event.PLAY, function() {
        player.playVideo();
      }));

      eventHandlerRemovers.push(scope.$on(YT_event.PAUSE, function() {
        player.pauseVideo();
      }));

    }
  };
});
