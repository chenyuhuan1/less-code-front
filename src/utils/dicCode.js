/*
 * @Description: 字典值本地配置
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2020-08-31 15:50:10
 * @LastEditors: tanpeng
 * @LastEditTime: 2023-04-20 15:03:22
 */
export const yesOrNo = [
  {
    desc: '是',
    name: 1,
  },
  {
    desc: '否',
    name: 0,
  },
]
export const custTypeList = [
  {
    value: '农户收入',
    label: '农户收入',
  },
  {
    value: '个体户',
    label: '个体户',
  },
  {
    value: '小微企业',
    label: '小微企业',
  },
  {
    value: '其他涉农',
    label: '其他涉农',
  },
  {
    value: '其他',
    label: '其他',
  },
]
export const inAccountTypeOptions = [
  {
    label: '客户转账到账',
    value: 'CUST',
  },
  {
    label: '诉讼/保险理赔',
    value: '诉讼/保险理赔',
  },
  {
    label: '诉讼节清减免',
    value: 'SSJQJM',
  },
  {
    label: 'SSFCZ',
    value: 'SSFCZ',
  },
  {
    label: '支付宝转账到账',
    value: 'CUST_ZFB_ARRIVA',
  },
  {
    label: 'YQCZ',
    value: 'YQCZ',
  },
  {
    label: '客户经理转账到账单',
    value: 'EMP',
  },
  {
    label: '优惠券入账',
    value: 'COUPON_ARRIVAL',
  },
]

export const interfaceTypes = [
  { prop: 'post', label: 'post' },
  { prop: 'get', label: 'get' },
  { prop: 'put', label: 'put' },
  { prop: 'delete', label: 'delete' },
]

export const paramTypes = [
  { prop: 'params', label: 'params' },
  { prop: 'query', label: 'body' },
]
export const showType = [
  { prop: 'no', label: '不展示详情按钮', width: 140 },
  { prop: 'yes', label: '展示详情按钮', width: 140 },
  { prop: 'backfill', label: '不展示详情按钮，用于回填编辑弹窗', width: 140 },
]

export const paramSource = [
  { prop: 'row', label: 'table行数据' },
  { prop: 'api', label: '接口获取' },
]


// 联动类型
export const gangedTypes = [
  { prop: 'show', label: '字段显示隐藏状态（回调函数返回ture为隐藏）' },
  { prop: 'dis', label: '字段禁用启用状态（回调函数返回ture为禁用）' },
  { prop: 'req', label: '字段必填状态（回调函数返回ture为必填）' },
  { prop: 'val', label: '字段值' },
  { prop: 'options', label: '字段下拉选项' },
]

// 自定义操作类型
export const customOpTypes = [
  { prop: 'jump', label: '页面跳转' },
  { prop: 'api', label: '接口请求' },
  { prop: 'form', label: '表单提交' },
]

// 自定义操作按钮类型
export const customOpBtnTypes = [
  { prop: 'primary', label: '主题色' },
  { prop: 'success', label: '绿色' },
  { prop: 'danger', label: '红色' },
  { prop: 'warning', label: '橙色' },
  { prop: 'info', label: '灰色' },
  { prop: 'text', label: '文字' },
]
// 表类型
export const databaseTableTypes = [
  { prop: 'single', label: '单表' },
  { prop: 'host', label: '主表' },
  { prop: 'attach', label: '附表' },
]