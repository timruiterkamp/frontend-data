webpackHotUpdate("main",{

/***/ "":
false,

/***/ "./src/scripts/interactions.js":
/*!*************************************!*\
  !*** ./src/scripts/interactions.js ***!
  \*************************************/
/*! exports provided: initInteractions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initInteractions\", function() { return initInteractions; });\n/* harmony import */ var _stateData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stateData.js */ \"./src/scripts/stateData.js\");\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ \"./src/scripts/index.js\");\n\n\nvar randomCountry = findElement('#nextItem');\n\nfunction initInteractions() {\n  var flyToLocation = findElement('#flyToLocation');\n  var mapSection = findElement('.map-section');\n  _stateData_js__WEBPACK_IMPORTED_MODULE_0__[\"filterAllData\"].then(function (data) {\n    initRandomCountrySelector(data);\n  }); // Event listeners\n\n  flyToLocation.addEventListener('click', function () {\n    state.data.init = false;\n    styleBeforeElement('#map:before', {\n      display: 'none'\n    });\n    _index_js__WEBPACK_IMPORTED_MODULE_1__[\"map\"].flyTo({\n      zoom: 4,\n      bearing: 0,\n      speed: 0.7,\n      curve: 1\n    });\n    setTimeout(function () {\n      mapSection.style = 'transform: translateX(0);';\n    }, 750);\n  });\n}\n\nfunction initRandomCountrySelector(data) {\n  randomCountry.addEventListener('click', function () {\n    var randomCountry = data[Math.floor(Math.random() * data.length)];\n    state.data.showCountryInfo = true;\n    state.data.country = randomCountry.country;\n    state.data.debt = randomCountry.debt;\n    state.data.population = randomCountry.population[0].value;\n    state.data.currGeoLocation = {\n      lat: randomCountry.lat,\n      long: randomCountry.long\n    };\n    state.data.selectedCountryProducts = randomCountry.food;\n    Object(_index_js__WEBPACK_IMPORTED_MODULE_1__[\"generateChartWithCountryInfo\"])(randomCountry);\n    document.querySelector('.map-section').style = 'width: 45vw; transform: translateX(0)';\n    _index_js__WEBPACK_IMPORTED_MODULE_1__[\"map\"].flyTo({\n      center: [randomCountry.long, randomCountry.lat],\n      pitch: 40,\n      zoom: 6,\n      offset: [-300, 0]\n    });\n  });\n}\n\nfunction findElement(d) {\n  return document.querySelector(d);\n} // Solution by https://stackoverflow.com/questions/7330355/javascript-set-css-after-styles/7330454#7330454\n\n\nvar styleBeforeElement = function (style) {\n  var sheet = document.head.appendChild(style).sheet;\n  return function (selector, css) {\n    var propText = Object.keys(css).map(function (p) {\n      return p + ':' + css[p];\n    }).join(';');\n    sheet.insertRule(selector + '{' + propText + '}', sheet.cssRules.length);\n  };\n}(document.createElement('style'));\n\n\n\n//# sourceURL=webpack:///./src/scripts/interactions.js?");

/***/ }),

/***/ "./src/styles/index.css":
/*!******************************!*\
  !*** ./src/styles/index.css ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/styles/index.css?");

/***/ })

})