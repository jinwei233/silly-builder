安装
----
    git clone xxx
    npm install -g

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

todo
----
* 支持生成时间戳文件夹

