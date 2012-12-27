/**
 *gen by sb
 *combo files:

/var/www/f/dropbox/gits/silly_builder/silly_prject/one/mods/modc.js
/var/www/f/dropbox/gits/silly_builder/silly_prject/one/mods/modb.js
/var/www/f/dropbox/gits/silly_builder/silly_prject/one/mods/moda.js
/var/www/f/dropbox/gits/silly_builder/silly_prject/one/index.js

*/
KISSY.add("silly_prject/one/mods/modc",function(){

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
