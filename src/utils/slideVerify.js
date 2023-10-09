import { EventBus } from './eventBus.js'
export const SlideVerify = function() {
  const slideVerify = document.getElementById('slideVerify')
  const newImage = slideVerify.getElementsByClassName('newImage')[0] // 图片小块
  const box = slideVerify.getElementsByClassName('drag')[0]
  const bg = slideVerify.getElementsByClassName('bg')[0]
  const text = slideVerify.getElementsByClassName('text')[0]
  const btn = slideVerify.getElementsByClassName('btn')[0]
  let offsetX // 鼠标滑动距离
  const sildeWidth = box.offsetWidth - btn.offsetWidth
  // 二、给滑块注册鼠标按下事件
  btn.onmousedown = function(e) {
    // 1.鼠标按下之前必须清除掉后面设置的过渡属性
    btn.style.transition = ''
    bg.style.transition = ''
    btn.style.backgroundColor = '#66b1ff'
    btn.style.color = '#fff'
    // 说明：clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。
    // 2.当滑块位于初始位置时，得到鼠标按下时的水平位置
    e = e || window.event
    const downX = e.clientX
    // 三、给文档注册鼠标移动事件
    document.onmousemove = function(e) {
      e = e || window.event
      // 1.获取鼠标移动后的水平位置
      const moveX = e.clientX
      // 2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
      offsetX = moveX - downX
      // 3.在这里判断一下：鼠标水平移动的距离与滑动成功的距离之间的关系
      if (offsetX > sildeWidth) {
        offsetX = sildeWidth// 如果滑过了终点，就将它停留在终点位置
      } else if (offsetX < 0) {
        offsetX = 0// 如果滑到了起点的左侧，就将它重置为起点位置
      }
      // 4.根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
      btn.style.left = offsetX + 'px'
      bg.style.width = (offsetX + 55) + 'px'
      bg.style.borderColor = '#66b1ff'
      newImage.style.left = offsetX + 'px'
      text.innerHTML = ''
    }

    // 四、给文档注册鼠标松开事件
    document.onmouseup = function(e) {
      // 如果鼠标的水平移动距离 = 滑动成功的宽度
      EventBus.$emit('slideVerify', offsetX)
    }
  }
  const validSuccess = function() {
    // 1.设置滑动成功后的样式
    btn.style.backgroundColor = '#52ccba'
    bg.style.backgroundColor = '#d2f4ef'
    bg.style.borderColor = '#52ccba'
    text.innerHTML = '登录中...'
    text.style.color = '#333'
    bg.style.width = (sildeWidth + 40) + 'px'
    btn.style.left = sildeWidth + 'px'
    // 成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
    btn.onmousedown = null
    document.onmousemove = null
    document.onmouseup = null
  }
  const validFailure = function() {
    bg.style.borderColor = 'transparent'
    bg.style.backgroundColor = '#d1e9fe'
    btn.style.backgroundColor = '#fff'
    btn.style.color = '#333'
    newImage.style.left = 0
    btn.style.left = 0
    bg.style.width = 0
    text.innerHTML = '向右拖动滑块填充拼图登录'
    text.style.color = '#333'
    // 只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件。
    document.onmousemove = null
    document.onmouseup = null
  }
  return { validSuccess, validFailure }
}
