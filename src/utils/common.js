import Vue from 'vue'
import _ from 'lodash' // lodash.js库的引入
export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}
/**
 * 对象合并
 */
export function mergeObj(target, ...sources) {
  return Object.assign(target, ...sources)
}
/**
 * 对象合并并返回一个新对象
 */
export function mergeReturnNewObj(...sources) {
  return Object.assign({}, ...sources)
}
/**
 * 判断是否为空对象
 */
export function isObjectEmpty(obj) {
  for (const name in obj) {
    return false
  }
  return true
}
/**
 * 克隆对象
 * 可以克隆原始对象并克隆它继承的值
 */
export function clone(origin) {
  const originProto = Object.getPrototypeOf(origin)
  return Object.assign(Object.create(originProto), origin)
}

/**
 * @description 深度拷贝
 * @param {Object} p 需要拷贝的对象
 * @param {Object} c 拷贝的对象
 * @return {Object} 返回深度拷贝的对象
 */
export function deepCopy(p, c) {
  c = c || {}
  for (const i in p) {
    if (typeof p[i] === 'object') {
      c[i] = p[i].constructor === Array ? [] : {}
      deepCopy(p[i], c[i])
    } else {
      c[i] = p[i]
    }
  }
  return c
}
/**
 * 数组合并
 */
export function mergeArray(arr1, arr2) {
  return arr1.concat(arr2)
}

/**
 * 判断是否为空
 */
export function isNull(str) {
  return str === null || str === undefined || str === '' || str === 'NAN'
}

export function isNotNull(str) {
  return !isNull(str)
}

export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @description 中英文字符串截取显示一致
 * @param {String} str 要截取的字符串
 * @param {Number} len 截取字符串的长度
 */
export function cutStr(str, len) {
  let charLength = 0
  if (str.length <= len) {
    return str
  }
  for (let i = 0; i < str.length; i++) {
    const sonStr = str.charAt(i)
    encodeURI(sonStr).length > 2 ? (charLength += 1) : (charLength += 0.5)
    if (charLength >= len) {
      const subLen = charLength === len ? i + 1 : i
      return str.substr(0, subLen) + '...'
    }
  }
  return str
}

/**
 * @description [throttle 节流函数]
 * @author zoumiao
 * @param {Function} fn 延时调用函数
 * @param {Number} delay 延迟多长时间
 * @param {Number} atleast 至少多长时间触发一次
 * @return {Function} 延迟执行的方法
 */
export function throttle(fn, delay, atleast) {
  let timer = null
  let previous = null

  return function() {
    const now = +new Date()
    if (!previous) {
      previous = now
    }
    if (atleast && now - previous > atleast) {
      fn()
      // 重置上一次开始时间为本次结束时间
      previous = now
      clearTimeout(timer)
    } else {
      clearTimeout(timer)
      timer = setTimeout(function() {
        fn()
        previous = null
      }, delay)
    }
  }
}

// 生成随机数
export const getUUID = function(len) {
  len = len || 6
  len = parseInt(len, 10)
  len = isNaN(len) ? 6 : len
  const seed = '0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ'
  const seedLen = seed.length - 1
  let uuid = ''
  while (len--) {
    uuid += seed[Math.round(Math.random() * seedLen)]
  }
  return uuid
}

/**
 * 获取后台接口返回不明白的英文错误转换
 * @param msg
 * @returns {*}
 */
export const getBackgroundUnknownMsg = function(msg) {
  if (!msg) {
    return ''
  }
  const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
  if (!reg.test(msg)) {
    if (msg.toLowerCase().indexOf('timeout') > -1) {
      msg =
        '后台维护导致超时，请刷新后重新操作，如果仍然有问题，请联系后台管理员'
    } else if (msg.toLowerCase().indexOf('general') > -1) {
      msg =
        '临时网络问题导致错误，请刷新后重新操作，如果仍然有问题，请联系后台管理员'
    } else if (msg.toLowerCase().indexOf('load balancer') > -1) {
      msg =
        '后台正在维护，导致部分功能不可用，请稍后几分钟重试，如果仍然有问题，请联系后台管理员'
    } else {
      msg = '后台正在维护，请刷新后重新操作，如果仍然有问题，请联系后台管理员'
    }
  }
  return msg
}

// sessionStorage
export const session = function(key, value) {
  // debugger
  if (value === void 0) {
    const lsVal = sessionStorage.getItem(key)
    if (lsVal && lsVal.indexOf('autostringify-') === 0) {
      return JSON.parse(lsVal.split('autostringify-')[1])
    } else {
      return lsVal
    }
  } else {
    if (typeof value === 'object' || Array.isArray(value)) {
      value = 'autostringify-' + JSON.stringify(value)
    }
    return sessionStorage.setItem(key, value)
  }
}

/**
 * 根据code判断是否要显示按钮（按钮权限控制）
 * @param code
 * @returns {*}
 */
export const isHavePermission = function(code) {
  const { permissionInfo } = session('permissionInfo')
  const userInfo = session('userInfo').data
  if (userInfo !== null) {
    if (userInfo.userType === 1) {
      return true
    } else {
      const permission = permissionInfo.find((value) => value === code)
      if (permission) {
        return true
      }
      return false
    }
  } else {
    return false
  }
}

/**
 * @description [classification 分类]
 * @author zoumiao
 * @param {Array} arr 需要分类的数组
 * @return {Array} 返回已经分类的数组
 */
export function classification(dataArr, name) {
  const list = dataArr
  let flag = 0
  const data = []
  for (let i = 0; i < list.length; i++) {
    let az = ''
    for (let j = 0; j < data.length; j++) {
      if (data[j][0][name] === list[i][name]) {
        flag = 1
        az = j
        break
      }
    }
    if (flag === 1) {
      data[az].push(list[i])
      flag = 0
    } else if (flag === 0) {
      const wdy = []
      wdy.push(list[i])
      data.push(wdy)
    }
  }
  return data
}

/**
 * @description  fileType 判断文件类型函数]
 * @author   zoumiao
 * @param    {string}   strs [字符串]
 * @param    {string}   str  [包含的字符]
 * @returns   {boolean}       [true or false]
 */
export function fileType(strs, str) {
  if (strs.split('.')[strs.split('.').length - 1].indexOf(str) !== -1) {
    return true
  }
  return false
}
export class Queue {
  constructor() {
    this.top = 0
    this.list = []
  }
  push(item) {
    this.top++
    this.list.push(item) // 入栈操作
  }
  shift() {
    --this.top
    return this.list.shift() // 出栈操作
  }
  peek() {
    return this.list[this.top - 1] // 查询栈顶元素
  }
}

// ajax错误处理
export const catchError = function(error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        Vue.prototype.$message({
          message: error.response.data.message || '请求参数异常',
          type: 'error',
        })
        break
      case 401:
        Vue.prototype.$message({
          message: error.response.data.message || '密码错误或账号不存在！',
          type: 'warning',
          onClose() {
            location.reload()
          },
        })
        break
      case 403:
        Vue.prototype.$message({
          message:
            error.response.data.message || '无访问权限，请联系企业管理员',
          type: 'warning',
        })
        break
      case 404:
        Vue.prototype.$message({
          message:
              error.response.data.message || '配置异常',
          type: 'warning',
        })
        break
      default:
        const msg = getBackgroundUnknownMsg(error.response.data.message)
        Vue.prototype.$message({
          message: msg || '服务端异常，请联系技术支持',
          type: 'error',
        })
    }
  }
  return Promise.reject(error)
}
/**
 * [把数字按照千分号隔开。例1,000,000]
 * @Author   tanpeng
 * @DateTime 2018-07-09
 * @version  [v1.0]
 * @param    {[string or number]}   num [数字或者字符串数字,数字的单位是分,需要转成元]
 * @return   {[string]}       [返回千分隔开的数字]
 */
export const toThousands = (num, type) => {
  let result = ''
  num =
    num != null && num !== ''
      ? Number(num.toString() || 0).toFixed(2)
      : Number(0).toFixed(2)
  const numAry = num.toString().split('.')
  let preNum = num >= 0 ? numAry[0] : Math.abs(numAry[0])
  const lastNum = numAry[1]
  while (preNum.length > 3) {
    result = ',' + preNum.slice(-3) + result
    preNum = preNum.slice(0, preNum.length - 3)
  }
  if (preNum) {
    result = preNum + result
  }
  if (type === undefined) {
    if (num >= 0) {
      result = result + '.' + lastNum
    } else {
      result = '-' + result + '.' + lastNum
    }
  }
  return result
}

/**
 * @description: 处理数组，table需要展开合并的时候需要用到
 *               参考：@/view/financialBudget/execute/record/index.vue
 * @param {Array} 需要处理的数组
 * @return {Array} 处理完成的数组
 * @author: 陈宇环
 * @Date: 2021-04-08 14:13:54
 */
export const groupingArray = function(arr) {
  const listMap = {}
  for (let i = 0; i < arr.length; i++) {
    if (!listMap[arr[i].deptCode]) {
      listMap[arr[i].deptCode] = [{ ...arr[i], rowKey: i + 1 }]
    } else {
      listMap[arr[i].deptCode].push({ ...arr[i], rowKey: i + 1 })
    }
  }
  const list = []
  for (const key in listMap) {
    list.push({ ...listMap[key][0], children: listMap[key].slice(1) })
  }
  return list
}

// 获取树结构code对应的value
export function getTreeValue(tree, code) {
  const stack = []
  // 顶点
  const first = tree
  stack.push(first)
  while (stack.length) {
    // 取最后一个，先进后出
    const node = stack.pop()
    if (node.orgCode === code) {
      return node.orgName
    }
    if (node.children) {
      // 这里循环倒序是控制同级节点的遍历信息
      // 如789节点，如果将下面的for顺序遍历的话，执行将会是987
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i])
      }
    }
  }
  return ''
}

// 数组转树
export function convert(list) {
  const obj = {}
  const res = []
  list.forEach((item) => {
    obj[item.prop] = item
  })
  list.forEach((item) => {
    if (item.parentKey) {
      obj[item.parentKey].children ? obj[item.parentKey].children.push(item) : obj[item.parentKey].children = [item]
    } else {
      res.push(item)
    }
  })
  return res
}

// 树转数组
export function flatten(tree) {
  const arr = []
  function spread(tree, parentKey) {
    for (let i = 0; i < tree.length; i++) {
      arr.push({ ...tree[i], parentKey })
      if (tree[i].children) {
        spread(tree[i].children, tree[i].prop)
        delete tree[i].children
      }
    }
  }
  spread(tree, undefined)
  return arr
}

/**
 * @description:  处理params将""、undefined等转成null
 * @param {*}
 * @return {*}
 * @author: 陈宇环
 * @Date: 2021-06-16 11:46:38
 */
export function disposeParams(par) {
  console.log('par', par)
  const params = _.cloneDeep(par)
  const newParams = {}
  for (const key in params) {
    console.log(params[key] === '')
    if (String(params[key]) === 'undefined' || params[key] === '') {
      newParams[key] = null
    } else {
      newParams[key] = params[key]
    }
  }
  console.log(newParams)
  return newParams
}

/**
 * @description: 替换链接中{key}的为第二个参数对象.key的value
 * @param {String} url 需要替换的url地址
 * @param {Object} 替换数据源对象
 * @return {String} 替换之后的url地址
 * @author: 陈宇环
 * @Date: 2021-07-08 09:25:45
 */
export function replaceParenthesis(url, sourceData) {
  let interfaceUrl = url
  for (const key in sourceData) {
    // 将接口上的/${id}等替换成/2
    interfaceUrl = interfaceUrl.replace(new RegExp('\\{' + key + '}', 'g'), sourceData[key])
  }
  return interfaceUrl
}

