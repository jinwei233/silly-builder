/**
 *gen by sb
 *combo files:

/home/tom/Dropbox/gits/silly_builder/silly_prject/two_v2/mods/modc.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/two_v2/mods/modb.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/two_v2/mods/moda.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/two_v2/index.js

*/
KISSY.add("silly_prject/two_v2/mods/modc",function(){

},{
  requires:["silly_prject/three/mods/modc"]
});
;KISSY.add("silly_prject/two_v2/mods/modb",function(){

});
;KISSY.add("silly_prject/two_v2/mods/moda",function(){

},{
  requires:["silly_prject/two_v2/mods/modc"]
});
;KISSY.add("silly_prject/two_v2/index",function(){
  
},{
  requires:["silly_prject/two_v2/mods/moda","silly_prject/two_v2/mods/modb"]
});
