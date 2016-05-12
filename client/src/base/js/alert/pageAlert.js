angular
  .module('alert')
  .directive('pageAlert', function () {
    return {
      restrict: 'A',
      scope: true,
      templateUrl: 'base/alert/main.html',
      link: function () {},
      controller: function (alertSrv) {
        var vm = this;
        vm.alertList = alertSrv.list;
        vm.clear = alertSrv.clear;
      },
      controllerAs: 'Alert'
    };
  });
