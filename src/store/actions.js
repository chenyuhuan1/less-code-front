/**
 * 根级别 action
 */
import * as types from './mutation-types'
/**
 * 初始化state
 */
export const init = ({ commit }) => {
  commit(types.SET_INIT)
}
