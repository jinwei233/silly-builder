#!/usr/bin/env node
var reader = require('./index').reader;
var task = require('./index').task;

var files = process.argv.slice(2);

var forcecombo = files.indexOf('-forcecombo') > -1;

files = files.filter(function(file){
          return !/^-/.test(file);
        });

var cfg = {
    forcecombo:forcecombo
};
//从app.cfg配置中读取
if(files.length == 0){
  new task(null,cfg);
  //单个文件打包
}else if(files.length == 1){
  new task(files[0],cfg);
  //多个文件打包
}else if(files.length>1){
  files.forEach(function(file){
    new task(file,cfg);
  });
}


