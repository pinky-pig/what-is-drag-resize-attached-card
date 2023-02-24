<script setup lang="ts">
useHead({
  title: 'Vitesse Nuxt 3',
  link: [
    {
      rel: 'icon', type: 'image/png', href: '/nuxt.png',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html, body , #__nuxt{
  position: absolute;
  height: 100%;
  width: 100%;
  min-height: 0px;
  min-width: 0px;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  outline: none;
}
html.light{
  background: #f7f4f0;
  color: black ;
}

html.dark {
  background: #171717 !important;
  color: black;
}
</style>
