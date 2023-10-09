<!--
 * @Author: 陈宇环
 * @Date: 2021-06-11 16:54:08
 * @LastEditTime: 2023-09-12 14:07:39
 * @LastEditors: 陈宇环
 * @Description: 编辑options
-->
<template>
  <div class="">
    <el-button
      type="primary"
      size="mini"
      @click="show"
    >
      {{
        optionsConfig && optionsConfig.source ? '编辑' :
        '新增'
      }}
    </el-button>
    <el-dialog
      append-to-body
      title="提示"
      :visible.sync="visiable"
      width="800px"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item
          v-if="type === 'select'"
          label="数据来源"
          prop="source"
        >
          <el-radio-group v-model="ruleForm.source">
            <el-radio label="接口获取">
              接口获取
              <el-tooltip
                class="item"
                effect="dark"
                content="通过配置接口信息，从接口拉取下拉选项"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </el-radio>
            <el-radio label="手动配置">
              手动配置
              <el-tooltip
                class="item"
                effect="dark"
                content="手动添加下拉选项的key和value值"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="ruleForm.source === '接口获取'">
          <el-form-item
            label="接口地址"
            prop="interface"
            style="width: 100%"
          >
            <el-input v-model="ruleForm.interface" />
          </el-form-item>
          <el-form-item
            label="接口类型"
            prop="interfaceType"
          >
            <el-select
              v-model="ruleForm.interfaceType"
              placeholder="请选择接口类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in interfaceTypes"
                :key="item.prop"
                :label="item.label"
                :value="item.prop"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="参数类型"
            prop="paramsType"
          >
            <el-select
              v-model="ruleForm.paramsType"
              placeholder="请选择参数类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in paramTypes"
                :key="item.prop"
                :label="item.label"
                :value="item.prop"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="请求参数"
            prop="params"
          >
            <!-- <span style="color: red;"></span> -->
            <template #label>
              <span> 请求参数 </span>
              <el-tooltip
                content="请传入JSON字符串,不要出现空格、换行且其中key必须带双引号；eg：{&quot;pageIndex&quot;:1,&quot;pageSize&quot;:&quot;1000&quot;,&quot;id&quot;:[201,302]}，缺省传：{}"
                placement="top"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </template>
            <!-- <el-input type="textarea" :rows="4" v-model="ruleForm.params"></el-input> -->
            <CodeEditor
              ref="paramsFunCodeEditor"
              v-model="ruleForm.params"
              type="JSON"
            />
            <!-- <el-table
              :data="ruleForm.params"
              style="width: 100%"
              size="mini"
            >
              <el-table-column
                v-for="(item, index) in paramsThead"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="item.prop === 'label'"
                    v-model="scope.row.label"
                    size="mini"
                    clearable
                  ></el-input>
                  <el-input
                    v-if="item.prop === 'value'"
                    v-model="scope.row.value"
                    size="mini"
                    clearable
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="delParams(scope.$index)"
                    type="text"
                    size="small"
                    v-if="scope.$index !== 0"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" icon="add" size="mini" @click="addParams"
              >新增</el-button
            > -->
          </el-form-item>
          <el-form-item
            v-if="type === 'inputAsync'"
            prop="keywordKey"
          >
            <template #label>
              <span> 搜索关键字字段名 </span>
              <el-tooltip
                content="inputAsync组件中，用户输入内容发送给后台对应的字段名称"
                placement="top"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </template>
            <el-input
              v-model="ruleForm.keywordKey"
              placeholder="默认：keyword"
            />
          </el-form-item>
          <!-- 返回结果获取数据路径；默认:data eg：如果是res.data.data则填写data；如果是res.data.data.records则填写data.records;res.data.data根据network中preview来的 -->
          <el-form-item
            label="接口数据获取路径"
            prop="resultPath"
          >
            <el-input
              v-model="ruleForm.resultPath"
              placeholder="默认：data"
            />
          </el-form-item>
          <el-form-item
            v-if="type === 'cascader'"
            label="value取值方式"
            prop="emitPath"
          >
            <el-select
              v-model="ruleForm.emitPath"
              placeholder="默认取选择节点的value"
              clearable
            >
              <el-option
                label="选择节点的value"
                value="node"
              />
              <el-option
                label="选择节点路径数组"
                value="array"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="keyField">
            <template #label>
              <span> label字段key </span>
              <el-tooltip
                content="select下拉选项对象中来用当做展示的字段名；eg: name；当需要多个字段组合时请通过{}将字段包裹；eg：{name}-{id}"
                placement="top"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </template>
            <el-input
              v-model="ruleForm.keyField"
              placeholder="默认：label"
            />
          </el-form-item>
          <el-form-item prop="valueField">
            <template #label>
              <span> value字段key </span>
              <el-tooltip
                content="select下拉选项对象中来用当做选中value的字段名；eg: id；当需要多个字段组合时请通过{}将字段包裹；eg：{name}-{id}"
                placement="top"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </template>
            <el-input
              v-model="ruleForm.valueField"
              placeholder="默认：value"
            />
          </el-form-item>
          <el-form-item
            v-if="type === 'cascader'"
            label="children字段key"
            prop="childrenField"
          >
            <el-input
              v-model="ruleForm.childrenField"
              placeholder="默认：children"
            />
          </el-form-item>
          <!-- <el-divider direction="horizontal" content-position="left"></el-divider> -->
          <!-- <el-form-item prop="ganged" v-if="type === 'select' || type === 'cascader'">
            <template #label>
              <span> 是否联动 </span>
              <el-tooltip content="是否需要联动，通过配置联动字段key及回调函数来重新获取下拉项" placement="top">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </template>
            <el-radio-group v-model="ruleForm.ganged">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="ruleForm.ganged === 1">
            <el-form-item prop="gangedKey">
              <template #label>
                <span> 联动字段key </span>
              </template>
              <el-input v-model="ruleForm.gangedKey" size="mini" clearable></el-input>
            </el-form-item>
            111{{ ruleForm.gangedFun }}
            <el-form-item prop="gangedFun">
              <template #label>
                <span> 联动回调函数 </span>
              </template>
              <CodeEditor ref="gangedFunCodeEditor" v-model="ruleForm.gangedFun"></CodeEditor>
            </el-form-item>
            <el-divider direction="horizontal" content-position="left"></el-divider>
          </template>-->
        </template>
        <template v-if="ruleForm.source === '手动配置'">
          <el-form-item
            label="数据配置"
            prop="jogConfig"
          >
            <template #label>
              <span> 数据配置 </span>
              <el-tooltip
                content="请传入数组类型的JSON字符串"
                placement="top"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </template>
            <CodeEditor
              ref="jogConfigEditor"
              v-model="ruleForm.jogConfig"
              type="JSON"
            />
            示例：
            <pre>
[
  {
    "prop": 1,
    "label": "男"
  },
  {
    "prop": 2,
    "label": "女"
  }
]
</pre>
            <!-- <el-table
              :data="ruleForm.jogConfig"
              style="width: 100%"
              size="mini"
            >
              <el-table-column
                v-for="(item, index) in thead"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="item.prop === 'label'"
                    v-model="scope.row.label"
                    size="mini"
                    clearable
                  />
                  <el-input
                    v-if="item.prop === 'prop'"
                    v-model="scope.row.prop"
                    size="mini"
                    clearable
                  />
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.$index !== 0"
                    type="text"
                    size="small"
                    @click="del(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table> -->
            <!-- <el-button
              type="primary"
              icon="add"
              size="mini"
              @click="add"
            >
              新增
            </el-button> -->
          </el-form-item>
        </template>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="visiable = false">取 消</el-button>
        <el-button
          type="primary"
          @click="sub"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { interfaceTypes, paramTypes } from '@/utils/dicCode.js'
import CodeEditor from './codeEditor.vue'
// import { isArray } from 'lodash'
export default {
  name: 'EditOptions',
  components: { CodeEditor },
  // components: { },
  props: {
    optionsConfig: {},
    type: {
      required: true,
      type: String,
      default: '',
    },
  },
  data() {
    const validateJogConfig = (rule, value, callback) => {
      if (this.ruleForm.source === '手动配置') {
        if (!value) {
          callback(new Error('请填写数据配置'))
        }
        let res
        try {
          res = JSON.parse(value)
        } catch (error) {
          callback(new Error('数据配置不是JSON数据类型'))
        }
        if (!(res && Array.isArray(res))) {
          callback(new Error('数据配置不是数组类型JSON'))
        }
      }
      callback()
    }
    const validateParams = (rule, value, callback) => {
      // if (this.ruleForm.source === '接口获取') {
      //   for (let i = 0; i < value.length; i++) {
      //     if ((value[i].label && !value[i].value) ||
      //                   (!value[i].label && value[i].value)) {
      //       callback(new Error('参数配置请填写完整'))
      //     }
      //   }
      // }
      console.log(this.$refs.paramsFunCodeEditor, this.$refs.paramsFunCodeEditor.error)
      if (this.$refs.paramsFunCodeEditor.error) {
        callback(this.$refs.paramsFunCodeEditor.error)
      }
      callback()
    }
    // const validateGangedFun = (rule, value, callback) => {
    //   console.log(21212, this.$refs.gangedFunCodeEditor.error)
    //   if (this.$refs.gangedFunCodeEditor.error) {
    //     callback(this.$refs.gangedFunCodeEditor.error)
    //   }
    //   callback()
    // }
    return {
      visiable: false,
      ruleForm: {
        source: '接口获取',
        jogConfig: '',
        params: '',
      },
      interfaceTypes,
      paramTypes,
      rules: {
        // system: [
        //   { required: true, message: '请选择系统', trigger: 'blur' }
        // ],
        source: [
          { required: true, message: '请选择数据来源', trigger: 'blur' },
        ],
        jogConfig: [
          { validator: validateJogConfig, trigger: 'change' },
        ],
        interface: [
          { required: true, message: '请填写接口地址', trigger: 'blur' },
        ],
        interfaceType: [
          { required: true, message: '请选择接口类型', trigger: 'blur' },
        ],
        paramsType: [
          { required: true, message: '请选择参数类型', trigger: 'blur' },
        ],
        params: [
          // { required: true, message: '请填写参数', trigger: 'change' },
          { validator: validateParams, trigger: 'change' },
        ],
        // gangedKey: [
        //   { required: true, message: '请填写联动字段Key', trigger: 'change' }
        // ],
        // gangedFun: [
        //   { required: true, message: '请填写联动回调函数', trigger: 'change' },
        //   { validator: validateGangedFun, trigger: 'change' }
        // ]
        // keyField: [
        //   { required: true, message: '请填写返回值label字段', trigger: 'blur' }
        // ],
        // valueField: [
        //   { required: true, message: '请填写返回值value字段', trigger: 'blur' }
        // ]
      },
      thead: [
        { prop: 'label', label: '选项名', width: 140 },
        { prop: 'prop', label: '选项值', width: 140 },
      ],
      paramsThead: [
        { prop: 'label', label: '参数key值', width: 140 },
        { prop: 'value', label: '参数value值', width: 140 },
      ],
    }
  },
  computed: {},
  watch: {
    visiable(val) {
      if (val && this.optionsConfig) {
        // eslint-disable-next-line prefer-destructuring
        const optionsConfig = this.optionsConfig
        if (optionsConfig.params && Array.isArray(optionsConfig.params)) {
          optionsConfig.params = optionsConfig.params.reduce((res, item) => {
            res[item.label] = item.value
            return res
          }, {})
          optionsConfig.params = JSON.stringify(optionsConfig.params)
        }
        this.ruleForm = optionsConfig
      }
    },
    'ruleForm.source'() {
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
      if (Array.isArray(this.ruleForm.jogConfig)) {
        this.ruleForm.jogConfig = JSON.stringify(this.ruleForm.jogConfig)
      }
      // if (!(this.ruleForm.jogConfig && this.ruleForm.jogConfig.length > 0)) {
      //   this.ruleForm.jogConfig = [{}]
      // }
      // if (!(this.ruleForm.params && this.ruleForm.params.length > 0)) {
      //   this.ruleForm.params = [{}]
      // }
    },
    // 'ruleForm.gangedFun'() {
    //   this.$refs.ruleForm.validateField('gangedFun')
    // },
    'ruleForm.params'() {
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.validateField('params')
      })
    },
  },
  created() { },
  mounted() {
  },
  methods: {
    show() {
      this.visiable = true
    },
    // add() {
    //   this.ruleForm.jogConfig.push({})
    // },
    // del(index) {
    //   this.ruleForm.jogConfig.splice(index, 1)
    // },
    addParams() {
      this.ruleForm.params.push({})
    },
    delParams(index) {
      this.ruleForm.params.splice(index, 1)
    },
    sub() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const optionsConfig = {
            ...this.ruleForm,
            jogConfig: JSON.parse(this.ruleForm.jogConfig).map((item) => {
              if (item.value && !item.prop) {
                item.prop = item.value
                delete item.value
              }
              return item
            }),
          }
          this.$emit('update:optionsConfig', optionsConfig)
          this.visiable = false
        } else {
          this.$message.error('请检查填写')
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
</style>
