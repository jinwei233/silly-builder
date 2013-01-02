var path = require('path')
  ,fs = require('fs')
  ,tool = require('./tool')

  ,PKG = {}
  ,items = ['app.json','project.json']
  ,cache = {}

items.forEach(function(i){
  var chk = ''
    ,name
  if(i == 'app.json'){
    chk = '/'+i;
    name = 'appinfo';
  }else if(i == 'project.json'){
    chk = '/'+i;
    name = 'pkginfo';
  }
  if(name){
    PKG[name] = function(filename,success,err){
	  var pkg = {}
        ,dir
	    ,dirs
	    ,dirname
	    ,fullpath
	  if(filename){
		dir = path.dirname(filename)
	  }else{
		dir = process.cwd()
	  }
	  dirs = dir.split('/')
	  var _getDeps = function(dirs){
		dirname = dirs.join('/')
		fullpath = dirname+chk;
		if(cache[dirname]){
		  success && success(cache[dirname]);
		  return;
		}
		fs.exists(fullpath,function(b){
		  _exists(b,fullpath);
		})
	  }
	  var _exists = function(b,fullpath){
		if(b){
		  fs.readFile(fullpath,function(err,chunk){
			pkg.fullpath = fullpath;
			pkg.basedir = path.dirname(fullpath);
			var content = tool.clearStr(chunk.toString());
			if(content){
			  pkg.cfg = JSON.parse(content);
			}else{
			  pkg.cfg = {};
			}
			pkg.name = pkg.cfg.name || path.basename(pkg.basedir);
			cache[dirname] = pkg;
			if(success){
			  success(pkg);
			}
		  })
		}else{
		  if(dirs.length){
			dirs.pop();
			_getDeps(dirs);
		  }else{
			err && err({});
		  }
		}
	  }
	  _getDeps(dirs);
    }
  }
  return i;
})

for(var x in PKG){
  exports[x] = PKG[x];
}
