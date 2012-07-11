/**
 *gen by sb
 *combo files:

/home/tom/Dropbox/gits/silly_builder/silly_app/mods/e.js
/home/tom/Dropbox/gits/silly_builder/silly_app/mods/d.js
/home/tom/Dropbox/gits/silly_builder/silly_app/mods/f.js
/home/tom/Dropbox/gits/silly_builder/silly_app/mods/c.js
/home/tom/Dropbox/gits/silly_builder/silly_app/mods/b.js
/home/tom/Dropbox/gits/silly_builder/silly_app/mods_test.js

*/
KISSY.add("silly_app/mods/e",function(){return'e';});;KISSY.add("silly_app/mods/d",function(){return'D';},{requires:['./e']});;KISSY.add("silly_app/mods/f",function(){return'f';},{requires:['./d.js']});;KISSY.add("silly_app/mods/c",function(){return'C';},{requires:['./f']});;KISSY.add("silly_app/mods/b",function(){return'B';},{requires:['./c']});;KISSY.add("silly_app/mods_test",function(){return'A';},{requires:['./mods/b','./mods/c']});