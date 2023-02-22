<script setup lang="ts">
import GridContainer from './GridContainer.vue'

const gridCells = ref([
  { id: '0', index: 0, x: 0, y: 0, width: 100, height: 100 },
  { id: '1', index: 1, x: 300, y: 0, width: 100, height: 100 },
])
provide('gridCells', gridCells)
</script>

<template>
  <GridContainer :grid-cells="gridCells" class="h-60vh w-80vw relative border mx-auto">
    <Card
      v-for="item, index in gridCells"
      :id="`${item.id}`"
      :key="item.id"
      v-model="gridCells[index]"
      :class="`card-item_${item.id}`"
    />
  </GridContainer>
</template>

<style scoped>

</style>
