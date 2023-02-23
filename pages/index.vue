<script setup lang="ts">
import GridContainer from './GridContainer.vue'

const CELLS = [
  {
    id: '0',
    index: 0,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    component: shallowRef(defineAsyncComponent(() => import('./GridCellOne.vue'))),
  },
  {
    id: '1',
    index: 0,
    x: 200,
    y: 0,
    width: 100,
    height: 100,
    component: shallowRef (defineAsyncComponent(() => import('./GridCellTwo.vue'))),
  },
]

const gridCells = ref(CELLS)
</script>

<template>
  <GridContainer
    :grid-cells="gridCells"
    :draggable="true"
    :resizable="true"
    :adsorbable="true"
    class="h-60vh w-80vw relative border mx-auto"
  >
    <component
      :is="item.component"
      v-for="item, index in gridCells"
      :id="`${item.id}`"
      :key="item.id"
      v-model="gridCells[index]"
      class="absolute bg-blue-200 rounded-md flex justify-center items-center text-5xl select-none"
      :style="{
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
      }"
    />
  </GridContainer>
</template>

<style scoped>

</style>
