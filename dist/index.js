/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "wps-hmr.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "wps-hmr.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "fb8e8e2daf8e46b69fa4";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack-plugin-serve/client.js":
/*!****************************************!*\
  !*** (webpack)-plugin-serve/client.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n  Copyright © 2018 Andrew Powell\n\n  This Source Code Form is subject to the terms of the Mozilla Public\n  License, v. 2.0. If a copy of the MPL was not distributed with this\n  file, You can obtain one at http://mozilla.org/MPL/2.0/.\n\n  The above copyright notice and this permission notice shall be\n  included in all copies or substantial portions of this Source Code Form.\n*/\n\n/**\n * @note This file exists merely as an easy reference for folks adding it to their configuration entries\n */\n\n(() => {\n  if (window.webpackPluginServe) {\n    return;\n  }\n\n  window.webpackPluginServe = true;\n\n  // eslint-disable-next-line global-require\n  __webpack_require__(/*! ./lib/client */ \"./node_modules/webpack-plugin-serve/lib/client.js\");\n})();\n\n\n//# sourceURL=webpack:///(webpack)-plugin-serve/client.js?");

/***/ }),

/***/ "./node_modules/webpack-plugin-serve/lib/client-hmr.js":
/*!************************************************!*\
  !*** (webpack)-plugin-serve/lib/client-hmr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n  Copyright © 2018 Andrew Powell\n\n  This Source Code Form is subject to the terms of the Mozilla Public\n  License, v. 2.0. If a copy of the MPL was not distributed with this\n  file, You can obtain one at http://mozilla.org/MPL/2.0/.\n\n  The above copyright notice and this permission notice shall be\n  included in all copies or substantial portions of this Source Code Form.\n*/\nconst { error, info, refresh, warn } = __webpack_require__(/*! ./client-log */ \"./node_modules/webpack-plugin-serve/lib/client-log.js\");\n\nconst { apply, check, status } = module.hot;\nlet latest = true;\n\nconst hmr = {\n  onUnaccepted(data) {\n    warn('Change in unaccepted module(s):\\n', data);\n    warn(data);\n  },\n  onDeclined(data) {\n    warn('Change in declined module(s):\\n', data);\n  },\n  onErrored(data) {\n    error('Error in module(s):\\n', data);\n  }\n};\n\nconst replace = async (hash) => {\n  if (hash) {\n    // eslint-disable-next-line no-undef\n    latest = hash.includes(__webpack_require__.h());\n  }\n\n  if (!latest) {\n    const hmrStatus = status();\n\n    if (hmrStatus === 'abort' || hmrStatus === 'fail') {\n      warn(`An HMR update was triggered, but ${hmrStatus}ed. ${refresh}`);\n      return;\n    }\n\n    let modules = await check(false);\n\n    if (!modules) {\n      warn(`No modules found for replacement. ${refresh}`);\n      return;\n    }\n\n    modules = await apply(hmr);\n\n    if (modules) {\n      latest = true;\n      info(`Build ${hash.slice(0, 7)} replaced:\\n`, modules);\n    }\n  }\n};\n\nmodule.exports = { replace };\n\n\n//# sourceURL=webpack:///(webpack)-plugin-serve/lib/client-hmr.js?");

/***/ }),

/***/ "./node_modules/webpack-plugin-serve/lib/client-log.js":
/*!************************************************!*\
  !*** (webpack)-plugin-serve/lib/client-log.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n  Copyright © 2018 Andrew Powell\n\n  This Source Code Form is subject to the terms of the Mozilla Public\n  License, v. 2.0. If a copy of the MPL was not distributed with this\n  file, You can obtain one at http://mozilla.org/MPL/2.0/.\n\n  The above copyright notice and this permission notice shall be\n  included in all copies or substantial portions of this Source Code Form.\n*/\nconst { error, info, warn } = console;\nconst log = {\n  error: error.bind(console, '⬡ wps:'),\n  info: info.bind(console, '⬡ wps:'),\n  refresh: 'Please refresh the page',\n  warn: warn.bind(console, '⬡ wps:')\n};\n\nmodule.exports = log;\n\n\n//# sourceURL=webpack:///(webpack)-plugin-serve/lib/client-log.js?");

/***/ }),

/***/ "./node_modules/webpack-plugin-serve/lib/client.js":
/*!********************************************!*\
  !*** (webpack)-plugin-serve/lib/client.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n  Copyright © 2018 Andrew Powell\n\n  This Source Code Form is subject to the terms of the Mozilla Public\n  License, v. 2.0. If a copy of the MPL was not distributed with this\n  file, You can obtain one at http://mozilla.org/MPL/2.0/.\n\n  The above copyright notice and this permission notice shall be\n  included in all copies or substantial portions of this Source Code Form.\n*/\nconst { replace } = __webpack_require__(/*! ./client-hmr */ \"./node_modules/webpack-plugin-serve/lib/client-hmr.js\");\nconst { error, info, refresh, warn } = __webpack_require__(/*! ./client-log */ \"./node_modules/webpack-plugin-serve/lib/client-log.js\");\nconst { init: initProgress } = __webpack_require__(/*! ./overlays/progress */ \"./node_modules/webpack-plugin-serve/lib/overlays/progress.js\");\nconst { init: initMinimalProgress } = __webpack_require__(/*! ./overlays/progress-minimal */ \"./node_modules/webpack-plugin-serve/lib/overlays/progress-minimal.js\");\nconst { init: initStatus } = __webpack_require__(/*! ./overlays/status */ \"./node_modules/webpack-plugin-serve/lib/overlays/status.js\");\n\n// eslint-disable-next-line no-undef, no-unused-vars\nconst options = {\"client\":null,\"compress\":null,\"historyFallback\":false,\"hmr\":true,\"host\":null,\"liveReload\":true,\"log\":{\"level\":\"info\",\"prefix\":{\"template\":\"{{level}}\"},\"name\":\"webpack-plugin-serve\"},\"open\":false,\"port\":1337,\"progress\":true,\"secure\":false,\"static\":[\"/Users/timruiterkamp1/Documents/School/leerjaar 3/techtrack/frontend-data\"],\"status\":true,\"address\":\"[::]:1337\"};\nconst { address, client, progress, secure, status } = options;\nconst protocol = secure ? 'wss' : 'ws';\nconst socket = new WebSocket(`${protocol}://${(client || {}).address || address}/wps`);\n\n// prevents ECONNRESET errors on the server\nwindow.addEventListener('beforeunload', () => socket.close());\n\nsocket.addEventListener('message', (message) => {\n  const { action, data } = JSON.parse(message.data);\n  const { errors, hash = '<?>', warnings } = data || {};\n  const shortHash = hash.slice(0, 7);\n\n  switch (action) {\n    case 'connected':\n      info('WebSocket connected');\n      break;\n    case 'errors':\n      error(`Build ${shortHash} produced errors:\\n`, errors);\n      break;\n    case 'reload':\n      window.location.reload();\n      break;\n    case 'replace':\n      replace(hash);\n      break;\n    case 'warnings':\n      warn(`Build ${shortHash} produced warnings:\\n`, warnings);\n      break;\n    default:\n  }\n});\n\nsocket.onclose = () => warn(`The client WebSocket was closed. ${refresh}`);\n\nif (progress === 'minimal') {\n  initMinimalProgress(options, socket);\n} else if (progress) {\n  initProgress(options, socket);\n}\n\nif (status) {\n  initStatus(options, socket);\n}\n\nif (true) {\n  info('Hot Module Replacement is active');\n\n  if (options.liveReload) {\n    info('Live Reload taking precedence over Hot Module Replacement');\n  }\n} else {}\n\nif (false) {}\n\n\n//# sourceURL=webpack:///(webpack)-plugin-serve/lib/client.js?");

/***/ }),

/***/ "./node_modules/webpack-plugin-serve/lib/overlays/progress-minimal.js":
/*!***************************************************************!*\
  !*** (webpack)-plugin-serve/lib/overlays/progress-minimal.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n  Copyright © 2018 Andrew Powell, Matheus Gonçalves da Silva\n\n  This Source Code Form is subject to the terms of the Mozilla Public\n  License, v. 2.0. If a copy of the MPL was not distributed with this\n  file, You can obtain one at http://mozilla.org/MPL/2.0/.\n\n  The above copyright notice and this permission notice shall be\n  included in all copies or substantial portions of this Source Code Form.\n*/\nconst { addCss, addHtml } = __webpack_require__(/*! ./util */ \"./node_modules/webpack-plugin-serve/lib/overlays/util.js\");\n\nconst ns = 'wps-progress-minimal';\nconst html = `\n<div id=\"${ns}\" class=\"${ns}-hidden\">\n  <div id=\"${ns}-bar\"></div>\n</div>\n`;\nconst css = `\n#${ns} {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 4px;\n  width: 100vw;\n}\n\n#${ns}-bar {\n  width: 0%;\n  height: 4px;\n  background-color: rgb(186, 223, 172);\n  transition: width 1s ease-in-out;\n}\n\n.${ns}-hidden{\n  display: none;\n}\n`;\n\nconst update = (percent) => {\n  const bar = document.querySelector(`#${ns}-bar`);\n  bar.style.width = `${percent}%`;\n};\n\nconst reset = (wrapper) => {\n  wrapper.classList.add(`${ns}-hidden`);\n  setTimeout(() => update(0), 1e3);\n};\n\nconst init = (options, socket) => {\n  document.addEventListener('DOMContentLoaded', () => {\n    addHtml(html);\n    addCss(css);\n  });\n\n  socket.addEventListener('message', (message) => {\n    const { action, data } = JSON.parse(message.data);\n\n    if (action !== 'progress') {\n      return;\n    }\n\n    const percent = Math.floor(data.percent * 100);\n    const wrapper = document.querySelector(`#${ns}`);\n\n    wrapper.classList.remove(`${ns}-hidden`);\n\n    if (data.percent === 1) {\n      setTimeout(() => reset(wrapper), 5e3);\n    }\n\n    update(percent);\n  });\n};\n\nmodule.exports = {\n  init\n};\n\n\n//# sourceURL=webpack:///(webpack)-plugin-serve/lib/overlays/progress-minimal.js?");

/***/ }),

/***/ "./node_modules/webpack-plugin-serve/lib/overlays/progress.js":
/*!*******************************************************!*\
  !*** (webpack)-plugin-serve/lib/overlays/progress.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n  Copyright © 2018 Andrew Powell, Matheus Gonçalves da Silva\n\n  This Source Code Form is subject to the terms of the Mozilla Public\n  License, v. 2.0. If a copy of the MPL was not distributed with this\n  file, You can obtain one at http://mozilla.org/MPL/2.0/.\n\n  The above copyright notice and this permission notice shall be\n  included in all copies or substantial portions of this Source Code Form.\n*/\nconst { addCss, addHtml } = __webpack_require__(/*! ./util */ \"./node_modules/webpack-plugin-serve/lib/overlays/util.js\");\n\nconst ns = 'wps-progress';\nconst css = `\n@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');\n\n#${ns}{\n  width: 200px;\n  height: 200px;\n  position: absolute;\n  right: 5%;\n  top: 5%;\n  transition: opacity .25s ease-in-out;\n  z-index: 1000;\n}\n\n#${ns}-bg {\n  fill: #282d35;\n}\n\n#${ns}-fill {\n  fill: rgba(0, 0, 0, 0);\n  stroke: rgb(186, 223, 172);\n  stroke-dasharray: 219.99078369140625;\n  stroke-dashoffset: -219.99078369140625;\n  stroke-width: 10;\n  transform: rotate(90deg)translate(0px, -80px);\n  transition: stroke-dashoffset 1s;\n}\n\n#${ns}-percent {\n  font-family: 'Open Sans';\n  font-size: 18px;\n  fill: #ffffff;\n}\n\n#${ns}-percent-value {\n  alignment-baseline: middle;\n  text-anchor: middle;\n}\n\n#${ns}-percent-super {\n  fill: #bdc3c7;\n  font-size: .45em;\n  baseline-shift: 10%;\n}\n\n.${ns}-noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  cursor: default;\n}\n\n@keyframes ${ns}-hidden-display {\n\t0% {\n\t\topacity: 1;\n\t\ttransform: scale(1);\n\t\t-webkit-transform: scale(1);\n\t}\n\t99% {\n\t\tdisplay: inline-flex;\n\t\topacity: 0;\n\t\ttransform: scale(0);\n\t\t-webkit-transform: scale(0);\n\t}\n\t100% {\n\t\tdisplay: none;\n\t\topacity: 0;\n\t\ttransform: scale(0);\n\t\t-webkit-transform: scale(0);\n\t}\n}\n\n.${ns}-hidden{\n  animation: ${ns}-hidden-display .3s;\n  animation-fill-mode:forwards;\n  display: inline-flex;\n}\n`;\n\nconst html = `\n<svg id=\"${ns}\" class=\"${ns}-noselect ${ns}-hidden\" x=\"0px\" y=\"0px\" viewBox=\"0 0 80 80\">\n  <circle id=\"${ns}-bg\" cx=\"50%\" cy=\"50%\" r=\"35\"></circle>\n  <path id=\"${ns}-fill\" d=\"M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0\" />\n  <text id=\"${ns}-percent\" x=\"50%\" y=\"51%\"><tspan id=\"${ns}-percent-value\">0</tspan><tspan id=\"${ns}-percent-super\">%</tspan></text>\n</svg>\n`;\n\nconst update = (percent) => {\n  const max = -219.99078369140625;\n  const value = document.querySelector(`#${ns}-percent-value`);\n  const track = document.querySelector(`#${ns}-fill`);\n  const offset = ((100 - percent) / 100) * max;\n\n  track.setAttribute('style', `stroke-dashoffset: ${offset}`);\n  value.innerHTML = percent.toString();\n};\n\nconst reset = (svg) => {\n  svg.classList.add(`${ns}-hidden`);\n  setTimeout(() => update(0), 1e3);\n};\n\nconst init = (options, socket) => {\n  document.addEventListener('DOMContentLoaded', () => {\n    addCss(css);\n    addHtml(html);\n  });\n\n  socket.addEventListener('message', (message) => {\n    const { action, data } = JSON.parse(message.data);\n\n    if (action !== 'progress') {\n      return;\n    }\n\n    const percent = Math.floor(data.percent * 100);\n    const svg = document.querySelector(`#${ns}`);\n\n    if (!svg) {\n      return;\n    }\n\n    // we can safely call this even if it doesn't have the class\n    svg.classList.remove(`${ns}-hidden`);\n\n    if (data.percent === 1) {\n      setTimeout(() => reset(svg), 5e3);\n    }\n\n    update(percent);\n  });\n};\n\nmodule.exports = { init };\n\n\n//# sourceURL=webpack:///(webpack)-plugin-serve/lib/overlays/progress.js?");

/***/ }),

/***/ "./node_modules/webpack-plugin-serve/lib/overlays/status.js":
/*!*****************************************************!*\
  !*** (webpack)-plugin-serve/lib/overlays/status.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n  Copyright © 2018 Andrew Powell\n\n  This Source Code Form is subject to the terms of the Mozilla Public\n  License, v. 2.0. If a copy of the MPL was not distributed with this\n  file, You can obtain one at http://mozilla.org/MPL/2.0/.\n\n  The above copyright notice and this permission notice shall be\n  included in all copies or substantial portions of this Source Code Form.\n*/\nconst { addCss, addHtml, socketMessage } = __webpack_require__(/*! ./util */ \"./node_modules/webpack-plugin-serve/lib/overlays/util.js\");\n\nconst ns = 'wps-status';\nconst css = `\n@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');\n\n#${ns} {\n  background: #282d35;\n  border-radius: 0.6em;\n  display: flex;\n  flex-direction: column;\n\tfont-family: 'Open Sans', Helvetica, Arial, sans-serif;\n\tfont-size: 10px;\n  height: 90%;\n  margin: 0 auto;\n  max-height: 20em;\n  min-height: 20em;\n  opacity: 1;\n  overflow: hidden;\n  padding-bottom: 3em;\n  position: relative;\n  transition: opacity .25s ease-in-out;\n  width: 95%;\n}\n\n@keyframes ${ns}-hidden-display {\n\t0% {\n\t\topacity: 1;\n\t}\n\t99% {\n\t\tdisplay: inline-flex;\n\t\topacity: 0;\n\t}\n\t100% {\n\t\tdisplay: none;\n\t\topacity: 0;\n\t}\n}\n\n#${ns}.${ns}-hidden {\n  animation: ${ns}-hidden-display .3s;\n  animation-fill-mode:forwards;\n  display: none;\n}\n\n#${ns}.${ns}-min {\n  animation: minimize 10s;\n  bottom: 2em;\n  cursor: pointer;\n  height: 6em;\n  min-height: 6em;\n  padding-bottom: 0;\n  position: absolute;\n  right: 2em;\n  width: 6em;\n}\n\n#${ns}.${ns}-min #${ns}-beacon {\n  display: block;\n}\n\n#${ns}-title {\n  color: #fff;\n  font-size: 1.2em;\n  font-weight: normal;\n  margin: 0;\n  padding: 0.6em 0;\n  text-align: center;\n  width: 100%;\n}\n\n#${ns}.${ns}-min #${ns}-title {\n  display: none;\n}\n\n#${ns}-title-errors {\n  color: #ff5f58;\n  font-style: normal;\n  padding-left: 1em;\n}\n\n#${ns}-title-warnings {\n  color: #ffbd2e;\n  font-style: normal;\n  padding-left: 1em;\n}\n\n#${ns}-problems {\n  overflow-y: auto;\n  padding: 1em 2em;\n}\n\n#${ns}-problems pre {\n  color: #ddd;\n  display: block;\n  font-size: 1.3em;\n\tfont-family: 'Open Sans', Helvetica, Arial, sans-serif;\n  white-space: pre-wrap;\n}\n\n#${ns}-problems pre em {\n  background: #ff5f58;\n  border-radius: 0.3em;\n  color: #641e16;\n  font-style: normal;\n  line-height: 3em;\n  margin-right: 0.4em;\n  padding: 0.1em 0.4em;\n  text-transform: uppercase;\n}\n\npre#${ns}-warnings em {\n  background: #ffbd2e;\n  color: #3e2723;\n}\n\npre#${ns}-success {\n  display: none;\n  text-align: center;\n}\n\npre#${ns}-success em {\n  background: #7fb900;\n  color: #004d40;\n}\n\n#${ns}-problems.${ns}-success #${ns}-success {\n  display: block;\n}\n\n#${ns}.${ns}-min #${ns}-problems {\n  display: none;\n}\n\n#${ns}-nav {\n  opacity: 0.5;\n  padding: 1.2em;\n  position: absolute;\n}\n\n#${ns}.${ns}-min #${ns}-nav {\n  display: none;\n}\n\n#${ns}-nav:hover {\n  opacity: 1;\n}\n\n#${ns}-nav div {\n  background: #ff5f58;\n  border-radius: 1.2em;\n  cursor: pointer;\n  display: inline-block;\n  height: 1.2em;\n  position: relative;\n  width: 1.2em;\n}\n\ndiv#${ns}-min {\n  background: #ffbd2e;\n  margin-left: 0.8em;\n}\n\n#${ns}-beacon {\n  border-radius: 3em;\n  display: none;\n  font-size: 10px;\n  height: 3em;\n  margin: 1.6em auto;\n  position: relative;\n  width: 3em;\n}\n\n#${ns}-beacon:before, #${ns}-beacon:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(127,185,0, 0.2);\n  border-radius: 3em;\n  opacity: 0;\n}\n\n#${ns}-beacon:before {\n  animation: ${ns}-pulse 3s infinite linear;\n  transform: scale(1);\n}\n\n#${ns}-beacon:after {\n  animation: ${ns}-pulse 3s 2s infinite linear;\n}\n\n\n@keyframes ${ns}-pulse {\n  0% {\n    opacity: 0;\n    transform: scale(0.6);\n  }\n  33% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(1.4);\n  }\n}\n\n#${ns}-beacon mark {\n  background: rgba(127, 185, 0, 1);\n  border-radius: 100% 100%;\n  height: 1em;\n  left: 1em;\n  position: absolute;\n  top: 1em;\n  width: 1em;\n}\n\n#${ns}-beacon.${ns}-error mark {\n  background: #ff5f58;\n}\n\n#${ns}-beacon.${ns}-error:before, #${ns}-beacon.error:after {\n  background: rgba(255, 95, 88, 0.2);\n}\n\n#${ns}-beacon.${ns}-warning mark {\n  background: #ffbd2e;\n}\n\n#${ns}-beacon.${ns}-warning:before, #${ns}-beacon.warning:after {\n  background: rgba(255, 189, 46, 0.2);\n}\n`;\n\nconst html = `\n<aside id=\"${ns}\" class=\"${ns}-hidden\" title=\"build status\">\n  <figure id=\"${ns}-beacon\">\n    <mark/>\n  </figure>\n  <nav id=\"${ns}-nav\">\n    <div id=\"${ns}-close\" title=\"close\"></div>\n    <div id=\"${ns}-min\" title=\"minmize\"></div>\n  </nav>\n  <h1 id=\"${ns}-title\">\n    build status\n    <em id=\"${ns}-title-errors\"></em>\n    <em id=\"${ns}-title-warnings\"></em>\n  </h1>\n  <article id=\"${ns}-problems\">\n    <pre id=\"${ns}-success\"><em>Build Successful</em></pre>\n    <pre id=\"${ns}-errors\"></pre>\n    <pre id=\"${ns}-warnings\"></pre>\n  </article>\n</aside>\n`;\n\nconst init = (options, socket) => {\n  const hidden = `${ns}-hidden`;\n  let aside;\n  let beacon;\n  let problems;\n  let preErrors;\n  let preWarnings;\n  let titleErrors;\n  let titleWarnings;\n\n  const reset = () => {\n    preErrors.innerHTML = '';\n    preWarnings.innerHTML = '';\n    problems.classList.remove(`${ns}-success`);\n    beacon.className = '';\n  };\n\n  const addErrors = (errors) => {\n    if (errors.length) {\n      beacon.classList.add(`${ns}-error`);\n\n      for (const error of errors) {\n        const markup = `<em>Error</em> in ${error}`;\n        addHtml(markup, preErrors);\n      }\n\n      titleErrors.innerText = `${errors.length} Error(s)`;\n    } else {\n      titleErrors.innerText = '';\n    }\n    aside.classList.remove(hidden);\n  };\n\n  const addWarnings = (warnings) => {\n    if (warnings.length) {\n      if (!beacon.classList.contains(`${ns}-error`)) {\n        beacon.classList.add(`${ns}-warning`);\n      }\n\n      for (const warning of warnings) {\n        const markup = `<em>Warning</em> in ${warning}`;\n        addHtml(markup, preWarnings);\n      }\n\n      titleWarnings.innerText = `${warnings.length} Warning(s)`;\n    } else {\n      titleWarnings.innerText = '';\n    }\n\n    aside.classList.remove(hidden);\n  };\n\n  document.addEventListener('DOMContentLoaded', () => {\n    addCss(css);\n    [aside] = addHtml(html);\n    beacon = document.querySelector(`#${ns}-beacon`);\n    problems = document.querySelector(`#${ns}-problems`);\n    preErrors = document.querySelector(`#${ns}-errors`);\n    preWarnings = document.querySelector(`#${ns}-warnings`);\n    titleErrors = document.querySelector(`#${ns}-title-errors`);\n    titleWarnings = document.querySelector(`#${ns}-title-warnings`);\n\n    const close = document.querySelector(`#${ns}-close`);\n    const min = document.querySelector(`#${ns}-min`);\n\n    aside.addEventListener('click', () => {\n      aside.classList.remove(`${ns}-min`);\n    });\n\n    close.addEventListener('click', () => {\n      aside.classList.add(`${ns}-hidden`);\n    });\n\n    min.addEventListener('click', (e) => {\n      aside.classList.add(`${ns}-min`);\n      e.stopImmediatePropagation();\n    });\n  });\n\n  socketMessage(socket, (action, data) => {\n    if (!aside) {\n      return;\n    }\n\n    switch (action) {\n      case 'problems':\n        reset();\n        addErrors(data.errors);\n        addWarnings(data.warnings);\n        aside.classList.remove(hidden);\n        break;\n      case 'replace':\n        if (!preErrors.children.length && !preWarnings.children.length) {\n          return;\n        }\n\n        reset();\n        problems.classList.add(`${ns}-success`);\n        aside.classList.remove(hidden);\n\n        setTimeout(() => aside.classList.add(hidden), 3e3);\n        break;\n      default:\n    }\n  });\n};\n\nmodule.exports = { init };\n\n\n//# sourceURL=webpack:///(webpack)-plugin-serve/lib/overlays/status.js?");

/***/ }),

/***/ "./node_modules/webpack-plugin-serve/lib/overlays/util.js":
/*!***************************************************!*\
  !*** (webpack)-plugin-serve/lib/overlays/util.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n  Copyright © 2018 Andrew Powell\n\n  This Source Code Form is subject to the terms of the Mozilla Public\n  License, v. 2.0. If a copy of the MPL was not distributed with this\n  file, You can obtain one at http://mozilla.org/MPL/2.0/.\n\n  The above copyright notice and this permission notice shall be\n  included in all copies or substantial portions of this Source Code Form.\n*/\nconst addHtml = (html, parent) => {\n  const div = document.createElement('div');\n  const nodes = [];\n\n  div.innerHTML = html.trim();\n\n  while (div.firstChild) {\n    nodes.push((parent || document.body).appendChild(div.firstChild));\n  }\n\n  return nodes;\n};\n\nconst addCss = (css) => {\n  const style = document.createElement('style');\n\n  style.type = 'text/css';\n\n  if (css.styleSheet) {\n    style.styleSheet.cssText = css;\n  } else {\n    style.appendChild(document.createTextNode(css));\n  }\n\n  // append the stylesheet for the svg\n  document.head.appendChild(style);\n};\n\nconst socketMessage = (socket, handler) => {\n  socket.addEventListener('message', (message) => {\n    const { action, data } = JSON.parse(message.data);\n    handler(action, data);\n  });\n};\n\nmodule.exports = { addCss, addHtml, socketMessage };\n\n\n//# sourceURL=webpack:///(webpack)-plugin-serve/lib/overlays/util.js?");

/***/ }),

/***/ "./src/scripts/index.js":
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
/*! exports provided: map, generateListWithCountries, generateInformationTips, generateChartWithCountryInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"map\", function() { return map; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"generateListWithCountries\", function() { return generateListWithCountries; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"generateInformationTips\", function() { return generateInformationTips; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"generateChartWithCountryInfo\", function() { return generateChartWithCountryInfo; });\n/* harmony import */ var _stateData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stateData.js */ \"./src/scripts/stateData.js\");\n/* harmony import */ var _interactions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interactions */ \"./src/scripts/interactions.js\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nmapboxgl.accessToken = 'pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w';\n\n // init interactions\n\nObject(_interactions__WEBPACK_IMPORTED_MODULE_1__[\"initInteractions\"])(); // init mapbox\n\nvar map = new mapboxgl.Map({\n  container: 'map',\n  style: 'mapbox://styles/noclue4u/cjoeoyn8u0htn2sobi8b7qy5k',\n  center: [10.214134, 47.440152],\n  maxZoom: 10,\n  minZoom: 3,\n  zoom: 3,\n  doubleClickZoom: false\n});\nvar container = map.getCanvasContainer();\nvar currentZoomLevel = map.getZoom();\nvar svg = d3.select(container).append('svg').append('g');\nmap.on('load', function () {\n  state.data.map = map;\n  state.data.loaded = true;\n  _stateData_js__WEBPACK_IMPORTED_MODULE_0__[\"filterAllData\"].then(function (res) {\n    initSelectOption(res);\n    generateInformationTips(res.map(function (d) {\n      return d;\n    }));\n    generateListWithCountries('#countries', res.map(function (d) {\n      return d;\n    }));\n  }).catch(function (err) {\n    return console.error(err);\n  });\n}); // Thanks to jorditost for showing how to display dots on mapbox\n\nfunction generateInformationTips(d, selectOption) {\n  var circles = svg.selectAll('circle').data(d).enter().append('circle') // .attr('class', d => `${trimWhiteAndLowercase(d.country)}`)\n  .on('click', function (d) {\n    return toggleCountryInfo(d);\n  }).transition().duration(0).attr('cx', function (d) {\n    return project([+d.long, +d.lat]).x;\n  }).attr('cy', function (d) {\n    return project([+d.long, +d.lat]).y;\n  }); // Update function\n\n  var update = function update() {\n    svg.selectAll('circle').attr('cx', function (d) {\n      return project([+d.long, +d.lat]).x;\n    }).attr('cy', function (d) {\n      return project([+d.long, +d.lat]).y;\n    }).transition().duration(750).attr('r', function (d) {\n      if (selectOption == 'totalDebt') {\n        return Math.sqrt(+d.debt[1] / 10e10 * 100) + 3;\n      } else if (selectOption == 'totalPopulation') {\n        return d.population.length ? Math.sqrt(+d.population[0].value / 10e6 * 100) + 3 : 0;\n      } else if (selectOption == 'totalDebtPerCitizen') {\n        return d.population.length ? Math.sqrt(+d.debt[1] / 10e10 / (+d.population[0].value / 10e6) * 100) + 3 : 0;\n      } else {\n        return Math.sqrt(+d.debt[1] / 10e10 * 100) + 3;\n      }\n    });\n  }; // Call the update function\n\n\n  update(); // Update on map interaction\n\n  map.on('viewreset', function () {\n    return update();\n  }).on('move', function () {\n    return update();\n  }).on('moveend', function () {\n    return update();\n  }).on('zoom', function () {\n    return update();\n  });\n}\n\nfunction generateListWithCountries(selection, d) {\n  var select = d3.select(selection).append('select').attr('class', 'countrySelection').on('change', function (e) {\n    var value = d3.select('.countrySelection').property('value');\n    return d.filter(function (country) {\n      return country.country == value;\n    }).map(function (d) {\n      return toggleCountryInfo(d);\n    });\n  });\n  select.selectAll('option').data(d.map(function (country) {\n    return country.country;\n  })).enter().append('option').text(function (d) {\n    return d;\n  });\n}\n\nfunction toggleCountryInfo(d) {\n  calculateDebtPerPerson(d);\n  setCountryInformationWidth('increase');\n  showCountryInformation(d);\n\n  if (state.data.showCountryInfo) {\n    generateChartWithCountryInfo(d);\n  }\n\n  map.flyTo({\n    center: [state.data.currGeoLocation.long, state.data.currGeoLocation.lat],\n    zoom: currentZoomLevel * 2,\n    offset: [-300, 0],\n    pitch: 30,\n    curve: 2,\n    speed: 0.5\n  });\n}\n\nfunction showCountryInformation(data) {\n  state.data.showCountryInfo = true;\n  state.data.country = data.country;\n  state.data.debt = data.debt;\n  state.data.population = data.population[0].value;\n  state.data.currGeoLocation = {\n    lat: data.lat,\n    long: data.long\n  };\n  state.data.selectedCountryProducts = data.food;\n}\n\nfunction calculateDebtPerPerson(data) {\n  var pastDebtInEuros = data.debt[0] ? data.debt[0] : 0;\n  var currentDebtInEuros = data.debt[1] ? data.debt[1] : data.debt;\n  var population = data.population[0].value ? data.population[0].value : '';\n  var currentDebt = (currentDebtInEuros / population).toFixed(2);\n  var pastDebt = (pastDebtInEuros / population).toFixed(2);\n  state.data.currentDebtPerCitizen = currentDebt;\n  state.data.pastDebtPerCitizen = pastDebt;\n}\n\nfunction generateChartWithCountryInfo(data) {\n  var debtCurrentYear = [];\n  var debtPastYear = [];\n  data.food.map(function (food) {\n    var newFoodObject = _objectSpread({\n      debt: Number((state.data.currentDebtPerCitizen / food.price).toFixed(0))\n    }, food);\n\n    var pastFoodObject = _objectSpread({\n      debt: Number((state.data.pastDebtPerCitizen / food.price).toFixed(0))\n    }, food);\n\n    debtCurrentYear.push(_objectSpread({\n      key: 2017\n    }, newFoodObject));\n    debtPastYear.push(_objectSpread({\n      key: 2016\n    }, pastFoodObject));\n  });\n  var debtPerYear = [].concat(debtPastYear, debtCurrentYear);\n\n  if (debtPerYear) {\n    drawBarChart(debtPerYear);\n  }\n}\n\nfunction drawBarChart(data) {\n  console.log(data); //chart based on https://bl.ocks.org/mbostock/3887051. Thanks Mike Bostock\n\n  var margin = {\n    top: 60,\n    right: 20,\n    bottom: 30,\n    left: 40\n  };\n  var width = 450 - margin.left - margin.right;\n  var height = 400 - margin.top - margin.bottom;\n  var svg = d3.select('.countryDebtChart');\n\n  if (!state.data.barchartIsDrawn) {\n    var _g = svg.append('g').attr('class', 'layer').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');\n  }\n\n  var g = svg.select('.layer');\n  var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);\n  var x1 = d3.scaleBand().padding(0.05);\n  var y = d3.scaleLinear().rangeRound([height, 0]);\n  var z = d3.scaleOrdinal().range(['#F7E3AF', '#F7AF9D', '#C08497']);\n  x0.domain(data.map(function (d) {\n    return d.key;\n  }));\n  x1.domain(data.map(function (d) {\n    return d.name;\n  })).rangeRound([0, x0.bandwidth()]);\n  y.domain([0, d3.max(data, function (d) {\n    return d.debt;\n  })]).nice();\n  var structuredData = d3.nest().key(function (d) {\n    return d.key;\n  }).entries(data);\n  g.append('g').selectAll('g').data(structuredData).enter().append('g').attr('class', 'bar').attr('transform', function (d) {\n    return 'translate(' + x0(d.key) + ',0)';\n  }).selectAll('rect').data(function (d) {\n    return d.values.map(function (items) {\n      return _objectSpread({\n        key: items.key\n      }, items);\n    });\n  }).enter().append('rect').attr('x', function (d) {\n    return x1(d.name);\n  }).attr('y', function (d) {\n    return y(d.debt);\n  }).attr('width', x1.bandwidth()).attr('height', function (d) {\n    return height - y(d.debt);\n  }).attr('fill', function (d) {\n    return z(d.name);\n  }).on('mouseover', function (d) {\n    d3.select('#tooltip').style('right', 2 + 'vw').style('top', 48 + 'vh').select('#value').text(\"\\n\\t\\t\\t\\t\\tevery citizin should buy / sell \".concat(d.debt, \" \").concat(d.name, \" to pay off the debt.\\n\\t\\t\\t\\t\\tThe price of a \").concat(d.name, \" is \\u20AC\").concat(d.price));\n    d3.select('#tooltip').classed('hidden', false);\n  }).on('mouseout', function () {\n    return d3.select('#tooltip').classed('hidden', true);\n  });\n\n  if (!state.data.barchartIsDrawn) {\n    g.append('g').attr('class', 'xAxis').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x0)).append('text').attr('fill', '#fff').attr('font-weight', 'bold').attr('text-anchor', 'start').attr('transform', \"translate(\".concat(width, \",0)\")).text('Years');\n    g.append('g').attr('class', 'yAxis').call(d3.axisLeft(y).ticks(null, 's')).append('text').attr('x', 2).attr('y', y(y.ticks().pop()) + 0.5).attr('dy', '0.32em').attr('fill', '#fff').attr('font-weight', 'bold').attr('text-anchor', 'start').text('Amount');\n  }\n\n  g.select('.xAxis').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x0)).append('text').attr('fill', '#fff').attr('font-weight', 'bold').attr('text-anchor', 'start').attr('transform', \"translate(\".concat(width, \",0)\")).text('Years');\n  g.select('.yAxis').call(d3.axisLeft(y).ticks(null, 's')).append('text').attr('x', 2).attr('y', y(y.ticks().pop()) + 0.5).attr('dy', '0.32em').attr('fill', '#fff').attr('font-weight', 'bold').attr('text-anchor', 'start').text('Amount');\n  state.data.barchartIsDrawn = true;\n\n  function update(data) {\n    var structuredData = d3.nest().key(function (d) {\n      return d.key;\n    }).entries(data);\n    x1.domain(data.map(function (d) {\n      return d.name;\n    })).rangeRound([0, x0.bandwidth()]);\n    y.domain([0, d3.max(data, function (d) {\n      return d.debt;\n    })]).nice(); // update the y axis:\n\n    svg.select('.yAxis').transition().call(d3.axisLeft(y).ticks(null, 's')).duration(500);\n    var barGroups = g.selectAll('g.bar').data(structuredData);\n    barGroups.enter().append('g').classed('bar', true).attr('transform', function (d) {\n      return 'translate(' + x0(d.key) + ',0)';\n    });\n    barGroups.exit().remove();\n    var bars = g.selectAll('g.bar').selectAll('rect').data(function (d) {\n      return d.values.map(function (items) {\n        return _objectSpread({\n          key: items.key\n        }, items);\n      });\n    });\n    bars.enter().append('rect').attr('x', function (d) {\n      return x1(d.name);\n    }).attr('y', function (d) {\n      return y(d.debt);\n    }).attr('width', x1.bandwidth()).attr('height', function (d) {\n      return height - y(d.debt);\n    }).attr('fill', function (d) {\n      return z(d.name);\n    });\n    bars.transition().duration(750).attr('y', function (d) {\n      return y(d.debt);\n    }).attr('height', function (d) {\n      return height - y(d.debt);\n    });\n  }\n\n  update(data);\n}\n\nfunction initSelectOption(data) {\n  mapDataFilter.addEventListener('change', function (e) {\n    generateInformationTips(data.map(function (d) {\n      return d;\n    }), e.target.value);\n  });\n}\n\nfunction checkIfExists(data, fallback) {\n  data > 1 || data.length && data !== undefined ? data : fallback;\n}\n\nfunction project(coords) {\n  return map.project(new mapboxgl.LngLat(+coords[0], +coords[1]));\n}\n\nfunction setCountryInformationWidth(statement) {\n  var infoWidth = document.querySelector('.map-section');\n  return statement == 'increase' ? infoWidth.style = 'width: 45vw; transform: translateX(0)' : infoWidth.style = 'width: 30vw; transform: translateX(0)';\n}\n\n\n\n//# sourceURL=webpack:///./src/scripts/index.js?");

/***/ }),

/***/ "./src/scripts/interactions.js":
/*!*************************************!*\
  !*** ./src/scripts/interactions.js ***!
  \*************************************/
/*! exports provided: initInteractions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initInteractions\", function() { return initInteractions; });\n/* harmony import */ var _stateData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stateData.js */ \"./src/scripts/stateData.js\");\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ \"./src/scripts/index.js\");\n\n\nvar randomCountry = findElement('#nextItem');\n\nfunction initInteractions() {\n  var flyToLocation = findElement('#flyToLocation');\n  var mapSection = findElement('.map-section');\n  _stateData_js__WEBPACK_IMPORTED_MODULE_0__[\"filterAllData\"].then(function (data) {\n    initRandomCountrySelector(data);\n  }); // Event listeners\n\n  flyToLocation.addEventListener('click', function () {\n    state.data.init = false;\n    styleBeforeElement('#map:before', {\n      display: 'none'\n    });\n    _index_js__WEBPACK_IMPORTED_MODULE_1__[\"map\"].flyTo({\n      zoom: 4,\n      bearing: 0,\n      speed: 0.7,\n      curve: 1\n    });\n    setTimeout(function () {\n      mapSection.style = 'transform: translateX(0);';\n    }, 750);\n  });\n}\n\nfunction initRandomCountrySelector(data) {\n  randomCountry.addEventListener('click', function () {\n    var randomCountry = data[Math.floor(Math.random() * data.length)];\n    state.data.showCountryInfo = true;\n    state.data.country = randomCountry.country;\n    state.data.debt = randomCountry.debt;\n    state.data.population = randomCountry.population[0].value;\n    state.data.currGeoLocation = {\n      lat: randomCountry.lat,\n      long: randomCountry.long\n    };\n    state.data.selectedCountryProducts = randomCountry.food;\n    Object(_index_js__WEBPACK_IMPORTED_MODULE_1__[\"generateChartWithCountryInfo\"])(randomCountry);\n    document.querySelector('.map-section').style = 'width: 45vw; transform: translateX(0)';\n    _index_js__WEBPACK_IMPORTED_MODULE_1__[\"map\"].flyTo({\n      center: [randomCountry.long, randomCountry.lat],\n      pitch: 40,\n      zoom: 6,\n      offset: [-300, 0]\n    });\n  });\n}\n\nfunction findElement(d) {\n  return document.querySelector(d);\n} // Solution by https://stackoverflow.com/questions/7330355/javascript-set-css-after-styles/7330454#7330454\n\n\nvar styleBeforeElement = function (style) {\n  var sheet = document.head.appendChild(style).sheet;\n  return function (selector, css) {\n    var propText = Object.keys(css).map(function (p) {\n      return p + ':' + css[p];\n    }).join(';');\n    sheet.insertRule(selector + '{' + propText + '}', sheet.cssRules.length);\n  };\n}(document.createElement('style'));\n\n\n\n//# sourceURL=webpack:///./src/scripts/interactions.js?");

/***/ }),

/***/ "./src/scripts/stateData.js":
/*!**********************************!*\
  !*** ./src/scripts/stateData.js ***!
  \**********************************/
/*! exports provided: filterAllData, checkIfObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"filterAllData\", function() { return filterAllData; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"checkIfObject\", function() { return checkIfObject; });\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar csvFiles = ['../data/worldGeoCodes.csv', '../data/europeDebt.csv', '../data/totalPopulation.csv'];\nd3.json('../data/countryItems.json').then(function (values) {\n  state.data.countryItems = values;\n  return values;\n}).catch(function (err) {\n  return err;\n});\nvar filterAllData = Promise.all(csvFiles.map(function (url) {\n  return d3.csv(url);\n})).then(function (values) {\n  var _ref;\n\n  var geoCodePerCountry = d3.nest().key(function (d) {\n    return d.name;\n  }).rollup(function (v) {\n    return v.map(function (d) {\n      return {\n        long: d.longitude,\n        lat: d.latitude\n      };\n    });\n  }).entries(values[0]);\n  var debtPerCountry = d3.nest().key(function (d) {\n    return d.TIME;\n  }).entries(values[1]).filter(function (d) {\n    return d.key > 2015;\n  }).map(function (d) {\n    return d.values.map(function (items) {\n      return _objectSpread({\n        key: items.GEO,\n        debt: items.Value\n      }, items);\n    });\n  });\n  var populationPerCountry = d3.nest().key(function (d) {\n    return d['Country Name'];\n  }).rollup(function (v) {\n    return v[0][2016];\n  }).entries(values[2]);\n\n  var filteredDataObject = (_ref = []).concat.apply(_ref, _toConsumableArray(debtPerCountry).concat(_toConsumableArray(populationPerCountry), _toConsumableArray(geoCodePerCountry), _toConsumableArray(state.data.countryItems)));\n\n  return filteredDataObject;\n}).then(function (filteredWorldData) {\n  var filterByCountry = d3.nest().key(function (d) {\n    return d.key;\n  }).entries(filteredWorldData).filter(function (filterByName) {\n    return filterByName.key.length > 2;\n  }).filter(function (filterByData) {\n    return filterByData.values.length > 2;\n  }).map(function (items) {\n    return {\n      country: items.key,\n      debt: items.values.filter(function (d) {\n        return d.UNIT == 'Million euro';\n      }).map(function (d) {\n        return d.debt.replace(',', '').replace('.', '') * 1000000;\n      }),\n      population: items.values.filter(function (d) {\n        return d.value > 500 ? d.value : '';\n      }),\n      food: items.values.map(function (d) {\n        return _typeof(d.food) == 'object' ? d.food : '';\n      }).filter(function (d) {\n        return d ? d : '';\n      })[0],\n      lat: items.values.map(function (geolocation) {\n        return _typeof(geolocation.value) == 'object' ? geolocation.value[0].lat : '';\n      }).filter(function (d) {\n        return d ? d : '';\n      })[0],\n      long: items.values.map(function (geolocation) {\n        return _typeof(geolocation.value) == 'object' ? geolocation.value[0].long : '';\n      }).filter(function (d) {\n        return d ? d : '';\n      })[0]\n    };\n  });\n  state.data.total = filterByCountry;\n  return filterByCountry;\n}).catch(function (err) {\n  return err;\n});\n\nvar checkIfObject = function checkIfObject(d) {\n  return _typeof(d) == 'object';\n};\n\n\n\n//# sourceURL=webpack:///./src/scripts/stateData.js?");

/***/ }),

/***/ "./src/styles/index.css":
/*!******************************!*\
  !*** ./src/styles/index.css ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/styles/index.css?");

/***/ }),

/***/ 0:
/*!***************************************************************************************!*\
  !*** multi ./src/scripts/index.js ./src/styles/index.css webpack-plugin-serve/client ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/scripts/index.js */\"./src/scripts/index.js\");\n__webpack_require__(/*! ./src/styles/index.css */\"./src/styles/index.css\");\nmodule.exports = __webpack_require__(/*! webpack-plugin-serve/client */\"./node_modules/webpack-plugin-serve/client.js\");\n\n\n//# sourceURL=webpack:///multi_./src/scripts/index.js_./src/styles/index.css_webpack-plugin-serve/client?");

/***/ })

/******/ });