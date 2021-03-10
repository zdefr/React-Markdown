#### Markdown在线转义编辑器组件使用指南
本项目基于react开发，可以以组件形式引用到项目中。
##### 组件
定位：./src/component/DocsOri
使用：
> *//App.js*
> *//直接在需要使用该组件的地方引入，以虚拟Dom声明方式使用即可*
> *//本组件默认填充父元素，最小宽度为800px，可在 ./src/component/DocsOri/index.module.css(.outerBlock)中进行修改*

##### 算法

**优势：**
* 不同于其他Markdown在线编辑器，本组件利用客户端进行ast解析，可以有效减轻服务器压力
* 受到react-diffing算法的启发，采用diffing算法计算ast，性能控制较好（仍有bug）

**不足：**
* 项目仍在开发中，支持的功能不完善（目前只支持header/block/strong/em/ul）
* 代码冗余较多，可优化项仍有不少（例如使用防抖节流优化ast解析）
* toolsList处有较多bug，且算法可优化（待优化）
* 网络同步接口未实现（计划使用防抖同步上传ast）
* 目前仅支持react中引用

##### Demo
###### 本项目提供一个Demo
* 启动：npm start
* 编译：npm build
