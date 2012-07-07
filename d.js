var fs = require('fs'),
    path = require('path');

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
    if(arguments.callee.n>20)return;
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
        reqs[mod] = mod;
        self.checkCyclic(p,mod);
      }
    });
  },
  parse:function(p,cb){
    var self = this,
        parent = path.dirname(p);

    this.data = '';
    path.exists(p,function(b){
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
    var modsRe = /requires\s*:\s*(\[.*\])/,
        r = modsRe.exec(this.data);
    this.counter--;
    if(r && r.length>1){
      var deps = eval(r[1]);
      this.counter += deps.length;
      this.getDeps(deps,parent,cb);
    }else if(this.counter <= 0){
      this.dump();
      this.tranverseDepsEnd();
    }
  },
  checkCyclic:function(p,m){
    var pa = this.requires[p].parent;
    while(pa){
      for(var x in this.requires[p]){
        if(x !== 'parent'){
          this.requires[pa][x] = x;
        }
      }
      if(this.requires[m][m]){
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
    var deps = this.uniqueArray(this.queue);
    // console.log('before unique:');
    // console.log(this.queue);
    deps = deps.reverse();
    // console.log('after unique:');
    console.log(deps);
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
  }
};

var args = process.argv.slice(2);

args.length && args.forEach(function(fname){
                 reader.init(fname);
               });

