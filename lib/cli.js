#!/usr/bin/env node
var reader = require('./index').reader;

var args = process.argv.slice(2);

args.length && args.forEach(function(fname){
                 reader.init(fname);
               });


