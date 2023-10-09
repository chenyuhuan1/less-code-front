<!--
 * @Author: 陈宇环
 * @Date: 2022-05-16 15:57:54
 * @LastEditTime: 2023-04-26 14:51:24
 * @LastEditors: tanpeng
 * @Description: 代码编辑控件
-->
<template>
  <div :class="'codeEditor ' + extendStyle ? 'extendStyle' : ''">
    <textarea
      ref="mycode"
      v-model="textarea"
      class="textarea"
      :placeholder="type === 'JSON' ? '请输出JSON字符串' : ''"
    />
    <!-- <span style="color: red">8{{error}}</span> -->
  </div>
</template>

<script>

import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/material-darker.css'

const CodeMirror = require('codemirror')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/javascript/javascript')
require('codemirror/addon/hint/show-hint')
require('codemirror/keymap/sublime.js')
require('codemirror/addon/selection/active-line.js')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/addon/display/autorefresh.js')

// 支持代码自动补全
import 'codemirror/addon/hint/anyword-hint.js'

export default {
  name: 'CodeEditor',
  components: {},
  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    extendStyle: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: 'material-darker',
    },
  },
  data() {
    return {
      textarea: '',
      error: '',
    }
  },
  computed: {

  },
  watch: {
    value() {
      this.$nextTick(() => {
        const editorValue = this.editorText.getValue()
        if (this.value !== editorValue) {
          this.editorText.setValue(this.value)
        }
        this.editorText.refresh()
      })
    },
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.editorText = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: { name: 'javascript', globalVars: true },
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autoRefresh: true,
        indentUnit: 2, // 缩进单位，默认2
        theme: this.theme,
        extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
        hintOptions: {
          // 自定义提示选项
          tables: {
            users: ['name', 'score', 'birthDate'],
            countries: ['name', 'population', 'size'],
          },
        },
      })
      this.editorText.on('change', (cm) => {
        this.error = ''
        if (this.type === 'JSON') {
          try {
            // 检查是否是josn格式
            JSON.parse(cm.getValue())
          } catch (error) {
            // this.$emit('input', '')
            this.error = 'JSON格式错误'
          }
        }
        this.$emit('input', cm.getValue())
      })

      if (this.value) {
        this.editorText.setValue(this.value)
        this.editorText.refresh()
      }
    })
  },
  methods: {

  },
}
</script>

<style scoped lang="scss">
.extendStyle /deep/ .CodeMirror{
  height: 100%;
}
</style>

