<template>
  <div class="cfpa-large-table">
    <el-table
      v-if="update"
      v-loading="ltLoading"
      :data="data"
      border
      ref="tableDom"
      :height="tableHeight"
      id="tableFixed"
      stripe
      :show-summary="showSummary"
      :summary-method="fnGetSummaries"
      :highlight-current-row="singleSelect"
      row-key="rowKey"
      @row-click="handleCurrentChange"
      @cell-dblclick="handleCellDbClick"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
    >
      <el-table-column
        type="selection"
        fixed="left"
        align="center"
        width="45"
        v-if="multipleSelect"
      >
      </el-table-column>
      <el-table-column
        type="index"
        min-width="40"
        fixed="left"
        align="center"
        v-if="hasIndexClo"
      >
      </el-table-column>
      <template v-for="(coloumnData, index) in formThead">
        <template v-if="!coloumnData.children">
          <el-table-column
            :key="index + '_' + coloumnData.prop"
            :label="coloumnData.label"
            :align="coloumnData.align ? coloumnData.align : 'center'"
            :min-width="coloumnData.width"
            :fixed="coloumnData.fixed ? coloumnData.fixed : false"
            :prop="coloumnData.prop"
            :show-overflow-tooltip="coloumnData.showOverflow"
          >
            <template slot-scope="scope">
              <slot
                v-if="coloumnData.slot"
                :name="coloumnData.prop"
                :row="scope.row"
                :index="scope.$index"
              ></slot>
              <template v-else>
                <span
                  v-if="
                    coloumnData.fmoney === undefined
                      ? pureMoneyTable
                      : coloumnData.fmoney
                  "
                  :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                >
                  {{ scope.row[coloumnData.prop] | fmoney }}
                </span>
                <span
                  v-else-if="coloumnData.frate"
                  :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                >
                  {{ scope.row[coloumnData.prop] | frate }}
                </span>
                <span
                  v-else-if="coloumnData.fhtml"
                  v-html="scope.row[coloumnData.prop]"
                >
                </span>
                <span
                  :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                  v-else
                >
                  {{ scope.row[coloumnData.prop] }}
                </span>
              </template>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          :key="index + '_' + coloumnData.prop"
          v-else
          :label="coloumnData.label"
          :align="coloumnData.align ? coloumnData.align : 'center'"
          :prop="coloumnData.prop"
        >
          <template v-for="(twoColoumnData, twoIndex) in coloumnData.children">
            <el-table-column
              :key="twoIndex + '_' + twoColoumnData.prop"
              v-if="!twoColoumnData.children"
              :label="twoColoumnData.label"
              :align="twoColoumnData.align ? twoColoumnData.align : 'center'"
              :min-width="twoColoumnData.width"
              :fixed="twoColoumnData.fixed ? twoColoumnData.fixed : false"
              :prop="twoColoumnData.prop"
              :show-overflow-tooltip="twoColoumnData.showOverflow"
            >
              <template slot-scope="scope">
                <slot
                  v-if="twoColoumnData.slot"
                  :name="twoColoumnData.prop"
                  :row="scope.row"
                  :index="scope.$index"
                ></slot>
                <template v-else>
                  <span
                    v-if="
                      twoColoumnData.fmoney === undefined
                        ? pureMoneyTable
                        : twoColoumnData.fmoney
                    "
                    :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                  >
                    {{ scope.row[twoColoumnData.prop] | fmoney }}
                  </span>
                  <span
                    v-else-if="twoColoumnData.frate"
                    :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                  >
                    {{ scope.row[twoColoumnData.prop] | frate }}
                  </span>
                  <span
                    v-else-if="twoColoumnData.fhtml"
                    v-html="scope.row[twoColoumnData.prop]"
                  >
                  </span>
                  <span
                    :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                    v-else
                  >
                    {{ scope.row[twoColoumnData.prop] }}
                  </span>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              :key="twoIndex + '_' + twoColoumnData.prop"
              v-else
              :label="twoColoumnData.label"
              :align="twoColoumnData.align ? twoColoumnData.align : 'center'"
              :prop="twoColoumnData.prop"
            >
              <el-table-column
                :key="threeIndex + '_' + threeColoumnData.prop"
                v-for="(threeColoumnData,
                threeIndex) in twoColoumnData.children"
                :label="threeColoumnData.label"
                :align="
                  threeColoumnData.align ? threeColoumnData.align : 'center'
                "
                :min-width="threeColoumnData.width"
                :fixed="threeColoumnData.fixed ? threeColoumnData.fixed : false"
                :prop="threeColoumnData.prop"
                :show-overflow-tooltip="threeColoumnData.showOverflow"
              >
                <template slot-scope="scope">
                  <slot
                    v-if="threeColoumnData.slot"
                    :name="threeColoumnData.prop"
                    :row="scope.row"
                    :index="scope.$index"
                  ></slot>
                  <template v-else>
                    <span
                      v-if="
                        threeColoumnData.fmoney === undefined
                          ? pureMoneyTable
                          : threeColoumnData.fmoney
                      "
                      :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                    >
                      {{ scope.row[threeColoumnData.prop] | fmoney }}
                    </span>
                    <span
                      v-else-if="threeColoumnData.frate"
                      :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                    >
                      {{ scope.row[threeColoumnData.prop] | frate }}
                    </span>
                    <span
                      v-else-if="threeColoumnData.fhtml"
                      v-html="scope.row[threeColoumnData.prop]"
                    >
                    </span>
                    <span
                      :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                      v-else
                    >
                      {{ scope.row[threeColoumnData.prop] }}
                    </span>
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
          </template>
        </el-table-column>
      </template>
      <slot v-if="!isFullScreen"></slot>
    </el-table>
    <slot name="tableFooter"></slot>
    <div class="cfpa-pagination-inline-block">
      <el-pagination
        @size-change="fnPageSizeChange"
        @current-change="fnCurrentChange"
        :current-page="ltCurrentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="ltPageSize"
        :layout="layout"
        :total="ltTotal"
        v-if="pagination"
      >
      </el-pagination>
      <slot name="paginationText"></slot>
      <div style="float: right" v-if="operateBtn && false">
        <el-popover placement="top" width="100" trigger="click">
          <el-checkbox-group
            v-model="checkboxVal"
            class="cfpa-showHide-check"
            :min="3"
          >
            <el-checkbox
              v-for="(coloumnData, index) in checkboxList"
              :label="coloumnData"
              :key="index"
              >{{ coloumnData.label }}</el-checkbox
            >
          </el-checkbox-group>
          <el-button type="primary" slot="reference">隐藏/显示列</el-button>
        </el-popover>
        <!--el-button type="warning" @click="fnFullScreen">全屏预览</el-button-->
      </div>
    </div>
    <template v-if="isFullScreen">
      <el-dialog
        title="数据"
        width="98%"
        :visible.sync="isFullScreen"
        top="1%"
        @close="isFullScreen === false"
        :close-on-click-modal="false"
        append-to-body
      >
        <el-table
          v-if="update"
          v-loading="ltLoading"
          :data="data"
          border
          ref="tableDom"
          :height="fullScreenTableHeight"
          id="tableFixed"
          stripe
          :show-summary="showSummary"
          :summary-method="fnGetSummaries"
          style="width: 100%"
          :cell-style="cellStyle"
          :header-cell-style="headerCellStyle"
        >
          <el-table-column
            type="index"
            min-width="40"
            fixed="left"
            align="center"
            v-if="hasIndexClo"
          >
          </el-table-column>
          <template v-for="(coloumnData, index) in formThead">
            <el-table-column
              :key="index + '_' + coloumnData.prop"
              v-if="!coloumnData.children"
              :label="coloumnData.label"
              :align="coloumnData.align ? coloumnData.align : 'center'"
              :min-width="coloumnData.width"
              :fixed="coloumnData.fixed ? coloumnData.fixed : false"
              :prop="coloumnData.prop"
              :show-overflow-tooltip="coloumnData.showOverflow"
            >
              <template slot-scope="scope">
                <slot
                  v-if="coloumnData.slot"
                  :name="coloumnData.prop"
                  :row="scope.row"
                  :index="scope.$index"
                ></slot>
                <template v-else>
                  <span
                    v-if="
                      coloumnData.fmoney === undefined
                        ? pureMoneyTable
                        : coloumnData.fmoney
                    "
                    :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                  >
                    {{ scope.row[coloumnData.prop] | fmoney }}
                  </span>
                  <span
                    v-else-if="coloumnData.frate"
                    :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                  >
                    {{ scope.row[coloumnData.prop] | frate }}
                  </span>
                  <span
                    v-else-if="coloumnData.fhtml"
                    v-html="scope.row[coloumnData.prop]"
                  >
                  </span>
                  <span
                    :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                    v-else
                  >
                    {{ scope.row[coloumnData.prop] }}
                  </span>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              :key="index + '_' + coloumnData.prop"
              v-else
              :label="coloumnData.label"
              :align="coloumnData.align ? coloumnData.align : 'center'"
              :prop="coloumnData.prop"
            >
              <template
                v-for="(twoColoumnData, twoIndex) in coloumnData.children"
              >
                <el-table-column
                  :key="twoIndex + '_' + twoColoumnData.prop"
                  v-if="!twoColoumnData.children"
                  :label="twoColoumnData.label"
                  :align="
                    twoColoumnData.align ? twoColoumnData.align : 'center'
                  "
                  :min-width="twoColoumnData.width"
                  :fixed="twoColoumnData.fixed ? twoColoumnData.fixed : false"
                  :prop="twoColoumnData.prop"
                  :show-overflow-tooltip="twoColoumnData.showOverflow"
                >
                  <template slot-scope="scope">
                    <slot
                      v-if="twoColoumnData.slot"
                      :name="twoColoumnData.prop"
                      :row="scope.row"
                      :index="scope.$index"
                    ></slot>
                    <template v-else>
                      <span
                        v-if="
                          twoColoumnData.fmoney === undefined
                            ? pureMoneyTable
                            : twoColoumnData.fmoney
                        "
                        :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                      >
                        {{ scope.row[twoColoumnData.prop] | fmoney }}
                      </span>
                      <span
                        v-else-if="twoColoumnData.frate"
                        :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                      >
                        {{ scope.row[twoColoumnData.prop] | frate }}
                      </span>
                      <span
                        v-else-if="twoColoumnData.fhtml"
                        v-html="scope.row[twoColoumnData.prop]"
                      >
                      </span>
                      <span
                        :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                        v-else
                      >
                        {{ scope.row[twoColoumnData.prop] }}
                      </span>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column
                  :key="twoIndex + '_' + twoColoumnData.prop"
                  v-else
                  :label="twoColoumnData.label"
                  :align="
                    twoColoumnData.align ? twoColoumnData.align : 'center'
                  "
                  :prop="twoColoumnData.prop"
                >
                  <el-table-column
                    :key="threeIndex + '_' + threeColoumnData.prop"
                    v-for="(threeColoumnData,
                    threeIndex) in twoColoumnData.children"
                    :label="threeColoumnData.label"
                    :align="
                      threeColoumnData.align ? threeColoumnData.align : 'center'
                    "
                    :min-width="threeColoumnData.width"
                    :fixed="threeColoumnData.fixed ? threeColoumnData.fixed : false"
                    :prop="threeColoumnData.prop"
                    :show-overflow-tooltip="threeColoumnData.showOverflow"
                  >
                    <template slot-scope="scope">
                      <slot
                        v-if="threeColoumnData.slot"
                        :name="threeColoumnData.prop"
                        :row="scope.row"
                        :index="scope.$index"
                      ></slot>
                      <template v-else>
                        <span
                          v-if="
                            threeColoumnData.fmoney === undefined
                              ? pureMoneyTable
                              : threeColoumnData.fmoney
                          "
                          :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                        >
                          {{ scope.row[threeColoumnData.prop] | fmoney }}
                        </span>
                        <span
                          v-else-if="threeColoumnData.frate"
                          :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                        >
                          {{ scope.row[threeColoumnData.prop] | frate }}
                        </span>
                        <span
                          v-else-if="threeColoumnData.fhtml"
                          v-html="scope.row[threeColoumnData.prop]"
                        >
                        </span>
                        <span
                          :class="{ 'cfpa-primary bold': scope.row.isTotal }"
                          v-else
                        >
                          {{ scope.row[threeColoumnData.prop] }}
                        </span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table-column>
              </template>
            </el-table-column>
          </template>
          <slot v-if="!isFullScreen"></slot>
        </el-table>
        <slot name="tableFooterFull"></slot>
        <!--分页组件 -->
        <div
          class="cfpa-pagination-inline-block"
          style="margin-top: 10px; height: 28px;"
        >
          <el-pagination
            @size-change="fnPageSizeChange"
            @current-change="fnCurrentChange"
            :current-page="ltCurrentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="ltPageSize"
            :layout="layout"
            :total="ltTotal"
            v-if="pagination"
          >
          </el-pagination>
          <slot name="paginationTextFull"></slot>
          <div style="float: right" v-if="operateBtn && false">
            <el-popover placement="top" width="100" trigger="click">
              <el-checkbox-group
                v-model="checkboxVal"
                class="cfpa-showHide-check"
                :min="3"
              >
                <el-checkbox
                  v-for="(coloumnData, index) in checkboxList"
                  :label="coloumnData"
                  :key="index"
                  >{{ coloumnData.label }}</el-checkbox
                >
              </el-checkbox-group>
              <el-button type="primary" slot="reference">隐藏/显示列</el-button>
            </el-popover>
            <el-button type="warning" @click="isFullScreen = false"
              >退出全屏</el-button
            >
          </div>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
export default {
  name: 'LargeTable',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Boolean,
      default: true
    },
    operateBtn: {
      type: Boolean,
      default: true
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    singleSelect: {
      type: Boolean,
      default: false
    },
    fmoney: {
      type: Boolean,
      default: false
    },
    multipleSelect: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    thead: {
      type: Array,
      required: true
    },
    summaryIndex: {
      type: Array,
      default() {
        return []
      }
    },
    summaryData: {
      type: Array,
      default() {
        return []
      }
    },
    currentPage: {
      type: Number,
      default: 1
    },
    height: {
      type: [Number, String],
      default: 400
    },
    pageSize: {
      type: Number,
      default: 20
    },
    total: {
      type: Number,
      default: 0
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    hasIndexClo: {
      // 是否需要index列
      type: Boolean,
      default: true
    },
    pureMoneyTable: {
      // 所有字段都金额类型的table，这里会同意将每列都处理成,分割的数组(不是数字及类数字字符串的列，将原样输出)
      type: Boolean,
      default: false
    },
    cellStyle: {
      type: Function,
      default({ row, column, rowIndex, columnIndex }) {}
    },
    headerCellStyle: {
      type: Function,
      default({ row, column, rowIndex, columnIndex }) {}
    }
  },
  data() {
    return {
      update: true,
      isFullScreen: false,
      fullScreenTableHeight: 500,
      formTheadOptions: this.thead,
      checkboxVal: this.thead,
      checkboxList: this.thead,
      formThead: this.thead,
      tableHeight: this.height,
      ltCurrentPage: this.currentPage,
      ltPageSize: this.pageSize,
      ltTotal: this.total,
      ltLoading: this.loading,
      currentChange: {}
    }
  },
  activated() {
    this.$refs.tableDom.doLayout()
  },
  watch: {
    currentPage(val) {
      this.ltCurrentPage = val
    },
    pageSize(val) {
      this.ltPageSize = val
    },
    total(val) {
      this.ltTotal = val
    },
    loading(val) {
      this.ltLoading = val
    },
    thead(val) {
      this.formThead = val
      this.formTheadOptions = val
      this.checkboxVal = val
      this.checkboxList = val
      this.fnUpdate()
    },
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1 // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    },
    height(val) {
      this.tableHeight = val
    }
  },
  created() {
    let vm = this
    if (vm.tableHeight === 400) {
      vm.tableHeight = document.body.clientHeight - 184
    }
  },
  methods: {
    // 刷新下表格组件，清除缓存
    fnUpdate() {
      this.update = false
      this.$nextTick(() => {
        this.update = true
      })
    },
    /**
     * @description [fnPageSizeChange pageSize改变]
     * @author   zoumiao
     * @param    {Number}   val [页数量]
     * @returns   {null}  [没有返回]
     */
    fnPageSizeChange(val) {
      this.ltPageSize = val
      this.ltCurrentPage = 1
      this.$emit('requestData', this.ltPageSize, this.ltCurrentPage)
    },
    /**
     * @description [fnCurrentChange currentPage改变]
     * @author   zoumiao
     * @param    {Number}   val [当前页]
     * @returns   {null}    [没有返回]
     */
    fnCurrentChange(val) {
      this.ltCurrentPage = val
      this.$emit('requestData', this.ltPageSize, this.ltCurrentPage)
    },
    /**
     * @description  [fnFullScreen 全屏预览]
     * @author   zoumiao
     * @returns   {null}   [没有返回]
     */
    fnFullScreen() {
      this.fullScreenTableHeight = document.body.clientHeight - 170
      this.isFullScreen = true
    },
    /**
     * @description  [fnGetSummaries 合计]
     * @author   zoumiao
     * @returns   {null}   [没有返回]
     */
    fnGetSummaries(param) {
      let vm = this
      let { columns, data } = param
      let sums = []
      if (vm.summaryData.length > 0) {
        return vm.summaryData
      }
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (vm.summaryIndex.length !== 0) {
          if (!vm.summaryIndex.find(ele => ele === index)) {
            sums[index] = ''
            return
          }
        }
        let values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = vm.fmoney
            ? '￥' +
              parseFloat(sums[index])
                .toFixed(2)
                .replace(/\B(?=(\d{3})+\b)/g, ',')
            : parseFloat(sums[index])
              .toFixed(2)
              .replace(/\B(?=(\d{3})+\b)/g, ',')
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    },
    handleCurrentChange(val) {
      if (this.currentChange === val) {
        this.currentChange = {}
        this.$refs.tableDom.setCurrentRow()
      } else {
        this.currentChange = val
      }
      this.$emit('handleSingleChange', this.currentChange)
    },
    handleCellDbClick(row, column, cell, event) {
      this.$emit('handleCellDbClick', row, column, cell, event)
    },
    /**
     * @description: 清除所有勾选
     * @author: 陈宇环
     */
    clearSelection() {
      this.$refs.tableDom.clearSelection()
    }
  }
}
</script>
