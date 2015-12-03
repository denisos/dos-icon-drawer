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
