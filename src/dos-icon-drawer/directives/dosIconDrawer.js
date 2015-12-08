
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