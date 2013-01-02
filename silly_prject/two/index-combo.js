/**
 *gen by sb
 *combo files:

/home/tom/Dropbox/gits/silly_builder/silly_prject/two/mods/modc.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/two/mods/modb.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/two/mods/moda.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/two/index.js

*/
KISSY.add("silly_prject/two/mods/modc.js",function(){

},{
  requires:['../../three/mods/modc']
});
;KISSY.add("silly_prject/two/mods/modb.js",function(){

});
;KISSY.add("silly_prject/two/mods/moda.js",function(){

},{
  requires:['./modc']
});
;KISSY.add("silly_prject/two/index.js",function(){
  
},{
  requires:['./mods/moda','./mods/modb']
});
