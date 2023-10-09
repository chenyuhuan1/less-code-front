<!--
 * @Author: 陈宇环
 * @Date: 2022-05-26 11:23:02
 * @LastEditTime: 2023-10-08 17:14:16
 * @LastEditors: 陈宇环
 * @Description: 联动函数实例
-->
<template>
  <div class="gangedFunExamples">
    <div><i class="el-icon-warning-outline" /> 示例联动函数：</div>
    <el-popover
      placement="top"
      trigger="click"
    >
      <pre>
  function cb(value) {
    if(value === '男'){
      return true
    }else {
      return false
    }
  }
      </pre>
      <el-button
        slot="reference"
        style="margin: 5px"
      >
        修改字段显示隐藏状态、字段禁用启用状态、字段必填状态、字段值-同步实例
      </el-button>
    </el-popover>
    <el-popover
      placement="top"
      trigger="click"
    >
      <pre>
  function cb(value, api) {
    return new Promise(async (resolve)=> {
      let result = await api.post(
        '/internal/trade/dept/config/query/data',
        {paramsStr: value}
      )
      if(result.isSuccess()) {
        resolve(result.data)
      } else {
        resolve(false)
      }
    })
  }
      </pre>
      <el-button
        slot="reference"
        style="margin: 5px"
      >
        修改字段显示隐藏状态、字段禁用启用状态、字段必填状态、字段值-异步实例
      </el-button>
    </el-popover>
    <el-popover
      placement="top"
      trigger="click"
    >
      <pre>
  function cb(value) {
    if(value === '1'){
      return [{label:'张三',value: 'zs'},{label:'李四',value: 'ls'}]
    }else {
      return [{label:'张三2',value: 'zs2'},{label:'李四2',value: 'ls2'}]
    }
  }
      </pre>
      <el-button
        slot="reference"
        style="margin: 5px"
      >
        修改下拉选项-同步实例
      </el-button>
    </el-popover>
    <el-popover
      placement="top"
      trigger="click"
    >
      <pre>
  function cb(value, api) {
    return new Promise(async (resolve)=> {
      let result = await api.post(
        'https://***list',
        {
          authData: false,
          number: 1,
          pageSize: 1000,
          status: 1
        }
      )
      if(result && result.success) {
        resolve(result.data.records.map(item=>{
          return {
            label: item.name,
            value: item.code
          }
        }))
      } else {
        resolve([])
      }
    })
  }
      </pre>
      <el-button
        slot="reference"
        style="margin: 5px"
      >
        修改下拉选项-异步实例
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'GangedFunExamples',
  components: {},
  data() {
    return {

    }
  },
  computed: {

  },
  created() {

  },
  methods: {

  },
}
</script>

<style scoped lang="scss">
</style>

