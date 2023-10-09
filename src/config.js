/*
 * @Description:
 * @Autor: tanpeng
 * @Date: 2021-07-22 10:50:10
 * @LastEditors: 陈宇环
 * @LastEditTime: 2023-10-08 17:10:39
 */
const config = {
  //  时间参数(s)
  timer: {
    // 等待后台交易超时时间
    connTimeout: 120,
  },
  // 是否开启mock
  mock: false,
  accept: {
    // 制度文件上传格式
    fileUploadType: [
      'bmp',
      'BMP',
      'gif',
      'GIF',
      'png',
      'PNG',
      'jpeg',
      'JPEG',
      'jpg',
      'JPG',
      'html',
      'htm',
      'txt',
      'csv',
      'vsd',
      'vsdx',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'xlsm',
      'ppt',
      'pptx',
      'xml',
      'pdf',
      'pdx',
      'rar',
      'zip',
      'wps',
      'ai',
      'ttf',
      'eps',
      'mp4',
      'ps',
      'cdr',
      'de',
      'psd',
      'tiff',
      'indd',
      'fla',
    ],
    // 制度文件在线预览格式
    fileLookType: ['doc', 'docx', 'xls', 'xlsx', 'xlsm', 'ppt', 'pptx'],
    // 简报编辑上传图片格式
    image: ['bmp', 'BMP', 'gif', 'GIF', 'png', 'PNG', 'jpeg', 'JPEG', 'jpg', 'JPG'],
    // 简报编辑上传视频格式
    video: ['mp4'],
    // 上传音频格式
    audio: ['wav'],
  },
  downloadType: ['bmp', 'BMP', 'gif', 'GIF', 'png', 'PNG', 'jpeg', 'JPEG', 'jpg', 'JPG', 'txt', 'pdf', 'pdx', 'mp4'],
}

export default config
