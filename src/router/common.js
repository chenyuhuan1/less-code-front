/*
 * @Description:
 * @Autor: tanpeng
 * @Date: 2021-02-24 15:51:44
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-09-08 15:42:35
 */
/** 公共页面路由 */

const unauthorized = () => import(/* webpackChunkName: "common" */ '@/views/common/401.vue')
const noPage = () => import(/* webpackChunkName: "common" */ '@/views/common/404.vue')
const welcome = () => import(/* webpackChunkName: "common" */ '@/views/common/welcome.vue')

const common = [
  {
    path: '/401',
    name: '无权访问',
    component: unauthorized,
  },
  {
    path: '/404',
    name: '找不到页面',
    component: noPage,
  },
  {
    path: '/welcome',
    name: '欢迎',
    component: welcome,
  },
  {
    path: '*',
    component: noPage,
  },
]
export default common
