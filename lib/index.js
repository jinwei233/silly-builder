var fs = require('fs'),
    path = require('path');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var reader = {
  init:function(filename){

    var p = process.cwd();

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
    if(arguments.callee.n>30){
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
    if(arguments.callee.counter >=20){
      console.log('fn parse more than 20 times. stop !!!');
      return;
    }
    arguments.callee.counter++;

    this.data = '';
    p = this.fixExtension(p);

    fs.exists(p,function(b){
      if(b){
        var stream = fs.createReadStream(p);
        stream.on('data',function(data){
          self.data+=data.toString();
        });
        stream.on('end',function(){
          self._onEnd(parent,cb);
          self.data = '';
        });
      }else{
        console.log('path '+p+' does not exists!');
      }
    });
  },
  _onEnd:function(parent,cb){
    var modsRe = /requires\s*:\s*(\[.*?\])/,
        r = modsRe.exec(this.data);
    this.counter--;
    if(r && r.length>1){
      var deps = eval(r[1]);
      //console.log(deps);
      deps = this.filterMods(deps);

      //console.log(deps);

      this.counter += deps.length;
      this.getDeps(deps,parent,cb);
    }else if(this.counter <= 0){
      this.dump();
      this.tranverseDepsEnd();
    }
  },
  filterMods:function(mods){
    return mods.filter(function(mod){
             return /^\.\//.test(mod);
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
  dump:function(){
    //console.log(this.queue);
  },
  //依赖迭代完成
  tranverseDepsEnd:function(){
    var deps = this.uniqueArray(this.queue),
        self = this;
    // console.log('before unique:');
    // console.log(this.queue);
    deps = deps.reverse();
    console.log('after unique:');
    console.log(deps);
    this.comboFiles(deps,function(comboFileContent){
      return;
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
      var min_code = pro.gen_code(ast); // compressed code here

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
    if(!(/\.js$/i).test(fname)){
      fname+='.js';
    }
    return fname;
  },
  comboFiles:function(pathArr,cb){
    var comboArr = [],
        self = this,
        counter = pathArr.length;
    pathArr.forEach(function(p,k){
      p = self.fixExtension(p);
      fs.readFile(p,function(err,data){
        if(err) throw err;
        comboArr[k] = data.toString();
        counter--;
        if(counter<=0){
          cb && cb(comboArr.join(';'));
        }
      });
    });
  }
};

exports.reader = reader;
