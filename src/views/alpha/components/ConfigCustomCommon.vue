<!--
 * @Author: 陈宇环
 * @Date: 2023-04-07 15:48:19
 * @LastEditTime: 2023-04-20 10:26:13
 * @LastEditors: tanpeng
 * @Description: 自定义菜单
-->

<template>
  <div class="ConfigCustomCommon">
    <CfpaForm
      ref="configForm"
      :config="formConfig"
    />
    <template
      v-if="formConfig.form.type === 'form'"
    >
      <el-button
        title="复制表单配置"
        size="mini"
        type="success"
        icon="el-icon-document-copy"
        circle
        plain
        @click="clonePasteFormConfig('copy')"
      />
      <el-button
        title="粘贴表单配置"
        size="mini"
        type="warning"
        icon="el-icon-document-checked"
        circle
        plain
        @click="clonePasteFormConfig('paste')"
      />
      <div class="inline-block">
        <el-upload
          class="inline-block-middle"
          action
          :multiple="false"
          accept=".js, .json"
          :before-upload="file => handleBeforeUpload(file)"
        >
          <el-button
            type="text"
            size="mini"
            icon="el-icon-upload2"
          >
            导入JSON
          </el-button>
        </el-upload>
      </div>
      <ConfigTableCommon
        class="mt10"
        :thead="tableInputConfigList"
        :config="formConfig.form"
      />
    </template>
  </div>
</template>

<script>
import CfpaForm from '@/components/cfpaForm'
import ConfigTableCommon from '../components/ConfigTableCommon'
import { customOpTypes, customOpBtnTypes, interfaceTypes, paramTypes, paramSource, yesOrNo  } from '@/utils/dicCode.js'
import { tableInputConfigList } from '../thead.js'
import { session } from '@/utils/common'
export default {
  name: 'ConfigCustomCommon',
  components: {
    CfpaForm,
    ConfigTableCommon,
  },
  props: {
    config: {
      type: Object,
      default() {
        return null
      },
    },
  },
  data() {
    return {
      tableInputConfigList,
      formConfig: {
        labelWidth: '100px',
        colNum: 24,
        columns: [],
        form: {
        },
      },
    }
  },
  watch: {
    config: {
      deep: true,
      immediate: true,
      handler() {
        this.formConfig.form = { ...this.config, ...this.formConfig.form }
        if (this.formConfig.form && this.formConfig.form.type) {
          this.colunmChange(this.formConfig.form.type, 'type', this.formConfig.form)
        }
        this.colunmChange(this.formConfig.form.isOutside, 'isOutside', this.formConfig.form)
      },
    },
    // 'formConfig.form': {
    //   deep: true,
    //   handler() {
    //     setTimeout(() => {
    //       this.config = this.formConfig.form
    //     })
    //   },
    // },
  },
 
  created() {
    this.formConfig.columns = this.getFormConfig(this)
  },
  methods: {
    handleBeforeUpload(file) {
      this.$emit('handleBeforeUpload', file)
    },
    submit() {
      return new Promise(async(resolve) => {
        const result = await this.$refs.configForm.submit()
        this.config = Object.assign(this.config, this.formConfig.form)
        resolve(result)
      })
    },
    getFormConfig(vm) {
      return [
        {
          prop: 'type',
          label: '操作类型',
          type: 'select',
          required: true,
          colNum: 8,
          options: customOpTypes,
          onChange: vm.colunmChange,
        },
        {
          prop: 'isOutside',
          label: '是否为table顶部操作按钮',
          type: 'select',
          required: true,
          colNum: 8,
          options: yesOrNo,
          labelKey: 'desc',
          valueKey: 'name',
          onChange: vm.colunmChange,
        },
        {
          prop: 'btnText',
          label: '按钮文案',
          type: 'input',
          required: true,
          colNum: 8,
        },
        {
          prop: 'btnType',
          label: '按钮类型',
          type: 'select',
          required: true,
          colNum: 8,
          options: customOpBtnTypes,
        },
        {
          prop: 'jumpUrl',
          label: '跳转链接',
          type: 'input',
          required: true,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'interface',
          label: '接口地址',
          type: 'input',
          required: true,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'interfaceType',
          label: '接口类型',
          type: 'select',
          options: interfaceTypes,
          required: true,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'paramType',
          label: '传参方式',
          type: 'select',
          options: paramTypes,
          required: true,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'paramSource',
          label: '回填数据来源',
          type: 'select',
          options: paramSource,
          required: false,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'rowParam',
          label: '附加参数字段',
          placeholder: '填写row中需要传递的字段；用,号隔开；如果需要在接口地址上带参数通过接口地址后面/{id}即可；默认传递整行对象',
          type: 'input',
          required: false,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'showCondition',
          label: 'table行按钮展示条件',
          placeholder: '根据某个状态判断是否展示此操作按钮，不传默认展示；eg: row.type == 1 || row.type == 2 当前行数据type==1或者==2时展示；支持原生js方法',
          type: 'input',
          required: false,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'isCheck',
          label: '是否需要行勾选',
          type: 'select',
          options: yesOrNo,
          labelKey: 'desc',
          valueKey: 'name',
          placeholder: '',
          required: true,
          colNum: 8,
          hide: true,
          onChange: vm.colunmChange,
        },
        {
          prop: 'checkKey',
          label: '勾选操作后台接收字段',
          placeholder: '',
          type: 'input',
          required: true,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'checkRowKey',
          label: '勾选操作行字段',
          placeholder: '',
          type: 'input',
          required: true,
          colNum: 8,
          hide: true,
        },
        {
          prop: 'width',
          label: '弹窗宽度',
          placeholder: 'eg: 800%、50%',
          type: 'input',
          required: false,
          colNum: 8,
          hide: true,
        },
      ]
    },
    colunmChange(value, prop) {
      if (prop === 'type') {
        const formConfig = Object.assign({}, this.formConfig)
        formConfig.columns.forEach((v) => {
          if (v.prop === 'jumpUrl') {
            v.hide = value !== 'jump'
          }
          if (v.prop === 'interface' || v.prop === 'interfaceType' || v.prop === 'paramType') {
            v.hide = value !== 'api' && value !== 'form'
          }
          if (v.prop === 'width') {
            v.hide = value !== 'form'
          }
        })
        this.colunmChange(this.formConfig.form.isOutside, 'isOutside')
        this.$set(this, 'formConfig', formConfig)
      }
      if (prop === 'isOutside') { // 是否为table行顶部操作
        const formConfig = Object.assign({}, this.formConfig)
        formConfig.columns.forEach((v) => {
          if (v.prop === 'rowParam' || v.prop === 'showCondition') {
            v.hide = value !== 0
          }
          if (v.prop === 'isCheck') {
            v.hide = value !== 1 || this.formConfig.form.type === 'jump'
          }
          if (v.prop === 'paramSource') {
            v.hide = value === 1 || this.formConfig.form.type !== 'form'
          }
        })
        value === 1 && (this.formConfig.form.rowParam = '')
        if (value === 0 || this.formConfig.form.type === 'jump')  {
          this.formConfig.form.isCheck = undefined
        }
        this.colunmChange(this.formConfig.form.isCheck, 'isCheck')
        this.$set(this, 'formConfig', formConfig)
      }
      if (prop === 'isCheck') { // 是否需要行勾选
        const formConfig = Object.assign({}, this.formConfig)
        formConfig.columns.forEach((v) => {
          if (v.prop === 'checkKey' || v.prop === 'checkRowKey') {
            v.hide = value !== 1
          }
        })
        !value && (this.formConfig.form.checkKey = '')
        !value && (this.formConfig.form.checkRowKey = '')
        this.$set(this, 'formConfig', formConfig)
      }
    },
    // 复制表单配置字段
    clonePasteFormConfig(type) {
      if (type === 'copy') {
        if (!(this.formConfig && this.formConfig.form && this.formConfig.form.columns && this.formConfig.form.columns.length > 0)) {
          this.$message.warning('表单内容为空')
          return
        }
        session('LowCodeFormConfig', this.formConfig.form.columns)
        this.$message.success('复制成功')
      } else if (type === 'paste') {
        if (!session('LowCodeFormConfig')) {
          this.$message.warning('粘贴内容为空')
          return
        }
        this.formConfig.form.columns = session('LowCodeFormConfig')
        this.$message.success('粘贴成功')
      }
    },
  },
}
</script>

<style scoped lang="scss">

</style>
