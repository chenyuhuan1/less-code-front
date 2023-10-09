<template>
  <div>
    <template v-if="!$store.state.isQiankun">
      <div
        class="tp-container"
        :class="{'container-collapse':collapse, 'tp-container-welcome': menusArr.length === 0}"
      >
        <el-row
          type="flex"
          class="tp-head"
        >
          <a
            href="/"
            title="低代码平台"
            class="logo"
          >
            <div class="cfpa-logo-title">{{ systemName }}</div>
          </a>
          <!-- <div
            class="cfpa-collapse-btn"
            @click="collapseChage"
          >
            <a
              href="javascript: void(0)"
              title="伸缩导航"
            >
              <i
                style="line-height: 70px;"
                class="iconfont"
              >&#xe859;</i>
            </a>
          </div> -->
        </el-row>
        <div class="content">
          <div :class="{sidebar: true, 'el-menu--collapse': collapse}">
            <el-menu
              class="sidebar-el-menu"
              :default-active="'1'"
              background-color="#30364c"
              text-color="#fff"
              active-text-color="#fff"
              :collapse="collapse"
              unique-opened
              router
            >
              <v-Sidebar :menus-arr="menusArr" />
            </el-menu>
          </div>
          <router-view
            id="main"
            ref="main"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>
<script>
import Sidebar from '@/views/common/menu.vue'
import headImage from '@/assets/image/headImage.jpg'

export default {
  components: {
    'v-Sidebar': Sidebar,
  },
  data() {
    return {
      // 新增
      headImage,
      userInfo: {},
      menusArr: [],
      collapse: false,
      systemName: '低代码平台',
      menuList: [],
      homeModuleId: '',
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  async created() {
  },
  methods: {
    collapseChage() {
      this.collapse = !this.collapse
    },
  },
}

</script>
<style lang="scss">
.cfpa-collapse-btn {
  padding: 0 12px;
  cursor: pointer;
  line-height: 70px;
  font-size: 22px;
  color: #fff;
  a {
    color: #fff;
    text-decoration: none;
    .iconfont {
      font-size: 23px;
    }
  }
}
.tp-head {
  background-color: #19233c;
  padding: 0 15px;
  height: 60px;
  .logo {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }
  img  {
    display: block;
    width: 54px;
  }
  .cfpa-logo-title {
    font-size: 22px;
    font-family: 'PingFang SC', "Helvetica Neue", Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
    color: #fff;
    white-space: nowrap;
    text-decoration: none;
  }
}
.content {
  height: calc(100vh - 60px);
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
}
.sidebar {
  width: 200px;
  background-color: rgb(48, 54, 76);
}
#main {
  flex: 1;
  overflow: hidden;
  padding: 15px;
  box-sizing: border-box;
}
</style>
