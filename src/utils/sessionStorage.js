/**
 * @description sessionStorage添加值
 * @param {String} name 键名
 * @param {value} value 键值
 */
function setItem(name, value) {
  sessionStorage.setItem(name, value)
}
/**
 * @description sessionStorage读取值
 * @param {String} name 键名
 * @return 返回键名name所对应的键值
 */
function getItem(name) {
  let data = sessionStorage.getItem(name)
  return data
}
/**
 * @description sessionStorage删除对应键值
 * @param {String} name 键名
 */
function removeItem(name) {
  sessionStorage.removeItem(name)
}
/**
 * @description sessionStorage删除所有数据
 */
function clear() {
  sessionStorage.clear()
}
/**
 * @description sessionStorage获取键值对数量
 */
function length() {
  let length = sessionStorage.length
  return length
}

export const storage = {
  setItem: setItem,
  getItem: getItem,
  removeItem: removeItem,
  clear: clear,
  length: length
}
