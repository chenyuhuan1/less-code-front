<template>
  <div class="cfpa-error-page">
    <div class="cfpa-error-img">
      <img src="../../assets/image/4042.png"/>
    </div>
    <div class="cfpa-error-handle">
      <router-link to="/">
        <el-button type="warning" size="large">返回首页</el-button>
      </router-link>
      <el-button class="cfpa-error-btn" type="warning" size="large" @click="fnGoBack">返回上一页</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    fnGoBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.cfpa-error-page{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f3f3f3;
  box-sizing: border-box;
  .cfpa-error-img {
    text-align: center;
  }
  .cfpa-error-handle {
    margin-top: 10px;
    text-align: center;
    .cfpa-error-btn {
      margin-left: 50px;
    }
  }
}
</style>
