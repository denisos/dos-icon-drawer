'use strict';

// Test the dosIconDrawer directive
//
describe('dosIconDrawer', function() {
    // Store references to scope and element
    // so they are available to all tests in this describe block
    var element,
        scope,
        $compile,
        $rootScope;

    // Load the module, which contains the directive
    beforeEach(module('dosIconDrawer'));


    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        // make scope and put data into it
        scope = $rootScope.$new();
        scope.vm = {};

        // compile some html with the directive and provide the scope
        // 2 fields, each a date; end_date should be after start_date
        //
        element = $compile('<dos-icon-drawer>' +
                           '</dos-icon-drawer>')(scope);

        $rootScope.$digest(); // fire all watches

    }));

    afterEach(function() {
        scope.$destroy();  // scope is not cleaned up within Karma so must destroy
    });

    it('should create drawer icon bar controls', function() {
        console.log(element);

        expect(angular.element(element[0].querySelector('.dos-icon-drawer-controls')).length).toBe(1);
    });

    it('should create drawer content area', function() {
        expect(angular.element(element[0].querySelector('.dos-icon-drawer-content')).length).toBe(1);
    });

    it('should be closed by default', function() {
        expect(angular.element(element[0].querySelector('.open')).length).toBe(0);
    });

    it('should set state to open when opened', function() {
        // isolateScope() part of angular.element api to get the scope of a directive
        var isolateScope = element.isolateScope();

        // default should be closed
        expect(isolateScope.vm.open).toBe(false);

        // now open it
        isolateScope.vm.toggleOpen();

        expect(isolateScope.vm.open).toBe(true);
    });







    it('should create controls', function() {

    //    expect(angular.element(element[0].querySelector('.dos-icon-drawer')).length).toBe(1);

        //
        //angular.element(element[0].querySelector('.dos-icon-drawer-controls'));

        //expect(angular.element(element.querySelector('dos-icon-drawer')).length).toBe(1);

        //expect(angular.element(element).find('li').length).toBe(1);

        //expect(element.querySelector('dos-icon-drawer').length).toBe(1);

        //expect(element.hasClass('li').length).toBe(true);
    });

});
