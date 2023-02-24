<script setup lang="ts">
import GridCellOne from './GridCellOne.vue'
import GridCellTwo from './GridCellTwo.vue'
import GridContainer from '~/package/GridContainer.vue'

// shallowRef(defineAsyncComponent(() => import('./GridCellOne.vue')))
const CELLS = [
  {
    id: '0',
    index: 0,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    component: markRaw(GridCellOne),
  },
  {
    id: '1',
    index: 0,
    x: 200,
    y: 0,
    width: 100,
    height: 100,
    component: markRaw(GridCellTwo),
  },
]

const gridCells = ref(CELLS)

const print = (val: string, e: any) => {
  // eslint-disable-next-line no-console
  console.log(val, e)
}
</script>

<template>
  <GridContainer
    :grid-cells="gridCells"
    :draggable="true"
    :resizable="true"
    :adsorbable="true"
    class="h-60vh w-80vw relative border mx-auto"
    @dragging="print('dragging', $event)"
    @drag-start="print('drag-start', $event)"
    @drag-end="print('drag-end', $event)"
    @resizing="print('resizing', $event)"
    @resize-start="print('resize-start', $event)"
    @resize-end="print('resize-end', $event)"
  />
</template>

<style scoped>

</style>
