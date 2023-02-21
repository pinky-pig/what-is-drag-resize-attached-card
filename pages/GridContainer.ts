enum IMode {
  Drag = 'Drag',
  Rotate = 'Rotate',
  Scale = 'Scale',
}
type ModeTypes = keyof typeof IMode

type ScaleType = 'top' | 'bottom' | 'left' | 'right' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | null

let transformMode: ModeTypes | null = null
let currentScaleType: ScaleType = null

let mouseFrom = { x: 0, y: 0 }
let mouseTo = { x: 0, y: 0 }
export function initGridContainer(
  containerDom: Ref<HTMLElement>,
  gridCells: Ref<{ id: string; x: number; y: number; width: number; height: number }[]>,
  currentClickedElement: Ref<any>,
  attachedLine: Ref<{ l: any[]; mv: any[];r: any[];t: any[];mh: any[];b: any[] }>,
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
        transformMode = 'Scale'
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
    if (mouseFrom.x !== 0 && mouseFrom.y !== 0 && currentClickedElement.value) {
      if (transformMode === 'Drag') {
        const disX = (mouseTo.x - mouseFrom.x)
        const disY = (mouseTo.y - mouseFrom.y)
        currentClickedElement.value.x += disX
        currentClickedElement.value.y += disY
        mouseFrom = { x: e.clientX, y: e.clientY }
      }
    }
  }
  function mouseup(_e: MouseEvent) {
    currentClickedElement.value = null
  }

  function getCellObjectInStoreFromPosition(position: { x: number; y: number }): Object | null {
    let result = null
    const point = { x: position.x, y: position.y }
    const initElement = document.elementFromPoint(point.x, point.y)
    if (initElement)
      result = gridCells.value.filter(ele => ele.id === initElement.id)

    return result ? result[0] : null
  }
}
