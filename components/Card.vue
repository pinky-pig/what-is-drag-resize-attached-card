<script setup lang="ts">
const props = defineProps({
  modelValue: {
    default: {
      id: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  },
})
const emit = defineEmits(['update:modelValue'])
// emit('update:modelValue', [key])
</script>

<template>
  <div
    class="absolute bg-blue-200 rounded-md flex justify-center items-center text-5xl"
    :style="{
      left: `${props.modelValue.x}px`,
      top: `${props.modelValue.y}px`,
      width: `${props.modelValue.width}px`,
      height: `${props.modelValue.height}px`,
    }"
  >
    {{ props.modelValue.id }}
  </div>
</template>

<style scoped>

</style>
