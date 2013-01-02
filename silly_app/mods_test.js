;(function(){
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

    KISSY.add(function(){
      return 'A';
    },{requires:['./mods/b','./mods/c',renderer]});

  })();
