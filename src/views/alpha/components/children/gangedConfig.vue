<!--
 * @Author: 陈宇环
 * @Date: 2022-05-23 15:52:40
 * @LastEditTime: 2022-05-26 11:45:03
 * @LastEditors: 陈宇环
 * @Description: 联动配置
-->
<template>
  <div>
    <el-button type="primary" size="mini" @click="visiable = true">{{
        this.gangedConfig ? '编辑' :
          '新增'
    }}</el-button>
    <el-dialog append-to-body title="联动配置" :visible.sync="visiable" width="800px">
      <el-alert style="margin: 0 0 15px 0" :closable="false" title="PS: 当前字段值发生变化时，自动触发联动回调函数，将通过联动类型以及回调函数的返回值来修改联动字段key对应字段的相关信息" type="info">
      </el-alert>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
        <el-form-item prop="gangedKey">
          <template #label>
            <span> 联动字段key </span>
            <el-tooltip content='需要联动修改的字段key值' placement="top">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </template>
          <el-input v-model="ruleForm.gangedKey" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item prop="gangedType">
          <template #label>
            <span> 联动类型 </span>
          </template>
          <el-select v-model="ruleForm.gangedType" placeholder="请选择联动类型" style="width: 100%">
            <el-option :label="item.label" :value="item.prop" v-for="item in gangedTypes" :key="item.prop">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="gangedFun">
          <template #label>
            <span> 联动回调函数 </span>
            <el-tooltip placement="top">
              <div slot="content">
                <el-link type="danger">请不要输入函数体外的其他内容，注释暂时也不支持</el-link>
                <div>
                  <el-link type="primary">入参</el-link>
                </div>
                <div>当前字段变化后的新值</div>
                <div style="color:blue">
                  <el-link type="primary">返回值</el-link>
                </div>
                <div>当联动类型选择：‘修改字段显示隐藏状态’、‘修改字段禁用启用状态’、‘修改字段必填状态时’，回调函数必须return一个布尔值</div>
                <div>当联动类型选择：‘修改字段下拉选项’时，<strong style="color:red">回调函数必须return一个由lable、value组成的对象数组</strong>。eg：[{lable:'男',value:1},{label:'女',value:2}]</div>
                <div>当联动类型选择：‘修改字段值’时，回调函数必须return,return类型由字段控件类型决定：eg：input需要return一个字符串、日期选择框需要return一个日期模板字符串('2022-01-01')</div>
                <el-link type="warning">PS：异步函数需要return一个Promise对象，最后将得到的结果resolve出来，具体查看下方实例</el-link>
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </template>
          <CodeEditor style="margin-bottom: 15px" ref="gangedFunCodeEditor" v-model="ruleForm.gangedFun"></CodeEditor>
          <gangedFunExamples></gangedFunExamples>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visiable = false">取 消</el-button>
        <el-button type="primary" @click="sub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { gangedTypes } from '@/utils/dicCode.js'
import CodeEditor from './codeEditor.vue'
import gangedFunExamples from './gangedFunExamples'
export default {
  name: 'EditOptions',
  props: {
    gangedConfig: {}
  },
  components: { CodeEditor, gangedFunExamples },
  watch: {
    visiable(val) {
      if (val && this.gangedConfig) {
        let gangedConfig = this.gangedConfig
        this.ruleForm = gangedConfig
      }
    }
  },
  data() {
    const validateGangedFun = (rule, value, callback) => {
      if (this.$refs.gangedFunCodeEditor.error) {
        callback(this.$refs.gangedFunCodeEditor.error)
      }
      callback()
    }
    return {
      visiable: false,
      gangedTypes,
      ruleForm: {
      },
      rules: {
        gangedKey: [
          { required: true, message: '请填写联动字段Key', trigger: 'blur' }
        ],
        gangedType: [
          { required: true, message: '请填写联动类型', trigger: 'change' }
        ],
        gangedFun: [
          { required: true, message: '请填写联动回调函数', trigger: 'change' },
          { validator: validateGangedFun, trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  created() { },
  mounted() {
  },
  methods: {
    show() {
      this.visiable = true
    },
    add() {
      this.ruleForm.jogConfig.push({})
    },
    del(index) {
      this.ruleForm.jogConfig.splice(index, 1)
    },
    addParams() {
      this.ruleForm.params.push({})
    },
    delParams(index) {
      this.ruleForm.params.splice(index, 1)
    },
    sub() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('update:gangedConfig', this.ruleForm)
          this.visiable = false
        } else {
          this.$message.error('请检查填写')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
