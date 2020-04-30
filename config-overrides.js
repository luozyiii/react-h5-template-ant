const {
    override,
    useBabelRc,
    fixBabelImports,
    addLessLoader,
    addWebpackPlugin,
    addWebpackAlias,
    addPostcssPlugins,
    setWebpackOptimizationSplitChunks
} = require('customize-cra')
const path = require("path")
const resolve = dir => path.join(__dirname, dir)
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
//关闭sourcemap
process.env.GENERATE_SOURCEMAP = "false";
module.exports = override(
    (config) => {
        config.entry = [
            ...config.entry,
            'core-js/es6/map',  // 解决ios8的错误：Map constructor does not accept arguments
        ]
        return config
    },
    // 使用外部.babelrc配置文件
    useBabelRc(),
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        libraryDirectory: 'es',
        style: true,
    }),
    // 自定义主题
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@brand-primary': '#FC3533', //主题色
            '@brand-primary-tap': '#ae3030',
            '@toast-zindex': 2000
        },
    }),
    addWebpackPlugin(
        // 用dayjs 替换 moment.js
        new AntdDayjsWebpackPlugin()
    ),
    // 配置路径别名
    addWebpackAlias({
        '@': resolve(`src`),
    }),
    // Postcss
    addPostcssPlugins([
        require('postcss-flexbugs-fixes'),
        // vw适配
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
    ]),
    // 分块打包
    setWebpackOptimizationSplitChunks({
        cacheGroups: {
            reactDom: {
                name: 'react-dom',
                minChunks: 1,
                test: /[\\/]node_modules[\\/](react-dom)[\\/]/,
                chunks: 'all',
                reuseExistingChunk: false,
                enforce: true
            },
            redux: {
                name: 'redux',
                minChunks: 1,
                test: /[\\/]node_modules[\\/](redux)[\\/]/,
                chunks: 'all',
                reuseExistingChunk: false,
                enforce: true
            },
            reactRedux: {
                name: 'redux',
                minChunks: 1,
                test: /[\\/]node_modules[\\/](react-redux)[\\/]/,
                chunks: 'all',
                reuseExistingChunk: false,
                enforce: true
            },
            antd: {
                name: 'antd-mobile',
                minChunks: 1,
                test: /[\\/]node_modules[\\/](antd-mobile)[\\/]/,
                chunks: 'all',
                reuseExistingChunk: false,
                enforce: true
            },
            reactCopy: {
                name: 'react-copy',
                minChunks: 1,
                test: /[\\/]node_modules[\\/](react-copy-to-clipboard)[\\/]/,
                chunks: 'all',
                reuseExistingChunk: false,
                enforce: true
            },
            moment: {
                name: 'moment',
                minChunks: 1,
                test: /[\\/]node_modules[\\/](dayjs)[\\/]/,
                chunks: 'all',
                reuseExistingChunk: false,
                enforce: true
            },
            vconsole: {
                name: 'vconsole',
                minChunks: 1,
                test: /[\\/]node_modules[\\/](vconsole)[\\/]/,
                chunks: 'all',
                reuseExistingChunk: false,
                enforce: true
            }
        }
    })
);