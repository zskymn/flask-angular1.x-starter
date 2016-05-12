//=require ./util/module.js
//=require ./alert/module.js

angular
  .module('base', [
    'vendor',
    'util',
    'alert'
  ]);

angular
  .module('base')
  .run(
    //=require ./tpls.js
  );
