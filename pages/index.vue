<script setup lang="ts">
import V3Dragblock from 'v3-dragblock'
import GridCellOne from '../components/GridCellOne.vue'
import GridCellTwo from '../components/GridCellTwo.vue'
import GridCellThree from '../components/GridCellThree.vue'
import GridCellFour from '../components/GridCellFour.vue'
// import GridContainer from '~/package/GridContainer.vue'
// shallowRef(defineAsyncComponent(() => import('./GridCellOne.vue')))

const CELLS = [
  { id: '0', index: 0, x: 80, y: 310, width: 180, height: 230, component: markRaw(GridCellOne) },
  { id: '1', index: 0, x: 550, y: 95, width: 240, height: 240, component: markRaw(GridCellTwo) },
  { id: '2', index: 0, x: 377, y: 457, width: 305, height: 70, component: markRaw(GridCellThree) },
  { id: '3', index: 0, x: 180, y: 30, width: 130, height: 145, component: markRaw(GridCellFour) },
]

const gridCells = ref(CELLS)
const print = (val: string, e: any) => {
  if (val === 'drag-end' || val === 'resize-end')
    window.localStorage.setItem('layoutJSON', JSON.stringify(e))
}

const color = useColorMode()
</script>

<template>
  <div :class="color.preference === 'dark' ? 'dark' : 'light'" class="drag-canvas">
    <div class="drag-canvas-bottom">
      <V3Dragblock
        class="V3Dragblock"
        :grid-cells="gridCells"
        :draggable="true"
        :resizable="true"
        :adsorbable="true"
        @dragging="print('dragging', $event)"
        @drag-start="print('drag-start', $event)"
        @drag-end="print('drag-end', $event)"
        @resizing="print('resizing', $event)"
        @resize-start="print('resize-start', $event)"
        @resize-end="print('resize-end', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.drag-canvas.light{
  --button_radius: 0.75em;
}
.drag-canvas.dark{
  --button_radius: 0.75em;
}
.drag-canvas {
  font-size: 17px;
  font-weight: bold;
  border: none;
  border-radius: 0.75em;
  /* background: black; */
  display: inline-flex;
}
.drag-canvas-bottom {
  border-radius: 0.75em;
  padding: 10px;
  background: var(--primary-background);
}

.V3Dragblock{
  background: #f7f4f0;
  width: 75vw;
  height: 75vh;
  border-radius: 10px;
  border-width: 1px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
}
</style>
