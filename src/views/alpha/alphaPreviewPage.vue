<!--
 * @Author: 陈宇环
 * @Date: 2021-07-14 09:53:08
 * @LastEditTime: 2023-09-11 15:09:31
 * @LastEditors: 陈宇环
 * @Description: 预览页面
-->
<template>
  <div
    v-loading="loading"
    class="alphaPreviewPage"
  >
    <preview
      :config-info="config"
      :route-params="$route.query"
    />
  </div>
</template>

<script>
import preview from './components/preview.vue'
import AlphaApi from '@/api/business/Alpha.js'
export default {
  name: 'AlphaPreviewPage',
  beforeRouteEnter(to, from, next) {
    next()
  },
  async beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 对于一个带有动态参数的路径 /good/:id，在 /good/1 和 /good/2 之间跳转的时候，
    // 由于会渲染同样的good组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.config = await this.fnConfigDetail(to.params.routerName)
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    if (to.path.indexOf('/publish/publish/') > -1) {
      next(to.path.replace('/publish/', ''))
    } else {
      next()
    }
  },
  components: { preview },
  data() {
    return {
      config: null,
      loading: false,
    }
  },
  computed: {

  },
  async created() {
    // this.config = await this.fnConfigDetail(this.$route.params.routerName)
    setTimeout(() => {  // 模拟接口获取
      const localConfigList = localStorage.getItem('localConfigList') ? JSON.parse(localStorage.getItem('localConfigList')) : []
      const result = localConfigList.find((item) => item.routerName === this.$route.params.routerName)
      this.config = result
    }, 300)
  },
  async mounted() {

  },
  methods: {
    // 获取配置详情
    // fnConfigDetail(routeName) {
    //   // let vm = this
    //   this.loading = true
    //   return new Promise(async(resolve, reject) => {
    //     try {
    //       const data = { routeName, version: 'online' }
    //       const api = new AlphaApi()
    //       const result = await api.detail(data)
    //       if (result.isSuccess()) {
    //         resolve(result.data)
    //       } else {
    //         resolve({})
    //       }
    //     } catch (err) {
    //       resolve({})
    //     } finally {
    //       this.loading = false
    //     }
    //   })
    // },
  },
}
</script>

<style scoped lang="scss">

</style>
