/*
 * @Description:
 * @Autor: tanpeng
 * @Date: 2021-02-23 16:33:06
 * @LastEditors: tanpeng
 * @LastEditTime: 2021-04-25 13:37:54
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
// import createVuexAlong from 'vuex-along'
Vue.use(Vuex)
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [
    // createVuexAlong({
    //   // 设置保存的集合名字，避免同站点下的多项目数据冲突
    //   name: 'oms-vuex-along',
    //   local: {
    //     list: ['areaList', 'orgTree', 'orgLevel'],
    //     // 过滤模块 ma 数据， 将其他的存入 localStorage
    //     isFilter: false
    //   },
    //   session: {
    //     // 保存模块 ma 中的 a1 到 sessionStorage
    //     list: ['options', 'activeIndex', 'userInfo', 'code', 'menusArr', 'userBranches', 'mockInit', 'businessInfo']
    //   }
    // })
  ],
})
