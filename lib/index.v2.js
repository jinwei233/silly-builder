var fs = require('fs'),
    path = require('path');

var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

function task(){
  this.init.apply(this,arguments);
};
var reader = {
  init:function(filename,cfg){
    //依赖关系数据，便于找出循环依赖
    this.cfg || (this.cfg = cfg);
    this.requires = {};
    this.queue = [];//依赖遍历路径
    this.counter = 1;
    var p = process.cwd()
      ,fullpath = path.resolve(p,filename)
      ,basedir = path.dirname(fullpath)

    this.basedir = basedir;

    this.setAppAndProjectPath(p);
    // console.log('this.apppath='+this.apppath);
    // console.log('this.projectpath='+this.projectpath);
    if(filename){
      this.getDep(filename,p);
    }else{
      if(this.appcfg.cp){
        console.log(this.appcfg.cp);
      }
    }
  },
  getDeps:function(a,parent,cb){
    var self = this;
    a.forEach(function(mod){
      self.getDep(mod,parent,cb);
    });
  },
  getDep:function(mod,parent,cb){
    arguments.callee.n = arguments.callee.n || 0;
    if(arguments.callee.n>1000){
      console.log('recursive more than 1000 times');
      return;
    }
    arguments.callee.n++;

    parent = parent || '';
    var p = path.resolve(parent,mod),
        self = this;

    this.queue.push(p);

    self.requires[p] || (self.requires[p] = {});

    cb && cb(p);

    this.parse(p,function(mod){
      if(mod){
        if(!self.requires[mod]){
          self.requires[mod] = {};
          self.requires[mod].parent = p;
          self.checkCyclic(mod);
        }
      }
    });
  },
  parse:function(p,cb){
    var self = this,
        parent = path.dirname(p);

    arguments.callee.counter = arguments.callee.counter || 0;
    if(arguments.callee.counter >=1000){
      console.log('fn parse more than 20 times. stop !!!');
      return;
    }
    arguments.callee.counter++;

    this.data = '';
    p = this.fixExtension(p);
    //console.log('p='+p);
    fs.exists(p,function(b){
      if(b){
        fs.readFile(p,function(err,data){
          if(err) throw err;
          self.data = data.toString();
          self._onEnd(parent,cb);
          self.data = "";
        });
      }else{
        console.log('path '+p+' does not exists!');
      }
    });
  },
  _onEnd:function(parent,cb){
    var modsRe = /requires:\[(.*?)\]/,
        r = modsRe.exec(this.clearBlankStr(this.data));
    this.counter--;
    if(r && r.length>1){
      var ret = r[1].replace(/\'/g,'').replace(/\"/g,'');
      var deps = ret.split(',');
      deps = this.filterMods(deps,parent);
      deps = this.fixpath(deps);
      this.counter += deps.length;
      this.getDeps(deps,parent,cb);
    }
    if(this.counter <= 0){
      this.tranverseDepsEnd();
    }
  },
  //返回非app之外的js、非css文件
  filterMods:function(mods,basepath){
    var self = this
      ,fixedpath
      ,b
      ,forceCombo = this.cfg.forceCombo
      ,combo
    return mods.filter(function(mod){
             if(forceCombo){
               return !/\.css$/.test(mod);
             }else{
               fixedpath = path.resolve(basepath,mod);
               b = self.pathcontains(fixedpath,self.apppath);
               return !/\.css$/.test(mod) && b;
             }
           });
  },
  //循环检测:感觉已经不太必要的，kissy内部肯定做了循环检测
  checkCyclic:function(m){
    var p = this.requires[m].parent,
        pa = this.requires[m].parent;
    while(pa){
      if(m == pa){
        throw Error('cyclic error 发现循环依赖');
      }
      pa = this.requires[pa].parent;
    }
  },
  //将包名fix为真实的路径名
  fixpath:function(deps){
    var re = /\.js$/,
        ret = [];
    deps.forEach(function(p){
      if(!re.test(p)){
        ret.push(p+'.js');
      }else{
        ret.push(p);
      }
    });
    return ret;
  },
  clearBlankStr:function(s){
    return s.replace(/\s/g,'');
  },
  //依赖迭代完成
  tranverseDepsEnd:function(){
    var deps = this.uniqueArray(this.queue),
        self = this;
    deps = deps.reverse();

    console.log(this.apppath);
    console.log(this.projectpath);

    return;
    console.log('after unique:');
    console.log(deps);
    this.comboFiles(deps,function(comboFileContent){
      var fname = self.queue[0].split('.'),
          fnamecombo,
          fnamemin;
      fname.pop();
      fnamecombo = fname.join('.')+'-combo.js';
      fnamemin = fname.join('.')+'-min.js';

      fs.writeFile(fnamecombo,comboFileContent,function(err){
        if(err) throw err;
        console.log('save combo file '+fnamecombo+' done' );
      });


      var ast = jsp.parse(comboFileContent); // parse code and get the initial AST
      ast = pro.ast_mangle(ast); // get a new AST with mangled names
      ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
      var min_code = pro.gen_code(ast,{
        ascii_only:true//只输出asc
      }); // compressed code here

      fs.writeFile(fnamemin,min_code,function(err){
        if(err) throw err;
        console.log('save mini file '+fnamemin+' done' );
      });

    });
  },
  //设置app.json project.json的位置
  setAppAndProjectPath:function(dirname){
    var dirs = dirname.split("/")
      ,dir
      ,fullpath
      ,projectfullpath
      ,APPPATH
      ,PROPATH
      ,APPJSON = '/app.json'
      ,PROJSON = '/project.json'
      ,APPNAME
      ,PRJNAME
      ,exists
      ,appflag
      ,projectflag
      ,popeddir

    while(dirs.length){
      dir = dirs.join('/')
      popeddir = dirs.pop();
      fullpath = dir+APPJSON;
      projectfullpath = dir+PROJSON;
      exists = fs.existsSync(fullpath)
      if(exists){
        appflag = true;
        APPPATH = dir;
        APPNAME = popeddir;
        var content = fs.readFileSync(fullpath);
        if(content){
          this.appcfg = JSON.parse(content);
        }else{
          this.appcfg = {};
        }
      }
      exists = fs.existsSync(projectfullpath)
      if(exists){
        projectflag = true;
        PROPATH = dir;
        PRJNAME = popeddir;
        var content = fs.readFileSync(projectfullpath);
        if(content){
          this.projectcfg = JSON.parse(content);
        }else{
          this.projectcfg = {};
        }
      }
      if(projectflag && appflag){
        break;
      }
    }
    if(appflag){
      this.apppath = APPPATH;
      this.appname = APPNAME;
    }else{
      this.apppath = this.basedir;
      var arr = this.basedir.split('/');
      if(arr.length){
        this.appname = arr.pop();
      }else{
        this.appname = this.basedir;
      }
    }

    if(projectflag){
      this.projectpath = PROPATH;
      this.projectname = PRJNAME;
    }
    if(!projectflag){
      this.projectpath = this.apppath;
      this.projectname = this.appname;
    }
  },
  //test if path A contains B
  pathcontains:function(A,B){
    A = path.resolve(A);
    B = path.resolve(B);
    return A.indexOf(B) === 0;
  },
  uniqueArray:function uniqueArray(arr) {
    var ret = [ ], temp = { }, elt;
    for (var i = 0; i < arr.length; i++) {
	  elt = arr[i];
	  if (!temp[elt]) {
	    temp[elt] = true;
	    ret.push(elt);
	  }
    }
    return ret;
  },
  fixExtension:function(fname){
    if((/\.css$/).test(fname)){
      return fname;
    }else if(!(/\.js$/i).test(fname)){
      fname+='.js';
    }
    return fname;
  },
  comboFiles:function(pathArr,cb){
    var comboArr = [],
        self = this,
        counter = pathArr.length,
    //TODO:add build time stamp
        combofiles = '/**\n *gen by sb\n *combo files:\n\n'+pathArr.join('\n')+'\n\n*/\n';

    pathArr.forEach(function(p,k){
      p = self.fixExtension(p);
      fs.readFile(p,function(err,data){
        if(err) throw err;
        comboArr[k] = self.fixModName(data.toString(),p);
        counter--;
        if(counter<=0){
          cb && cb(combofiles+comboArr.join(';'));
        }
      });
    });
  },
  fixModName:function(s,p){
    var slicer = '.add(',
        len = slicer.length,
        i = s.indexOf(slicer);
    if(s.slice(i+len,i+len+8) == 'function'){
      var modname = p.replace(this.projectpath,this.projectname).replace(/\.js$/,'');
      s = s.slice(0,i+5)+'"'+modname+'",'+s.slice(i+5);
    }
    return s;
  }
};
task.prototype = reader;

exports.reader = reader;
exports.task = task;