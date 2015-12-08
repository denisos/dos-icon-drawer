(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('dosIconDrawer.config', [])
      .value('dosIconDrawer.config', {
          debug: true
      });

  // Modules
  angular.module('dosIconDrawer.directives', []);
  angular.module('dosIconDrawer',
      [
          'dosIconDrawer.config',
          'dosIconDrawer.directives'
      ]);

})(angular);


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

(function (angular) {

    'use strict';

    angular.module('dosIconDrawer.directives')
           .directive('dosIconDrawer', dosIconDrawer)
           .controller('DosIconDrawerController', DosIconDrawerController);

    /*
     * <dos-icon-drawer> directive. a container for one or more: <dos-drawer-panel>
     *  contains the icon bar, has the open close behavior with content area
     *   for content in panels
     *  all work is delegated to the controller DosIconDrawerController
     */
    function dosIconDrawer() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {},
            controller: 'DosIconDrawerController',
            controllerAs: 'vm',
            link: function(scope, element, attrs) {
            },
            template: '<div class="dos-icon-drawer" ng-class="{open: vm.open}">' +
                            '<div class="dos-icon-drawer-controls">' +
                                '<div class="iconbar">' +
                                    '<ul><li class="opener">' +
                                        '<a ng-click="vm.toggleOpen()">' +
                                            '<span class="fui-arrow-left open-control"></span>' +
                                            '<span class="fui-arrow-right close-control"></span>' +
                                        '</a>' +
                                    '</li></ul>' +
                                    '<ul class="" ng-class="" ng-transclude>' +
                                    '</ul>' +
                                '</div>' +
                                '<div class="icon-drawer-toggle" ng-click="vm.toggleOpen()">' +
                                '</div>' +
                            '</div>' +
                            '<div class="dos-icon-drawer-content">' +
                                '<div class="drawer-panel"' +
                                    'ng-repeat="panel in vm.panels"'  +
                                    'ng-class="{active: panel.active}"' +
                                    'dos-icon-drawer-content-transclude="panel">' +
                                '</div>' +
                            '</div>' +
                       '</div>'
        };
    }


    DosIconDrawerController.$inject = ['$scope', '$element'];

    function DosIconDrawerController($scope, $element) {
        var vm = this;

        // public properties
        vm.panels = [];   // list of content panels within drawer
        vm.open = false;  // initially closed

        // public api
        vm.toggleOpen = toggleOpen;
        vm.select = select;
        vm.addPanel = addPanel;
        vm.removePanel = removePanel;

        // private methods (which may or may not be exposed as public)
        /*
         * handle drawer open close arrows, when opened show first
         */
        function toggleOpen() {
            vm.open = ! vm.open;

            if (vm.open) {
                if (vm.panels.length) {
                    vm.panels[0].active = true;
                }

                // trigger open event passing panel.id
            } else {
                // drawer closed so deactivate all
                deactivateAllPanels();

                // trigger closed event
            }
        }

        /*
         * when a drawer panel is selected, deactivate others, activate it and
         *  open the drawer if not already opened
         */
        function select(panel) {
            deactivateAllPanels();

            panel.active = true;    // sets active state

            // open icon-drawer if closed
            if (! vm.open) {
                vm.open = true;
            }

            // trigger open event passing panel.id
        }

        /**
         * add a panel to the drawers panels list
         */
        function addPanel(panel) {
            vm.panels.push(panel);
            if (vm.panels.length === 1) {
                vm.select(panel);
            }
        }

        /**
         * remove a panel from the drawers panels list
         */
        function removePanel(panel) {
            var index = vm.panels.indexOf(panel);
            //Select a new drawer if the drawer to be removed is selected
            if (panel.active && vm.panels.length > 1) {
                // if this is the last drawer panel, select the previous drawer panel
                // else, the next drawer panel
                var newActiveIndex = index === vm.panels.length - 1 ? index - 1 : index + 1;
                vm.select(vm.panels[newActiveIndex]);
            }
            vm.panels.splice(index, 1);
        }

        /*
         * sets all drawer panels active property to false
         */
        function deactivateAllPanels() {
            vm.panels.forEach(function(panel) {
                panel.active = false;
            });
        }
    }

})(angular);

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