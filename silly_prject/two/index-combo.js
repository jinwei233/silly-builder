/**
 *gen by sb
 *combo files:

/var/www/f/dropbox/gits/silly_builder/silly_prject/three/mods/modc.js
/var/www/f/dropbox/gits/silly_builder/silly_prject/two/mods/modc.js
/var/www/f/dropbox/gits/silly_builder/silly_prject/two/mods/modb.js
/var/www/f/dropbox/gits/silly_builder/silly_prject/two/mods/moda.js
/var/www/f/dropbox/gits/silly_builder/silly_prject/two/index.js

*/
KISSY.add("silly_prject/three/mods/modc",function(){

});
;KISSY.add("silly_prject/two/mods/modc",function(){

},{
  requires:['../../three/mods/modc']
});
;KISSY.add("silly_prject/two/mods/modb",function(){

});
;KISSY.add("silly_prject/two/mods/moda",function(){

},{
  requires:['./modc']
});
;KISSY.add("silly_prject/two/index",function(){
  
},{
  requires:['./mods/moda','./mods/modb']
});
