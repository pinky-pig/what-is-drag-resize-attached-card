enum IMode {
  Drag = 'Drag',
  Rotate = 'Rotate',
  Resize = 'Resize',
}
type ModeTypes = keyof typeof IMode

type ScaleType = 'top' | 'bottom' | 'left' | 'right' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | null

let transformMode: ModeTypes | null = null
let currentScaleType: ScaleType = null
const DEVIATION = 5
let mouseFrom = { x: 0, y: 0 }
let mouseTo = { x: 0, y: 0 }
export function initGridContainer(
  containerDom: Ref<HTMLElement>,
  gridCells: Ref<{ id: string; x: number; y: number; width: number; height: number }[]>,
  currentClickedElement: Ref<any>,
  adsorbedLine: Ref<{ l: any[]; mv: any[]; r: any[]; t: any[]; mh: any[]; b: any[] }>,
  option: any,
) {
  // 1.绑定鼠标事件
  addMouseEvent()
  function addMouseEvent() {
    containerDom.value.addEventListener('mousedown', mousedown, false)
    containerDom.value.addEventListener('mouseup', mouseup, false)
    containerDom.value.addEventListener('mousemove', mousemove, false)
  }
  function mousedown(e: MouseEvent) {
    mouseFrom = { x: e.clientX, y: e.clientY }
    // 1. 设置模式 drag or scale
    const initElement = document.elementFromPoint(e.clientX, e.clientY)
    if (initElement && initElement?.id.startsWith('bounds_') && currentClickedElement.value) {
      // 进行尺寸改变的点
      if (initElement?.id.endsWith('_scale')) {
        transformMode = 'Resize'
        const tp = initElement?.id?.slice(7).match(/_(.*)_/)
        currentScaleType = tp && tp[1] as ScaleType
      }
      else if (initElement?.id.endsWith('_rotate')) {
        transformMode = 'Rotate'
      }
    }
    else {
      // 点击的是block
      currentClickedElement.value = getCellObjectInStoreFromPosition(mouseFrom)
      if (currentClickedElement.value)
        transformMode = 'Drag'
    }
  }
  function mousemove(e: MouseEvent) {
    mouseTo = { x: e.clientX, y: e.clientY }
    const disX = (mouseTo.x - mouseFrom.x)
    const disY = (mouseTo.y - mouseFrom.y)
    if (mouseFrom.x !== 0 && mouseFrom.y !== 0 && currentClickedElement.value) {
      if (transformMode === 'Drag' && option.draggable) {
        // currentClickedElement.value.x += disX
        // currentClickedElement.value.y += disY
        // mouseFrom = { x: e.clientX, y: e.clientY }

        if (adsorbedLine.value.l.length === 0 && adsorbedLine.value.r.length === 0) {
          currentClickedElement.value.x += disX
          adsorbedLine.value.l = []
          adsorbedLine.value.r = []
          mouseFrom = Object.assign(mouseFrom, { x: e.clientX })
          createAttachedLineForDrag('l')
          createAttachedLineForDrag('r')
        }
        else if (adsorbedLine.value.l.length > 0 && adsorbedLine.value.r.length === 0) {
          const left = adsorbedLine.value.l[0]
          if (
            ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
            || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
            currentClickedElement.value.x += disX
            adsorbedLine.value.l = []
            mouseFrom = Object.assign(mouseFrom, { x: e.clientX })
            createAttachedLineForDrag('l')
          }
        }
        else if (adsorbedLine.value.l.length === 0 && adsorbedLine.value.r.length > 0) {
          const right = adsorbedLine.value.r[0]
          if (
            ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
            || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            currentClickedElement.value.x += disX
            adsorbedLine.value.r = []
            mouseFrom = Object.assign(mouseFrom, { x: e.clientX })
            createAttachedLineForDrag('r')
          }
        }
        else if (adsorbedLine.value.l.length > 0 && adsorbedLine.value.r.length > 0) {
          const left = adsorbedLine.value.l[0]
          if (
            ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
            || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
            currentClickedElement.value.x += disX
            adsorbedLine.value.l = []
            mouseFrom = Object.assign(mouseFrom, { x: e.clientX })
            createAttachedLineForDrag('l')
          }
        }

        if (adsorbedLine.value.t.length === 0 && adsorbedLine.value.b.length === 0) {
          currentClickedElement.value.y += disY
          adsorbedLine.value.t = []
          adsorbedLine.value.b = []
          mouseFrom = Object.assign(mouseFrom, { y: e.clientY })
          createAttachedLineForDrag('t')
          createAttachedLineForDrag('b')
        }
        else if (adsorbedLine.value.t.length > 0 && adsorbedLine.value.b.length === 0) {
          const top = adsorbedLine.value.t[0]
          if (
            ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
            || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
            currentClickedElement.value.y += disY
            adsorbedLine.value.t = []
            mouseFrom = Object.assign(mouseFrom, { y: e.clientY })
            createAttachedLineForDrag('t')
          }
        }
        else if (adsorbedLine.value.t.length === 0 && adsorbedLine.value.b.length > 0) {
          const bottom = adsorbedLine.value.b[0]
          if (
            ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
            || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            currentClickedElement.value.y += disY
            adsorbedLine.value.b = []
            mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForDrag('b')
          }
        }
        else if (adsorbedLine.value.t.length > 0 && adsorbedLine.value.b.length > 0) {
          const bottom = adsorbedLine.value.b[0]
          if (
            ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
            || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            currentClickedElement.value.y += disY
            adsorbedLine.value.b = []
            mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForDrag('b')
          }
        }
      }
      else if (transformMode === 'Resize' && option.resizable) {
        // 😅 开始变形！~
        if (currentScaleType === 'left') {
          if (adsorbedLine.value.l.length === 0) {
            // 说明没有左边线
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX
            adsorbedLine.value.l = []
            mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else {
            // 说明有左边线。因为左边线可能出现在其他元素的左边或者右边，所以有两个判断，加其他元素的宽度
            const left = adsorbedLine.value.l[0]
            if (
              ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
              || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              adsorbedLine.value.l = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'right') {
          if (adsorbedLine.value.r.length === 0) {
            // 说明没有右边线
            currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)
            adsorbedLine.value.r = []
            mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else {
            // 说明有右边线。因为左边线可能出现在其他元素的左边或者右边，所以有两个判断，加其他元素的宽度
            const right = adsorbedLine.value.r[0]
            if (
              ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
              || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
            }
            else {
              currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)
              adsorbedLine.value.r = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'top') {
          if (adsorbedLine.value.t.length === 0) {
            // 说明没有左边线
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            adsorbedLine.value.t = []
            mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else {
            // 说明有左边线。因为左边线可能出现在其他元素的左边或者右边，所以有两个判断，加其他元素的宽度
            const top = adsorbedLine.value.t[0]
            if (
              ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
              || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.y += disY
              currentClickedElement.value.height -= disY
              adsorbedLine.value.t = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'bottom') {
          if (adsorbedLine.value.b.length === 0) {
            // 说明没有右边线
            currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)
            adsorbedLine.value.b = []
            mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else {
            // 说明有右边线。因为左边线可能出现在其他元素的左边或者右边，所以有两个判断，加其他元素的宽度
            const bottom = adsorbedLine.value.b[0]
            if (
              ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
            }
            else {
              currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)
              adsorbedLine.value.b = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'top_left') {
          if (adsorbedLine.value.l.length === 0 && adsorbedLine.value.t.length === 0) {
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            mouseFrom = { x: e.clientX, y: e.clientY }
            adsorbedLine.value.l = []
            adsorbedLine.value.t = []
            createAttachedLineForScale()
          }
          else if (adsorbedLine.value.l.length > 0 && adsorbedLine.value.t.length === 0) {
            // 碰到了左边线
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY

            const left = adsorbedLine.value.l[0]
            if (
              ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
              || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              mouseFrom = Object.assign(mouseFrom, { y: e.clientY })
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              adsorbedLine.value.l = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (adsorbedLine.value.l.length === 0 && adsorbedLine.value.t.length > 0) {
            // 碰到了上边线
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX

            const top = adsorbedLine.value.t[0]
            if (
              ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
              || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              mouseFrom = Object.assign(mouseFrom, { x: e.clientX })
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.y += disY
              currentClickedElement.value.height -= disY
              adsorbedLine.value.t = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (adsorbedLine.value.l.length > 0 && adsorbedLine.value.t.length > 0) {
            // 碰到了两条线
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX

            const left = adsorbedLine.value.l[0]
            if (
              ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
              || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              adsorbedLine.value.l = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }

            const top = adsorbedLine.value.t[0]
            if (
              ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
              || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
            ) {
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.y += disY
              currentClickedElement.value.height -= disY
              adsorbedLine.value.t = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'top_right') {
          if (adsorbedLine.value.r.length === 0 && adsorbedLine.value.t.length === 0) {
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)
            adsorbedLine.value.r = []
            adsorbedLine.value.t = []
            mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else if (adsorbedLine.value.r.length > 0 && adsorbedLine.value.t.length === 0) {
            // 碰到了右边线
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY

            const right = adsorbedLine.value.r[0]
            if (
              ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
              || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
            ) {
              mouseFrom = Object.assign(mouseFrom, { y: e.clientY })
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)
              adsorbedLine.value.r = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (adsorbedLine.value.r.length === 0 && adsorbedLine.value.t.length > 0) {
            currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)

            const top = adsorbedLine.value.t[0]
            if (
              ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
              || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              mouseFrom = Object.assign(mouseFrom, { x: e.clientX })
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.y += disY
              currentClickedElement.value.height -= disY
              adsorbedLine.value.t = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (adsorbedLine.value.r.length > 0 && adsorbedLine.value.t.length > 0) {
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)

            const right = adsorbedLine.value.r[0]
            if (
              ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
              || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
            ) {
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)
              adsorbedLine.value.r = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }

            const top = adsorbedLine.value.t[0]
            if (
              ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
              || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.y += disY
              currentClickedElement.value.height -= disY
              adsorbedLine.value.t = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'bottom_left') {
          if (adsorbedLine.value.l.length === 0 && adsorbedLine.value.b.length === 0) {
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX
            currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)

            adsorbedLine.value.l = []
            adsorbedLine.value.b = []
            mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else if (adsorbedLine.value.l.length > 0 && adsorbedLine.value.b.length === 0) {
            currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)

            const left = adsorbedLine.value.l[0]
            if (
              ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
              || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
            ) {
              mouseFrom = Object.assign(mouseFrom, { y: e.clientY })
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              adsorbedLine.value.l = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (adsorbedLine.value.l.length === 0 && adsorbedLine.value.b.length > 0) {
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX

            const bottom = adsorbedLine.value.b[0]
            if (
              ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              mouseFrom = Object.assign(mouseFrom, { x: e.clientX })
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)
              adsorbedLine.value.b = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (adsorbedLine.value.l.length > 0 && adsorbedLine.value.b.length > 0) {
            currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX

            const left = adsorbedLine.value.l[0]
            if (
              ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
              || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
            ) {
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              adsorbedLine.value.l = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }

            const bottom = adsorbedLine.value.b[0]
            if (
              ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)
              adsorbedLine.value.b = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'bottom_right') {
          if (adsorbedLine.value.r.length === 0 && adsorbedLine.value.b.length === 0) {
            currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)
            currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)
            adsorbedLine.value.b = []
            adsorbedLine.value.r = []
            mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else if (adsorbedLine.value.r.length > 0 && adsorbedLine.value.b.length === 0) {
            currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)

            const right = adsorbedLine.value.r[0]
            if (
              ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
                || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
            ) {
              mouseFrom = Object.assign(mouseFrom, { y: e.clientY })
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)
              adsorbedLine.value.r = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (adsorbedLine.value.r.length === 0 && adsorbedLine.value.b.length > 0) {
            currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)

            const bottom = adsorbedLine.value.b[0]
            if (
              ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              mouseFrom = Object.assign(mouseFrom, { x: e.clientX })
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)
              adsorbedLine.value.b = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (adsorbedLine.value.r.length > 0 && adsorbedLine.value.b.length > 0) {
            currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)
            currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)

            const right = adsorbedLine.value.r[0]
            const bottom = adsorbedLine.value.b[0]
            if (
              ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
                || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
            ) {
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.width += (mouseTo.x - mouseFrom.x)
              adsorbedLine.value.r = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }

            if (
              ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.height += (mouseTo.y - mouseFrom.y)
              adsorbedLine.value.b = []
              mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
      }
    }
  }
  function mouseup(_e: MouseEvent) {
    mouseFrom.x = 0
    mouseFrom.y = 0
    for (const key in adsorbedLine.value)
      adsorbedLine.value[key] = []
  }

  function getCellObjectInStoreFromPosition(position: { x: number; y: number }): Object | null {
    let result = null
    const point = { x: position.x, y: position.y }
    const initElement = document.elementFromPoint(point.x, point.y)
    if (initElement)
      result = gridCells.value.filter(ele => ele.id === initElement.id)

    return result ? result[0] : null
  }

  function createAttachedLineForScale() {
    // 每个块有六条线

    gridCells.value.forEach((cell, index) => {
      if (cell?.id !== currentClickedElement.value?.id) {
        if (currentScaleType === 'left')
          generateLeftLine()
        else if (currentScaleType === 'right')
          generateRightLine()
        else if (currentScaleType === 'top')
          generateTopLine()
        else if (currentScaleType === 'bottom')
          generateBottomLine()
        else if (currentScaleType === 'top_left')
          generateTopLeftLine()
        else if (currentScaleType === 'top_right')
          generateTopRightLine()
        else if (currentScaleType === 'bottom_left')
          generateBottomLeftLine()
        else if (currentScaleType === 'bottom_right')
          generateBottomRightLine()

        function generateLeftLine() {
          if ((Math.abs(cell.x) - DEVIATION) < currentClickedElement.value?.x && currentClickedElement.value?.x < (Math.abs(cell.x) + DEVIATION)) {
            const disX = cell.x - currentClickedElement.value.x
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX
            adsorbedLine.value.l.push({ ...cell, type: 0 })
          }
          // cell的右边
          if (
            (Math.abs(cell.x + cell.width) - DEVIATION) < currentClickedElement.value?.x
            && currentClickedElement.value?.x < (Math.abs(cell.x + cell.width) + DEVIATION)
          ) {
            const disX = cell.x + cell.width - currentClickedElement.value.x
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX
            adsorbedLine.value.l.push({ ...cell, type: 1 })
          }
        }

        function generateRightLine() {
          // cell的左边
          if ((Math.abs(cell.x) - DEVIATION) < (currentClickedElement.value?.x + currentClickedElement.value?.width) && (currentClickedElement.value?.x + currentClickedElement.value?.width) < (Math.abs(cell.x) + DEVIATION)) {
            const disX = cell.x - (currentClickedElement.value.x + currentClickedElement.value.width)
            currentClickedElement.value.width += disX
            adsorbedLine.value.r.push({ ...cell, type: 0 })
          }
          // cell的右边
          if (
            (Math.abs(cell.x + cell.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width)
            && (currentClickedElement.value.x + currentClickedElement.value.width) < (Math.abs(cell.x + cell.width) + DEVIATION)
          ) {
            const disX = (cell.x + cell.width) - (currentClickedElement.value.x + currentClickedElement.value.width)
            currentClickedElement.value.width += disX
            adsorbedLine.value.r.push({ ...cell, type: 1 })
          }
        }

        function generateTopLine() {
          // cell的上边
          if ((Math.abs(cell.y) - DEVIATION) < currentClickedElement.value?.y && currentClickedElement.value?.y < (Math.abs(cell.y) + DEVIATION)) {
            const disY = cell.y - currentClickedElement.value.y
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            adsorbedLine.value.t.push({ ...cell, type: 0 })
          }
          // cell的下边
          if (
            (Math.abs(cell.y + cell.height) - DEVIATION) < currentClickedElement.value?.y
            && currentClickedElement.value?.y < (Math.abs(cell.y + cell.height) + DEVIATION)
          ) {
            const disY = cell.y + cell.height - currentClickedElement.value.y
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            adsorbedLine.value.t.push({ ...cell, type: 1 })
          }
        }

        function generateBottomLine() {
          // 2.当前元素的右吸附线
          // cell的左边
          if ((Math.abs(cell.y) - DEVIATION) < (currentClickedElement.value?.y + currentClickedElement.value?.height) && (currentClickedElement.value?.y + currentClickedElement.value?.height) < (Math.abs(cell.y) + DEVIATION)) {
            const disY = cell.y - (currentClickedElement.value.y + currentClickedElement.value.height)
            currentClickedElement.value.height += disY
            adsorbedLine.value.b.push({ ...cell, type: 0 })
          }
          // cell的右边
          if (
            (Math.abs(cell.y + cell.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height)
            && (currentClickedElement.value.y + currentClickedElement.value.height) < (Math.abs(cell.y + cell.height) + DEVIATION)
          ) {
            const disY = (cell.y + cell.height) - (currentClickedElement.value.y + currentClickedElement.value.height)
            currentClickedElement.value.height += disY
            adsorbedLine.value.b.push({ ...cell, type: 1 })
          }
        }

        function generateTopLeftLine() {
          generateLeftLine()
          generateTopLine()
        }
        function generateTopRightLine() {
          generateTopLine()
          generateRightLine()
        }
        function generateBottomLeftLine() {
          generateBottomLine()
          generateLeftLine()
        }
        function generateBottomRightLine() {
          generateBottomLine()
          generateRightLine()
        }
      }
    })
  }

  function createAttachedLineForDrag(type?: string) {
    gridCells.value.forEach((cell, index) => {
      if (cell?.id !== currentClickedElement.value?.id) {
        if (type === 'l')
          generateLeftLine()
        else if (type === 't')
          generateTopLine()
        else if (type === 'r')
          generateRightLine()
        else if (type === 'b')
          generateBottomLine()

        function generateLeftLine() {
          if ((Math.abs(cell.x) - DEVIATION) < currentClickedElement.value?.x && currentClickedElement.value?.x < (Math.abs(cell.x) + DEVIATION)) {
            const disX = cell.x - currentClickedElement.value.x
            currentClickedElement.value.x += disX
            adsorbedLine.value.l.push({ ...cell, type: 0 })
          }
          if (
            (Math.abs(cell.x + cell.width) - DEVIATION) < currentClickedElement.value?.x
            && currentClickedElement.value?.x < (Math.abs(cell.x + cell.width) + DEVIATION)
          ) {
            const disX = cell.x + cell.width - currentClickedElement.value.x
            currentClickedElement.value.x += disX
            adsorbedLine.value.l.push({ ...cell, type: 1 })
          }
        }
        function generateRightLine() {
          if ((Math.abs(cell.x) - DEVIATION) < (currentClickedElement.value?.x + currentClickedElement.value?.width) && (currentClickedElement.value?.x + currentClickedElement.value?.width) < (Math.abs(cell.x) + DEVIATION)) {
            const disX = cell.x - (currentClickedElement.value.x + currentClickedElement.value.width)
            currentClickedElement.value.x = currentClickedElement.value.x + disX
            adsorbedLine.value.r.push({ ...cell, type: 0 })
          }
          if (
            (Math.abs(cell.x + cell.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width)
            && (currentClickedElement.value.x + currentClickedElement.value.width) < (Math.abs(cell.x + cell.width) + DEVIATION)
          ) {
            const disX = (cell.x + cell.width) - (currentClickedElement.value.x + currentClickedElement.value.width)
            currentClickedElement.value.x = currentClickedElement.value.x + disX
            adsorbedLine.value.r.push({ ...cell, type: 1 })
          }
        }
        function generateTopLine() {
          if ((Math.abs(cell.y) - DEVIATION) < currentClickedElement.value?.y && currentClickedElement.value?.y < (Math.abs(cell.y) + DEVIATION)) {
            const disY = cell.y - currentClickedElement.value.y
            currentClickedElement.value.y += disY
            adsorbedLine.value.t.push({ ...cell, type: 0 })
          }
          if (
            (Math.abs(cell.y + cell.height) - DEVIATION) < currentClickedElement.value?.y
            && currentClickedElement.value?.y < (Math.abs(cell.y + cell.height) + DEVIATION)
          ) {
            const disY = cell.y + cell.height - currentClickedElement.value.y
            currentClickedElement.value.y += disY
            adsorbedLine.value.t.push({ ...cell, type: 1 })
          }
        }
        function generateBottomLine() {
          if ((Math.abs(cell.y) - DEVIATION) < (currentClickedElement.value?.y + currentClickedElement.value?.height) && (currentClickedElement.value?.y + currentClickedElement.value?.height) < (Math.abs(cell.y) + DEVIATION)) {
            const disY = cell.y - (currentClickedElement.value.y + currentClickedElement.value.height)
            currentClickedElement.value.y += disY
            adsorbedLine.value.b.push({ ...cell, type: 0 })
          }
          if (
            (Math.abs(cell.y + cell.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height)
            && (currentClickedElement.value.y + currentClickedElement.value.height) < (Math.abs(cell.y + cell.height) + DEVIATION)
          ) {
            const disY = (cell.y + cell.height) - (currentClickedElement.value.y + currentClickedElement.value.height)
            currentClickedElement.value.y += disY
            adsorbedLine.value.b.push({ ...cell, type: 1 })
          }
        }
      }
    })
  }
}
