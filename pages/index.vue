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
  />
</template>

<style scoped>

</style>
