<script setup lang="ts">
import V3Dragblock from 'v3-dragblock'
import GridCellOne from '../components/GridCellOne.vue'
import GridCellTwo from '../components/GridCellTwo.vue'
import GridCellThree from '../components/GridCellThree.vue'
import GridCellFour from '../components/GridCellFour.vue'
// import GridContainer from '~/package/GridContainer.vue'
// shallowRef(defineAsyncComponent(() => import('./GridCellOne.vue')))
const CELLS = [
  { id: '0', index: 0, x: 50, y: 0, width: 100, height: 200, component: markRaw(GridCellOne) },
  { id: '1', index: 0, x: 300, y: 200, width: 150, height: 150, component: markRaw(GridCellTwo) },
  { id: '2', index: 0, x: 400, y: 400, width: 200, height: 80, component: markRaw(GridCellThree) },
  { id: '3', index: 0, x: 50, y: 400, width: 100, height: 100, component: markRaw(GridCellFour) },
]

const gridCells = ref(CELLS)

const print = (val: string, e: any) => {
  // console.log(val, e)
}
const color = useColorMode()
</script>

<template>
  <div :class="color.preference === 'dark' ? 'dark' : 'light'" class="drag-canvas">
    <div class="drag-canvas-bottom">
      <!-- <div class="w-800px h-500px bg-red-100" /> -->
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
  <!-- <V3Dragblock
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
  /> -->
</template>

<style scoped>
.drag-canvas.light{
  --button_radius: 0.75em;
  --button_color: #fffefc;
  --button_outline_color: #000000;
}
.drag-canvas.dark{
  --button_radius: 0.75em;
  --button_color: #474747;
  --button_outline_color: #fffefc;
}
.drag-canvas {
 font-size: 17px;
 font-weight: bold;
 border: none;
 border-radius: var(--button_radius);
 background: var(--button_outline_color);
 display: inline-flex;
}
.drag-canvas-bottom {
 display: block;
 box-sizing: border-box;
 border: 2px solid var(--button_outline_color);
 border-radius: var(--button_radius);
 padding: 10px;
 background: var(--button_color);
 color: var(--button_outline_color);
 transform: translateY(-0.2em);
 transition: transform 0.1s ease;
}

.V3Dragblock{
  width: 80vw;
  height: 70vh;
  border-radius: 10px;
  border-width: 1px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
}
</style>
