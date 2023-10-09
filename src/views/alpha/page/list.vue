<!--
 * @Description: 配置列表
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2021-01-06 10:53:17
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-10-08 16:28:08
-->
<template>
  <div class="list">
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
      />
    </div>
    <div class="cfpa-table">
      <div class="mb10">
        <el-button
          type="primary"
          @click="fnAddMethods('add')"
        >
          新增
        </el-button>
      </div>
      <large-table
        :loading="largeTableParams.loading"
        :pagination="largeTableParams.pagination"
        :data="largeTableParams.data"
        :thead="largeTableParams.thead"
        :current-page="largeTableParams.currentPage"
        :page-size="largeTableParams.pageSize"
        :total="largeTableParams.total"
        :height="largeTableParams.tableHeight"
        :fmoney="largeTableParams.fmoney"
        @requestData="fnPaginationChange"
      >
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              class="ml5"
              type="primary"
              plain
              size="mini"
              @click="fnAddMethods('edit', scope.row)"
            >
              编辑
            </el-button>
            <el-button
              class="ml5"
              type="primary"
              plain
              size="mini"
              @click="fnAddMethods('preview', scope.row)"
            >
              预览
            </el-button>
          </template>
        </el-table-column>
      </large-table>
    </div>
    <!-- 编辑弹窗 -->
    <editDialog
      ref="editDialog"
      @reloadList="reloadList"
    />
    <!-- 预览弹窗 -->
    <previewDialog ref="previewDialog" />
  </div>
</template>

<script>
import LargeTable from '@/components/largeTable'
import CfpaForm from '@/components/cfpaForm'
import editDialog from '../components/editDialog'
import previewDialog from '../page/previewDialog'
import { tableList } from '../thead.js'
export default {
  name: 'AlphaTableList',

  components: {
    LargeTable,
    CfpaForm,
    editDialog,
    previewDialog,
  },

  mixins: [],

  props: {},

  data() {
    return {
      searchFormConfig: {
        labelWidth: '100px',
        columns: [],
        disabled: false,
        form: {},
        size: 'mini',
        searchBtn: true,
      },
      largeTableParams: {
        loading: false,
        pagination: true,
        data: [],
        thead: tableList,
        currentPage: 1,
        pageSize: 20,
        total: 0,
        tableHeight: 400,
        fmoney: true,
      },
    }
  },

  computed: {},

  watch: {
  },

  async created() {
    if (document.body.clientHeight > 830) {
      this.largeTableParams.pageSize = 30
    }
    this.fnExpand()
    this.searchFormConfig.columns = this.getSearchColunms(this)
    this.$nextTick(() => {
      this.fnSearch()
    })
  },

  mounted() {},

  destroyed() {},

  methods: {
    fnAddMethods(type, row) {
      if (type === 'preview') {
        this.$refs.previewDialog.show(row)
        return
      }
      if (type === 'edit2') {
        this.$refs.editDialog2.show(type, row)
        return
      }
      this.$refs.editDialog.show(type, row)
    },
    fnExpand() {
      this.$nextTick(function() {
        const height = document.body.clientHeight
        this.largeTableParams.tableHeight =
          height - 160 - this.$refs.searchRef.clientHeight
      })
    },
    getSearchColunms(vm) {
      if (vm.$store.state.isQiankun) {
        return [
          { prop: 'route', label: '路由地址', type: 'input', colNum: 8 },
        ]
      }
      return [
        // { prop: 'system', label: '所属系统', type: 'input', colNum: 8 },
        { prop: 'route', label: '路由地址', type: 'input', colNum: 8 },
      ]
    },
    reloadList() {
      this.fnSearch()
    },
    async fnSearch(data) {
      const vm = this
      if (data) {
        vm.largeTableParams.currentPage = 1
      }
      vm.searchFormConfig.disabled = true
      vm.largeTableParams.loading = true
      try {
        // let api = new AlphaApi()
        // let params = vm.searchFormConfig.form
        // params.page = vm.largeTableParams.currentPage
        // params.size = vm.largeTableParams.pageSize
        // let result = await api.list(params)
        // if (result.isSuccess()) {
        //   vm.largeTableParams.data = result.data.rows
        //   vm.largeTableParams.total = result.data.count
        // } else {
        //   vm.$error(result.message || '配置参数查询失败')
        // }

        const localConfigList = localStorage.getItem('localConfigList') ? JSON.parse(localStorage.getItem('localConfigList')) : []
        vm.largeTableParams.data = localConfigList
        vm.largeTableParams.total = 0

      } catch (err) {
        console.log(err)
      } finally {
        vm.searchFormConfig.disabled = false
        vm.largeTableParams.loading = false
      }
    },
    fnPaginationChange(pageSize, pageIndex) {
      this.largeTableParams.currentPage = pageIndex
      this.largeTableParams.pageSize = pageSize
      this.fnSearch()
    },
  },
}
</script>
<style scoped>
.list {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.cfpa-table {
  flex: 1;
}
.ml5{
  margin-left: 5px;
}
</style>
