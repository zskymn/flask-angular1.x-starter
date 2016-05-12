//=require ../node_modules/lodash-modern/lodash.min.js
//=require ../node_modules/jquery/dist/jquery.min.js
//=require ../node_modules/angular/angular.min.js
//=require ../node_modules/angular-ui-router/release/angular-ui-router.min.js

angular
  .module('vendor', [
    'ui.bootstrap',
    'ui.router'
  ])
  .config(function($tooltipProvider) {
    $tooltipProvider.options({
      placement: 'top',
      animation: true,
      popupDelay: 0,
      appendToBody: true
    });
  });
