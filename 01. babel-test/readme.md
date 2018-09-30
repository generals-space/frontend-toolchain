参考文章

1. [What is Babel?](https://babeljs.io/docs/en/)
    - 直接看官方英文版的比较好, 中文版文档貌似少了点东西

2. [Babel 入门教程 - 阮一峰](http://www.ruanyifeng.com/blog/2016/01/babel.html)

3. [babel-preset-env：一个帮你配置babel的preset](http://www.fly63.com/article/detial/609)

4. [webpack官方文档](https://www.webpackjs.com/concepts/)
    - 比babel的好, 概念讲解的很清晰

## 1. 关于babel

环境

babel 7

本示例中涉及到babel编译的只有`src`, `lib`两个目录. 

`src`中`index.js`写了两个示例, 一个是箭头函数, 一个是`Object.is`静态函数, 都是es7新增的语法. 我们通过babel将ta们转换成es5的语法.

`babel.config.js`是babel的配置文件, babel提供了一堆预设来满足我们对编译结果的配置, 其中最主要的是`@babel/preset-env`. 我们可以通过`target`来设置编译结果对目标浏览器平台的兼容.

...不过我只是想将es6/7等最新的语法转换成es5的, 不管ta是什么平台, 支持到多少. 之前是有`babel-preset-es2015`这个插件来着, 现在没有了. 

```js
const presets = [
    [
        "@babel/env", {}
    ]
];
```

不过貌似单纯指定`@babel/env`, 第二个成员留空也可以正常编译, 至少把`class`与箭头函数转换成了es5的语法.

## 2. babel中polyfill与webpack

然后是`polyfill`的问题.

babel默认只转换语法, 不转换api. 什么意思呢? 就是说, 只转换变量/函数/类的声明或调用方式, 对于es6/7中定义的数组或对象等的新方法(或者说扩展)是不转换的. 比如es6中新定义的`Set`类型, 还有`Object`对象新增的`is`方法.

旧式浏览器没有这些方法怎么办呢? 这就是`polyfill`的作用了. 

> ...md为什么要分开做, sb吗?

把我们上面定义的babel配置添加一行, 变成如下

```js
const presets = [
    [
        "@babel/env", 
        {
            useBuiltIns: "usage",
        }
    ]
];
```

en, 多了一个`useBuiltIns`字段. ta会使生成的目标文件中通过引用`core-js`库中的模块完成这些API的模拟. 如下

```js
require("core-js/modules/es6.set");
require("core-js/modules/es6.object.is");
```

但是我们要生成的是浏览器端的js文件, 浏览器中很多也是不支持`require`的呀, 那怎么办?

好吧, 这个我们需要用到webpack打包工具, ta会把我们通过`require`引入的包打成一个单文件, 就不用担心引用的问题啦.

`webpack.config.js`中是我们的配置, `entry`为入口配置, 常规下只是入口的js文件路径即可, 为了打包`polyfill`, 要把'@babel/polyfill'放在入口文件前面, 这样就可以在`dist`目录下生成我们要的单文件.

------

总结一下, package.json中的3个命令.

`npm run compile`: 使用babel编译src目录中的源文件到lib目录;

`npm run make`: 使用webpack对src目录中的index.js入口文件进行打包.