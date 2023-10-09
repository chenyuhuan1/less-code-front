<!--
 * @Description: 基础表单组件
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2020-11-20 09:13:49
 * @LastEditors: tanpeng
 * @LastEditTime: 2023-04-20 10:41:34
-->
<style scoped>
.cfpaForm /deep/ .el-row {
  flex-wrap: wrap;
}
.cfpaForm /deep/ .el-form-item {
  display: flex;
  align-items: center;
}
.cfpaForm /deep/ .el-form-item .el-form-item__content,
.cfpaForm /deep/ .el-form-item .el-form-item__label {
  line-height: 15px;
}
.cfpaForm /deep/ .el-form-item .el-form-item__label {
  max-height: 30px;
  overflow: hidden;
}
.cfpaForm /deep/ .el-form-item .el-form-item__content {
  margin-left: 0 !important;
  /** margin-right: 20px; **/
  width: 100%;
}
.cfpaForm /deep/ .el-select,
.cfpaForm /deep/ .el-cascader,
.cfpaForm /deep/ .el-input-number,
.cfpaForm /deep/ .el-autocomplete,
.cfpaForm /deep/ .el-date-editor.el-input,
.cfpaForm /deep/ .el-date-editor.el-input__inner {
  width: 100%;
}
.cfpaForm /deep/ .el-input-number .el-input__inner {
  text-align: left;
}
.cfpaForm /deep/ .el-form-item .el-form-item__label {
  padding-right: 6px;
}
.range-left {
  position: relative;
  padding-right: 10px;
}
.range-right {
  position: relative;
  padding-left: 10px;
}
.range-line {
  position: absolute;
  right: -5px;
  top: 7px;
  color: #ccc;
}
.right-btn{
  position: absolute; right: 25px; z-index: 9999; height: 32px;
}
.has-right-btn{
  width: calc(100% - 80px);
}
.btns {
  margin-bottom: 10px;
}
</style>
<template>
  <el-form
    ref="form"
    class="cfpaForm"
    :model="config.form"
    :label-width="config.labelWidth"
    :rules="rules"
    :disabled="config.disabled"
    :size="config.size || 'small'"
  >
    <el-row :gutter="10">
      <el-col
        v-for="(item, index) in columns"
        v-show="item.isExpand"
        :key="index"
        :xs="24"
        :sm="item.colNum || config.colNum || getSpan(item.type, item.colNum)[0]"
        :md="item.colNum || config.colNum || getSpan(item.type, item.colNum)[1]"
        :lg="item.colNum || config.colNum || getSpan(item.type, item.colNum)[2]"
        :xl="item.colNum || config.colNum || getSpan(item.type, item.colNum)[3]"
        :offset="item.offset"
      >
        <el-button
          v-if="item.rightBtn"
          plain
          type="primary"
          class="right-btn"
          @click="()=> typeof item.onRightBtnClick === 'function'? item.onRightBtnClick(item.prop, config.form) : ''"
        >
          {{ item.rightBtnText || '搜素' }}
        </el-button>
        <!-- 插槽 -->
        <slot
          v-if="item.slot"
          :name="item.prop"
          :data="config.form"
        />
        <template v-else>
          <el-form-item
            :label="item.label"
            :prop="item.prop"
            :label-width="item.labelWidth"
            :style="{
              marginLeft:
                item.type.indexOf('Range') > 0 && !config.colNum
                  ? getExpandNum() === 6
                    ? '-13.5px'
                    : getExpandNum() === 4
                      ? '-18.5px'
                      : getExpandNum() === 2
                        ? '-15.5px'
                        : getExpandNum() === 1
                          ? '-12.5px'
                          : ''
                  : ''
            }"
          >
            <!-- 文本区域框、文本输入框 -->
            <template
              v-if="
                !item.type || item.type === 'input' || item.type === 'textarea'
              "
            >
              <el-input
                v-model="config.form[item.prop]"
                :class="{'has-right-btn':item.rightBtn}"
                clearable
                :show-password="item.showpassword"
                :disabled="!!item.disabled"
                :minlength="item.minlength"
                :maxlength="item.maxlength"
                :type="item.type || 'text'"
                :rows="item.rows || 3"
                :autosize="item.autosize"
                :placeholder="item.placeholder || `请输入${item.label}`"
                @input="
                  value => {
                    typeof item.onChange === 'function'
                      ? item.onChange(value, item.prop, config.form)
                      : ''
                  }
                "
              >
                <!-- 输入框后面的单位 -->
                <template
                  v-if="item.append"
                  slot="append"
                >
                  {{
                    item.append
                  }}
                </template>
                <!-- 输入框前面的单位 -->
                <template
                  v-if="item.prepend"
                  slot="prepend"
                >
                  {{
                    item.prepend
                  }}
                </template>
              </el-input>
            </template>
            <!-- 数字类型 -->
            <template v-else-if="item.type === 'number'">
              <div style="display:flex;justify-content: center;align-items: center;">
                <el-input-number
                  v-model="config.form[item.prop]"
                  :controls="false"
                  :min="item.min"
                  :max="item.max"
                  step-strictly
                  :step="item.step"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder || `请输入${item.label}`"
                  @change="
                    (value, oldValue) => {
                      typeof item.onChange === 'function'
                        ? item.onChange(value, item.prop, config.form)
                        : ''
                    }
                  "
                />
                <div
                  v-if="item.append"
                  class="append"
                  style="white-space: nowrap;margin-left: 5px;"
                >
                  {{ item.append }}
                </div>
              </div>
            </template>
            <!-- 选择框类型 -->
            <template v-else-if="item.type === 'select'">
              <el-select
                v-model="config.form[item.prop]"
                :disabled="!!item.disabled"
                :class="{'has-right-btn':item.rightBtn}"
                :clearable="item.clearable === false ? false : true"
                filterable
                :placeholder="item.placeholder || `请选择${item.label}`"
                :multiple="item.multiple"
                :collapse-tags="item.multiple"
                @change="
                  value => {
                    typeof item.onChange === 'function'
                      ? item.onChange(value, item.prop, config.form)
                      : ''
                  }
                "
              >
                <el-option
                  v-for="(cItem, cIndex) in item.options"
                  :key="
                    (item.valueKey ? cItem[item.valueKey] : cItem.prop) +
                      '_' +
                      cIndex
                  "
                  :label="item.labelKey ? getLabelOrValue(cItem, item.labelKey) : cItem.label"
                  :value="item.valueKey ? getLabelOrValue(cItem, item.valueKey) : cItem.prop"
                />
              </el-select>
            </template>
            <!-- 日期、月、年选择类型 -->
            <template
              v-else-if="
                item.type === 'date' ||
                  item.type === 'month' ||
                  item.type === 'year'
              "
            >
              <el-date-picker
                v-model="config.form[item.prop]"
                :type="item.type"
                :placeholder="item.placeholder || `请选择${item.label}`"
                :picker-options="item.pickerOptions"
                :disabled="!!item.disabled"
                :format="getFormat(item, item.type)"
                :value-format="getFormat(item, item.type)"
                @change="
                  value => {
                    typeof item.onChange === 'function'
                      ? item.onChange(value, item.prop, config.form)
                      : ''
                  }
                "
              />
            </template>
            <!-- 日期、月、年区间选择类型 -->
            <template
              v-else-if="
                item.type === 'dateRange' ||
                  item.type === 'monthRange' ||
                  item.type === 'yearRange'
              "
            >
              <el-row>
                <el-col
                  :span="12"
                  class="range-left"
                >
                  <el-date-picker
                    v-model="config.form[item.prop]"
                    :type="getRangeType(item.type)"
                    :placeholder="item.placeholder || `${item.label}-开始`"
                    :picker-options="
                      item.pickerOptions ||
                        pickerOptions('start', config.form[item.propEnd])
                    "
                    :disabled="!!item.disabled"
                    :format="getFormat(item, getRangeType(item.type))"
                    :value-format="getFormat(item, getRangeType(item.type))"
                    @change="
                      value => {
                        typeof item.onChange === 'function'
                          ? item.onChange(value, item.prop, config.form)
                          : ''
                      }
                    "
                  />
                  <span class="range-line">-</span>
                </el-col>
                <el-col
                  :span="12"
                  class="range-right"
                >
                  <el-date-picker
                    v-model="config.form[item.propEnd]"
                    :type="getRangeType(item.type)"
                    :disabled="!!item.disabled"
                    :placeholder="item.placeholder || `${item.label}-结束`"
                    :picker-options="
                      item.pickerOptionsEnd ||
                        pickerOptions('end', config.form[item.prop])
                    "
                    :format="getFormat(item, getRangeType(item.type))"
                    :value-format="getFormat(item, getRangeType(item.type))"
                    @change="
                      value => {
                        typeof item.onChange === 'function'
                          ? item.onChange(value, item.propEnd, config.form)
                          : ''
                      }
                    "
                  />
                </el-col>
              </el-row>
            </template>
            <!-- 获得数字区间 -->
            <template v-else-if="item.type === 'numRange'">
              <el-row>
                <el-col
                  :span="12"
                  class="range-left"
                >
                  <el-input-number
                    v-model="config.form[item.prop]"
                    :controls="false"
                    :min="item.min"
                    :max="config.form[item.propEnd] || item.max"
                    step-strictly
                    :step="item.step"
                    :disabled="!!item.disabled"
                    :placeholder="item.placeholder || `请输入${item.label}`"
                    @change="
                      (value, oldValue) => {
                        typeof item.onChange === 'function'
                          ? item.onChange(value, item.prop, config.form)
                          : ''
                      }
                    "
                  />
                  <span class="range-line">-</span>
                </el-col>
                <el-col
                  :span="12"
                  class="range-right"
                >
                  <el-input-number
                    v-model="config.form[item.propEnd]"
                    :controls="false"
                    :min="config.form[item.prop] || item.min"
                    :max="item.max"
                    step-strictly
                    :step="item.step"
                    :disabled="!!item.disabled"
                    :placeholder="item.placeholder || `请输入${item.label}`"
                    @change="
                      (value, oldValue) => {
                        typeof item.onChange === 'function'
                          ? item.onChange(value, item.propEnd, config.form)
                          : ''
                      }
                    "
                  />
                </el-col>
              </el-row>
            </template>
            <!-- TODO 远程input搜索选择框-->
            <template v-else-if="item.type === 'inputAsync'">
              <el-autocomplete
                v-model="config.form[item.prop]"
                :disabled="!!item.disabled"
                :fetch-suggestions="
                  typeof item.querySearch === 'function'
                    ? (queryString, cb) =>
                      item.querySearch(queryString, cb, item.prop)
                    : ''
                "
                :placeholder="item.placeholder || `请输入关键词查询`"
                :value-key="item.valueKey"
                @select="
                  (value, oldValue) => {
                    typeof item.onChange === 'function'
                      ? item.onChange(value, item.prop, config.form)
                      : ''
                  }
                "
              />
            </template>
            <template v-else-if="item.type === 'cascader'">
              <el-cascader
                v-model="config.form[item.prop]"
                :disabled="!!item.disabled"
                :options="item.options"
                :props="{
                  value: item.valueKey || 'value',
                  label: item.labelKey || 'label',
                  children: item.childrenKey || 'children',
                  multiple: item.multiple || false,
                  emitPath: item.emitPath || item.emitPath === false ? item.emitPath : true // v-model是否是完整的路径数组   false: 最后一级的value
                }"
                filterable
                clearable
                collapse-tags
                :show-all-levels="false"
                @change="
                  (value, oldValue) => {
                    typeof item.onChange === 'function'
                      ? item.onChange(value, item.prop, config.form)
                      : ''
                  }
                "
              />
            </template>
            <template v-else-if="item.type === 'switch'">
              <el-switch
                v-model="config.form[item.prop]"
                :disabled="!!item.disabled"
                :active-color="item.activeColor"
                :inactive-color="item.inactiveColor"
                :active-text="item.activeText"
                :inactive-text="item.inactiveText"
                @change="
                  (value, oldValue) => {
                    typeof item.onChange === 'function'
                      ? item.onChange(value, item.prop, config.form)
                      : ''
                  }
                "
              />
            </template>
            <template v-else-if="item.type === 'upload'">
              <UploadFile
                :config="config.form[item.prop]"
              />
            </template>
            <template v-else-if="item.type === 'importFile'">
              <!-- :config="config.form[item.prop]" -->
              <ImportFile
                v-model="config.form[item.prop]"
              />
            </template>
            <template v-else-if="item.type === 'checkbox'">
              <el-checkbox-group
                v-model="config.form[item.prop]"
                :disabled="item.disabled"
                @change="
                  (value, oldValue) => {
                    typeof item.onChange === 'function'
                      ? item.onChange(value, item.prop, config.form)
                      : ''
                  }
                "
              >
                <el-checkbox
                  v-for="(cItem, cIndex) in item.options"
                  :key="
                    (item.valueKey ? cItem[item.valueKey] : cItem.value) +
                      '_' +
                      cIndex
                  "
                  :label="item.valueKey ? cItem[item.valueKey] : cItem.value"
                >
                  {{ item.labelKey ? cItem[item.labelKey] : cItem.label }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
        </template>
      </el-col>
      <el-col
        v-if="config.searchBtn"
        class="btns"
        :xs="24"
        :sm="6"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <el-button
          type="primary"
          :loading="config.disabled"
          :size="config.size || 'small'"
          @click="search"
        >
          搜索
        </el-button>
        <el-button
          :loading="config.disabled"
          :size="config.size || 'small'"
          @click="reset"
        >
          重置
        </el-button>
        <el-button
          v-if="config.isExport"
          type="warning"
          :loading="config.disabled"
          :size="config.size || 'small'"
          plain
          @click="fnExport"
        >
          导出
        </el-button>
        <el-tooltip
          v-if="expandIcon"
          content="展开/收起"
          placement="top"
          effect="light"
        >
          <el-button
            :size="config.size || 'small'"
            :icon="expandIcon"
            @click="
              changeExpand(expandIcon === 'el-icon-bottom' ? true : false)
            "
          />
        </el-tooltip>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { Message } from 'element-ui'
import UploadFile from '@/components/UploadFile.vue'
import ImportFile from '@/components/ImportFile.vue'
import * as utils from '@/utils'
export default {
  name: 'CfpaForm',
  components: { UploadFile, ImportFile },
  props: {
    // columns、form、disabled、labelWidth、size、searchBtn
    config: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      rules: {},
      columns: [],
      pickerOptions(type, val) {
        const vm = this
        return {
          disabledDate(time) {
            if (val && type) {
              if (type === 'start') {
                // 这里为了解决 默认08:00:00问题
                return vm.$moment(vm.$moment(time).format('yyyy-MM-DD HH:mm:ss')).unix() > vm.$moment(vm.$moment(val).format('yyyy-MM-DD HH:mm:ss')).unix()
              }
              if (type === 'end') {
                return vm.$moment(vm.$moment(time).format('yyyy-MM-DD HH:mm:ss')).unix() < vm.$moment(vm.$moment(val).format('yyyy-MM-DD HH:mm:ss')).unix()
              }
            }
            return false
          },
        }
      },
      expandIcon: '',
    }
  },
  watch: {
    // 传进来的columns 发生改变时
    'config.columns'(val) {
      this.initAll()
    },
  },
  created() {
    this.initAll()
  },
  methods: {
    /**
     * 根据 labelKey 或者 valueKey 来获取 select下拉的label或者value
     * @param {*} item select下拉item数据
     * @param {*} key labelKey 或者 valueKey key值
     */
    getLabelOrValue(item, key) {
      // 将{name}这种格式调换成item的name值
      const str = utils.replaceParenthesis(key, item)
      if (key === str) { // 字符串中没有{name}这种需要替换的字段
        return item[key]
      }
      return str
    },
    /**
     * @description: 获取日期格式化
     * @param {*} type
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-18 11:38:34
     */
    getFormat(item, type) {
      if (item.format) {
        return item.format
      }
      if (type === 'date') {
        return 'yyyy-MM-dd'
      }
      if (type === 'month') {
        return 'yyyy-MM'
      }
      if (type === 'year') {
        return 'yyyy'
      }
      return this.showConfigTypeError('日期格式错误')
    },
    /**
     * @description: 获得区间type
     * @param {*} name
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-18 11:01:21
     */
    getRangeType(name) {
      // dateRange、monthRange
      if (name && name.indexOf('Range') > 0) {
        const type = name.split('Range')[0]
        if (type === 'date' || type === 'month' || type === 'year') {
          return type
        }
        return ''
      }
      return ''
    },
    /**
     * @description: 初始化所有数据
     * @param {*}
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-17 17:15:12
     */
    initAll() {
      this.initForm()
      this.initColumns()
      this.initRules()
      this.$nextTick(() => {
        this.$refs.form && (this.$refs.form.clearValidate())
      })
    },
    /**
     * @description: 初始化columns
     * @param {*}
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-17 17:15:02
     */
    initColumns() {
      const vm = this
      if (vm.checkConfigType(vm.config, 'columns')) {
        // 判断是否有搜索框
        if (vm.config.searchBtn) {
          // 改变搜索表单的isExpand参数显示隐藏
          vm.changeExpand(false)
        } else {
          // 普通表单全部添加isExpand参数
          vm.changeExpand(true)
        }
        vm.$set(
          vm,
          'columns',
          vm.config.columns.filter((v) => !v.hide),
        )
      }
    },
    changeExpand(bool = false) {
      if (this.config.hideExpand === undefined || this.config.hideExpand === false) {
        const num = this.getExpandNum() || 1
        // 过滤所有的显示的column
        const showColunms = this.config.columns.filter((v) => !v.hide)
        // 当columns的长度小于屏幕所需的数量
        if (num >= showColunms.length) {
          this.expandIcon = ''
          bool = true
        } else {
          this.expandIcon = bool ? 'el-icon-top' : 'el-icon-bottom'
        }
        let index = 1
        this.config.columns.forEach((v) => {
          if (!v.hide) {
            if (num >= index) {
              if (this.getRangeType(v.type)) {
                index += 2
              } else {
                index++
              }
              v.isExpand = true
            } else {
              v.isExpand = bool
            }
          }
        })
        // 切换表单展开、收起事件
        this.$emit('expand', bool)
      } else {
        this.config.columns.forEach((v) => {
          if (!v.hide) {
            v.isExpand = true
          }
        })
      }
    },
    /**
     * @description: 根据屏幕宽度隐藏的colunm
     * @param {*}
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-18 17:28:01
     */
    getExpandNum() {
      // let width = document.body.clientWidth
      // // let width = window.screen.width
      // if (width >= 1920) {
      //   return 7
      // }
      // if (width >= 1200) {
      //   return 4
      // }
      // if (width >= 992) {
      //   return 2
      // }
      // if (width >= 768) {
      //   return 1
      // }
      return 8
    },
    /**
     * @description: 计算分栏策略
     * @param {*} type:类型，colNum:分栏数量
     * @return {*} Array [sm, md, lg, xl]
     * @author: tanpeng
     * @Date: 2020-12-11 16:40:14
     */
    getSpan(type = 'input', colNum = 4) {
      let spanArray = []
      if (colNum === 3) {
        // 分三栏
        spanArray = [24, 12, 8, 6]
      } else if (colNum === 6) {
        // 分6栏
        spanArray = [12, 6, 4, 3]
      } else {
        // 默认分4栏
        spanArray = [12, 8, 6, 4]
      }
      // 对时间区间做特殊处理
      if (type === 'datetimeRange' || type === 'dateRange' || type === 'monthRange') {
        // 区间为分栏数量的两倍
        spanArray = spanArray.map((v) => v * 2)
      }
      // 对占用两个位置的区域
      if (type === 'inputDouble') {
        // 区间为分栏数量的两倍
        spanArray = spanArray.map((v) => v * 2)
      }
      return spanArray
    },
    /**
     * @description: 初始化form表单验证
     * @param {*}
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-11 16:41:40
     */
    initRules() {
      const vm = this
      if (vm.checkConfigType(vm.config, 'columns')) {
        const rules = {}
        vm.config.columns.forEach((v) => {
          // 是否隐藏判断
          if (!v.hide) {
            // 是否必填
            if (v.required) {
              if (v.type === 'yearRange' || v.type === 'monthRange' || v.type === 'dateRange') {
                rules[v.prop] = [
                  { required: true, message: `* ${v.label}必填`, trigger: 'change' },
                  { validator: (rule, value, callback) => {
                    if (!vm.config.form[v.prop] || !vm.config.form[v.propEnd]) {
                      callback(new Error(`* ${v.label}必填`))
                    } else {
                      callback()
                    }
                  }, trigger: 'blur' },
                ]
              } else {
                rules[v.prop] = [
                  { required: true, message: `* ${v.label}必填`, trigger: 'blur' },
                ]
              }
            } else {
              rules[v.prop] = [
                {
                  required: false,
                  message: `* ${v.label}必填`,
                  trigger: 'blur',
                },
              ]
            }
            // 自定义验证，判断是否为函数
            if (v.validator && typeof v.validator === 'function') {
              rules[v.prop].push({ validator: v.validator, trigger: 'blur' })
            }
          }
        })
        // 合并初始化对象
        vm.$set(vm, 'rules', rules)
      }
    },
    /**
     * @description: 初始化form表单
     * @param {*}
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-17 17:15:28
     */
    initForm() {
      const vm = this
      // 判断是否有columns
      if (vm.checkConfigType(vm.config, 'columns')) {
        // 接收数据对象
        const form = {}
        vm.config.columns.forEach((v) => {
          // 是否隐藏判断
          if (!v.hide) {
            // 复选框||多选判断 将form字段默认为数组类型
            if (v.type === 'checkbox' || (v.multiple && vm.isMultipleType(v.type))) {
              // 判断是否为空或者是否是数组
              form[v.prop] = ((form[v.prop] === undefined || form[v.prop] === null)
                ? []
                : Array.isArray(v.value)
                  ? v.value
                  : [v.value])
            } else if (v.type === 'number') {
              form[v.prop] = (!v.value && v.value !== 0) ? undefined : v.value
            } else if (v.type === 'upload') {
              const { optionsConfig } = v
              form[v.prop] = {
                fileList: [],
                ...optionsConfig,
              }
            } else {
              form[v.prop] = vm.isNull(v.value) ? v.value : ''
            }
            // 判断是否是区间
            if (v.propEnd && typeof v.propEnd === 'string') {
              if (vm.getRangeType(v.type)) {
                // 给form赋值
                form[v.propEnd] = vm.isNull(v.valueEnd) ? v.valueEnd : ''
                console.log(form[v.propEnd], 9999)
              }
            }
          }
        })
        // 合并初始化对象
        vm.config.form = Object.assign(form, vm.config.form)
      }
    },
    /**
     * @description: 是否多选判断函数
     * @param {*} type
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-17 17:15:38
     */
    isMultipleType(type = 'input') {
      // 设置可多选的类型
      const arr = ['select']
      return (
        arr.filter((v) => v === type).length > 0
      )
    },
    /**
     * @description: 是否为NaN值
     * @param {*} value
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-17 17:15:55
     */
    isNaN(value) {
      // eslint-disable-next-line no-self-compare
      if (value !== value) {
        return true
      }
      return false
    },
    /**
     * @description: 是否为null
     * @param {*} value
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-17 17:16:10
     */
    isNull(value) {
      if (
        value !== undefined &&
        value !== 'undefined' &&
        value !== null &&
        value !== 'null' &&
        !this.isNaN(value)
      ) {
        return true
      }
      return false
    },
    /**
     * @description: 表单提交函数
     * @param {*}
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-17 17:16:22
     */
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
    /**
     * @description: 重置
     * @param {*}
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-18 15:43:59
     */
    reset() {
      const vm = this
      vm.$refs.form.resetFields()
      vm.resetPropEnd()
      // vm.search()
    },
    /**
     * @description: 重置区间结束值
     * @param {*}
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-18 16:52:19
     */
    resetPropEnd() {
      this.columns.forEach((v) => {
        if (v.propEnd) {
          this.config.form[v.propEnd] = v.valueEnd || ''
        }
      })
    },
    async search() {
      const result = await this.submit()
      if (result) {
        this.$emit('search', true)
      }
    },
    async fnExport() {
      const result = await this.submit()
      if (result) {
        this.$emit('export', true)
      }
    },
    /**
     * @description: 判断config各参数的类型
     * @param {*} config
     * @param {*} type
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-17 17:16:32
     */
    checkConfigType(config = {}, type = '') {
      if (config[type] && Array.isArray(config[type]) && type === 'columns') {
        return true
      }
      typeof this.showConfigTypeError === 'function' &&
        this.showConfigTypeError(type)
      return false
    },
    /**
     * @description: 打印config参数配置错误信息
     * @param {*} type
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-17 17:16:56
     */
    showConfigTypeError(type = '') {
      Message({
        showClose: true,
        message: `config->${type} 参数配置错误`,
        type: 'warning',
      })
    },
  },
}
</script>
