### react-h5-template-ant
>基于ant-mobile的H5模板,采用vw适配移动端

#### 安装antd-mobile
```
yarn add antd-mobile
```

#### 按需加载
```
yarn add react-app-rewired customize-cra -D
```

```
/* package.json */
"scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test --env=jsdom",
+   "test": "react-app-rewired test --env=jsdom",
}
```

#### 然后在项目根目录创建一个 config-overrides.js 用于修改默认配置。
```
module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config;
};
```

使用 babel-plugin-import 是一个用于按需加载组件代码和样式的 babel 插件（原理），现在我们尝试安装它并修改 config-overrides.js 文件。
```
yarn add babel-plugin-import -D

+ const { override, fixBabelImports } = require('customize-cra');

- module.exports = function override(config, env) {
-   // do stuff with the webpack config...
-   return config;
- };
+ module.exports = override(
+   fixBabelImports('import', {
+     libraryName: 'antd-mobile',
+     style: 'css',
+   }),
+ );
```

#### 安装less less-loader style-loader css-loader
```
yarn add less less-loader@5.0.0 style-loader css-loader -D
```
特别注意 less-loader@6.0.0 安装后报错，配置的写法和5.0.0应该有出入

fixBabelImports修改
```
fixBabelImports('import', {
    libraryName: 'antd-mobile',
    libraryDirectory: 'es',
    style: true,
}),

addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
        '@brand-primary': '#FC3533', //主题色
        '@brand-primary-tap': '#ae3030',
        '@toast-zindex': 2000
    },
}),
```
报错了 先隐藏

#### 配置路径别名


#### vw适配
安装postcss插件  

postcss-flexbugs-fixes  
```
yarn add postcss-flexbugs-fixes -D
```
处理flex布局的兼容性


```
yarn add postcss-aspect-ratio-mini postcss-px-to-viewport postcss-write-svg postcss-cssnext postcss-viewport-units cssnano cssnano-preset-advanced -D
```

利用customize-cra 的addPostcssPlugins处理
```
addPostcssPlugins([
    require('postcss-aspect-ratio-mini')({}),
    require('postcss-px-to-viewport')({
        viewportWidth: 750, // (Number) The width of the viewport.
        viewportHeight: 1334, // (Number) The height of the viewport.
        unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
        viewportUnit: 'vw', // (String) Expected units.
        selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
        minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
        mediaQuery: false // (Boolean) Allow px to be converted in media queries.
    }),
    require('postcss-write-svg')({
        utf8: false
    }),
    require('postcss-cssnext')({}),
    require('postcss-viewport-units')({}),
    require('cssnano')({
        preset: "advanced",
        autoprefixer: false,
        "postcss-zindex": false
    })
])
```


##### 加入viewport-units-buggyfill配置, 部分低版本安卓机降级处理vw

打开public/index.html,在<head></head>中引入阿里cdn  
```
<script src="//g.alicdn.com/fdilab/lib3rd/viewport-units-buggyfill/0.6.2/??viewport-units-buggyfill.hacks.min.js,viewport-units-buggyfill.min.js"></script>
```

在body中，加入如下js代码  
```
<script>
  window.onload = function () {
    window.viewportUnitsBuggyfill.init({
      hacks: window.viewportUnitsBuggyfillHacks
    });
  }
</script>
```