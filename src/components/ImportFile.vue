<!--
 * @Description: 上传文件获取文件二级制流
 * @Author: 陈宇环
 * @Date: 2022-04-13 20:50:24
 * @LastEditTime: 2022-04-14 15:42:07
 * @LastEditors: 陈宇环
 * @Description:
-->
<template>
  <div>
    <el-upload
      class="upload-demo"
      action=""
      :limit="1"
      :multiple="false"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :auto-upload="false"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      // type: [Object, String],
      // required: true
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  watch: {
  },
  created() {
    console.log(88, this.config)
  },
  methods: {
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.fileList.push(file)
      this.$emit('input', file.raw)
    },
    handleExceed() {
      this.$message.warning('最多上传一个文件')
    }
  }
}
</script>
<style lang="scss" scope>
</style>
