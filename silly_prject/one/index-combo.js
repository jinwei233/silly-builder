/**
 *gen by sb
 *combo files:

/home/tom/Dropbox/gits/silly_builder/silly_prject/three/mods/modc.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/one/mods/modc.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/two/mods/modc.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/one/mods/modb.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/one/mods/moda.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/one/index.js

*/
KISSY.add("silly_prject/three/mods/modc",function(){

});
;KISSY.add("silly_prject/one/mods/modc",function(){

});
;KISSY.add("silly_prject/two/mods/modc",function(){

},{
  requires:['../../three/mods/modc']
});
;KISSY.add("silly_prject/one/mods/modb",function(){

});
;KISSY.add("silly_prject/one/mods/moda",function(){

},{
  requires:['./modc']
});
;KISSY.add("silly_prject/one/index",function(){

},{
  requires:['./mods/moda','./mods/modb','../two/mods/modc']
});
