#!/usr/bin/env node
var reader = require('./index').reader;

var args = process.argv.slice(2);

var forceCombo = args.indexOf('--forcecombo') > -1;

var cfg = {
    forceCombo:forceCombo
};

args.length && args.forEach(function(fname){
                 reader.init(fname,cfg);
               });


