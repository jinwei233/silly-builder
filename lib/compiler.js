var fs = require('fs')
  ,path = require('path')
  ,tool = require('./tool')

function filterMods(mods){
  return mods.filter(function(mod){
           //非css、相对路径
           return !/\.css$/.test(mod) && /^\./.test(mod);
         });
}
function fixJSpath(mods){
    var re = /\.js$/,
        ret = [];
    mods.forEach(function(p){
      if(!re.test(p)){
        ret.push(p+'.js');
      }else{
        ret.push(p);
      }
    });
    return ret;
}

function getDeps(child_paths,parent_dir,cb){
  child_paths.forEach(function(child_path){
    getDep(child_path,parent_dir,cb);
  });
}
function getDep(child_path,parent_dir,cb){
  var filename = path.resolve(parent_dir,child_path)
    ,content
    ,deps
  //update parent_dir
  parent_dir = path.dirname(filename)

  fs.readFile(filename,function(err,chunk){
    if(err){
      throw err;
    }
    content = chunk.toString();
    deps = tool.getModsFromString(content);
    deps = deps.map(function(i){
             return i.replace('"','').replace('"','');
           });
    deps = filterMods(deps);
    deps = fixJSpath(deps);
    deps = deps.map(function(i){
             return path.resolve(parent_dir,i);
           });
    cb && cb(deps,parent_dir);
  });
}
/**
 * remove item in B that occurs in A
 * */
function cleanRepeat(A,B){
  var ret = [];
  for(var i=0;i<B.length;i++){
    var b = B[i];
    if(A.indexOf(b) == -1){
      ret.push(b);
    }
  }
  return ret;
}

function Compiler(fullpath,cb){
  this.basepath = path.dirname(fullpath);
  this.deps = [fullpath];
  this.counter = 1;

  var that = this
    ,callback = function(deps,parent_dir){
       that.counter--;
       if(deps.length){
         deps = cleanRepeat(that.deps,deps);
         that.deps = that.deps.concat(deps);
         that.counter+=deps.length;
         getDeps(deps,parent_dir,callback);
       }else{
         if(that.counter <= 0){
           onend();
         }
       }
     }
    ,onend = function(){
       cb && cb(that.deps.reverse());
     }
  getDep(fullpath,this.basepath,callback);
};

function GetDep(fullpath,cb){
  return new Compiler(fullpath,cb);
}
exports.getdep = GetDep;