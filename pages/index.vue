<script setup lang="ts">
import { initGridContainer } from './GridContainer'
enum IMode {
  Drag = 'Drag',
  Rotate = 'Rotate',
  Scale = 'Scale',
}
type ScaleType = 'top' | 'bottom' | 'left' | 'right' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | null

type ModeTypes = keyof typeof IMode

const gridCells = ref(
  [
    {
      id: '0',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    {
      id: '1',
      x: 300,
      y: 0,
      width: 100,
      height: 100,
    },
  ],

)

const attachedLine: Ref<{ l: any[]; mv: any[];r: any[];t: any[];mh: any[];b: any[] } > = ref({ l: [], mv: [], r: [], t: [], mh: [], b: [] })
const currentClickedElement: Ref<any> = ref()
// 1.初始化盒子，给盒子添加鼠标点击事件
const gridContainerRef = ref()
onMounted(() => {
  initGridContainer(gridContainerRef, gridCells, currentClickedElement, attachedLine)
})
</script>

<template>
  <div>
    <!-- <DragCanvas> -->
    <div ref="gridContainerRef" class="h-60vh w-80vw relative border mx-auto">
      <Card
        v-for="item, index in gridCells"
        :id="`${item.id}`"
        :key="item.id"
        v-model="gridCells[index]"
        :class="`card-item_${item.id}`"
      />
    </div>
    <!-- </DragCanvas> -->
  </div>
</template>
