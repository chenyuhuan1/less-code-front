<!--
 * @Description: 配置预览弹窗组件
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2021-01-06 10:56:47
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-09-11 13:57:56
-->
<template>
  <el-dialog
    title="预览页面"
    :visible.sync="visible"
    :close-on-click-modal="false"
    fullscreen
  >
    <preview :config-info="config" />
  </el-dialog>
</template>

<script>
import preview from '../components/preview.vue'
import AlphaApi from '@/api/business/Alpha.js'
export default {
  name: 'AuditReport',

  components: {
    preview,
  },

  mixins: [],

  props: {},

  data() {
    return {
      visible: false,
      config: null,
    }
  },

  computed: {},

  watch: {
  },

  async created() {

  },

  mounted() {},

  destroyed() {},

  methods: {
    async show(row) {
      // this.config = await this.fnConfigDetail(row.route, row.system, row.version)
      setTimeout(() => {  // 模拟接口获取
        const localConfigList = localStorage.getItem('localConfigList') ? JSON.parse(localStorage.getItem('localConfigList')) : []
        const result = localConfigList.find((item) => item.id === row.id)
        this.config = result
      }, 300)
      this.visible = true
    },
    // 获取配置详情
    fnConfigDetail(routeName, system, version) {
      // let vm = this
      return new Promise(async(resolve, reject) => {
        try {
          const data = { routeName, system, version }
          const api = new AlphaApi()
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
  },
}
</script>
