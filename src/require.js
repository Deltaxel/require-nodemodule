var fs = {
	
	loadFile: function(fileName) {
		
		var xmlhttp = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.WMLHTTP'));
		
		xmlhttp.open('GET', fileName, false);
		xmlhttp.send();
	
		if (xmlhttp.status == 200)
			return (xmlhttp.responseText);
	}
};

(function(){
	
	var modules = {
		
		config: { baseUrl: '' },

		list: [],
		
		resolveJson: function(module) {
			
			module.jsonPath = window.path.join(module.path, 'package.json');
			module.json = JSON.parse(fs.loadFile(module.jsonPath));
			console.assert(module.json != undefined, 'Could not load module: ' + module.name);
			if (module.json.main && window.path.extname(module.json.main) == '')
				module.json.main = window.path.join(module.json.main, window.path.sep);
		},
		
		resolveDependencies: function(module) {
			
			if (module.json.dependencies)
				for (var it in module.json.dependencies)
					require(it, module.path);
			if (module.json.peerDependencies)
				for (var it in module.json.peerDependencies)
					require(it);
		},
		
		find: function(moduleName, modulePath) {
			
			var module = { name: moduleName, localPath: modulePath };
			
			if (!modules.list[module.name]) {
				
				module.node_module = path.firstdirname(module.name);
				if (module.node_module == '')
					module.node_module = module.name;
				module.fileToInport = module.name.substr(module.node_module.length);
				module.path = path.join((module.localPath ? module.localPath : modules.config.baseUrl), 'node_modules', module.node_module);
				if (module.node_module == module.name)
					modules.resolveJson(module);			
				if (!module.fileToInport || module.fileToInport == '')
					module.fileToInport = module.json.main;
				module.fileUrl = window.path.join(module.path, module.fileToInport);
				module.exports = require('.' + path.sep + path.filename(module.fileUrl), path.dirname(module.fileUrl));
				modules.list[module.name] = module;
			}
			return (modules.list[module.name]);
		}
	};
	
	modules.files = {
		
		list: [],
		
		retrive: function(module) {
			
			module.content = fs.loadFile(module.url);
			if (module.content == undefined && path.filename(module.url) != 'index.js') {
				
				module.url = path.join(module.url.substr(0, module.url.length - 3), 'index.js');
				modules.files.localPath = path.dirname(module.url);
				module.content = fs.loadFile(module.url);
			}
			eval(module.content);
		},
		
		find: function(fileName, filePath) {
			
			if (!filePath)
				filePath = modules.files.localPath;

			var oldLocalPath = modules.files.localPath;
			modules.files.localPath = path.dirname(path.join(filePath, fileName));
			
			var file = { name: fileName, localPath: filePath };
			
			if (!modules.files.list[file.name]) {
				
				file.url = path.join((file.localPath ? file.localPath : modules.config.baseUrl), fileName);
				if (path.basename(file.url) == '')
					file.url += 'index';
				if (path.extname(file.url) != '.js')
					file.url += '.js';
				modules.files.retrive(file);
				modules.files.list[file.name] = file;
			}
			modules.files.localPath = oldLocalPath;
			return (modules.files.list[file.name]);
		}
	};
	
	window.require = function (moduleName, modulePath) {
	
		var dep = path.firstdirname(moduleName);
		
		if (dep == './' || dep == '../') {
			
			return (modules.files.find(moduleName, modulePath).exports);
		}
		return (modules.find(moduleName, modulePath).exports);
	};
	
	window.require.config = function(config) {
	
		if (!config.baseUrl) config.baseUrl = '';
		modules.config = config;
	};
})();