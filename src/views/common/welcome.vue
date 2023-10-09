<!--
 * @Description:
 * @Autor: tanpeng
 * @Date: 2021-02-24 15:50:26
 * @LastEditors: tanpeng
 * @LastEditTime: 2021-07-22 14:05:47
-->
<template>
  <div class="cfpa-dashboard">
    <div class="cfpa-dashboard-contain">
      <img
        width="400"
        class="mb20"
        src="images/no-code.jpg"
      >
      <div class="cfpa-dashboard-title">
        WELCOME
      </div>
      <div class="cfpa-dashboard-text">
        欢迎进入低代码平台
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
}
</script>
<style lang="scss" scoped>
.cfpa-dashboard {
  background-color: #fff;
  height: 100%;
  width: 100%;
  padding: 5% 0;
  .cfpa-dashboard-contain {
    text-align: center;
    .cfpa-dashboard-title {
      font-size: 25px;
      padding-bottom: 10px;
      font-family: Georgia, serif;
      letter-spacing:2px;
    }
    .cfpa-dashboard-text {
      font-size: 16px;
    }
  }
}
</style>
