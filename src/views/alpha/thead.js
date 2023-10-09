/*
 * @Description: 页头配置
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2021-01-06 11:13:30
 * @LastEditors: tanpeng
 * @LastEditTime: 2023-04-23 15:02:30
 */
export const tableList = [
  { prop: 'route', label: '路由名称', width: 140 },
  // { prop: 'system', label: '所属系统', width: 140 },
  { prop: 'meta', label: '页面名称', width: 140 },
  { prop: 'isEnable', label: '启用状态', width: 140 },
  { prop: 'createDate', label: '创建时间', width: 140 },
  { prop: 'createName', label: '创建人', width: 140 },
  { prop: 'updateDate', label: '最后修改时间', width: 140 },
  { prop: 'updateName', label: '最后修改人', width: 140 },
]
export const tableConfigList = [
  { prop: 'prop', label: '参数值', width: 140 },
  { prop: 'label', label: '参数名', width: 140 },
  { prop: 'parentKey', label: '父节点key', width: 140 },
  { prop: 'fixed', label: '固定列', width: 140 },
  { prop: 'align', label: '对齐', width: 140 },
  { prop: 'width', label: '宽度', width: 140 },
]
// 组件类型
const typeOptions = [
  { label: 'input', value: 'input' },
  { label: 'textarea', value: 'textarea' },
  { label: 'number', value: 'number' },
  { label: 'select', value: 'select' },
  { label: 'date', value: 'date' },
  { label: 'month', value: 'month' },
  { label: 'year', value: 'year' },
  { label: 'dateRange', value: 'dateRange' },
  { label: 'monthRange', value: 'monthRange' },
  { label: 'yearRange', value: 'yearRange' },
  { label: 'numRange', value: 'numRange' },
  { label: 'inputAsync', value: 'inputAsync' },
  { label: 'cascader', value: 'cascader' },
  { label: 'switch', value: 'switch' },
  { label: 'upload', value: 'upload' },
  { label: 'importFile', value: 'importFile' },
]
// 数据库类型
const databaseTypeOptions = [
  { label: 'String', value: 'String' },
  { label: 'Integer', value: 'Integer' },
  { label: 'Double', value: 'Double' },
  { label: 'Date', value: 'Date' },
  { label: 'Datetime', value: 'Datetime' },
  { label: 'BigDecimal', value: 'BigDecimal' },
  { label: 'Text', value: 'Text' },
  { label: 'Blob', value: 'Blob' },
]
export const deteTypes = ['date', 'month', 'year', 'dateRange', 'monthRange', 'yearRange']

export const tableInputConfigList = [
  { prop: 'type', label: '类型', width: 140, options: typeOptions },
  { prop: 'prop', label: '参数key值', width: 140 },
  { prop: 'propEnd', label: '范围值第二参数', width: 140 },
  { prop: 'label', label: '参数名', width: 140 },
  { prop: 'colNum', label: '宽度', width: 140 },
  { prop: 'required', label: '是否必填', width: 140 },
  { prop: 'multiple', label: '是否多选', width: 140 },
  { prop: 'dateFormat', label: '日期格式', width: 140 },
  { prop: 'disabled', label: '是否禁用', width: 140 },
  { prop: 'optionsConfig', label: '源数据配置', width: 140 },
  { prop: 'gangedConfig', label: '联动配置', width: 140 },
]
export const tableDataBaseInputConfigList = [
  { prop: 'fieldName', label: '字段名称', width: 140 },
  { prop: 'fieldType', label: '字段类型', width: 140, options: databaseTypeOptions },
  { prop: 'fieldRemark', label: '字段备注', width: 140 },
  { prop: 'fieldLength', label: '字段长度', width: 140 },
  { prop: 'fieldPrimaryKey', label: '主键', width: 140 },
  { prop: 'fieldIsNull', label: '允许空值', width: 140 },
]
export const exportDatabaseColunmsList = [
  { prop: 'fieldName', label: '字段名称', width: 140 },
  { prop: 'fieldType', label: '字段类型', width: 140, options: databaseTypeOptions },
  { prop: 'fieldRemark', label: '字段备注', width: 140 },
  { prop: 'fieldLength', label: '字段长度', width: 140 },
  { prop: 'fieldPrimaryKey', label: '主键', width: 140 },
  { prop: 'fieldIsNull', label: '允许空值', width: 140 },
]
