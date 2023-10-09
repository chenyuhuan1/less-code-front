/**
 * @description [fnDownload 下载文件]
 * @author   zoumiao
 * @param {Object} data [blob数据]
 * @param {String} title [文件名称]
 * @returns   {null}    [没有返回]
 */
export const exportFile = function(data, title) {
  let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', title)
  document.body.appendChild(link)
  link.click()
  return true
}
