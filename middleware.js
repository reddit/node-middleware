(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("./Thunker.js"), require("./Logger.js"), require("./PromiseWell.js"));
	else if(typeof define === 'function' && define.amd)
		define(["./Thunker.js", "./Logger.js", "./PromiseWell.js"], factory);
	else if(typeof exports === 'object')
		exports["middleware.js"] = factory(require("./Thunker.js"), require("./Logger.js"), require("./PromiseWell.js"));
	else
		root["middleware.js"] = factory(root["./Thunker.js"], root["./Logger.js"], root["./PromiseWell.js"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PromiseWell = exports.Logger = exports.Thunker = undefined;

	var _Thunker = __webpack_require__(1);

	var _Thunker2 = _interopRequireDefault(_Thunker);

	var _Logger = __webpack_require__(2);

	var _Logger2 = _interopRequireDefault(_Logger);

	var _PromiseWell = __webpack_require__(3);

	var _PromiseWell2 = _interopRequireDefault(_PromiseWell);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Thunker = _Thunker2.default;
	exports.Logger = _Logger2.default;
	exports.PromiseWell = _PromiseWell2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;