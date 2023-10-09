/*
 * @Description:
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2021-02-24 15:51:44
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-09-11 15:13:32
 */
import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import common from './common'
Vue.use(Router)
NProgress.configure({
  minimum: 0.3,
  showSpinner: false,
  template: '<div class="bar" role="bar" style="background: #0d7ef2; transform: translate3d(-0.6%, 0px, 0px); transition: all 200ms ease;"><div class="peg" style="box-shadow: 0 0 10px #0d7ef2, 0 0 5px #0d7ef2;"></div></div><div class="spinner" role="spinner"><div class="spinner-icon" style="border-top-color:white;border-left-color: white"></div></div',
})

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "alphaManagement" */ '@/views/index/index.vue'),
    redirect: '/alphaTable',
    children: [
      {
        path: 'alphaTable',
        name: '配置表格',
        component: () => import(/* webpackChunkName: "alphaManagement" */ '@/views/alpha/page/list.vue'),
        children: [],
      },
      {
        path: 'publish/testlocal11',
        component: () => import(/* webpackChunkName: "alphaManagement" */ '@/views/alpha/alphaPreviewPage.vue'),
        children: [],
        name: '测试预览',
        meta: {
          haveParams: 'routerName',
        },
      },
    ],
    ...common,
  },
]
// .concat(workFlow)
// debugger
const router = new Router({
  mode: 'history',
  routes,
})

router.afterEach(() => {
  NProgress.done()
})

export default { router, routes }
