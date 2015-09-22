(function() {
	
	window.path = {
		
	    sep			: '/',
	    delimiter	: ':',
	
	    normalize	: function(path) {
			
			var array = path.split(this.sep);
			var realPath = '';
			var nbRet = 0;
			
			var it = array.length;
			while (--it >= 0) {
				if (array[it] == '' || array[it] == '.')
					continue ;
				if (array[it] == '..') {
					++nbRet;
					continue ;
				}
				if (nbRet) {
					--nbRet;
					continue ;
				}
				realPath = array[it] + (realPath == ''  && path[path.length - 1] != this.sep ? '' : this.sep + realPath);
			}
			while (nbRet--) {
				realPath = '..' + this.sep + realPath;
			}
			return (realPath);
		},
	
	    join		: function() {
			
			var realPath = '';
			
			for (var it = arguments.length; --it >= 0;)
				realPath = arguments[it] + (realPath == ''  && path[path.length - 1] != this.sep ? '' : this.sep + realPath);
			return (this.normalize(realPath));
		},
	
	//    relative	: function(from, to) {},
	    dirname		: function(path) {
			
			var pos = path.lastIndexOf(this.sep);
			
			return (path.substr(0, pos == -1 ? 0 : pos + 1));		
		},
		
	    filename	: function(path) {
			
			var pos = path.lastIndexOf(this.sep);
			
			return (path.substr(pos == -1 ? 0 : pos + 1));		
		},
		
	    basename	: function(path) {
			
			path = this.filename(path);
			
			var pos = path.lastIndexOf('.');
			
			return (path.substr(0, pos == -1 ? path.length : pos));		
		},
		
	    extname		: function(path) {
		
			path = this.filename(path);
			
			var pos = path.lastIndexOf('.');
		
			return (path.substr(pos == -1 ? path.length : pos));
		},
		
		firstdirname: function(path) {
			
			var pos = path.indexOf(this.sep);
			
			return (path.substr(0, pos == -1 ? 0 : pos + 1));		
		}
	};
})();