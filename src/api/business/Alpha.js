/*
 * @Description: 测试配置表格参数
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2020-09-28 14:12:23
 * @LastEditors: 陈宇环
 * @LastEditTime: 2021-12-21 11:59:29
 */
import instance from '../index.js'
import Result from '../Result.js'
export const baseURL = ''
const host = baseURL + '/lessCodeApi/routeConfig'
import * as utils from 'utils/common'
function originSystem() {
  return utils.session('originSystem') && utils.session('originSystem').system
}
/**
 * 财务分析图表
 */
export default class Api {
  // 列表
  async list(opts = {}) {
    opts = {
      ...opts,
      system: opts.system || originSystem(),
    }
    const result = await instance.get(`${host}`, {
      params: opts,
    })
    return new Result(result.data)
  }
  // 新增
  async add(opts = {}) {
    opts = {
      ...opts,
      system: opts.system || originSystem(),
    }
    const result = await instance.post(`${host}`, opts)
    return new Result(result.data)
  }
  // 删除
  async del(opts = {}) {
    opts = {
      ...opts,
      system: opts.system || originSystem(),
    }
    const result = await instance.post(`${host}/del`, opts)
    return new Result(result.data)
  }
  // 更新
  async update(opts = {}) {
    opts = {
      ...opts,
      system: opts.system || originSystem(),
    }
    const result = await instance.put(`${host}/${opts.id}`, opts)
    return new Result(result.data)
  }
  // 详情
  // async detail(opts = {}) {
  //   let result = await instance.get(`${host}/${opts.id}`, opts)
  //   return new Result(result.data)
  // }
  async detail(opts = {}) {
    opts = {
      ...opts,
      system: opts.system || originSystem(),
    }
    const result = await instance.post('/lessCodeApi/getRouteInfo', {
      route: opts.routeName,
      system: opts.system,
      version: opts.version,
    })
    return new Result(result.data)
  }
}
