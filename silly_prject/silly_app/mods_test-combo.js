/**
 *gen by sb
 *combo files:

/var/www/f/dropbox/gits/silly_builder/silly_app/mods/e.js
/var/www/f/dropbox/gits/silly_builder/silly_app/mods/d.js
/var/www/f/dropbox/gits/silly_builder/silly_app/mods/f.js
/var/www/f/dropbox/gits/silly_builder/silly_app/mods/c.js
/var/www/f/dropbox/gits/silly_builder/silly_app/mods/b.js
/var/www/f/dropbox/gits/silly_builder/silly_app/mods_test.js

*/
KISSY.add("silly_app/mods/e",function(){
  return 'e';
});;KISSY.add("silly_app/mods/d",function(){
  return 'D';
},{requires:['./e']});

;KISSY.add("silly_app/mods/f",function(){
  return 'f';
},{requires:['./d']});;KISSY.add("silly_app/mods/c",function(){
  return 'C';
},{requires:['./f']});

;KISSY.add("silly_app/mods/b",function(){
  return 'B';
},{requires  : [ './c'  ]});

;;(function(){
    var win        = window,
        doc        = window.document,
        renderer,
        surportSVG = !!doc.createElementNS && !!doc.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect,
        surportVML = (function supportsVml() {
          var a            = document.body.appendChild(document.createElement('div'));
          a.innerHTML      = '<v:shape id="vml_flag1" adj="1" />';
          var b            = a.firstChild;
          b.style.behavior = "url(#default#VML)";
          var supported    = b ? typeof b.adj == "object": true;

          a.parentNode.removeChild(a);
          return supported;
        })();

    renderer = surportSVG ? 'svg' : surportVML ? 'vml' : null;
    if(!renderer){
      throw Error('Your Browser does not surport svg or vml! ');
    }

    KISSY.add("silly_app/mods_test",function(){
      return 'A';
    },{requires:['./mods/b','./mods/c',renderer]});

  })();
