'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
  return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {

      // Get module
      module = angular.module('dosIconDrawer');
      dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('dosIconDrawer.config')).toBe(true);
  });



  it('should load directives module', function() {
    expect(hasModule('dosIconDrawer.directives')).toBe(true);
  });


});