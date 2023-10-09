<!--
 * @Author: 陈宇环
 * @Date: 2021-06-11 16:54:08
 * @LastEditTime: 2021-09-16 19:59:51
 * @LastEditors: tanpeng
 * @Description: 编辑options
-->
<template>
  <div class="">
    <el-popover width="600" v-model="editor.visiable" trigger="click">
        <CfpaForm :ref="editor.formName" :config="editor">
        </CfpaForm>
      <el-row type="flex" justify="center" style="margin-top: 20px">
        <el-button size="small" @click="editor.visiable = false">取消</el-button>
        <el-button type="primary" size="small" @click="sub(editor.formName)">确认</el-button>
      </el-row>
      <el-button slot="reference" type="primary" size="mini">{{optionsConfig.interface ? '编辑' : '新增'}}</el-button>
    </el-popover>
  </div>
</template>

<script>
import { interfaceTypes, paramTypes } from '@/utils/dicCode.js'
import CfpaForm from '@/components/cfpaForm'
export default {
  name: 'EditOptions',
  props: {
    optionsConfig: {},
    type: {
      required: false,
      type: String,
      default: ''
    }
  },
  components: {
    CfpaForm
  },
  watch: {
    visiable(val) {
      if (val && this.optionsConfig) {
        this.editor.form = this.optionsConfig
      }
    }
  },
  data() {
    return {
      editor: {
        loading: false,
        formName: 'editorForm',
        visible: false,
        title: '',
        type: 'add',
        labelWidth: '100px',
        colNum: 24,
        columns: [],
        form: {}
      },
      interfaceTypes,
      paramTypes
    }
  },
  computed: {},
  created() {
    this.editor.form = Object.assign({}, this.optionsConfig)
    this.editor.columns = this.getDialogColunms(this)
  },
  methods: {
    getDialogColunms(vm) {
      return [
        { prop: 'interface', label: '接口地址', type: 'input', required: true },
        { prop: 'interfaceType', label: '接口类型', type: 'select', options: vm.interfaceTypes, required: true },
        { prop: 'paramsType', label: '传参方式', type: 'select', options: vm.paramTypes, required: true },
        { prop: 'ossFolder', label: '文件夹名称', type: 'input', required: false, placeholder: '请输入文件夹名称，默认：DEFAULT-OSS-FOLDER' },
        { prop: 'accept', label: '文件类型', type: 'input', required: false, placeholder: '请输入文件类型，例：bmp,gif' },
        { prop: 'size', label: '文件大小', type: 'number', required: false }]
    },
    async sub(formName) {
      let vm = this
      let result = await vm.$refs[formName].submit()
      if (result) {
        let optionsConfig = {
          ...this.editor.form
        }
        this.$emit('update:optionsConfig', optionsConfig)
        this.editor.visiable = false
      } else {
        this.$message.error('请检查填写')
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
