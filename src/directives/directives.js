
const install = (Vue) => {
  // 文本内容保留换行
  Vue.directive('formatText', {
    bind(el, binding) {
      const { value } = binding
      if (value) {
        const formatText = value.replace(/\n+/g, '<br/>')
        el.innerHTML = formatText
      }
    },
  })
}

export default install
