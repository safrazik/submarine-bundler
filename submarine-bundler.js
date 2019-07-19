(function(global){

	if(global.Submarine){
		return;
	}

	var _isAnyRequired = false;

	global.Submarine = {};
	Submarine.all = {};

	Submarine.map = {};

	Submarine.useGlobalRequire = false;
	Submarine.useGlobalVars = true;

	var resolvedPathCache = {};

	var pathsMapReverse = null;

	var resolvePath = function(currentPath, relativePath){

		var cacheKey = currentPath + ':' + relativePath;
		if(resolvedPathCache[cacheKey]){
			return resolvedPathCache[cacheKey];
		}
		var currentPathParts = (currentPath || '').split('/');
		currentPathParts.pop();
		var relativePathParts = (relativePath || '').split('/');

		var m1;
		var newPathParts = [];
		while(true){
			m1 = relativePathParts.shift();
			if(m1 == '..'){
				if (!currentPathParts.length) {
					newPathParts.push('..');
				}
				currentPathParts.pop();
				continue;
			}
			if(m1 == '.'){
				continue;
			}
			if (m1 != '.') {
				newPathParts.push(m1);
			}
			break;
		}
		var resolvedPath = currentPathParts.concat(newPathParts).concat(relativePathParts).join('/');
		return resolvedPathCache[cacheKey] = resolvedPath;
	}

	var createRelativeRequire = function(selfModuleId){
		var selfModuleIdReal = selfModuleId;
		if (Submarine.map[selfModuleId] && Submarine.map[selfModuleId].realPath) {
			selfModuleIdReal = Submarine.map[selfModuleId].realPath;
		}
		return function requireRelative(moduleIdRelative){
			if(moduleIdRelative.indexOf('./') == -1 && moduleIdRelative.indexOf('../') == -1){
				var moduleId = moduleIdRelative;
			}
			else {
				var moduleId = resolvePath(selfModuleIdReal, moduleIdRelative);
			}

			if (!_isAnyRequired) {
				_isAnyRequired = true;
			}

			if (!pathsMapReverse) {
				pathsMapReverse = {};
				for(var mm in Submarine.map){
					if (!Submarine.map[mm].realPath) {
						continue;
					}
					pathsMapReverse[Submarine.map[mm].realPath] = mm;
				}
			}

			var mod = Submarine.all[moduleId];
			if (!mod) {
				if (pathsMapReverse[moduleId]) {
					mod = Submarine.all[pathsMapReverse[moduleId]];
				}
				else if (pathsMapReverse[moduleId + '.js']) {
					mod = Submarine.all[pathsMapReverse[moduleId + '.js']];
				}
			}
			Submarine.beforeRequire(moduleId);
			if (!mod) {
				var exports = {};
				if(Submarine.useGlobalRequire && global.require){
					exports = global.require(moduleId);
				}
				else if(Submarine.useGlobalVars && window[moduleId]) {
					exports = window[moduleId];
				}
				else {
					console.error('Module "' + moduleId + '" not found!. (required in "' + selfModuleId + '"');
				}
				Submarine.afterRequire(moduleId, exports);
				return exports;
			}
			if(!mod.invoked){
				try {
					mod.invoked = true;
					mod.def(mod.require, mod.module.exports, mod.module);
				}
				catch(e){
					throw e;
				}
			}
			Submarine.afterRequire(moduleId, mod.module.exports);
			return mod.module.exports;
		}
	}

	var requireAbsolute = createRelativeRequire(null);


	Submarine.beforeRequire = function(moduleId){
	}
	Submarine.afterRequire = function(moduleId, exports){
	}

	Submarine.require = function(moduleId){
		return requireAbsolute(moduleId);
	};

	Submarine.register = function(moduleId, moduleDef){
		var mod = Submarine.all[moduleId] || {};
		mod.id = moduleId;
		mod.def = moduleDef;
		mod.module = mod.module || {exports: {}};
		mod.require = mod.require || createRelativeRequire(moduleId);
		mod.invoked = false;
		Submarine.all[moduleId] = mod;
	};

	if(!global.require){
		global.require = Submarine.require;
	}

})(window);