(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Thunker.js"] = factory();
	else
		root["Thunker.js"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = {
	  create: function create() {
	    var storeQueue = [];
	    var actionQueue = [];

	    var waitForAction = function waitForAction(actionFn) {
	      var cb = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
	      return new Promise(function (resolve, reject) {
	        actionQueue = actionQueue.concat([[actionFn, function (state) {
	          return resolve(state);
	        }]]);
	      }).then(cb);
	    };

	    return function (store) {
	      return function (next) {
	        return function (action) {
	          var dispatch = store.dispatch;
	          var getState = store.getState;


	          var state = getState();

	          var waitForState = function waitForState(stateFn) {
	            var cb = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
	            var stateFailedFn = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];
	            return new Promise(function (resolve, reject) {
	              if (!stateFn(state)) {
	                storeQueue = storeQueue.concat([[stateFn, function (newState) {
	                  return resolve(newState);
	                }]]);
	                stateFailedFn(state);
	              } else {
	                resolve(state);
	              }
	            }).then(cb);
	          };

	          if (typeof action === 'function') {
	            var result = action(dispatch, getState, { waitForState: waitForState, waitForAction: waitForAction });

	            if (!(result instanceof Promise)) {
	              throw new Error('Thunked actions must return promises');
	            }

	            return next(result);
	          }

	          actionQueue = actionQueue.filter(function (_ref) {
	            var _ref2 = _slicedToArray(_ref, 2);

	            var actionFn = _ref2[0];
	            var cb = _ref2[1];

	            if (actionFn(action)) {
	              cb(state);
	              return false;
	            }

	            return true;
	          });

	          // order of operations is very important here.
	          // for the store queue to process properly, we need to let the new action
	          // make its way into the store first before we check if any queued
	          // waitForState situations are resolveable
	          next(action);

	          // also important, the store queue filter function must re-fetch state
	          // using getState, otherwise the aforementioned action's effects will not
	          // be reflected in the filter function.
	          storeQueue = storeQueue.filter(function (_ref3) {
	            var _ref4 = _slicedToArray(_ref3, 2);

	            var stateFn = _ref4[0];
	            var cb = _ref4[1];

	            var state = getState();
	            if (stateFn(state)) {
	              cb(state);
	              return false;
	            }

	            return true;
	          });
	        };
	      };
	    };
	  }
	};

/***/ }
/******/ ])
});
;