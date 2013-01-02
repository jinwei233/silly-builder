/**
 *gen by sb
 *combo files:

/home/tom/Dropbox/gits/silly_builder/silly_prject/two/mods/modc.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/two/mods/modb.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/two/mods/moda.js
/home/tom/Dropbox/gits/silly_builder/silly_prject/two/main.js

*/
KISSY.add("silly_prject/two/mods/modc",function(){

},{
  requires:["silly_prject/three/mods/modc"]
});
;KISSY.add("silly_prject/two/mods/modb",function(){

});
;KISSY.add("silly_prject/two/mods/moda",function(){

},{
  requires:["silly_prject/two/mods/modc"]
});
;KISSY.add("silly_prject/two/main",function(){
  
},{
  requires:["silly_prject/two/mods/moda","silly_prject/two/mods/modb"]
});
