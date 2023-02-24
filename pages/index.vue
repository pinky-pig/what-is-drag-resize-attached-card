<script setup lang="ts">
import V3Dragblock from 'v3-dragblock'
import GridCellOne from '../components/GridCellOne.vue'
import GridCellTwo from '../components/GridCellTwo.vue'
// import GridContainer from '~/package/GridContainer.vue'
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
  <V3Dragblock
    :grid-cells="gridCells"
    :draggable="true"
    :resizable="true"
    :adsorbable="true"
    style="height: 60vh;width:80vw;position: relative; border-width: 1px; margin-left: auto; margin-right: auto;"
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
