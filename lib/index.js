var fs = require('fs'),
    path = require('path');

var jsp = require("uglify-js").parser
  ,pro = require("uglify-js").uglify
  ,compiler = require('./compiler')
  ,info = require('./info')
  ,tool = require('./tool')

function task(file,opts){
  var basepath = process.cwd()
    ,pkginfo
    ,appinfo
  function callback(deps,fullpath,pkginfo,appinfo,group){
    var opt = {}

    opt.pkgpath = pkginfo.basedir;
    opt.pkgname = pkginfo.name;
    opt.forcecombo = opts.forcecombo || appinfo.forcecombo;
    opt.appbasedir = appinfo.basedir;
    tool.combo(deps,opt,function(filecontent,src){
      var despath
        ,content
        ,reg
        ,targetpath
      if(group){//如果有时间戳目录
        targetpath = path.resolve(appinfo.basedir,group.des);
        if(targetpath != fullpath){
          var info = getreplace(fullpath,pkginfo,group)
            ,srccontent
            ,lastindex

          reg = new RegExp(info.from,'g');
          despath = fullpath.replace(reg,info.to);
          content = filecontent.replace(reg,info.to);

          //源码只替换包名
          reg = new RegExp(info.from);
          srccontent = src.replace(reg,info.to);
          makedirp(path.dirname(despath),function(){
            var src = srccontent;
            combo(despath,content,src);
          });
        }else{
          combo(fullpath,filecontent);
        }
      }else{//打包到当前目录
          combo(fullpath,filecontent);
      }
    });
  }
  if(file){
    var fullpath = path.resolve(basepath,file)
    info.pkginfo(fullpath,function(pkginfo){
      //success
      info.appinfo(fullpath,function(appinfo){
        //success
        compiler.getdep(fullpath,function(deps){
          callback(deps,fullpath,pkginfo,appinfo);
        })
      },function(){
          //fail
        })
    },function(){
        //fail
      });
  }else{
    info.pkginfo(false,function(pkginfo){
      //success
      info.appinfo(false,function(appinfo){
        //success
        if(appinfo.cfg && appinfo.cfg.build && appinfo.cfg.build.length){
          appinfo.cfg.build.forEach(function(group){
            var file = group.src;
            var fullpath;
            if(file){
              fullpath = path.resolve(basepath,file);
              compiler.getdep(fullpath,function(deps){
                callback(deps,fullpath,pkginfo,appinfo,group);
              });
            }else{
              console.error('配置文件的格式不正确');
            }
          });
        }else{
          console.error('你没有指定要打包的文件，当前目录下也没有app.json配置文件或app.json为空');
        }
      },function(){
          //fail
        });
    },function(){
        //fail
    });
  }
}

/**
 *
 * */
function combo(fullpath,content,srccontent){
  var basename = path.basename(fullpath,'.js')
    ,dirname = path.dirname(fullpath)
    ,minfile = dirname+'/'+basename+'-min.js'
    ,combofile = dirname+'/'+basename+'-combo.js'
  if(srccontent){
    fs.writeFile(fullpath,srccontent,function(){
      console.log('save src file '+fullpath+' done' );
    });
  }

  fs.writeFile(combofile,content,function(err){
    if(err)throw err;
    console.log('save combo file '+combofile+' done' );
  })

  var ast = jsp.parse(content)
  ast = pro.ast_mangle(ast);
  ast = pro.ast_squeeze(ast);
  var min_code = pro.gen_code(ast,{
    ascii_only:true
  });
  fs.writeFile(minfile,min_code,function(err){
    if(err)throw err;
    console.log('save mini file '+minfile+' done' );
  });
}

function getreplace(fullpath,pkginfo,group){
  var a,b,desdir,slice
    ,aa,bb

  a = path.dirname(fullpath)
  desdir = path.resolve(a,group.des);
  b = path.dirname(desdir)

  aa = a.replace(pkginfo.basedir,pkginfo.name);
  bb = b.replace(pkginfo.basedir,pkginfo.name);

  return {from:aa,to:bb};
}

function makedirp(f,cb){
  var dir
    ,dirs = f.split('/')
    ,index
  dir = '/'+dirs[0]
  index = 0
  _makedirp(dir,dirs,index,cb);
}

function _makedirp(dir,dirs,index,cb){
  fs.exists(dir,function(b){
    if(b){
      if(index<=dirs.length){
        _makedirp('/'+dirs.slice(0,index).join('/'),dirs,++index,cb);
      }else{
        cb && cb();
      }
    }else{
      fs.mkdir(dir,function(b){
        if(index<=dirs.length){
          _makedirp('/'+dirs.slice(0,index).join('/'),dirs,++index,cb);
        }else{
          cb && cb();
        }
      });
    }
  });
}

exports.task = task;
