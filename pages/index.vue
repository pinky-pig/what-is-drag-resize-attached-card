<script setup lang="ts">
const cardOption = ref({
  x: 0,
  y: 0,
  width: 200,
  height: 200,
})
</script>

<template>
  <div>
    <!-- <Logos mb-6 /> -->
    <!-- <Suspense>
      <PageView />
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
    <InputEntry /> -->

    <DragCanvas>
      <div class="h-60vh w-80vw relative">
        <Card v-model="cardOption" />
      </div>
    </DragCanvas>
  </div>
</template>
