KISSY.add("silly_prject/three/mods/modc",function(){}),KISSY.add("silly_prject/two/mods/modc",function(){},{requires:["../../three/mods/modc"]}),KISSY.add("silly_prject/two/mods/modb",function(){}),KISSY.add("silly_prject/two/mods/moda",function(){},{requires:["./modc"]}),KISSY.add("silly_prject/two/main",function(){},{requires:["./mods/moda","./mods/modb"]})