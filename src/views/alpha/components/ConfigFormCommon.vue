<!--
 * @Description: 配置表单
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2021-01-08 10:27:07
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-09-12 14:07:16
-->
<template>
  <div>
    <CfpaForm
      ref="configForm"
      :config="params"
    />
  </div>
</template>

<script>
import CfpaForm from '@/components/cfpaForm'
import { interfaceTypes, paramTypes, showType, paramSource, databaseTableTypes } from '@/utils/dicCode.js'
// import * as utils from 'utils/common'
// function originSystem() {
//   return utils.session('originSystem') && utils.session('originSystem').system
// }
export default {
  name: 'ConfigFormCommon',

  components: {
    CfpaForm,
  },

  mixins: [],

  props: {
    // {
    //   type: 'configQuery'
    //   show: false,
    //   interface: '',
    //   interfaceType: 'post',
    //   paramType: 'params',
    //   columns: [],
    //   like: false
    // },
    config: {
      type: Object,
      default() {
        return {}
      },
    },
    showDisabled: {
      type: Boolean,
    },
  },

  data() {
    return {
      params: {
        labelWidth: '100px',
        colNum: 24,
        columns: [],
        form: {
        },
      },
      interfaceTypes,
      databaseTableTypes,
      paramTypes,
      showType,
      paramSource,
      system: '',
    }
  },

  computed: {},

  watch: {
    config: {
      deep: true,
      handler() {
        this.initParams()
        // const config = Object.assign({}, this.config)
        // delete config.columns
        // Object.assign(this.params.form, config)
        // // 数据库属性缺失
        // if (!this.config) {
        //   return
        // }
        // this.params.columns =
        //   this.config.type === 'configDetail' ?
        //     this.getDetailDialogColunms(this) :
        //     this.config.type === 'configDelete' ?
        //       this.getDeleteDialogColunms(this) :
        //       this.config.type === 'configDatabase' ?
        //         this.getDatabaseDialogColunms(this) : this.getDialogColunms(this)
        // if (this.config.type !== 'configDetail') {
        //   this.colunmChange(this.params.form.show, 'show')
        // } else {
        //   this.colunmChange(this.params.form.showType, 'showType')
        //   if (this.params.form.showType !== 'no') {
        //     this.colunmChange(this.params.form.paramSource, 'paramSource')
        //   }
        // }
      },
    },
    system() {
      this.reset()
    },
  },

  created() {
    this.initParams()
  },

  mounted() {},

  destroyed() {},

  methods: {
    // 初始话数据
    initParams() {
      const config = Object.assign({}, this.config)
      delete config.columns
      Object.assign(this.params.form, config)
      // 数据库属性缺失
      if (!this.config) {
        return
      }
      this.params.columns =
      this.config.type === 'configDetail' ?
        this.getDetailDialogColunms(this) :
        this.config.type === 'configDelete' ?
          this.getDeleteDialogColunms(this) :
          this.config.type === 'configDatabase' ?
            this.getDatabaseDialogColunms(this) : this.getDialogColunms(this)
      if (this.config.type !== 'configDetail') {
        this.colunmChange(this.params.form.show, 'show')
      } else {
        this.colunmChange(this.params.form.showType, 'showType')
        if (this.params.form.showType !== 'no') {
          this.colunmChange(this.params.form.paramSource, 'paramSource')
        }
      }
    },
    getDialogColunms(vm) {
      return [
        {
          prop: 'show',
          label: '是否展示',
          type: 'switch',
          onChange: vm.colunmChange,
          disabled: vm.showDisabled,
        },
        {
          prop: 'interface',
          label: '接口地址',
          type: 'input',
          required: false,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'interfaceType',
          label: '接口类型',
          type: 'select',
          options: vm.interfaceTypes,
          required: false,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'paramType',
          label: '传参方式',
          type: 'select',
          options: vm.paramTypes,
          required: false,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'pageKey',
          label: '分页page字段名',
          placeholder: '默认值：有分页时：pageNumber;无分页时：不需要填写;',
          type: 'input',
          required: false,
          colNum: 8,
          hide: this.config.type !== 'configQuery',
        },
        {
          prop: 'pageSizeKey',
          label: '分页size字段名',
          placeholder: '默认值：有分页时：pageSize;无分页时：不需要填写;',
          type: 'input',
          required: false,
          colNum: 8,
          hide: this.config.type !== 'configQuery',
        },
        // 在查询接口定义中，需要指定查询接口返回数据的路径比如:result.data.data.records,则填写data.records
        // 默认值：开启分页时候：data.records;无分页时：data
        // 手动填写时：具体路径可以查看：浏览器->network->preview返回体结构
        {
          prop: 'resultPath',
          label: '接口数据获取路径',
          placeholder: '默认值：有分页时：data.records;无分页时：data;手动填写时：请参考浏览器->network->preview返回体结构',
          type: 'input',
          required: false,
          colNum: 8,
          hide: this.config.type !== 'configQuery',
        },
        {
          prop: 'totalPath',
          label: '分页total获取路径',
          placeholder: '意义同上一字段;默认值：有分页时：data.totle;无分页时：不需要填写;',
          type: 'input',
          required: false,
          colNum: 8,
          hide: this.config.type !== 'configQuery',
        },
      ]
    },
    getDetailDialogColunms(vm) {
      return [
        {
          prop: 'showType',
          label: '展示方式',
          type: 'select',
          colNum: 8,
          options: vm.showType,
          onChange: vm.colunmChange,
          hide: false,
        },
        {
          prop: 'paramSource',
          label: '回填数据来源',
          type: 'select',
          colNum: 8,
          onChange: vm.colunmChange,
          options: vm.paramSource,
          required: true,
          hide: false,
        },
        {
          prop: 'interface',
          label: '接口地址',
          type: 'input',
          colNum: 8,
          required: false,
          hide: true,
        },
        {
          prop: 'interfaceType',
          label: '接口类型',
          type: 'select',
          colNum: 8,
          options: vm.interfaceTypes,
          required: false,
          hide: true,
        },
        {
          prop: 'paramType',
          label: '传参方式',
          type: 'select',
          colNum: 8,
          options: vm.paramTypes,
          required: false,
          hide: true,
        },
        {
          prop: 'rowParam',
          label: '参数字段',
          placeholder: '填写row中需要传递的字段；用,号隔开；如果需要在接口地址上带参数通过接口地址后面/{id}即可',
          type: 'input',
          colNum: 8,
          required: false,
          hide: true,
        },
        // 需要指定查询接口返回数据的路径比如:result.data.data,则填写data
        // 默认值：data
        // 手动填写时：具体路径可以查看：浏览器->network->preview返回体结构
        {
          prop: 'resultPath',
          label: '接口数据获取路径',
          placeholder: '默认值：有分页时：data.records;无分页时：data;手动填写时：请参考浏览器->network->preview返回体结构',
          type: 'input',
          colNum: 8,
          required: false,
          hide: true,
        },
      ]
    },
    getDeleteDialogColunms(vm) {
      return [
        {
          prop: 'show',
          label: '是否展示',
          type: 'switch',
          colNum: 8,
          onChange: vm.colunmChange,
          disabled: vm.showDisabled,
        },
        {
          prop: 'interface',
          label: '接口地址',
          type: 'input',
          colNum: 8,
          required: false,
          hide: true,
        },
        {
          prop: 'interfaceType',
          label: '接口类型',
          type: 'select',
          colNum: 8,
          options: vm.interfaceTypes,
          required: false,
          hide: true,
        },
        {
          prop: 'paramType',
          label: '传参方式',
          type: 'select',
          colNum: 8,
          options: vm.paramTypes,
          required: false,
          hide: true,
        },
        {
          prop: 'rowParam',
          label: '参数字段',
          placeholder: '填写row中需要传递的字段；用,号隔开；如果需要在接口地址上带参数通过接口地址后面/{id}即可；默认传递整行对象',
          type: 'input',
          colNum: 8,
          required: false,
          hide: true,
        },
      ]
    },
    getDatabaseDialogColunms(vm) {
      return [
        {
          prop: 'show',
          label: '是否展示',
          type: 'switch',
          colNum: 24,
          onChange: vm.colunmChange,
          disabled: vm.showDisabled,
        },
        {
          prop: 'databaseTableName',
          label: '表名',
          type: 'input',
          colNum: 8,
          required: true,
        },
        {
          prop: 'databaseTableDescription',
          label: '表描述',
          type: 'input',
          colNum: 8,
          required: true,
        },
        {
          prop: 'databaseTableType',
          label: '表类型',
          type: 'select',
          colNum: 8,
          options: vm.databaseTableTypes,
          required: false,
        },
      ]
    },
    colunmChange(value, prop, form) {
      if (prop === 'show') {
        this.config.show = value
        const params = Object.assign({}, this.params)
        params.columns.forEach((v) => {
          if (['interface', 'interfaceType', 'paramType', 'databaseTableDescription', 'databaseTableType', 'databaseTableName'].includes(v.prop)) {
            v.required = value
            v.hide = !value
          }
          if (['rowParam'].includes(v.prop)) {
            v.hide = !value
          }
        })
        this.$set(this, 'params', params)
      }
      if (prop === 'showType') {
        this.config.showType = value
        const params = Object.assign({}, this.params)
        params.columns.forEach((v) => {
          if (v.prop === 'paramSource' || v.prop === 'interface' || v.prop === 'interfaceType' || v.prop === 'paramType') {
            v.required = value !== 'no'
            v.hide = value === 'no'
          }
          if (v.prop === 'rowParam' || v.prop === 'resultPath') {
            v.hide = value === 'no'
          }
        })
        this.$set(this, 'params', params)
      }
      if (prop === 'paramSource') {
        const params = Object.assign({}, this.params)
        params.columns.forEach((v) => {
          if (v.prop === 'interface' || v.prop === 'interfaceType' || v.prop === 'paramType') {
            v.required = value !== 'row'
            v.hide = value === 'row'
          }
          if (v.prop === 'rowParam' || v.prop === 'resultPath') {
            v.hide = value === 'row'
          }
        })
        this.$set(this, 'params', params)
      }
    },
    /**
     * @description: 表单提交函数
     * @param {*}
     * @return {*}
     * @author: tanpeng
     * @Date: 2020-12-17 17:16:22
     */
    submit() {
      return new Promise(async(resolve) => {
        const result = await this.$refs.configForm.submit()
        this.config = Object.assign(this.config, this.params.form)
        resolve(result)
      })
    },
    // 清除当前模块数据
    reset() {
      // 清除表单数据
      this.$set(this.params.form, 'interface', '')
      this.$set(this.params.form, 'interfaceType', '')
      this.$set(this.params.form, 'paramType', '')
      this.$set(this.params.form, 'rowParam', '')
      this.$set(this.params.form, 'resultPath', '')
      this.$set(this.params.form, 'totalPath', '')
      this.$set(this.config, 'columns', [])
      // 清除table表格字段数组
      if (this.config.type === 'configQuery') {
        // 查询配置中table字段设置
        this.$emit('setConfigQueryColumns', [])
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
