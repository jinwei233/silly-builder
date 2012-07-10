安装
----
    git clone xxx
    npm install -g

测试
------
    sb mods_test.js

    save combo file /home/tom/Dropbox/gits/silly_builder/mods_test-combo.js done
    save mini file /home/tom/Dropbox/gits/silly_builder/mods_test-min.js done

about
------
* 这是一个kissy模块傻瓜打包器，要满足下面的要求
* 按目录结构来命名包，比如path/mods/a.js，那么在定义包就必须为
  <pre>
    KISSY.add('path/mods/a.js',function(S){
	  //more code 
	},{requires:['./b.js']});
  </pre>
* sb的依赖关系只分析requires:['./b.js']，以./开始表示使用的是相对路径，需要合并打包
* sb不支持KISSY.Config配置的包路径（确实很傻）
* sb不支持一个文件中写多个模块
todo
----
* 支持生成时间戳文件夹

