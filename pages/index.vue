<script setup lang="ts">
enum IMode {
  Drag = 'Drag',
  Rotate = 'Rotate',
  Scale = 'Scale',
}
type ScaleType = 'top' | 'bottom' | 'left' | 'right' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | null

type ModeTypes = keyof typeof IMode
const transformMode: ModeTypes | null = null
const currentScaleType: ScaleType = null
let previousEvent: MouseEvent | null = null
let mouseFrom: { x: number; y: number } = { x: 0, y: 0 }
const dragCanvasRef = ref<HTMLElement | undefined>()
function addMouseEvent() {
  if (dragCanvasRef.value instanceof HTMLElement) {
    dragCanvasRef.value.addEventListener('mousedown', mousedown, false)
    dragCanvasRef.value.addEventListener('mouseup', mouseup, false)
    dragCanvasRef.value.addEventListener('mousemove', mousemove, false)
  }
}
// 1.添加监听事件
onMounted(() => {
  addMouseEvent()
})

const cardOptionArray = ref([
  {
    id: 0,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  {
    id: 1,
    x: 300,
    y: 0,
    width: 100,
    height: 100,
  },
])
function mousedown(e: MouseEvent) {
  mouseFrom = { x: e.clientX, y: e.clientY }
  previousEvent = e
}

function mousemove(e: MouseEvent) {
  previousEvent = null
}
function mouseup(e: MouseEvent) {
  previousEvent = null
}
</script>

<template>
  <div>
    <!-- <Logos mb-6 /> -->
    <!-- <Suspense>
      <PageView />
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
    <InputEntry /> -->

    <DragCanvas>
      <div ref="dragCanvasRef" class="h-60vh w-80vw relative">
        <Card
          v-for="item, index in cardOptionArray"
          :key="item.id"
          v-model="cardOptionArray[index]"
        />
      </div>
    </DragCanvas>
  </div>
</template>
