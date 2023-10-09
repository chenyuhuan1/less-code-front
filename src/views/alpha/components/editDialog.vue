<!--
 * @Author: 陈宇环
 * @Date: 2021-06-11 09:26:45
 * @LastEditTime: 2023-10-08 17:07:38
 * @LastEditors: 陈宇环
 * @Description: 新增/编辑 弹窗
-->
<template>
  <div class="editDialog">
    <el-dialog
      v-if="editorDialog.visible"
      :title="editorDialog.title"
      :visible.sync="editorDialog.visible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      fullscreen
    >
      <div slot="title">
        <h2 class="font18 inline-block-middle mr20">
          {{ editorDialog.title }}
        </h2>
        <el-upload
          class="inline-block-middle"
          action
          :multiple="false"
          accept=".js, .json"
          :before-upload="file => handleBeforeUpload(file, 'configs')"
        >
          <el-button
            type="text"
            size="mini"
            icon="el-icon-upload2"
          >
            导入配置
          </el-button>
        </el-upload>
      </div>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col :span="24">
          <CfpaForm
            :ref="editorDialog.formName"
            :config="editorDialog"
          >
            <!-- 表格/查询/新增/修改/导入/导出 配置 start -->
            <template slot="configAll">
              <el-tabs
                v-model="addTabsValue"
                type="border-card"
              >
                <el-tab-pane
                  v-for="(item, index) in configs"
                  :key="item.configName + '_' + index"
                  :label="item.title"
                  :name="item.configName"
                >
                  <!-- 列表配置 start-->
                  <el-form-item v-if="item.configName === 'configTable'">
                    <div class="config-item">
                      <el-row
                        type="flex"
                        align="middle"
                      >
                        <el-col
                          :span="24"
                          style="display: flex; align-items: center"
                        >
                          <div class="inline-block">
                            <el-upload
                              class="inline-block-middle"
                              action
                              :multiple="false"
                              accept=".js, .json"
                              :before-upload="file => handleBeforeUpload(file, 'configTable')"
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
                          <div class="inline-block">
                            <span class="config-sub-title">展示分页</span>
                            <el-switch v-model="configTable.pagination" />
                          </div>
                        </el-col>
                      </el-row>
                      <!-- table表格字段配置 -->
                      <ConfigTableCommon
                        class="mt10"
                        :thead="thead"
                        :config="configTable"
                      />
                    </div>
                  </el-form-item>
                  <!-- 列表配置 end-->
                  <el-form-item v-else>
                    <div class="config-item">
                      <el-row
                        type="flex"
                        align="middle"
                      >
                        <el-col :span="24">
                          <!-- 接口地址、接口类型配置 -->
                          <ConfigFormCommon
                            :ref="item.configName"
                            :config="getConfig(item.configName)"
                            :show-disabled="item.configName === 'configQuery'"
                            @setConfigQueryColumns="setConfigQueryColumns"
                          />
                        </el-col>
                      </el-row>
                      <template
                        v-if="
                          getConfig(item.configName) && (getConfig(item.configName).show || (getConfig(item.configName).showType && getConfig(item.configName).showType === 'yes'))
                        "
                      >
                        <el-button
                          v-if="item.configName === 'configAdd' || item.configName === 'configDetail' || item.configName === 'configModify'"
                          title="复制表单配置"
                          size="mini"
                          type="success"
                          icon="el-icon-document-copy"
                          circle
                          plain
                          @click="clonePasteFormConfig(item.configName, 'copy')"
                        />
                        <el-button
                          v-if="item.configName === 'configAdd' || item.configName === 'configDetail' || item.configName === 'configModify'"
                          title="粘贴表单配置"
                          size="mini"
                          type="warning"
                          icon="el-icon-document-checked"
                          circle
                          plain
                          @click="clonePasteFormConfig(item.configName, 'paste')"
                        />
                        <ConfigTableCommon
                          v-if="getConfig(item.configName) && !['configExport', 'configDelete'].includes(getConfig(item.configName).type)"
                          class="mt10"
                          :thead="item.thead"
                          :config="getConfig(item.configName)"
                        />
                      </template>
                    </div>
                  </el-form-item>
                </el-tab-pane>
              </el-tabs>
            </template>
            <template slot="configCustom">
              <el-divider content-position="left">
                自定义功能 <el-button
                  type="primary"
                  size="mini"
                  @click="()=>handleTabsEdit('', 'add')"
                >
                  添加1个
                </el-button>
              </el-divider>
              <template v-if="configCustom.length > 0">
                <el-tabs
                  v-model="editableTabsValue"
                  type="border-card"
                  closable
                  @edit="handleTabsEdit"
                >
                  <el-tab-pane
                    v-for="(custom, index) in configCustom"
                    :key="index"
                    :label="custom.btnText"
                    :name="index + ''"
                  >
                    <el-form-item
                      :key="index"
                      style="margin-bottom: 0;"
                    >
                      <div class="config-item">
                        <el-row
                          type="flex"
                          align="middle"
                        >
                          <el-col :span="24">
                            <ConfigCustomCommon
                              :ref="`configCustom${index}`"
                              :config="custom"
                              @handleBeforeUpload="file => handleBeforeUpload(file, {...custom, index})"
                            />
                          </el-col>
                        </el-row>
                      </div>
                    </el-form-item>
                  </el-tab-pane>
                </el-tabs>
              </template>
            </template>
            <!-- 查询/新增/修改/导出 配置 end -->
          </CfpaForm>
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editorDialog.visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="fnEditorSubmit('editorDialogForm')"
        >保存配置</el-button>
        <el-button
          type="warning"
          @click="fnEditorSubmit('editorDialogForm', 'saveJson')"
        >导出配置</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="previewCodeDialog.visible"
      width="80%"
      top="5vh"
      :title="previewCodeDialog.title"
      :visible.sync="previewCodeDialog.visible"
      :close-on-click-modal="false"
    >
      <el-tabs
        type="border-card"
        @tab-click="previewCodeTabClick"
      >
        <el-tab-pane
          v-for="(tab, index) in previewCodeDialog.tabs"
          :key="tab.type + '' + index"
          :label="tab.type"
        >
          <div
            v-if="previewCodeDialog.activeTab === tab.type"
            :style="{height: codeHeight, overflow: 'auto'}"
          >
            <CodeEditor
              v-model="previewCodeDialog.form.codeStr"
              :extend-style="true"
              theme="default"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="previewCodeDialog.visible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ConfigTableCommon from '../components/ConfigTableCommon'
import ConfigFormCommon from '../components/ConfigFormCommon'
import ConfigCustomCommon from '../components/ConfigCustomCommon'
import CodeEditor from './children/codeEditor.vue'
import AlphaApi from '@/api/business/Alpha.js'
import CfpaForm from '@/components/cfpaForm'
import { tableConfigList, tableInputConfigList, tableDataBaseInputConfigList } from '../thead.js'
import { Message } from 'element-ui'
import { session, convert, flatten } from '@/utils/common'
export default {
  name: 'EditDialog',
  components: {
    ConfigTableCommon,
    ConfigFormCommon,
    ConfigCustomCommon,
    CfpaForm,
    CodeEditor,
  },
  data() {
    return {
      codeHeight: '500px',
      editableTabsValue: '0',
      addTabsValue: 'configTable',
      exportCodeDialog: {
        loading: false,
        formName: 'exportCodeDialogForm',
        visible: false,
        title: '',
        type: 'add',
        labelWidth: '120px',
        colNum: 24,
        columns: [
          { prop: 'databaseTableName', label: '表名', type: 'input', disabled: true, required: true },
          { prop: 'entityName', label: '实体类名', type: 'input', required: true },
          { prop: 'entityPackage', label: '包名（小写）', type: 'input', required: true }],
        form: {},
      },
      editorDialog: {
        loading: false,
        formName: 'editorDialogForm',
        visible: false,
        title: '',
        type: 'add',
        labelWidth: '100px',
        colNum: 24,
        columns: [],
        form: {
        },
      },
      previewCodeDialog: {
        loading: false,
        formName: 'previewCodeDialogForm',
        visible: false,
        title: '',
        type: 'add',
        labelWidth: '100px',
        colNum: 24,
        tabs: [],
        activeTab: 'controller',
        columns: [],
        form: {},
      },
      routeName: '',
      thead: tableConfigList,
      configQuery: {
        type: 'configQuery', // 类型
        show: true, // 是否展示
        system: '',
        interface: '', // 提交信息接口地址
        interfaceType: 'post', // 提交信息接口类型
        paramType: 'query', // 提交信息接口参数类型
        columns: [], // 表单字段数据
      },
      configAdd: {
        type: 'configAdd',
        show: false,
        system: '',
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        columns: [],
        like: false,
      },
      configModify: {
        type: 'configModify',
        show: false,
        system: '',
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        columns: [],
        like: false,
      },
      configDetail: {
        type: 'configDetail',
        showType: 'no', //  no(不展示按钮，不需要配置) yes(展示按钮) backfill(不展示按钮，需要配置，用于编辑回填)
        system: '',
        interface: '', // 获取回填信息接口地址
        interfaceType: 'post', // 获取回填信息接口类型
        paramType: 'query', // 获取回填信息接口传参类型
        rowParam: '', // 获取回填信息参数，这里只需要指定行row的字段，用逗号隔开；eg: id,date
        columns: [], // 表单字段数组
        like: false,
      },
      configImport: {
        type: 'configImport',
        show: false,
        system: '',
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        columns: [],
        like: false,
      },
      configExport: {
        type: 'configExport',
        show: false,
        system: '',
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        // columns: [],
        like: false,
      },
      configDelete: {
        type: 'configDelete',
        show: false,
        system: '',
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        rowParam: '', // 获取回填信息参数，这里只需要指定行row的字段，用逗号隔开；eg: id,date
        columns: [],
      },
      configTable: {
        type: 'configTable',
        pagination: true,
        multipleSelect: false,
        columns: [],
      },
      configDatabase: {
        type: 'configDatabase',
        databaseTableType: '',
        databaseTableName: '',
        databaseTableDescription: '',
        show: false,
        columns: [],
      },
      configCustom: [],
      configs: [
        // {
        //   configName: 'configDatabase',
        //   thead: tableDataBaseInputConfigList,
        //   title: '数据库属性',
        // },
        {
          configName: 'configTable',
          title: '列表配置',
        },
        {
          configName: 'configQuery',
          thead: tableInputConfigList,
          title: '查询配置',
        },
        {
          configName: 'configAdd',
          thead: tableInputConfigList,
          title: '新增配置',
        },
        {
          configName: 'configModify',
          thead: tableInputConfigList,
          title: '修改配置',
        },
        {
          configName: 'configDetail',
          thead: tableInputConfigList,
          title: '详情配置',
        },
        {
          configName: 'configImport',
          thead: tableInputConfigList,
          title: '导入配置',
        },
        {
          configName: 'configExport',
          thead: tableInputConfigList,
          title: '导出配置',
        },
        {
          configName: 'configDelete',
          thead: tableInputConfigList,
          title: '删除配置',
        },
      ],
    }
  },

  computed: {},

  watch: {
    'editorDialog.visible'() {
      this.editableTabsValue = '0'
      this.addTabsValue = 'configTable'
    },
  },
  created() {
    this.codeHeight = document.body.clientHeight - 320 + 'px'
  },
  methods: {
    // 预览代码tab切换
    previewCodeTabClick(name) {
      const { index, label } = name
      console.log('name', name)
      this.previewCodeDialog.activeTab = label
      const codeStr = this.previewCodeDialog.tabs[index].str
      this.previewCodeDialog.form.codeStr = codeStr
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.addCustom()
        this.editableTabsValue = (this.configCustom.length - 1) + ''
      }
      if (action === 'remove') {
        const tabs = this.configCustom
        let activeName = this.editableTabsValue
        // 改变当前tab
        const changeActiveName = (index, array) => {
          let activeName = index + ''
          if (index === (array.length - 1)) {
            activeName = (array.length - 2) + ''
          }
          return activeName
        }
        if (activeName === targetName) {
          tabs.forEach((tab, index, array) => {
            if ((index + '') === targetName) {
              activeName = changeActiveName(index, array)
              this.delCustom(index, activeName, tabs[index].btnText)
            }
          })
        } else {
          const index = tabs.findIndex((tab, index) => (index + '') === targetName)
          activeName = changeActiveName(index, tabs)
          this.delCustom(index, activeName, tabs[index].btnText)
        }
        // this.configCustom = tabs.filter((tab, index) => (index + '') !== targetName)
      }
    },
    // 上传前的拦截
    handleBeforeUpload(file, type) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'js' || fileExt === 'json') {
        // this.file = file;
        this.readData(file, type)
      } else {
        Message({
          showClose: true,
          message: '请选择后缀为"js"或"json"的文件',
          type: 'warning',
        })
      }
      return false
    },
    // 解析文件
    readData(file, type) {
      const vm = this
      // let fileName = file.name;
      // let check = this.uploadList.some(item => item.name === fileName);
      // if (check) {
      //     Message({
      //       showClose: true,
      //       message: `不能上传重复的文件`,
      //       type: 'warning'
      //     })
      //     return;
      // }
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onerror = () => {
        Message({
          showClose: true,
          message: '读取文件错误',
          type: 'warning',
        })
      }
      reader.onload = (e) => {
        try {
          if (typeof type == 'string') {
            if (type === 'configs') {
              const result = JSON.parse(e.target.result)
              if (result.id) {
                delete result.id
              }
              vm.fnChangeResult(result)
            // } else if (type === 'configTable') {
            //   const { result } = e.target
            //   const _result = JSON.parse(result)
            //   this[type].columns = [...this[type].columns, ..._result]
            } else {
              const { result } = e.target
              const _result = JSON.parse(result)
              this[type].columns = [...this[type].columns, ..._result]
            }
          } else if (typeof type == 'object') {
            const { result } = e.target
            const _result = JSON.parse(result)
            const { configCustom } = this
            configCustom[type.index].columns = [...configCustom[type.index].columns, ..._result]
            this.$set(this, 'configCustom', configCustom)
            console.log('configCustom', configCustom)
          }
        } catch (err) {
          console.log('err', err)
          Message({
            showClose: true,
            message: '文件格式错误',
            type: 'warning',
          })
        }
      }
    },
    // 保存json成文件到本地
    fnSaveFile(data, filename, type = 'text/json') {
      if (!data) {
        Message({
          showClose: true,
          message: '保存的数据为空',
          type: 'warning',
        })
        return
      }
      if (!filename && type === 'text/json') {
        // eslint-disable-next-line no-param-reassign
        filename = 'json.json'
      }
      if (typeof data === 'object') {
        // eslint-disable-next-line no-param-reassign
        data = JSON.stringify(data, undefined, 4)
      }
      const blob = new Blob([data], { type })
      const e = document.createEvent('MouseEvent')
      const a = document.createElement('a')
      a.download = filename
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = [type, a.download, a.href].join(':')
      e.initMouseEvent('click', true, true)
      a.dispatchEvent(e)
    },
    getConfig(configName) {
      return this[configName]
    },
    /**
     * @description: 整体表单结构
     * @param {*} vm this
     * @return {*}
     */
    getDialogColunms(vm) {
      let arr = [
        { prop: 'route', label: '路由地址', type: 'input', colNum: 8, required: true },
        { prop: 'meta', label: '页面名称', type: 'input', colNum: 8, required: true },
        {
          prop: 'isEnable',
          label: '是否启用',
          type: 'select',
          colNum: 8,
          options: [
            { prop: 1, label: '是' },
            { prop: 0, label: '否' },
          ],
          required: true,
        },
      ]
      arr = [
        ...arr,
        { prop: 'configTable', label: '', slot: true, required: true },
        { prop: 'configQuery', label: '', slot: true },
        { prop: 'configAdd', label: '', slot: true },
        { prop: 'configModify', label: '', slot: true },
        { prop: 'configDetail', label: '', slot: true },
        { prop: 'configImport', label: '', slot: true },
        { prop: 'configExport', label: '', slot: true },
        { prop: 'configDelete', label: '', slot: true },
        { prop: 'configAll', label: '', slot: true },
        { prop: 'configCustom', label: '', slot: true },
      ]
      // if (!vm.$store.state.isQiankun) {
      //   arr.unshift({
      //     prop: 'system',
      //     label: '所属系统',
      //     type: 'input',
      //     colNum: 8,
      //     required: true,
      //   })
      // }
      return arr
    },
    /**
     * @description: 校验填写内容
     * @param {*} formName
     */
    async fnEditorSubmit(formName, type) {
      const vm = this
      // 最外层填写内容-这里只会校验路由地址、页面名称、是否启用三项
      const result = await vm.$refs[formName].submit()
      // 各个子模块单独校验
      let valid
      let message = '请检查模版填写'
      const configAddValid = await this.$refs.configAdd[0].submit()
      const configModifyValid = await this.$refs.configModify[0].submit()
      const configDetailValid = await this.$refs.configDetail[0].submit()
      const configExportValid = await this.$refs.configExport[0].submit()
      const configImportValid = await this.$refs.configImport[0].submit()
      const configDeleteValid = await this.$refs.configDelete[0].submit()
      const configQueryValid = await this.$refs.configQuery[0].submit()
      const configDatabaseValid = await this.$refs.configDatabase[0].submit()

      // 自定义操作
      let configCustomValid = true
      // 收集错误信息
      let errorArr = []
      if (this.configCustom && this.configCustom.length > 0) {
        for (let i = 0; i < this.configCustom.length; i++) {
          if (!(await this.$refs[`configCustom${i}`][0].submit())) {
            configCustomValid = false
            errorArr.push({ mesage: this.configCustom[i].btnText, flag: false })
          }
        }
      }
      valid = result && configAddValid && configDatabaseValid && configModifyValid && configDetailValid && configDeleteValid && configExportValid && configImportValid && configQueryValid && configCustomValid
      errorArr = [...[
        { mesage: '基本配置', flag: result },
        { mesage: '新增配置', flag: configAddValid },
        { mesage: '修改配置', flag: configModifyValid },
        { mesage: '详情配置', flag: configDetailValid },
        { mesage: '删除配置', flag: configDeleteValid },
        { mesage: '导出配置', flag: configExportValid },
        { mesage: '导入配置', flag: configImportValid },
        { mesage: '数据库属性', flag: configDatabaseValid },
        { mesage: '查询配置', flag: configQueryValid }], ...errorArr]
      const strArr = []
      errorArr.forEach((v) => {
        if (!v.flag) {
          strArr.push(v.mesage)
        }
      })
      message = `请检查“${strArr + ''}”填写`
      if (valid) {
        if (type === 'saveJson') {
          this.fnSaveFile(this.fnChangeParams(), `${this.editorDialog.form.route}-${this.editorDialog.form.meta}.json`)
        } else {
          this.fnSubmit()
        }
      } else {
        this.$error(message)
      }
    },
    // 复制表单配置字段
    clonePasteFormConfig(configName, type) {
      if (type === 'copy') {
        if (!(this[configName] && this[configName].columns && this[configName].columns.length > 0)) {
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
    fnChangeParams() {
      const params = { ...this.editorDialog.form }
      this.configs.forEach((v) => {
        if (v.configName !== 'configTable') {
          params[v.configName] = JSON.stringify(Object.assign({}, this[v.configName]))
        }
      })


      // 自定义操作
      if (this.configCustom && this.configCustom.length > 0) {
        // params.configCustom = JSON.stringify(Object.assign({}, this.configCustom))
        params.configCustom = Object.assign({}, this.configCustom)
      }

      params.version = 'current'
      // 处理多级头部
      params.configTable = JSON.stringify(
        Object.assign(
          {},
          {
            ...this.configTable,
            columns: convert(
              this.configTable.columns.map((item) => {
                if (item.children) {
                  return {
                    ...item,
                    children: [],
                  }
                }
                return item
              }),
            ),
          },
        ),
      )
      return params
    },
    async fnSubmit() {
      const vm = this
      try {
        // const api = new AlphaApi()
        const params = this.fnChangeParams()
        let obj = 'add'
        // 修改
        if (vm.editorDialog.type === 'edit') {
          obj = 'update'
        }
        let localConfigList = localStorage.getItem('localConfigList') ? JSON.parse(localStorage.getItem('localConfigList')) : []
        if (obj === 'add') {
          localConfigList.push({ ...params, id: +new Date() })
        }
        if (obj === 'update') {
          localConfigList = localConfigList.map((item) => {
            if (item.id === params.id) {
              return params
            }
            return item
          })
        }
        localStorage.setItem('localConfigList', JSON.stringify(localConfigList))
        vm.$success('操作成功')
        vm.editorDialog.visible = false
        vm.$emit('reloadList')
        // const ret = await api[obj](params)
        // if (ret.isSuccess()) {
        //   vm.$success('操作成功')
        //   vm.editorDialog.visible = false
        //   vm.$emit('reloadList')
        // } else {
        //   Message({
        //     showClose: true,
        //     message: ret.message || '参数配置错误',
        //     type: 'error',
        //   })
        // }
      } catch (err) {
        console.error(err)
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
      vm.editorDialog.title = type === 'add' ? '新增页面' : type === 'edit' ? '编辑页面' : '查看页面'
      vm.reset()
      vm.editorDialog.visible = true
      if (type === 'edit') {
        // const result = await vm.fnDetail(row.route, row.system)

        const localConfigList = localStorage.getItem('localConfigList') ? JSON.parse(localStorage.getItem('localConfigList')) : []
        const result = localConfigList.find((item) => item.id === row.id)
        vm.fnChangeResult(result)
      } else {
        this.editorDialog.columns = this.getDialogColunms(this)
      }
      vm.editorDialog.loading = false
    },
    fnChangeResult(result) {
      const vm = this
      result.configQuery && (vm.configQuery = JSON.parse(result.configQuery))
      result.configAdd && (vm.configAdd = JSON.parse(result.configAdd))
      result.configModify && (vm.configModify = JSON.parse(result.configModify))
      result.configDetail && (vm.configDetail = JSON.parse(result.configDetail))
      result.configDelete && (vm.configDelete = JSON.parse(result.configDelete))
      result.configImport && (vm.configImport = JSON.parse(result.configImport))
      result.configExport && (vm.configExport = JSON.parse(result.configExport))
      result.configDatabase && (vm.configDatabase = JSON.parse(result.configDatabase))

      // 自定义操作
      result.configCustom && (vm.configCustom = Object.values(result.configCustom))
      // vm.configCustom = [{ type: 'jump', btnText: '123', btnType: 'danger', columns: [], jumpUrl: '123123' }]

      // 去除chilren字段，在编辑时候父子关系通过parentKey标识，数据里里通过树结构存储
      const configTable = result.configTable ? JSON.parse(result.configTable) : null
      configTable && (vm.configTable = { ...configTable, columns: flatten(configTable.columns) })


      result.isEnable = result.isEnable ? 1 : 0
      this.editorDialog.columns = this.getDialogColunms(this)
      vm.editorDialog.form = Object.assign({}, result)
      console.log('vm.editorDialog.form', vm.editorDialog.form)
    },
    // 新增自定义操作
    addCustom() {
      this.configCustom.push({
        type: '',
        btnText: '按钮文案',
        btnType: '',
        columns: [],
      })
    },
    // 删除自定义操作
    delCustom(index, activeName, btnText) {
      this.$confirm(`确认删除 "${btnText}(第${index + 1}个tab)" 的功能吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async() => {
        this.configCustom.splice(index, 1)
        this.editableTabsValue = activeName
      }).catch(() => {})
    },
    reset() {
      const vm = this
      vm.configQuery = {
        type: 'configQuery',
        show: true,
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        columns: [],
      }
      vm.configAdd = {
        type: 'configAdd',
        show: false,
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        columns: [],
        like: false,
      }
      vm.configModify = {
        type: 'configModify',
        show: false,
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        columns: [],
        like: false,
      }
      vm.configDetail = {
        type: 'configDetail',
        showType: 'no', //  no(不展示按钮，不需要配置) yes(展示按钮) backfill(不展示按钮，需要配置，用于编辑回填)
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        columns: [],
        like: false,
      }
      vm.configDelete = {
        type: 'configDelete',
        show: false,
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        rowParam: '', // 获取回填信息参数，这里只需要指定行row的字段，用逗号隔开；eg: id,date
        columns: [],
      }
      vm.configImport = {
        type: 'configImport',
        show: false,
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        columns: [],
        like: false,
      }
      vm.configExport = {
        type: 'configExport',
        show: false,
        interface: '',
        interfaceType: 'post',
        paramType: 'query',
        // columns: [],
        like: false,
      }
      vm.configTable = {
        type: 'configTable',
        pagination: true,
        columns: [],
      }
      vm.configDatabase = {
        type: 'configDatabase',
        databaseTableType: '',
        databaseTableName: '',
        databaseTableDescription: '',
        show: false,
        columns: [],
      }
      vm.configCustom = []
      vm.editorDialog.form = {}
      vm.configTable.columns = []
    },
    fnDetail(routeName, system) {
      // archiveStorageQueryDetail
      const vm = this
      vm.editorDialog.loading = true
      return new Promise(async(resolve) => {
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
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
  },
}
</script>

<style scoped lang="scss">
.editDialog /deep/ .el-tabs--border-card > .el-tabs__content{
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
}
.mt10 {
  margin-top: 10px;
}
.config-item {
  /** border: 1px solid #dcdfe6;
  padding: 10px;
  border-radius: 4px;
  background: #fff; **/
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
.inline-block-middle {
  display: inline-block;
  vertical-align: middle;
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
