/*
 * @Description: vue-cli3.0配置
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2021-02-23 14:25:44
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-10-08 17:03:31
 */
const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
// const PurgecssPlugin = require('purgecss-webpack-plugin')
// const glob = require('glob-all')
const { name } = require('./package.json')
// const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
let globalObject = {} // globalObject: process.env.ENV === 'dev' ? '' : 'this', // here
if (process.env.NODE_ENV !== 'development') {
  globalObject = { globalObject: 'this' }
}
module.exports = {
  publicPath: './', // 默认'/'，部署应用包时的基本 URL
  outputDir: 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: true,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: false, // 生产环境的 source map
  css: {
    extract: true,
    loaderOptions: {
      sass: {
        prependData: '@import "@/sass/index.scss";', // 引入全局变量
      },
    },
  },
  // 部署优化
  configureWebpack: {
    name,
    // 使用CDN
    externals: {},
    // GZIP压缩
    plugins: [],
    output: Object.assign(
      {
        // 把子应用打包成 umd 库格式
        library: name,
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${name}`,
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[id].[hash].js',
      },
      globalObject,
    ),
  },
  chainWebpack: (config) => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('router', resolve('src/router'))
      .set('utils', resolve('src/utils'))
      .set('api', resolve('src/api'))
      .set('store', resolve('src/store'))
    // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
    config.plugin('define').tap((args) => {
      args[0]['process.env'].BASE_ROOT = JSON.stringify(process.env.BASE_ROOT)
      args[0]['process.env'].API_ROOT = JSON.stringify(process.env.API_ROOT)
      return args
    })
  },
  devServer: {
    open: false,
    host: '172.16.6.226',
    port: 7080,
    https: false,
    hotOnly: false,
    disableHostCheck: true, // 显示警告和错误
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
}
