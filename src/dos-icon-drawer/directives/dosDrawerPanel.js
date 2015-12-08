
(function (angular) {

    'use strict';

    angular.module('dosIconDrawer.directives')
           .directive('dosDrawerPanel', dosDrawerPanel);

    // no inject needed dosDrawerPanel.$inject = [];

    function dosDrawerPanel() {
        return {
          require: '^dosIconDrawer',
          restrict: 'E',
          replace: true,
          transclude: true,
          scope: {
            onSelect: '&select' // optional callback for when panel selected
          },
          controller: function() {
            //Empty controller so other directives can require being 'under' a panel
          },
          template: '<li ng-class="{active: active}">' +
                        '<a ng-click="select()" class="{{icon}}">' +
                            '<span class="title">{{iconTitle}}</span>' +
                        '</a>' +
                    '</li>',
          compile: function(elm, attrs, transclude) {
            return function postLink(scope, elm, attrs, iconDrawerCtrl) {

                scope.active = false; // default value
                scope.$watch('active', function(active) {
                    if (active) {
                        // tell parent this is active
                        iconDrawerCtrl.select(scope);

                        // call the callback
                        if (angular.isFunction(scope.onSelect)) {
                            scope.onSelect();
                        }
                    }
                });

                // put panel attribute iconTitle on scope for view
                if (attrs.iconTitle) {
                    scope.iconTitle = attrs.iconTitle;
                }

                // put panel attribute icon on scope for view
                if (attrs.icon) {
                    scope.icon = attrs.icon;
                }

                // put slide id attribute icon on scope for view
                if (attrs.panelId) {
                    scope.panelId = attrs.panelId;
                }

                // if you ever wanted to support disabled drawer panels then
                //    pass in disabled flag in attrs e.g. attrs.disabled
                //     and set scope variable e.g. "disabled" from that;

                /*
                 * user selected this slide
                 */
                scope.select = function() {
                    scope.active = true;
                    // note: if was supporting disabled then only set active if not disabled
                };

                // add this panel scope to parents list
                iconDrawerCtrl.addPanel(scope);
                scope.$on('$destroy', function() {
                    iconDrawerCtrl.removePanel(scope);
                });

                // transclude the collection of sibling elements to build the
                //  icon bar tabs
                transclude(scope.$parent, function(clone) {
                  scope.contentElement = clone;
                });

            };
          }
        };
}

})(angular);