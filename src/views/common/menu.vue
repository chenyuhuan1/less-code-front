<template>
  <div>
    <template v-for="userMenu in menusArr">
      <el-menu-item
        :key="userMenu.path"
        :index="userMenu.path"
        :route="'/' + userMenu.path"
      >
        <!-- <i
          :class="[iconfont, userMenu.item.moduleIcon]"
          style="font-size: 18px;padding-right: 10px; color: #fff;"
        /> -->
        <span slot="title"> {{ userMenu.name }}</span>
      </el-menu-item>
      <el-submenu
        v-if="userMenu.children && userMenu.children.length > 0"
        :key="userMenu.path"
        :index="userMenu.path"
      >
        <template slot="title">
          <span slot="title"> {{ userMenu.name }}</span>
        </template>
        <userMenu :menus-arr="userMenu.children" />
      </el-submenu>
    </template>
  </div>
</template>
<script>
import router from '@/router/index'
export default {
  name: 'UserMenu',
  props: [],
  data() {
    return {
      menusArr: router.routes[0].children,
    }
  },
  created() {
  },
  methods: {
  },
}

</script>
