UPDATE
------
使用升级版的包含更多功能的silly builder https://github.com/WeweTom/silly

安装
----
    npm install silly_builder -g
测试
------
    
    cd silly_app
    sb mods_test.js

    save combo file /home/tom/Dropbox/gits/silly_builder/mods_test-combo.js done
    save mini file /home/tom/Dropbox/gits/silly_builder/mods_test-min.js done

about
------
* sb的依赖关系只分析requires:['./b']，以./开始表示使用的是相对路径，需要合并打包
* sb不支持KISSY.Config配置的包路径（确实很傻）
* sb不支持一个文件中写多个模块

配置build.js
------------
* 配置文件build.js放在包根目录里
* 配置项packagebase表示包根目录，为统一性，都用相对路径
* eg: 
  
    exports.packagebase = '../silly_app';
    //表示silly_app将作为打包后的根目录

适用场景
--------
* 模块较多的单页面应用，按照例子中（silly_app/mods）的包书写规范，silly能自动分析依赖关系，自动打包
* 不适合大规模的自动化打包，比如开发框架的时候，因为silly builder没有像ant那样的build.xml描述文件

todo
----
* 支持生成时间戳文件夹
* 模块化供第三方调用


update
------
添加强制combo
project 和 app 机制:支持project级别和app级别打包
project配置包名
copy文件支持

KISSY的目录结构模型
-------------------

