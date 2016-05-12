angular
  .module('util', []);

//=require ./util.srv.js
//=require ./arrayJoin.js

angular
  .module('util')
  .run(function ($rootScope) {
    $rootScope.onAppEvent = function (name, callback) {
      if (this.$$destroyed) {
        return angular.noop;
      }
      var unbind = $rootScope.$on(name, callback);
      this.$on('$destroy', unbind);
      return unbind;
    };
    $rootScope.appEvent = $rootScope.$emit;
  })
  .run(function (alertSrv, utilSrv, $rootScope) {
    $rootScope._ = _;
    alertSrv.init();
    utilSrv.init();
    $rootScope.dashAlerts = alertSrv;
  });
