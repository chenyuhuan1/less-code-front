<!--
 * @Description: 配置预览弹窗
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2021-01-06 10:56:47
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-10-08 17:14:28
-->
<template>
  <div>
    <!-- 渲染table页面 -->
    <div
      v-if="searchFormConfig.columns.length > 0"
      ref="searchRef"
      class="cfpa-search"
    >
      <CfpaForm
        ref="cfpaForm"
        :config="searchFormConfig"
        @search="fnSearch"
        @expand="fnExpand"
        @export="fnExport"
      />
    </div>
    <div class="cfpa-table">
      <div class="mb10">
        <template v-if="config.configAdd && config.configAdd.show">
          <el-button
            type="primary"
            :disabled="largeTableParams.loading"
            :loading="largeTableParams.loading"
            @click="fnAddMethods('add')"
          >
            新增
          </el-button>
        </template>
        <!-- 批量操作 -->
        <template v-for="(custom, index) in config.configCustomBatch">
          <el-button
            :key="custom.type + custom.btnText + index"
            :type="custom.btnType ? custom.btnType : 'primary'"
            size="mini"
            :disabled="largeTableParams.loading"
            @click="fnCustomBatch(custom)"
          >
            {{ custom.btnText }}
          </el-button>
        </template>

        <template v-if="config.configImport && config.configImport.show">
          <el-button
            type="primary"
            :disabled="largeTableParams.loading"
            :loading="largeTableParams.loading"
            @click="fnAddMethods('import')"
          >
            导入
          </el-button>
        </template>
      </div>
      <large-table
        :loading="largeTableParams.loading"
        :pagination="isPagination"
        :data="largeTableParams.data"
        :thead="largeTableParams.thead"
        :current-page="largeTableParams.number"
        :page-size="largeTableParams.pageSize"
        :total="largeTableParams.total"
        :height="largeTableParams.tableHeight"
        :multiple-select="isCheck"
        @requestData="fnPaginationChange"
        @handleSelectionChange="fnSelect"
      >
        <el-table-column
          v-if="(config.configDetail && config.configDetail.showType === 'yes') || (config.configModify && config.configModify.show) || (config.configDelete && config.configDelete.show)"
          fixed="right"
          align="center"
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              v-if="config.configDetail && config.configDetail.showType === 'yes'"
              v-loading="largeTableParams.loading"
              type="primary"
              plain
              size="mini"
              :disabled="largeTableParams.loading"
              @click="fnAddMethods('view', scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="config.configModify && config.configModify.show"
              type="primary"
              plain
              size="mini"
              :disabled="largeTableParams.loading"
              @click="fnAddMethods('edit', scope.row)"
            >
              编辑
            </el-button>

            <template v-for="(custom, index) in config.configCustomRow">
              <el-button
                v-if="customBtnShow(scope.row, custom)"
                :key="custom.type + custom.btnText + index"
                :type="custom.btnType ? custom.btnType : 'primary'"
                size="mini"
                :disabled="largeTableParams.loading"
                @click="fnCustom(scope.row, custom)"
              >
                {{ custom.btnText }}
              </el-button>
            </template>

            <el-button
              v-if="config.configDelete && config.configDelete.show"
              type="danger"
              plain
              size="mini"
              :disabled="largeTableParams.loading"
              @click="fnDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </large-table>
    </div>
    <!-- 表单弹窗 -->
    <el-dialog
      v-if="editorDialog.visible"
      :title="editorDialog.title"
      :width="editorDialog.width ? editorDialog.width : '50%'"
      :visible.sync="editorDialog.visible"
      :close-on-click-modal="false"
      append-to-body
    >
      <CfpaForm
        :ref="editorDialog.formName"
        :config="editorDialog"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editorDialog.visible = false">
          关 闭
        </el-button>
        <el-button
          v-if="editorDialog.type !== 'view'"
          type="primary"
          @click="fnEditorSubmit('editorDialogForm')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- table型弹窗 -->
    <el-dialog
      v-if="tableDialog.visible"
      :title="tableDialog.title"
      :width="tableDialog.width ? tableDialog.width : '50%'"
      :visible.sync="tableDialog.visible"
      :close-on-click-modal="false"
      append-to-body
    >
      <CfpaForm
        ref="cfpaForm"
        :config="tableDialog.searchFormConfig"
        @search="fnSearchTableDialog"
      />
      <large-table
        :loading="tableDialog.largeTableParams.loading"
        :pagination="tableDialog.isPagination"
        :data="tableDialog.largeTableParams.data"
        :thead="tableDialog.largeTableParams.thead"
        :current-page="tableDialog.largeTableParams.number"
        :page-size="tableDialog.largeTableParams.pageSize"
        :total="tableDialog.largeTableParams.total"
        :height="tableDialog.largeTableParams.tableHeight"
        @requestData="fnPaginationChangeTableDialog"
      >
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="tableDialog.visible = false">
            关 闭
          </el-button>
        </div>
      </large-table>
    </el-dialog>
  </div>
</template>

<script>
import LargeTable from '@/components/largeTable'
import CfpaForm from '@/components/cfpaForm'
import { deteTypes } from '../thead'
import * as utils from '@/utils'
import moment from 'moment' // moment.js库的引入
import instance from '@/api/index.js'
import exportInstance from '@/api/export.js'
import _ from 'lodash' // lodash.js库的引入
export default {
  name: 'AuditReport',

  components: {
    LargeTable,
    CfpaForm,
  },

  mixins: [],

  props: {
    configInfo: {
      type: Object,
      default() {
        return null
      },
    },
    routeParams: {
      type: Object,
      default() {
        return null
      },
    },
  },

  data() {
    return {
      routeInfo: null,
      searchFormConfig: {
        colNum: 6,
        labelWidth: '130px',
        columns: [],
        disabled: false,
        form: {},
        size: 'mini',
        searchBtn: true,
        hideExpand: true,
        isExport: false,
      },
      largeTableParams: {
        loading: false,
        data: [],
        thead: [],
        number: 1,
        pageSize: 20,
        total: 0,
        tableHeight: 400,
      },
      editorDialog: {
        loading: false,
        formName: 'editorDialogForm',
        visible: false,
        title: '',
        type: 'add',
        labelWidth: '130px',
        colNum: 24,
        columns: [],
        form: {},
        disabled: true,
      },
      tableDialog: {
        formName: 'tableDialog',
        visible: false,
        title: '',
        width: '',
        searchFormConfig: {
          colNum: 6,
          labelWidth: '130px',
          columns: [],
          disabled: false,
          form: {},
          size: 'mini',
          searchBtn: true,
          hideExpand: true,
          isExport: false,
        },
        largeTableParams: {
          isPagination: false,
          loading: false,
          data: [],
          thead: [],
          number: 1,
          pageSize: 20,
          total: 0,
          tableHeight: 'auto',
        },
      },
      config: {},
      isCheck: false, // 是否开启行多选
      checkRows: [], // 行多选数组
      currentCustom: null, // 当前的自定义操作-自定义操作弹窗时暂存
    }
  },

  computed: {
    // 是否开启了分页
    isPagination() {
      return this.config.configTable && this.config.configTable.pagination
    },
  },

  watch: {
    configInfo: {
      deep: true,
      async handler() {
        console.log(44455)
        // 重置搜索表单
        this.resetSearchFormConfig()
        console.log('routeParams', this.routeParams)
        this.routeInfo = {
          routerName: this.configInfo.meta,
          routerUrl: this.configInfo.route,
          isEnable: this.configInfo.isEnable,
        }
        const {
          configAdd,
          configDelete,
          configExport,
          configImport,
          configModify,
          configDetail,
          configQuery,
          configTable,
          configCustom,
        } = this.configInfo
        if (this.configInfo.id) {
          this.config = {
            configAdd: configAdd && JSON.parse(configAdd).show ? JSON.parse(configAdd) : null,
            configDelete: configDelete && JSON.parse(configDelete).show ? JSON.parse(configDelete) : null,
            configImport: configImport && JSON.parse(configImport).show ? JSON.parse(configImport) : null,
            configExport: configExport && JSON.parse(configExport).show ? JSON.parse(configExport) : null,
            configModify: configModify && JSON.parse(configModify).show ? JSON.parse(configModify) : null,
            configDetail: configDetail && JSON.parse(configDetail).showType !== 'no' ? JSON.parse(configDetail) : null,
            configQuery: configQuery && JSON.parse(configQuery).show ? JSON.parse(configQuery) : null,
            configTable: configTable ? JSON.parse(configTable) : null,
            configCustom: configCustom ? Object.values(configCustom) : [],  // 包含 table行自定义和table上方全局的自定义操作
            configCustomRow: configCustom ? Object.values(configCustom).filter((item) => !item.isOutside) : [],  // table行自定义操作
            configCustomBatch: configCustom ? Object.values(configCustom).filter((item) => item.isOutside) : [], // table上方自定义操作
          }
          this.isCheck = this.config.configCustomBatch.some((item) => item.isCheck)
          this.largeTableParams.thead = (this.config.configTable && this.config.configTable.columns) ? this.config.configTable.columns : []
          if (this.config.configQuery) {
            // 搜索config处理，通过接口或者配置参数获取到获取实际的select-options
            this.searchFormConfig.columns = await this.disposeColumns(
              this.config.configQuery.columns,
            )
            // 处理联动字段
            this.disposeGanged(this.searchFormConfig)
          }
        }
        if (this.routeParams) {
          this.searchFormConfig.form = this.routerParamsInit(this.routeParams)
        } else {
          this.searchFormConfig.form = {}
        }
        // 搜索按钮显示隐藏
        this.searchFormConfig.searchBtn = this.config.configQuery && this.config.configQuery.columns && this.config.configQuery.columns.length > 0
        // 导出按钮显示隐藏
        this.searchFormConfig.isExport = this.config.configExport && this.config.configExport.show
        // 触发table搜索
        setTimeout(() => {
          this.fnSearch()
          this.fnExpand()
        })
      },
    },
    routeParams() {
      if (this.routeParams) {
        this.searchFormConfig.form = this.routerParamsInit(this.routeParams)
      } else {
        this.searchFormConfig.form = {}
      }
    },
  },

  async created() { },

  mounted() {
  },

  destroyed() { },

  methods: {
    // 路由取下来的参数，如果是多选字段，并且参数只有一个的话query取下来是字符串
    // 这里统一处理成数组
    routerParamsInit(params) {
      const cloneParams = _.cloneDeep(params)
      for (const key in params) {
        const item = this.getColumnItem(this.searchFormConfig.columns, key)
        if (item && ((item.type === 'select' && item.multiple) || (item.type === 'cascader' && item.multiple) || item.type === 'checkbox')) {
          if (params[key] && !Array.isArray(params[key])) {
            cloneParams[key] = [cloneParams[key]]
          }
        }
      }
      return cloneParams
    },

    getColumnItem(columm, key) {
      return columm?.find((item) => item.prop === key)
    },
    /**
     * @description: 处理联动字段
     *               这里是非纯函数会直接修改传来的formConfig，通过配置的联动字段来给表单项目动态生成onchange事件来实现联动
     * @param {*} columns
     * @return {*}
     * @author: 陈宇环
     * @Date: 2021-06-15 15:45:34
     */
    disposeGanged(formConfig) {
      formConfig.columns = formConfig.columns.map((item) => {
        if (item.gangedConfig) {
          return {
            ...item,
            onChange: async(value, prop, isEliminate = true) => {
              if (prop === item.prop) {
                // 组装回调函数
                // eg: item.gangedConfig.gangedFun 值为 function cb(value) {if(value === '1'){return true}else {return false}}
                //                                      dom("1") 输出 true
                // eslint-disable-next-line no-new-func
                const gangedFun = new Function(`return ${item.gangedConfig.gangedFun}`)()
                const gangedFunValue = await gangedFun(value, instance)
                // 联动类型=修改字段值
                if (item.gangedConfig && item.gangedConfig.gangedType === 'val') {
                  formConfig.form = {
                    ...formConfig.form,
                    [item.gangedConfig.gangedKey]: gangedFunValue,
                  }
                  return
                }
                formConfig.columns = formConfig.columns.map((item2) => {
                  if (item2.prop === item.gangedConfig.gangedKey) {
                    // 联动类型=启用禁用
                    if (item.gangedConfig && item.gangedConfig.gangedType === 'dis') {
                      return {
                        ...item2,
                        disabled: gangedFunValue,
                      }
                    }
                    // 联动类型=显示隐藏
                    if (item.gangedConfig && item.gangedConfig.gangedType === 'show') {
                      return {
                        ...item2,
                        hide: gangedFunValue,
                      }
                    }
                    // 联动类型=是否必填
                    if (item.gangedConfig && item.gangedConfig.gangedType === 'req') {
                      return {
                        ...item2,
                        required: gangedFunValue,
                      }
                    }
                    // 联动类型=修改字段下拉选项
                    if (item.gangedConfig && item.gangedConfig.gangedType === 'options') {
                      return {
                        ...item2,
                        options: (gangedFunValue && Array.isArray(gangedFunValue)) ? gangedFunValue.map((item) => ({ ...item, prop: item.value })) : [],
                      }
                    }
                  }
                  return item2
                })
                // 清空联动控件的值
                if (item.gangedConfig && ['options', 'show', 'dis'].includes(item.gangedConfig.gangedType) && isEliminate) {
                  formConfig.form = {
                    ...formConfig.form,
                    [item.gangedConfig.gangedKey]: undefined,
                  }
                }
              }
            },
          }
        }
        return item
      })
    },
    /**
     * @description: 处理构建表单的columns，将一些下拉菜单的选择项通过接口获取到,并设置到options
     * @param {*} columns
     * @return {*}
     * @author: 陈宇环
     * @Date: 2021-06-15 15:45:34
     */
    async disposeColumns(columns) {
      // try {
      // promise.all用来处理map里的异步操作
      const newColumns = await Promise.all(
        columns.map(async(item) => {
          // 通过配置的接口信息来构造出inputAsync搜索函数 -- item.querySearch(queryString, cb, item.prop)
          if (
            item.type === 'inputAsync' &&
            item.optionsConfig
          ) {
            const querySearch = async(queryString, cb) => {
              let params = {}
              // 除输出字符外的额外附加参数
              if (item.optionsConfig.params) {
                // 通过键值对传参-现在这个方式已经舍弃-这里只是为了处理数据库里的旧数据
                if (Array.isArray(item.optionsConfig.params)) {
                // 将optionsConfig中的{label:'key', value: 'value'}转成{key: value}形式
                  params = { [item.optionsConfig.keywordKey ? item.optionsConfig.keywordKey : 'keyword']: queryString, ...item.optionsConfig.params.reduce((res, item) => {
                    res[item.label] = item.value
                    return res
                  }, {}) }
                } else {
                  // JSON方式
                  params = { [item.optionsConfig.keywordKey ? item.optionsConfig.keywordKey : 'keyword']: queryString, ...JSON.parse(item.optionsConfig.params) }
                }
              }
              // 替换/{id}为/2
              const interfaceUrl = utils.replaceParenthesis(item.optionsConfig.interface, params)
              const result = await instance[item.optionsConfig.interfaceType](
                interfaceUrl,
                item.optionsConfig.paramType === 'query' ? params : { ...params },
              )
              // 返回结果路径
              const resultPath = item.optionsConfig.resultPath || 'data'
              cb(_.get(result.data, resultPath, []))
            }
            return Promise.resolve({
              ...item,
              querySearch,
              valueKey: item.optionsConfig.valueField || 'value', // 下拉选项value对象的key
              labelKey: item.optionsConfig.keyField || 'label', // 下拉选项label对象的key
            })
          }

          // 通过配置的接口来获取select的下拉选项
          if (
            item.type === 'select' &&
            item.optionsConfig &&
            item.optionsConfig.source === '接口获取'
          ) {
            let params = {}
            if (item.optionsConfig.params) {
              // 通过键值对传参-现在这个方式已经舍弃-这里只是为了处理数据库里的旧数据
              if (Array.isArray(item.optionsConfig.params)) {
                // 将optionsConfig中的{label:'key', value: 'value'}转成{key: value}形式
                params = item.optionsConfig.params.reduce((res, item) => {
                  res[item.label] = item.value
                  return res
                }, {})
              } else {
                params = JSON.parse(item.optionsConfig.params)
              }
            }
            // 替换/{id}为/2
            const interfaceUrl = utils.replaceParenthesis(item.optionsConfig.interface, params)
            const result = await instance[item.optionsConfig.interfaceType](
              interfaceUrl,
              item.optionsConfig.paramType === 'query' ? params : { ...params },
            )
            // 返回结果路径
            const resultPath = item.optionsConfig.resultPath || 'data'
            return Promise.resolve({
              ...item,
              options: _.get(result.data, resultPath, []),
              valueKey: item.optionsConfig.valueField || 'value', // 下拉选项value对象的key
              labelKey: item.optionsConfig.keyField || 'label', // 下拉选项label对象的key
            })
          }
          // 手动配置的select下拉选项
          if (
            item.type === 'select' &&
            item.optionsConfig &&
            item.optionsConfig.source === '手动配置'
          ) {
            return Promise.resolve({
              ...item,
              options: item.optionsConfig.jogConfig,
            })
          }
          // 接口获取cascader的下拉选项  childrenField
          if (
            item.type === 'cascader' &&
            item.optionsConfig
          ) {
            let params = {}
            if (item.optionsConfig.params) {
              // 通过键值对传参-现在这个方式已经舍弃-这里只是为了处理数据库里的旧数据
              if (Array.isArray(item.optionsConfig.params)) {
                // 将optionsConfig中的{label:'key', value: 'value'}转成{key: value}形式
                params = item.optionsConfig.params.reduce((res, item) => {
                  res[item.label] = item.value
                  return res
                }, {})
              } else {
                params = JSON.parse(item.optionsConfig.params)
              }
            }

            // 替换/{id}为/2
            const interfaceUrl = utils.replaceParenthesis(item.optionsConfig.interface, params)
            const result = await instance[item.optionsConfig.interfaceType](
              interfaceUrl,
              item.optionsConfig.paramType === 'query' ? params : { params },
            )
            // 返回结果路径
            const resultPath = item.optionsConfig.resultPath || 'data'
            return Promise.resolve({
              ...item,
              options: _.get(result.data, resultPath, []),
              valueKey: item.optionsConfig.valueField || 'value', // 下拉选项value对象的key
              labelKey: item.optionsConfig.keyField || 'label', // 下拉选项label对象的key
              childrenKey: item.optionsConfig.childrenField || 'children', // 下拉选项label对象的key
              emitPath: item.optionsConfig.emitPath && item.optionsConfig.emitPath === 'array', // 默认选择最后一级
            })
          }
          return Promise.resolve(item)
        }),
      )
      return newColumns
      // } catch (error) {
      //   console.log(error)
      //   return []
      // }
    },
    fnExpand() {
      this.$nextTick(function() {
        const height = document.body.clientHeight
        this.$refs.searchRef && (this.largeTableParams.tableHeight = height - 240 - this.$refs.searchRef.clientHeight)
      })
    },
    async fnEditorSubmit(formName) {
      const vm = this
      const result = await vm.$refs[formName].submit()
      if (result) {
        this.fnSubmit()
      }
    },
    async fnSubmit() {
      try {
        // 替换参数中的''、undefined为null
        let params = utils.disposeParams(this.editorDialog.form)
        // 格式化日期
        params = this.paramsDateFormat(params)
        // params.yearMonthDate = Number(params.yearMonthDate) // todo
        let result
        if (this.editorDialog.type === 'add') {
          // 图片字段处理
          params = this.uploadFieldFormat(params, this.config.configAdd ? this.config.configAdd.columns : [], 'off')
          // 替换链接上的{id}等
          const interfaceUrl = utils.replaceParenthesis(this.config.configAdd.interface, params)
          result = await instance[this.config.configAdd.interfaceType](
            interfaceUrl,
            this.config.configAdd.paramType === 'query' ? params : { params },
          )
        } else if (this.editorDialog.type === 'edit') {
          // 图片字段处理
          params = this.uploadFieldFormat(params, this.config.configModify ? this.config.configModify.columns : [], 'off')
          // 替换链接上的{id}等
          const interfaceUrl = utils.replaceParenthesis(this.config.configModify.interface, params)
          result = await instance[this.config.configModify.interfaceType](
            interfaceUrl,
            this.config.configModify.paramType === 'query' ? params : { params },
          )
        } else if (this.editorDialog.type === 'import') {
          // 图片字段处理
          params = this.uploadFieldFormat(params, this.config.configImport ? this.config.configImport.columns : [], 'off')
          // 替换链接上的{id}等
          const interfaceUrl = utils.replaceParenthesis(this.config.configImport.interface, params)
          const formData = new FormData()
          for (const key in params) {
            formData.append(key, params[key])
          }
          result = await instance[this.config.configImport.interfaceType](
            interfaceUrl,
            this.config.configImport.paramType === 'query' ? formData : { params: formData },
          )
        } else if (this.editorDialog.type === 'custom') { // table行内自定义操作
          // 图片字段处理
          params = this.uploadFieldFormat(params, this.currentCustom ? this.currentCustom.columns : [], 'off')
          // 替换链接上的{id}等
          const interfaceUrl = utils.replaceParenthesis(this.currentCustom.interface, params)
          result = await instance[this.currentCustom.interfaceType](
            interfaceUrl,
            this.currentCustom.paramType === 'query' ? params : { params },
          )
        } else if (this.editorDialog.type === 'customBatch') { // 全局自定义操作
          // 图片字段处理
          params = this.uploadFieldFormat(params, this.currentCustom ? this.currentCustom.columns : [], 'off')

          // 批量勾选参数
          if (this.currentCustom.isCheck) { // 需要勾选行
            params[this.currentCustom.checkKey] = this.checkRows.map((item) => item[this.currentCustom.checkRowKey])
          }

          // 替换链接上的{id}等
          const interfaceUrl = utils.replaceParenthesis(this.currentCustom.interface, params)
          result = await instance[this.currentCustom.interfaceType](
            interfaceUrl,
            this.currentCustom.paramType === 'query' ? params : { params },
          )
        }
        if (result.status === 200 && result.data.code === '0') {
          this.checkRows = []
          this.$success('操作成功')
          this.editorDialog.visible = false
          this.fnSearch()
        } else {
          this.$error(result.data.message || '操作失败')
        }
      } catch (err) {
        console.log(err)
      }
    },
    /* 新增、修改、导入 */
    async fnAddMethods(type, row) {
      const vm = this
      vm.resetEditorDialog()
      vm.editorDialog.type = type
      vm.editorDialog.disabled = (type === 'view')
      vm.editorDialog.title = type === 'add' ? '新增' : type === 'edit' ? '编辑' : '查看'
      // 操作类型为add && 有配置新增参数
      if (type === 'add' && this.config.configAdd) {
        // 处理columns 将一些select的options通过接口获取并设置进来
        this.editorDialog.columns = await this.disposeColumns(
          this.config.configAdd.columns,
        )
        // 处理联动字段
        this.disposeGanged(this.editorDialog)
      }
      if (type === 'import' && this.config.configImport) {
        // 处理columns 将一些select的options通过接口获取并设置进来
        this.editorDialog.columns = await this.disposeColumns(
          this.config.configImport.columns,
        )
        // 处理联动字段
        this.disposeGanged(this.editorDialog)
      }
      // 操作类型为edit && 有配置编辑参数
      if (type === 'edit' && this.config.configModify) {
        // 处理columns 将一些select的options通过接口获取并设置进来
        this.editorDialog.columns = await this.disposeColumns(
          this.config.configModify.columns,
        )
        this.disposeGanged(this.editorDialog)
        // 回填数据
        vm.editorDialog.loading = true
        let result = this.config.configDetail.paramSource === 'api' ? await vm.fnDetail(row) : row
        // 图片字段处理
        result = this.uploadFieldFormat(result, this.config.configModify ? this.config.configModify.columns : [], 'on')
        vm.editorDialog.form = result
        // 触发一下联动字段的change事件
        this.editorDialog.columns.forEach((item) => {
          if (item.gangedConfig && item.onChange && vm.editorDialog.form[item.prop] !== undefined &&  vm.editorDialog.form[item.prop] !== null) {
            item.onChange(vm.editorDialog.form[item.prop], item.prop, false)
          }
        })
        vm.editorDialog.loading = false
      }
      // 操作类型为查看
      if (type === 'view' && this.config.configDetail) {
        // 处理columns 将一些select的options通过接口获取并设置进来
        this.editorDialog.columns = await this.disposeColumns(
          this.config.configDetail.columns,
        )
        // 回填数据
        vm.editorDialog.loading = true
        let result = this.config.configDetail.paramSource === 'api' ? await vm.fnDetail(row) : row
        // 图片字段处理
        result = this.uploadFieldFormat(result, this.config.configDetail ? this.config.configDetail.columns : [], 'on')
        vm.editorDialog.form = result
        // 触发一下联动字段的change事件
        this.editorDialog.columns.forEach((item) => {
          if (item.gangedConfig && item.onChange && vm.editorDialog.form[item.prop] !== undefined &&  vm.editorDialog.form[item.prop] !== null) {
            item.onChange(vm.editorDialog.form[item.prop], item.prop, false)
          }
        })
        vm.editorDialog.loading = false
      }
      vm.editorDialog.visible = true
    },
    // 接口获取回填编辑弹窗
    fnDetail(row) {
      // eslint-disable-next-line consistent-this
      const vm = this
      vm.editorDialog.loading = true
      return new Promise(async(resolve) => {
        try {
          let params = {}
          // 如果有指定需要传哪些参数就只传那些，否则转编辑行的所有数据
          if (this.config.configDetail.rowParam) {
            const rowParamKeys = this.config.configDetail.rowParam ? this.config.configDetail.rowParam.split(',') : []
            rowParamKeys.forEach((key) => {
              params[key] = row[key]
            })
          } else {
            params = row
          }
          // 替换/{id}为/2
          const interfaceUrl = utils.replaceParenthesis(this.config.configDetail.interface, params)
          const result = await instance[this.config.configDetail.interfaceType](
            interfaceUrl,
            this.config.configDetail.paramType === 'query' ? params : { params },
          )
          if (result.status === 200 && result.data.code === '0') {
            const detailDataPath = this.config.configDetail.resultPath ? this.config.configDetail.resultPath : 'data'
            resolve(_.get(result.data, detailDataPath, {}))
          } else {
            vm.$error(result.data && result.data.message ? result.data.message : '获取详情失败')
            resolve({})
          }
        } catch (err) {
          resolve({})
          this.$error('获取详情失败!')
        }
      })
    },
    /* 删除 */
    fnDelete(row) {
      const vm = this
      vm.$confirm('是否要删除此条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async() => {
        try {
          vm.largeTableParams.loading = true
          vm.searchFormConfig.disabled = true
          let interfaceUrl = this.config.configDelete.interface
          let params = {}
          if (this.config.configDelete.rowParam) {
            const rowParamKeys = this.config.configDelete.rowParam ? this.config.configDelete.rowParam.split(',') : []
            rowParamKeys.forEach((key) => {
              params[key] = row[key]
            })
          } else {
            params = row
          }
          console.log('interfaceUrl', interfaceUrl)
          console.log('params', params)
          // 替换/{id}为/2
          interfaceUrl = utils.replaceParenthesis(interfaceUrl, params)
          const result = await instance[this.config.configDelete.interfaceType](
            interfaceUrl,
            this.config.configDelete.paramType === 'query' ? params : { params },
          )
          if (result.status === 200 && result.data.code === '0') {
            vm.$success('删除成功')
            vm.fnSearch()
          } else {
            vm.$error(result.message, result.code)
          }
        } catch (error) {
          console.log('error', error)
          vm.$error('操作失败！')
        } finally {
          vm.largeTableParams.loading = false
          vm.searchFormConfig.disabled = false
        }
      })
    },
    /**
     * table行内自定义操作-点击事件
    */
    async fnCustom(row, custom) {
      const vm = this
      vm.currentCustom = null
      // 页面跳转
      if (custom.type === 'jump') {
        window.location.href = custom.jumpUrl
      }
      // 二次确认直接调用接口
      if (custom.type === 'api') {
        vm.$confirm(`是否要${custom.btnText}此条记录吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async() => {
          try {
            vm.largeTableParams.loading = true
            vm.searchFormConfig.disabled = true
            let interfaceUrl = custom.interface
            let params = {}
            if (custom.rowParam) {
              const rowParamKeys = custom.rowParam ? custom.rowParam.split(',') : []
              rowParamKeys.forEach((key) => {
                params[key] = row[key]
              })
            } else {
              params = row
            }
            interfaceUrl = utils.replaceParenthesis(interfaceUrl, params)
            const result = await instance[custom.interfaceType](
              interfaceUrl,
              custom.paramType === 'query' ? params : { params },
            )
            if (result.status === 200 && result.data.code === '0') {
              vm.$success('操作成功')
              vm.fnSearch()
            } else {
              vm.$error(result.message, result.code)
            }
          } catch (error) {
            vm.$error('操作失败！')
          } finally {
            vm.largeTableParams.loading = false
            vm.searchFormConfig.disabled = false
          }
        }).catch(() => {})
      }
      if (custom.type === 'form') {
        vm.resetEditorDialog()
        vm.editorDialog.disabled = false
        vm.editorDialog.type = 'custom'
        vm.editorDialog.width = custom.width
        vm.editorDialog.title = custom.btnText
        vm.currentCustom = custom
        // 处理columns 将一些select的options通过接口获取并设置进来
        this.editorDialog.columns = await this.disposeColumns(
          custom.columns,
        )
        this.disposeGanged(this.editorDialog)
        // 回填数据
        vm.editorDialog.loading = true

        // let result = {}
        let result = custom.paramSource === 'api' ? await vm.fnDetail(row) : row
        if (custom.rowParam) {
          const rowParamKeys = custom.rowParam ? custom.rowParam.split(',') : []
          rowParamKeys.forEach((key) => {
            result[key] = row[key]
          })
        }

        // 图片字段处理
        result = this.uploadFieldFormat(result, custom ? custom.columns : [], 'on')
        vm.editorDialog.form = result
        // 触发一下联动字段的change事件
        this.editorDialog.columns.forEach((item) => {
          if (item.gangedConfig && item.onChange && vm.editorDialog.form[item.prop] !== undefined &&  vm.editorDialog.form[item.prop] !== null) {
            item.onChange(vm.editorDialog.form[item.prop], item.prop, false)
          }
        })
        vm.editorDialog.loading = false
        vm.editorDialog.visible = true
      }
    },
    // table行顶部全局自定义操作
    async fnCustomBatch(custom) {
      const vm = this
      // 页面跳转
      if (custom.type === 'jump') {
        window.location.href = custom.jumpUrl
      }
      // 二次确认直接调用接口
      if (custom.type === 'api') {
        if (custom.isCheck && this.checkRows.length === 0) { // 需要勾选行
          vm.$error('请选择需要操作的行！')
          return
        }
        vm.$confirm(`确认执行${custom.btnText}操作吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async() => {
          try {
            vm.largeTableParams.loading = true
            vm.searchFormConfig.disabled = true
            const interfaceUrl = custom.interface
            const params = {}
            if (custom.isCheck) { // 需要勾选行
              params[custom.checkKey] = this.checkRows.map((item) => item[custom.checkRowKey])
            }
            const result = await instance[custom.interfaceType](
              interfaceUrl,
              custom.paramType === 'query' ? params : { params },
            )
            if (result.status === 200 && result.data.code === '0') {
              vm.$success('操作成功')
              vm.fnSearch()
            } else {
              vm.$error(result.message, result.code)
            }
          } catch (error) {
            vm.$error('操作失败！')
          } finally {
            vm.largeTableParams.loading = false
            vm.searchFormConfig.disabled = false
          }
        })
      }
      if (custom.type === 'form') {
        if (custom.isCheck && this.checkRows.length === 0) { // 需要勾选行
          vm.$error('请选择需要操作的行！')
          return
        }
        vm.resetEditorDialog()
        vm.editorDialog.disabled = false
        vm.editorDialog.type = 'customBatch'
        vm.editorDialog.width = custom.width
        vm.editorDialog.title = custom.btnText
        vm.currentCustom = custom
        // 处理columns 将一些select的options通过接口获取并设置进来
        this.editorDialog.columns = await this.disposeColumns(
          custom.columns,
        )
        this.disposeGanged(this.editorDialog)
        vm.editorDialog.loading = true
        vm.editorDialog.form = {}
        // 触发一下联动字段的change事件
        this.editorDialog.columns.forEach((item) => {
          if (item.gangedConfig && item.onChange && vm.editorDialog.form[item.prop] !== undefined &&  vm.editorDialog.form[item.prop] !== null) {
            item.onChange(vm.editorDialog.form[item.prop], item.prop, false)
          }
        })
        vm.editorDialog.loading = false
        vm.editorDialog.visible = true
      }
    },
    // 行自定义操作是否展示
    customBtnShow(row, custom) {
      if (!custom.showCondition) {
        return true
      }
      //* ***** 这里row参数不要删除custom.showCondition字符串中包含row变量 */
      try {
        console.error('传入的【table行按钮展示条件】表达式有误！')
        // eslint-disable-next-line no-eval
        return (eval(custom.showCondition))
      } catch (error) {
        return false
      }
    },
    /**
     * @description: 导出
     * @param {type} null
     * @return: null
     * @author: 陈宇环
     * @Date: 2020-06-21 09:35:50
     */
    async fnExport() {
      const vm = this
      vm.largeTableParams.loading = true
      vm.searchFormConfig.disabled = true
      try {
        // 处理params将""、undefined等转成null
        let params = utils.disposeParams(vm.searchFormConfig.form)
        // 处理日期格式
        params = this.paramsDateFormat(params)
        // 替换/{id}为/2
        const interfaceUrl = utils.replaceParenthesis(this.config.configExport.interface, params)
        const result = await exportInstance[this.config.configExport.interfaceType](
          interfaceUrl,
          this.config.configExport.paramType === 'query' ? params : { params },
        )
        if (result.status === 200 && result.data && result.data.size > 308) {
          vm.$download({
            title: vm.routeInfo ? vm.routeInfo.routerName : '导出文件',
            data: result.data,
            callback: () => {
              vm.searchFormConfig.disabled = false
              vm.largeTableParams.loading = false
            },
          })
          return
        }
        vm.searchFormConfig.disabled = false
        vm.largeTableParams.loading = false
        vm.$error('导出失败')
      } catch (err) {
        vm.searchFormConfig.disabled = false
        vm.largeTableParams.loading = false
        vm.$error('导出失败')
      }
    },
    /**
     * @description: table查询
     * @param {type} null
     * @return: null
     * @author: tanpeng
     * @Date: 2020-06-22 11:41:25
     */
    async fnSearch(isInit) {
      const vm = this
      if (isInit) {
        vm.largeTableParams.number = 1
      }
      vm.largeTableParams.data = []
      // vm.largeTableParams.total = 0
      vm.searchFormConfig.disabled = true
      vm.largeTableParams.loading = true
      try {
        // 根据api配置调用接口
        // 处理params将""、undefined等转成null
        let params = utils.disposeParams(vm.searchFormConfig.form)
        // 处理日期格式
        params = this.paramsDateFormat(params)
        // 系统
        if (this.isPagination) {
          // 设置分页参数（每个系统可能不一样）
          const pageKey = this.config.configQuery.pageKey ? this.config.configQuery.pageKey : 'pageNumber'
          const pageSizeKey = this.config.configQuery.pageSizeKey ? this.config.configQuery.pageSizeKey : 'pageSize'
          params[pageKey] = this.largeTableParams.number
          params[pageSizeKey] = this.largeTableParams.pageSize
        }
        // 替换链接上的/{id}等为/2
        const interfaceUrl = utils.replaceParenthesis(this.config.configQuery.interface, params)
        const result = await instance[this.config.configQuery.interfaceType](
          interfaceUrl,
          this.config.configQuery.paramType === 'query' ? params : { params },
        )
        if (result.status === 200 && result.data.code === '0') {
          const paginationDataPath = result.data && result.data.data && result.data.data.records ? 'data.records' : 'data.list'
          const resultPath = this.config.configQuery.resultPath ? this.config.configQuery.resultPath : this.isPagination ? paginationDataPath : 'data'
          vm.largeTableParams.data = _.get(result.data, resultPath, [])
          if (this.isPagination) {
            const totalPath = this.config.configQuery.totalPath ? this.config.configQuery.totalPath : 'data.total'
            vm.largeTableParams.total = _.get(result.data, totalPath, 0)
          }
        } else {
          vm.$error(result.message || '查询失败')
        }
        vm.largeTableParams.loading = false
      } catch (err) {
        console.error(err)
      } finally {
        vm.largeTableParams.loading = false
        vm.searchFormConfig.disabled = false
      }
    },
    async fnSearchTableDialog(isInit) {
      const vm = this
      if (isInit) {
        vm.tableDialog.largeTableParams.number = 1
      }
      vm.tableDialog.largeTableParams.data = []
      vm.tableDialog.largeTableParams.total = 0
      vm.tableDialog.searchFormConfig.disabled = true
      vm.tableDialog.largeTableParams.loading = true
      try {
        
        // 根据api配置调用接口
        // 处理params将""、undefined等转成null
        let params = utils.disposeParams(vm.tableDialog.searchFormConfig.form)
        // 处理日期格式
        params = this.paramsDateFormat(params)
        
        // 系统
        if (this.isPagination) {
          // 设置分页参数（每个系统可能不一样）
          const pageKey = vm.currentCustom.pageKey ? vm.currentCustom.pageKey : 'pageNumber'
          const pageSizeKey = vm.currentCustom.pageSizeKey ? vm.currentCustom.pageSizeKey : 'pageSize'
          params[pageKey] = this.tableDialog.largeTableParams.number
          params[pageSizeKey] = this.tableDialog.largeTableParams.pageSize
        }
        // 替换链接上的/{id}等为/2
        const interfaceUrl = utils.replaceParenthesis(vm.currentCustom.interface, params)
        const result = await instance[vm.currentCustom.interfaceType](
          interfaceUrl,
          vm.currentCustom.paramType === 'query' ? params : { params },
        )
        if (result.status === 200 && result.data.code === '0') {
          const paginationDataPath = result.data && result.data.data && result.data.data.records ? 'data.records' : 'data.list'
          const resultPath = vm.currentCustom.resultPath ? vm.currentCustom.resultPath : this.isPagination ? paginationDataPath : 'data'
          vm.tableDialog.largeTableParams.data = _.get(result.data, resultPath, [])
          if (this.isPagination) {
            const totalPath = vm.currentCustom.totalPath ? vm.currentCustom.totalPath : 'data.total'
            vm.tableDialog.largeTableParams.total = _.get(result.data, totalPath, 0)
          }
        } else {
          vm.$error(result.message || '查询失败')
        }
        vm.tableDialog.largeTableParams.loading = false
      } catch (err) {
        console.error(err)
      } finally {
        vm.tableDialog.largeTableParams.loading = false
        vm.tableDialog.searchFormConfig.disabled = false
      }
    },
    // 处理form表单中所有的日期格式
    paramsDateFormat(params) {
      const cloneParams = _.cloneDeep(params)
      const dateItem = this.searchFormConfig.columns.filter((item) => deteTypes.includes(item.type))
      // let numberDateStr = ['yyyy','yyyymm']
      // 将所有日期及字段组成{startYearMonthDate: "YYYYMM", endYearMonthDate: "YYYYMM"}对象
      const dateKeysFormarObj = dateItem.reduce((res, item) => {
        if (item.prop) {
          res[item.prop] = item.dateFormat
        }
        if (item.propEnd) {
          res[item.propEnd] = item.dateFormat
        }
        return res
      }, {})
      // 用对应的格式化字符串格式日期
      for (const key in cloneParams) {
        if (dateKeysFormarObj[key]) {
          // if(numberDateStr.includes(dateKeysFormarObj[key].toLocaleString())) {
          //   cloneParams[key] = cloneParams[key] ? String(moment(cloneParams[key]).format(dateKeysFormarObj[key])) : ''
          // }
          cloneParams[key] = cloneParams[key] ? moment(cloneParams[key]).format(dateKeysFormarObj[key]) : ''
        }
      }
      return cloneParams
    },
    // tyoe off：去除  on：添加
    uploadFieldFormat(form, columns, type) {
      const cloneForm = _.cloneDeep(form)
      const uploadColumns = columns.filter((item) => item.type === 'upload').map((item) => item.prop)
      if (type === 'off') {
        for (let i = 0; i < uploadColumns.length; i++) {
          if (cloneForm[uploadColumns[i]]) {
            cloneForm[uploadColumns[i]] = cloneForm[uploadColumns[i]].fileList
          }
        }
      }
      if (type === 'on') {
        for (let i = 0; i < uploadColumns.length; i++) {
          if (cloneForm[uploadColumns[i]]) {
            cloneForm[uploadColumns[i]] = {
              fileList: cloneForm[uploadColumns[i]],
              ossFolder: 'ARCHIVE_VOUCHERS',
              size: 100,
            }
          }
        }
      }
      return cloneForm
    },
    fnPaginationChange(pageSize, number) {
      this.largeTableParams.number = number
      this.largeTableParams.pageSize = pageSize
      this.fnSearch()
    },
    fnPaginationChangeTableDialog(pageSize, number) {
      this.tableDialog.largeTableParams.number = number
      this.tableDialog.largeTableParams.pageSize = pageSize
      this.fnSearchTableDialog()
    },
    // 行选中事件
    fnSelect(rows) {
      this.checkRows = rows
    },
    resetEditorDialog() {
      this.editorDialog = {
        loading: false,
        formName: 'editorDialogForm',
        visible: false,
        title: '',
        type: 'add',
        labelWidth: '100px',
        colNum: 24,
        columns: [],
        form: {},
        disabled: true,
      }
    },
    resettableDialog() {
      this.tableDialog = {
        formName: 'tableDialog',
        visible: false,
        title: '',
        searchFormConfig: {
          colNum: 6,
          labelWidth: '130px',
          columns: [],
          disabled: false,
          form: {},
          size: 'mini',
          searchBtn: true,
          hideExpand: true,
          isExport: false,
        },
        largeTableParams: {
          loading: false,
          data: [],
          thead: [],
          number: 1,
          pageSize: 20,
          total: 0,
          tableHeight: 400,
        },
      }
    },
    resetSearchFormConfig() {
      this.searchFormConfig = {
        colNum: 6,
        labelWidth: '100px',
        columns: [],
        disabled: false,
        form: {},
        size: 'mini',
        searchBtn: true,
        hideExpand: true,
        isExport: false,
      }
    },
  },
}
</script>
