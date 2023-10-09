/*
 * @Description:
 * @Autor: tanpeng
 * @Date: 2021-09-10 14:47:23
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-09-12 14:53:24
 */
import axios from 'axios'
import * as util from 'utils/common'
import config from '@/config'
// import _ from 'lodash'

const instance = axios.create({
  timeout: config.timer.connTimeout * 1000,
})

instance.defaults.headers.post['Content-Type'] = 'application/json'
instance.defaults.headers.post['data-origin'] = 1

instance.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 错误处理
instance.interceptors.response.use(function(response) {
  return response.data
}, util.catchError)

export default instance
