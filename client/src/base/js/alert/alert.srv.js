angular
  .module('alert')
  .service('alertSrv', function ($timeout, $sce, $rootScope) {
    var vm = this;
    vm.list = [];
    vm.init = init;
    vm.clear = clear;

    function init() {
      $rootScope.onAppEvent('alert-error', function (e, alert) {
        set(alert[0], alert[1], 'error');
      });
      $rootScope.onAppEvent('alert-warning', function (e, alert) {
        set(alert[0], alert[1], 'warning', 5000);
      });
      $rootScope.onAppEvent('alert-success', function (e, alert) {
        set(alert[0], alert[1], 'success', 3000);
      });
      $rootScope.onAppEvent('confirm-modal', showConfirmModal);
      $rootScope.onAppEvent('tip-modal', showTipModal);
    }

    function set(title, text, severity, timeout) {
      var _a = {
          title: title || '',
          text: $sce.trustAsHtml(text || ''),
          severity: severity || 'success',
        },
        _ca = angular.toJson(_a);

      _.chain(vm.list).remove(function (val) {
        return angular.toJson(val) === _ca;
      }).value();

      vm.list.push(_a);
      if (timeout > 0) {
        $timeout(function () {
          vm.list = _.without(vm.list, _a);
        }, timeout);
      }
      return _a;
    }

    function clear(alert) {
      vm.list = _.without(vm.list, alert);
    }

    function showConfirmModal(e, payload) {
      var scope = $rootScope.$new();
      scope.title = payload.title;
      scope.text = payload.text;
      scope.onConfirm = payload.onConfirm;
      $rootScope.appEvent('show-modal', {
        templateUrl: 'base/alert/confirm_modal.html',
        modalClass: 'confirm-modal',
        scope: scope,
        backdrop: 'static',
        keyboard: false
      });

    }

    function showTipModal(e, payload) {
      var scope = $rootScope.$new();
      scope.title = payload.title;
      scope.text = payload.text;
      $rootScope.appEvent('show-modal', {
        templateUrl: 'base/alert/tip_modal.html',
        modalClass: 'confirm-modal',
        scope: scope,
        size: payload.size || '',
        backdrop: 'static',
        keyboard: true
      });
    }
  });
