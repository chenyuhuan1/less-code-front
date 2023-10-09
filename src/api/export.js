import axios from 'axios'
import * as util from 'utils/common'
import config from '@/config'
const serverURL = process.env.API_ROOT
const biz = serverURL + '*****'
const instance = axios.create({
  baseURL: biz,
  timeout: config.timer.connTimeout * 1000,
})

instance.defaults.headers.post['Content-Type'] = 'application/json'
instance.defaults.responseType = 'blob'
instance.defaults.headers.post['data-origin'] = 1
// 错误处理
instance.interceptors.response.use(function(response) {
  return response
}, util.catchError)

export default instance
