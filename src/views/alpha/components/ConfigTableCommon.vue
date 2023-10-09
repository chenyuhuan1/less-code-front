<!--
 * @Description: 配置表格公用
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2021-01-07 16:29:41
 * @LastEditors: tanpeng
 * @LastEditTime: 2023-04-20 17:31:08
-->
<template>
  <div>
    <el-table
      :data="config.columns"
      style="width: 100%"
      size="mini"
      append-to-body
    >
      <el-table-column
        v-for="(item, index) in thead"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :show-overflow-tooltip="false"
      >
        <template slot-scope="scope">
          <!-- 正在编辑的行 -->
          <template v-if="scope.row.edit">
            <!-- 数据库表配置相关 start-->
            <el-select
              v-if="item.prop === 'fieldType'"
              v-model="scope.row[item.prop]"
              size="mini"
            >
              <el-option
                v-for="item in item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-checkbox
              v-else-if="item.prop === 'fieldPrimaryKey' || item.prop === 'fieldIsNull'"
              v-model="scope.row[item.prop]"
            />
            <!-- 数据库表配置相关 end-->
            <!-- 类型 -->
            <el-select
              v-else-if="item.prop === 'type'"
              v-model="scope.row[item.prop]"
              size="mini"
            >
              <el-option
                v-for="item in item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- 固定列 -->
            <template v-else-if="item.prop === 'fixed'">
              <el-select
                v-model="scope.row[item.prop]"
                placeholder="请选择"
                size="mini"
                clearable
              >
                <el-option
                  label="左侧固定"
                  value="left"
                />
                <el-option
                  label="右侧固定"
                  value="right"
                />
              </el-select>
            </template>
            <!-- 对齐 -->
            <template v-else-if="item.prop === 'align'">
              <el-select
                v-model="scope.row[item.prop]"
                placeholder="请选择"
                size="mini"
                clearable
              >
                <el-option
                  label="左对齐"
                  value="left"
                />
                <el-option
                  label="居中对齐"
                  value="center"
                />
                <el-option
                  label="右对齐"
                  value="right"
                />
              </el-select>
            </template>
            <!-- 范围值第二参数 -->
            <template v-else-if="item.prop === 'propEnd'">
              <template v-if="scope.row.type === 'dateRange' || scope.row.type === 'monthRange' || scope.row.type === 'yearRange' || scope.row.type === 'numRange'">
                <el-input
                  v-model="scope.row[item.prop]"
                  size="mini"
                />
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </template>
            <!-- options配置 -->
            <template v-else-if="item.prop === 'optionsConfig'">
              <template v-if="scope.row.type === 'inputAsync'">
                <editOptions
                  :options-config.sync="scope.row.optionsConfig"
                  type="inputAsync"
                />
              </template>
              <template v-else-if="scope.row.type === 'select'">
                <editOptions
                  :options-config.sync="scope.row.optionsConfig"
                  type="select"
                />
              </template>
              <template v-else-if="scope.row.type === 'cascader'">
                <editOptions
                  :options-config.sync="scope.row.optionsConfig"
                  type="cascader"
                />
              </template>
              <template v-else-if="scope.row.type === 'upload'">
                <uploadOptions :options-config.sync="scope.row.optionsConfig" />
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </template>
            <template v-else-if="item.prop === 'gangedConfig'">
              <gangedConfig :ganged-config.sync="scope.row.gangedConfig" />
            </template>
            <!-- 宽度 -->
            <template v-else-if="item.prop === 'colNum'">
              <el-input-number
                v-model="scope.row[item.prop]"
                placeholder="24等份；默认：6"
                size="mini"
                :step="1"
                :min="0"
                :controls="false"
                :max="24"
              />
            </template>
            <!-- 是否必填 -->
            <template v-else-if="item.prop === 'required'">
              <el-select
                v-model="scope.row[item.prop]"
                placeholder="请选择"
                size="mini"
                clearable
              >
                <el-option
                  label="是"
                  :value="true"
                />
                <el-option
                  label="否"
                  :value="false"
                />
              </el-select>
            </template>
            <!-- 是否多选 -->
            <template v-else-if="item.prop === 'multiple'">
              <template v-if="scope.row.type === 'select' || scope.row.type === 'cascader'">
                <el-select
                  v-model="scope.row[item.prop]"
                  placeholder="请选择"
                  size="mini"
                  clearable
                >
                  <el-option
                    label="是"
                    :value="true"
                  />
                  <el-option
                    label="否"
                    :value="false"
                  />
                </el-select>
              </template>
              <template v-else>
                <div class="">
                  -
                </div>
              </template>
            </template>
            <!-- 日期格式化字符串 -->
            <template v-else-if="item.prop === 'dateFormat'">
              <template v-if="deteTypes.includes(scope.row.type)">
                <el-input
                  v-model="scope.row[item.prop]"
                  size="mini"
                  placeholder="日期格式化字符串"
                />
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </template>
            <!-- 是否禁用 -->
            <template v-else-if="item.prop === 'disabled'">
              <el-select
                v-model="scope.row[item.prop]"
                placeholder="请选择"
                size="mini"
                clearable
              >
                <el-option
                  label="是"
                  :value="true"
                />
                <el-option
                  label="否"
                  :value="false"
                />
              </el-select>
            </template>
            <template v-else>
              <el-input
                v-model="scope.row[item.prop]"
                size="mini"
              />
            </template>
          </template>
          <div
            v-else
            style="width: 100px; height: 32px; line-height: 32px"
            @dblclick="fnEdit(scope.$index, true)"
          >
            <!-- 是否必填 || 是否禁用 -->
            <span v-if="item.prop === 'required' || item.prop === 'disabled'">{{ scope.row[item.prop] === false ? '否' : scope.row[item.prop] === true ? '是' : '' }}</span>
            <template v-else-if="item.prop === 'fixed'">
              <span>{{ scope.row[item.prop] === 'left' ? '左侧固定' : scope.row[item.prop] === 'right' ? '右侧固定' : '' }}</span>
            </template>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="205"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.$index < config.columns.length - 1"
            title="下移"
            size="mini"
            type="primary"
            icon="el-icon-bottom"
            circle
            plain
            @click="fnMove(scope.$index, 'down')"
          />
          <el-button
            v-if="scope.$index > 0"
            title="上移"
            size="mini"
            type="success"
            icon="el-icon-top"
            circle
            plain
            @click="fnMove(scope.$index, 'up')"
          />
          <!-- 复制本行配置 -->
          <el-button
            title="复制此行配置"
            size="mini"
            type="success"
            icon="el-icon-document-copy"
            circle
            plain
            @click="clonePasteConfig(scope.$index, 'clone')"
          />
          <el-button
            title="粘贴此行配置"
            size="mini"
            type="warning"
            icon="el-icon-document-checked"
            circle
            plain
            @click="clonePasteConfig(scope.$index, 'paste')"
          />
          <el-button
            title="删除"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            @click="fnDelete(scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-button
      class="mt10"
      plain
      icon="el-icon-plus"
      @click="fnAdd('configTable')"
    >
      新增
    </el-button>
    <el-button
      class="mt10"
      plain
      icon="el-icon-check"
      @click="fnEdit"
    >
      结束编辑
    </el-button>
  </div>
</template>

<script>
import { deteTypes } from '../thead'
import editOptions from './children/editOptions'
import gangedConfig from './children/gangedConfig'
import uploadOptions from './children/uploadOptions'
import { session } from '@/utils/common'
export default {
  name: 'ConfigTableCommon',

  components: { editOptions, uploadOptions, gangedConfig },

  mixins: [],

  props: {
    // {
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
        return {
          columns: [],
        }
      },
    },
    thead: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      showEditDialog: {
        labelWidth: '100px',
        columns: [],
        form: {},
        size: 'mini',
        searchBtn: false,
      },
      deteTypes,
      params: {},
    }
  },

  computed: {},

  watch: {},

  created() {
    this.thead &&
      this.thead.forEach((v) => {
        this.params[v.prop] = ''
      })
  },

  mounted() {},

  destroyed() {},

  methods: {
    /**
     * @description: 移动
     * @param {*} index 行数
     * @param {*} type  'up' / 'down'
     * @return {*}
     * @author: tanpeng
     * @Date: 2021-01-07 18:22:16
     */
    fnMove(index, type) {
      if (type === 'up') {
        this.config.columns[index] = this.config.columns.splice(index - 1, 1, this.config.columns[index])[0]
      } else {
        this.config.columns[index] = this.config.columns.splice(index + 1, 1, this.config.columns[index])[0]
      }
    },
    /**
     * @description: 修改双击行的是否可以编辑状态
     * @param {*} index 行数
     * @param {*} bool 是否编辑
     * @author: tanpeng
     * @return {*}
     */
    fnEdit(index, bool) {
      const columns = JSON.parse(JSON.stringify(this.config.columns))
      columns.forEach((v) => {
        v.edit = false
      })
      if (bool === true) {
        columns[index].edit = true
      } else if (bool === false) {
        columns[index].edit = false
      }
      this.$set(this.config, 'columns', columns)
    },
    fnAdd() {
      const params = Object.assign({}, this.params)
      this.config.columns.push(params)
    },
    fnDelete(index) {
      this.config.columns.splice(index, 1)
    },
    // 复制select配置
    clonePasteConfig(index, type) {
      if (type === 'clone') {
        session('LowCodeCloneConfig', this.config.columns[index])
        this.$message.success('复制成功')
      } else if (type === 'paste') {
        if (!session('LowCodeCloneConfig')) {
          this.$message.warning('粘贴内容为空')
          return
        }
        this.$set(this.config.columns, index, session('LowCodeCloneConfig'))
        this.$message.success('粘贴成功')
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
