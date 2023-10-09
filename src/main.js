/*
 * @Description:
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2021-02-25 23:08:50
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-10-08 15:38:55
 */

import './public-path'
import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from '@/store'
import Router from 'vue-router'
import VueParticles from 'vue-particles'
import common from '@/common'
import App from './App.vue'
import router from './router'
import globalMixin from './mixins/global'
import MyDirectives from './directives/directives'
import VueClipboard from 'vue-clipboard2'
import * as filters from './filters/filters'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'small' })
Vue.mixin(globalMixin)
Vue.use(VueParticles)
Vue.use(common)
Vue.use(MyDirectives)
Vue.use(VueClipboard)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
  },
})

// 过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
// 接入qiankun框架
let micoAppRouter = null
let instance = null

function render(props = {}) {
  const { container } = props
  micoAppRouter = new Router({
    base: window.__POWERED_BY_QIANKUN__ ? '/lessCodeService' : '/',
    mode: 'history',
    routes: router.routes,
  })
  micoAppRouter.beforeEach((to, from, next) => {
    const routeName = to.meta.name || to.name
    window.document.title =
      (routeName ? routeName + ' - ' : '') + '低代码平台'
    next()
  })
  if (window.__POWERED_BY_QIANKUN__) {
    instance = new Vue({
      router: micoAppRouter,
      store,
      render: (h) => h(App),
    }).$mount(container ? container.querySelector('#app') : '#app')
  } else {
    new Vue({
      router: router.router,
      store,
      render: (h) => h(App),
    }).$mount('#app')
  }
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}
function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) => {
        console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev)
      })
}
// 导出子应用生命周期挂载前
export async function bootstrap() {
}

export async function mount(props) {
  storeTest(props)
  render(props)
}

// 卸载
export async function unmount() {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  micoAppRouter = null
}

// qiankun 完成

