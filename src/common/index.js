/*
 * @Description:
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2021-02-23 16:33:06
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-09-12 14:12:05
 */
import axios from 'axios'
import { Message, Notification } from 'element-ui'
import Moment from 'moment' // moment.js库的引入
import _ from 'lodash' // lodash.js库的引入
const install = (Vue) => {
  if (install.installed) {
    return
  }
  // 解决axios跨域问题
  axios.defaults.withCredentials = true
  // 前端数据总线
  Vue.prototype.$moment = Moment
  Vue.prototype._ = _
  Vue.prototype.$tableau = window.tableau
  const errorHandler = (error, vm) => {
    console.error('errorHandler:')
    console.error(vm)
    console.error(error)
  }

  Vue.prototype.HOST = '/api'
  Vue.prototype.$http = axios
  Vue.prototype.$message = Message
  Vue.prototype.$notify = Notification
  Vue.prototype.$throw = (error) => errorHandler(error, this)
  Vue.config.errorHandler = errorHandler
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default { install }
