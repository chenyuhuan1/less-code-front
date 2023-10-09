/**
 * @description [文件批量下载]
 * @author   zoumiao
 * @param {String} sUrl [下载地址]
 * @returns {Boolean} [返回true或者false]
 */
export const downloadFile = function(sUrl) {
  if (/(iP)/g.test(navigator.userAgent)) {
    alert('Your device does not support files downloading. Please try again in desktop browser.')
    return false
  }
  let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1
  let isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1
  if (isChrome || isSafari) {
    var link = document.createElement('a')
    link.href = sUrl
    link.target = '_blank'
    if (link.download !== undefined) {
      var fileName = decodeURI(sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length).split('?')[0])
      link.download = fileName
    }
    if (document.createEvent) {
      var e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      link.dispatchEvent(e)
      return true
    }
  }
  if (sUrl.indexOf('?') === -1) {
    sUrl += '?download'
  }
  console.log('sUrl', sUrl)
  window.open(sUrl, '_blank')
  return true
}
