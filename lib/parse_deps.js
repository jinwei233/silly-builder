var fs = require('fs')

var PRT = "prototype";

var modsREG = /requires:\[(.*?)\]/

function filterMods(mods){
  return mods.filter(function(mod){
           //非css、相对路径
           return !/\.css$/.test(mod) && /^\.\//.test(mod);
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
function getDeps(str){
  var r = modsREG.exec(str)
    ,match
    ,deps = []

  match = modsREG.exec(str);
  if(r && r.length>1){
    deps = r[1].replace(/\'/g,'').replace(/\"/g,'');
    deps = deps.split(',');
    deps = filterMods(deps);
  }
  return deps
}

function Parser(filename){
  this.depsMap = {}
  this.BasePath = process.cwd();

  var file = fs.readFileSync('./b.js')
    ,content
    ,deps

  content = file.toString()
  deps = getDeps(content);
  console.log(deps);
}

Parser[PRT].parse = function(){

}

Parser[PRT].addModule = function(){

}

Parser[PRT].removeModule = function(){

}

Parser[PRT].dumpModDeps = function(){

}

exports.Parser = Parser;


