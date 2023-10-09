import { exportFile } from 'utils'
export default {
  data() {
    return {
      isNotify: false,
      serverURL: '',
    }
  },
  created() {
    this.serverURL = process.env.API_ROOT + '/api'
  },
  beforeRouteLeave(to, from, next) {
    next()
  },
  methods: {
    $download(params) {
      params.filetype = params.filetype || 'xlsx'
      const date = this.$moment().format('YYYYMMDDHHmmss')
      const title = `${params.title}-${date}.${params.filetype}`
      const ret = exportFile(params.data, title)
      ret && params.callback()
    },
    $error(message, errrCode, duration) {
      if (this.isNotify) {
        return
      }
      this.isNotify = true
      message = message || '未知错误'
      const code = errrCode || ''
      if (code === '102' || code === '103') {
        this.$alert(message, '提示', {
          confirmButtonText: '确定',
          type: 'error',
          callback: () => this.$router.push({ path: '/login' }),
        })
        return
      }
      if (!duration) {
        duration = 4500
      }
      this.$notify({
        title: '提示',
        message: `${message}`,
        position: 'bottom-right',
        type: 'error',
        duration: `${duration}`,
        onClose: () => {
          this.isNotify = false
        },
      })
    },
    $warn(message, duration) {
      if (!duration) {
        duration = 4500
      }
      this.$notify({
        title: '提示',
        message: `${message}`,
        position: 'bottom-right',
        type: 'warning',
        duration: `${duration}`,
      })
    },
    $success(message, duration) {
      if (!duration) {
        duration = 4500
      }
      this.$notify({
        title: '提示',
        message: `${message}`,
        position: 'bottom-right',
        type: 'success',
        duration: `${duration}`,
      })
    },
  },
}
