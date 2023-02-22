<script setup lang="ts">
import { initGridContainer } from './GridContainer'
import BoundsSVGContainer from './BoundsSVGContainer.vue'

const gridCells = inject('gridCells') as Ref<{ id: string; x: number; y: number; width: number; height: number }[]>

const attachedLine: Ref<{ l: any[]; mv: any[];r: any[];t: any[];mh: any[];b: any[] } > = ref({ l: [], mv: [], r: [], t: [], mh: [], b: [] })
const currentClickedElement: Ref<any> = ref()
// 1.初始化盒子，给盒子添加鼠标点击事件
const gridContainerRef = ref()
onMounted(() => {
  initGridContainer(gridContainerRef, gridCells, currentClickedElement, attachedLine)
})
</script>

<template>
  <div ref="gridContainerRef">
    <slot />
    <BoundsSVGContainer v-model="currentClickedElement" :current-clicked-element="currentClickedElement" :attached-line="attachedLine" />
  </div>
</template>
