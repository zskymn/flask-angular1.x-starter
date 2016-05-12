angular
  .module('util')
  .service('utilSrv', function($rootScope, $modal, $q, $timeout) {
    var vm = this;

    vm.init = function() {
      $rootScope.onAppEvent('show-modal', this.showModal);
    };

    vm.showModal = function(e, options) {
      $rootScope.appEvent('hide-modal');
      options = _.defaults(options, {
        persist: false,
        show: false,
        keyboard: true,
        backdrop: 'static',
        scope: $rootScope.$new()
      });
      var modal = $modal.open(options);
      options.scope.onAppEvent('hide-modal', function() {
        modal.close();
      });
    };

    vm.debounce = function(func, wait) {
      return _.debounce(function() {
        var context = this,
          args = arguments;
        $timeout(function() {
          func.apply(context, args);
        });
      }, (_.isNumber(wait) && wait) || 300);
    };
  });
