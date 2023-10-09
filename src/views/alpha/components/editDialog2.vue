<!--
 * @Author: 陈宇环
 * @Date: 2021-06-11 09:26:45
 * @LastEditTime: 2023-04-20 10:44:11
 * @LastEditors: tanpeng
 * @Description: 新增/编辑 弹窗
-->
<template>
  <div class="editDialog">
    <el-dialog
      v-if="editorDialog.visible"
      :title="editorDialog.title"
      :visible.sync="editorDialog.visible"
      :close-on-click-modal="false"
      fullscreen
    >
      <div :style="{height: configHeight + 'px', 'overflow-y': 'auto'}">
        <el-card shadow="never">
          <h3>基本信息</h3>
          <CfpaForm
            :ref="editorDialog.formName"
            :config="editorDialog"
          />
        </el-card>
        <el-row
          :gutter="15"
          class="mt10"
        >
          <el-col
            v-for="(item, index) in configs"
            :key="index"
            :span="6"
          >
            <el-card shadow="never">
              <h3>基本信息</h3>
              <CfpaForm
                :ref="item.formName"
                :config="item"
              />
            </el-card>
          </el-col>
        </el-row>
        <el-button
          class="mt10"
          type="primary"
        >
          增加模块
        </el-button>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editorDialog.visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="fnEditorSubmit('editorDialogForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import ConfigTableCommon from '../components/ConfigTableCommon'
// import ConfigFormCommon from '../components/ConfigFormCommon'
import AlphaApi from '@/api/business/Alpha.js'
import CfpaForm from '@/components/cfpaForm'
import { tableConfigList } from '../thead.js' // tableInputConfigList
import { Message } from 'element-ui'
import { session } from '@/utils/common'
export default {
  name: 'EditDialog',
  components: {
    // ConfigTableCommon,
    // ConfigFormCommon,
    CfpaForm,
  },
  data() {
    return {
      configHeight: 500,
      editorDialog: {
        loading: false,
        formName: 'editorDialogForm',
        visible: false,
        title: '',
        type: 'add',
        labelWidth: '100px',
        colNum: 6,
        columns: [],
        form: {},
      },
      routeName: '',
      thead: tableConfigList,
      configs: [
        {
          formName: 'editorDialogForm',
          labelWidth: '100px',
          colNum: 6,
          columns: [],
          form: {},
        },
      ],
    }
  },

  computed: {},

  watch: {
    'editorDialog.visible'(val) {
      if (val) {
        this.editorDialog.columns = this.getDialogColunms(this)
      } else {
        this.editorDialog.form = {}
        // this.configTable.columns = []
      }
    },
  },
  created() {
    this.configHeight = document.body.clientHeight - 130
  },
  methods: {
    getConfig(configName) {
      return this[configName]
    },
    /**
     * @description: 整体表单结构
     * @param {*} vm this
     * @return {*}
     */
    getDialogColunms(vm) {
      const arr = [
        { prop: 'route', label: '路由地址', type: 'input', required: true },
        { prop: 'meta', label: '页面名称', type: 'input', required: true },
        {
          prop: 'isEnable',
          label: '是否启用',
          type: 'select',
          options: [
            { prop: 1, label: '是' },
            { prop: 0, label: '否' },
          ],
          required: true,
        },
      ]
      // if (!vm.$store.state.isQiankun) {
      //   arr.unshift({
      //     prop: 'system', label: '所属系统', type: 'input', required: true,
      //   })
      // }
      return arr
    },
    /**
     * @description: 校验填写内容
     * @param {*} formName
     */
    async fnEditorSubmit(formName) {
      const vm = this
      // 最外层填写内容-这里只会校验路由地址、页面名称、是否启用三项
      const result = await vm.$refs[formName].submit()
      if (
        result
      ) {
        this.fnSubmit()
      }
    },
    // 复制表单配置字段
    clonePasteFormConfig(configName, type) {
      if (type === 'copy') {
        if (
          !(
            this[configName] &&
            this[configName].columns &&
            this[configName].columns.length > 0
          )
        ) {
          this.$message.warning('表单内容为空')
          return
        }
        session('LowCodeFormConfig', this[configName].columns)
        this.$message.success('复制成功')
      } else if (type === 'paste') {
        if (!session('LowCodeFormConfig')) {
          this.$message.warning('粘贴内容为空')
          return
        }
        this[configName].columns = session('LowCodeFormConfig')
        this.$message.success('粘贴成功')
      }
    },
    /**
     * @description: 提交配置
     * @param {*}
     * @return {*}
     * @author: tanpeng
     * @Date: 2021-01-08 15:32:34
     */
    async fnSubmit() {
      const vm = this
      try {
        const api = new AlphaApi()
        const params = { ...vm.editorDialog.form }
        this.configs.forEach((v) => {
          params[v.configName] = JSON.stringify(
            Object.assign({}, this[v.configName]),
          )
        })
        params.version = 'current'
        params.configTable = JSON.stringify(Object.assign({}, this.configTable))
        let obj = 'add'
        // 修改
        if (vm.editorDialog.type === 'edit') {
          obj = 'update'
        }
        const ret = await api[obj](params)
        if (ret.isSuccess()) {
          vm.$success('操作成功')
          vm.editorDialog.visible = false
          vm.$emit('reloadList')
        } else {
          Message({
            showClose: true,
            message: ret.message || '参数配置错误',
            type: 'error',
          })
        }
      } catch (err) {
        Message({
          showClose: true,
          message: err.message || '参数配置错误',
          type: 'error',
        })
      }
    },
    /* 新增、修改 */
    async show(type, row) {
      const vm = this
      vm.editorDialog.type = type
      vm.editorDialog.title =
        type === 'add' ? '新增页面' : type === 'edit' || type === 'edit2' ? '编辑页面' : '查看页面'
      vm.reset()
      if (type === 'edit' || type === 'edit2') {
        const result = await vm.fnDetail(row.route, row.system)
        vm.editorDialog.loading = false
        result.isEnable = result.isEnable ? 1 : 0
        vm.editorDialog.form = Object.assign({}, result)
      }
      vm.editorDialog.visible = true
    },
    reset() {
      const vm = this
      vm.editorDialog.form = {}
    },
    fnDetail(routeName, system) {
      // archiveStorageQueryDetail
      const vm = this
      vm.editorDialog.loading = true
      return new Promise(async(resolve, reject) => {
        try {
          const api = new AlphaApi()
          const data = { routeName, system, version: 'current' }
          const result = await api.detail(data)
          if (result.isSuccess()) {
            resolve(result.data)
          } else {
            resolve({})
          }
        } catch (err) {
          resolve({})
        }
      })
    },
    setConfigQueryColumns(columns) {
      this.$set(this.configTable, 'columns', columns)
    },
  },
}
</script>

<style scoped lang="scss">
.mt10 {
  margin-top: 10px;
}
.config-item {
  border: 1px solid #dcdfe6;
  padding: 10px;
  border-radius: 4px;
  background: #fff;
}
.config-item .config-title {
  display: inline-block;
  margin-right: 20px;
  vertical-align: top;
  /** width: 95px; **/
}
.config-item .config-sub-title {
  display: inline-block;
  width: 80px;
  text-align: right;
}
.inline-block {
  display: inline-block;
  vertical-align: top;
}
.inline-block-extra {
  width: 80%;
  position: relative;
  top: 13px;
}
.font13 {
  font-size: 13px;
  margin-top: 25px;
  font-weight: normal;
}
</style>
