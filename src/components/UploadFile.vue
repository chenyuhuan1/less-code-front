<!--
 * @Description: 上传附件组件
 * @Version: 2.0
 * @Autor: tanpeng
 * @Date: 2020-12-27 14:32:16
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-10-08 17:12:45
-->
<template>
  <div>
    <el-upload
      v-if="!config.isView"
      ref="upload"
      drag
      action="#"
      :auto-upload="false"
      :on-remove="handleRemove"
      :show-file-list="false"
      :on-change="handleChange"
      :disabled="config.disabled"
      :multiple="config.multiple ? config.multiple : false"
      :class="{'el-icon-upload-dis': config.disabled}"
    >
      <i class="el-icon-upload" />
      <div
        class="el-upload__text"
        style="margin-bottom: 10px;"
      >
        将文件拖到此处，或
        <em>点击上传</em>，上传文件大小不超过{{ config.size }}M
      </div>
      <div
        v-if="config.tips"
        slot="tip"
        class="el-upload__tip"
      />
    </el-upload>
    <div
      v-if="config.fileList.length > 0"
      style="margin-top: 10px;"
    >
      <template v-for="(item, index) in config.fileList">
        <div
          v-if="isImg(item.fileName)"
          :key="item.id"
          class="img-box"
        >
          <el-image
            :src="item[config.previewKey]"
            fit="contain"
            :preview-src-list="srcList"
            :z-index="9999"
          />
          <span
            v-if="!config.disabled"
            class="closeBtn"
            @click="fnDeleteFile(index, true)"
          ><i class="el-icon-close" /></span>
          <!-- <el-button type="danger" size="mini" class="closeBtn" icon="el-icon-close" round @click="fnDeleteFile(index, true)"></el-button> -->
        </div>
        <div
          v-else
          :key="item.id"
          class="except-img"
        >
          <a
            :href="item[config.previewKey]"
            target="_blank"
          >{{
            item.fileName
          }}</a>
          <span
            v-if="!config.disabled"
            class="closeBtn"
            @click="fnDeleteFile(index, false)"
          ><i class="el-icon-close" /></span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import instance from '@/api/index.js'
import config from '@/config'
export default {
  props: {
    // 图片上传成功后返回的oss取值参数previewUrl, fileList, srcList
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      srcList: [],
    }
  },
  watch: {
    'config.fileList': {
      handler(val) {
        this.fnGetSrcList()
      },
      immediate: true,
    },
  },
  created() {
    const vm = this
    vm.changeUploadConfig()
    this.fnGetSrcList()
  },
  methods: {
    changeUploadConfig() {
      const vm = this
      console.log('vm.config', vm.config)
      vm.config.previewKey = vm.config.previewKey || 'previewUrl'
      vm.config.ossFolder = vm.config.ossFolder || 'DEFAULT-OSS-FOLDER'
      vm.config.fileList = vm.config.fileList || [] // 上传数据
      vm.config.accept = vm.config.accept ? vm.config.accept.split(',') : config.accept.fileUploadType // 上传文件类，默认图片，表格等文件类型
      vm.config.size = vm.config.size || 15 // 上传文件大小
    },
    fnGetSrcList() {
      const vm = this
      // vm.config.fileList.forEach(v => {
      //   if (vm.isImg(v.fileName)) {
      //     vm.srcList.push(v.previewUrl)
      //   }
      // })
      vm.srcList = vm.config.fileList.filter((item) => vm.isImg(item.fileName)).map((item) => item.previewUrl)
    },
    fnDeleteFile(index, isImg) {
      const vm = this
      // 是图片
      if (isImg) {
        const currentUrl = vm.config.fileList[index][vm.config.previewKey]
        vm.srcList = vm.srcList.filter((v) => v !== currentUrl)
        vm.config.fileList.splice(index, 1)
      } else {
        vm.config.fileList.splice(index, 1)
      }
    },
    isImg(name) {
      if (!name) {
        return false
      }
      if (name.indexOf('.') > -1) {
        const type = name.split('.')[1]
        if (config.accept.image.indexOf(type) > -1) {
          return true
        }
        return false
      }
      return false
    },
    async fnUploadFile(file) {
      const vm = this
      if (!vm.beforeUpload(file)) {
        return
      }
      try {
        const params = { ossFolder: vm.config.ossFolder, file }
        const result = await instance[vm.config.interfaceType](vm.config.interface, this.config.paramsType === 'query' ? params : { params })
        if (result.success) {
          // 财务系统的处理方式，其他系统的处理得区分
          vm.config.fileList = vm.config.fileList.concat(result.data)
          vm.config.fileList &&
            vm.config.fileList.forEach((v) => {
              if (vm.isImg(v.fileName)) {
                vm.srcList.push(v[vm.config.previewKey])
              }
            })
        } else {
          vm.$error(result.message, result.code)
        }
      } catch (err) {
        vm.$error('上传附件失败!')
      }
    },
    handleChange(file, fileList) {
      this.fnUploadFile(file)
    },
    beforeUpload(file) {
      const vm = this
      const fileName = file.name
      const allowType = vm.config.accept
      console.log('vm.config.accept', vm.config.accept)
      // 获取文件后缀名
      const fileTypename = fileName.substring(
        fileName.lastIndexOf('.') + 1,
        fileName.length,
      )
      const isUpload = allowType.find(type => type === fileTypename)
      if (!isUpload) {
        vm.$alert(`上传文件格式不能为.${fileTypename}`, '提示', {
          confirmButtonText: '确定',
          type: 'error',
          callback: (action) => {},
        })
        return false
      }
      const isLtSize = file.size / 1024 / 1024 < vm.config.size
      if (!isLtSize) {
        vm.$alert(`上传文件大小不能超过 ${vm.config.size}MB!`, '提示', {
          confirmButtonText: '确定',
          type: 'error',
          callback: (action) => {},
        })
        return false
      }
      return true
    },
    // 上传文件删除
    handleRemove(file, fileList) {
      this.$refs.upload.clearFiles()
      this.config.fileList = []
    },
  },
}
</script>
<style lang="scss" scope>
/deep/ .el-list-enter-active,
/deep/ .el-list-leave-active {
  transition: none;
}

/deep/ .el-list-enter,
/deep/ .el-list-leave-active {
  opacity: 0;
}
/deep/ .el-upload-list {
  height: 40px;
}
.el-icon-upload-dis, .el-icon-upload-dis .el-upload, .el-icon-upload-dis .el-upload--picture-card, .el-icon-upload-dis .el-upload-dragger {
  cursor: not-allowed;
}
.el-icon-upload-dis .el-upload-dragger {
  border-color:#d9d9d9 !important;
}
.img-box {
  width: 100px;
  height: 100px;
  display: inline-block;
  vertical-align: top;
  margin-right: 10px;
  position: relative;
  overflow: hidden;
}
.except-img {
  width: 80px;
  height: 80px;
  position: relative;
  background: #f3f3f3;
  display: inline-block;
  vertical-align: top;
  padding: 10px;
  overflow: hidden;
  margin-right: 10px;
  line-height: 1.5;
}
.closeBtn {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 9999;
  border-radius: 50%;
  background: rgba($color: #fff, $alpha: 1);
  color: red;
  .el-icon-close {
    display: block;
    font-size: 12px;
  }
}
</style>
