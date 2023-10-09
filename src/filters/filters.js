/* eslint-disable no-param-reassign */
import Moment from 'moment' // moment.js库的引入
const fmoney = (value) => {
  if (value) {
    const fm = parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+\b)/g, ',')
    return fm
  } else {
    return '0.00'
  }
}

const fdate = (value, format = 'YYYY-MM-DD') => {
  if (value) {
    const fm = Moment(value).format(format)
    return fm
  } else {
    return ''
  }
}

const frate = (value, num) => {
  if (value === '-') {
    return '-'
  }
  if (!value) {
    return value
  }
  const fixed = num || 2
  const fm = (value * 100).toFixed(fixed) + '%'
  return fm
}

const fIntNumber = (value) => {
  if (value) {
    const fm = parseFloat(value).toFixed(0).replace(/\B(?=(\d{3})+\b)/g, ',')
    return fm
  } else {
    return '0'
  }
}
const transferType = (value, typeArr) => {
  let result = ''
  if (value !== undefined && value !== '' && value != null) {
    value = value + ''
    for (const i of typeArr) {
      if (typeof i.itemCode === 'object') {
        for (const j of i.itemCode) {
          if (`${value}` === `${j}`) {
            result = i.itemName
          }
        }
      } else {
        if (`${value}` === `${i.itemCode}`) {
          result = i.itemName
        }
      }
    }
  }
  return result
}
const fcrossBar = (value) => value || '-'
const filterHTMLTag = function(msg) {
  msg = msg.replace(/<\/?[^>]*>/g, '') // 去除HTML Tag
  msg = msg.replace(/[|]*\n/, '') // 去除行尾空格
  msg = msg.replace(/&npsp;/ig, '') // 去掉npsp
  return msg
}

const fmobile = (value) => {
  if (!value) {
    return ''
  }
  value = '' + value
  const reg = /(\d{3})\d{4}(\d{4})/
  const mobile = value.replace(reg, '$1****$2')
  return mobile
}
export {
  fmoney,
  fdate,
  frate,
  fIntNumber,
  transferType,
  fcrossBar,
  filterHTMLTag,
  fmobile,
}
