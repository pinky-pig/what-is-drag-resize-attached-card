<script setup lang="ts">
const props = defineProps({
  modelValue: {
    default: {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
    },
  },
})
const emit = defineEmits(['update:modelValue'])
// emit('update:modelValue', [key])
</script>

<template>
  <div
    class="absolute bg-red-50 rounded-md"
    :style="{
      left: `${props.modelValue.x}px`,
      top: `${props.modelValue.y}px`,
      width: `${props.modelValue.width}px`,
      height: `${props.modelValue.height}px`,
    }"
  >
    card
  </div>
</template>

<style scoped>

</style>
