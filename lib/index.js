var fs = require('fs'),
    path = require('path');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var reader = {
  init:function(filename){

    var p = process.cwd();

    try{
      this.packagebase = require(p+'/build.js').packagebase;
    }catch(e){
      throw('未找到build.js文件');
    }

    this.packagebase = fs.realpathSync(this.packagebase);
    this.packageName = this.packagebase.split('/').pop();

    //console.log('Name:',this.packageName);

    this.requires = {};//依赖关系，便于找出循环依赖
    this.queue = [];//依赖遍历路径
    this.counter = 1;

    this.getDep(filename,p);

  },
  getDeps:function(a,parent,cb){
    var self = this;
    a.forEach(function(mod){
      self.getDep(mod,parent,cb);
    });
  },
  getDep:function(mod,parent,cb){
    arguments.callee.n = arguments.callee.n || 0;
    if(arguments.callee.n>100){
      console.log('recursive more than 30 times');
      return;
    }
    arguments.callee.n++;

    parent = parent || '';
    var p = path.resolve(parent,mod),
        self = this;

    this.queue.push(p);

    var reqs = this.requires[p] = this.requires[p] || {};

    cb && cb(p);

    this.parse(p,function(mod){
      if(mod){
        self.requires[mod] = self.requires[mod] || {};
        self.requires[mod].parent = p;
        // console.log('check:',p);
        // console.log(mod);
        self.checkCyclic(mod);
      }
    });
  },
  parse:function(p,cb){
    var self = this,
        parent = path.dirname(p);

    arguments.callee.counter = arguments.callee.counter || 0;
    if(arguments.callee.counter >=100){
      console.log('fn parse more than 20 times. stop !!!');
      return;
    }
    arguments.callee.counter++;

    this.data = '';
    p = this.fixExtension(p);

    fs.exists(p,function(b){
      if(b){
        /*
        var stream = fs.createReadStream(p);
        stream.on('data',function(data){
          //这种方式潜在乱码风险：参见朴灵2012.07D2F分享
          self.data+=data.toString();
        });
        stream.on('end',function(){
          self._onEnd(parent,cb);
          self.data = '';
        });
        */
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
    var modsRe = /requires:(\[.*?\])/,
        r = modsRe.exec(this.clearBlankStr(this.data));
    this.counter--;
    //console.log(this.counter);
    if(r && r.length>1){
      var deps = eval(r[1]);
      //console.log(deps);
      deps = this.filterMods(deps);
      deps = this.fixpath(deps);
      //console.log(deps);

      this.counter += deps.length;
      this.getDeps(deps,parent,cb);
    }

    if(this.counter <= 0){
      //console.log(this.queue);
      this.dump();
      this.tranverseDepsEnd();
    }
  },
  filterMods:function(mods){
    var self = this;
    return mods.filter(function(mod){
             return !/\.css$/.test(mod) && /^\.\//.test(mod);
           });
  },
  checkCyclic:function(m){
    var p = this.requires[m].parent,
        pa = this.requires[m].parent;

    while(pa){
      // for(var x in this.requires[m]){
      //   if(x !== 'parent'){
      //     this.requires[pa][x] = x;
      //   }
      // }
      if(m == pa){
        throw Error('cyclic error 发现循环依赖');
      }
      pa = this.requires[pa].parent;
    }
  },
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
  dump:function(){
    //console.log(this.queue);
  },
  //依赖迭代完成
  tranverseDepsEnd:function(){
    //console.log(this.queue);

    var deps = this.uniqueArray(this.queue),
        self = this;
    // console.log('before unique:');
    // console.log(this.queue);
    deps = deps.reverse();
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

      //var min_code = comboFileContent;

      fs.writeFile(fnamemin,min_code,function(err){
        if(err) throw err;
        console.log('save mini file '+fnamemin+' done' );
      });

    });
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
        var modname = p.replace(this.packagebase,this.packageName).replace(/\.js$/,'');
        s = s.slice(0,i+5)+'"'+modname+'",'+s.slice(i+5);
      }
      return s;
    }
};

exports.reader = reader;
