
(function (angular) {

    'use strict';

    angular.module('dosIconDrawer.directives')
           .directive('dosIconDrawerContentTransclude', dosIconDrawerContentTransclude);

    dosIconDrawerContentTransclude.$inject = ['$parse'];

    function dosIconDrawerContentTransclude($parse) {
        return {
          restrict: 'A',
          link: function(scope, elm, attrs) {
            scope.$watch($parse(attrs.dosIconDrawerContentTransclude), function(panel) {
              // elm is a panel
              elm.html('');
              if (panel) {
                  // transclude (append) the content
                  elm.append(panel.contentElement);
              }
            });
          }
        };
    }

})(angular);