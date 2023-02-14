<script setup lang="ts">
const color = useColorMode()
</script>

<template>
  <div :class="color.preference === 'dark' ? 'dark' : 'light'">
    <div class=" button_top">
      <slot />
    </div>
  </div>
</template>

<style  scoped>
div.light{
  --button_radius: 0.75em;
  --button_color: #e8e8e8;
  --button_outline_color: #000000;
}
div.dark{
  --button_radius: 0.75em;
  --button_color: #474747;
  --button_outline_color: #e8e8e8;
}
div {
  /* Variables */
 /* --button_radius: 0.75em;
 --button_color: #e8e8e8;
 --button_outline_color: #000000; */
 font-size: 17px;
 font-weight: bold;
 border: none;
 border-radius: var(--button_radius);
 background: var(--button_outline_color);
 display: inline-flex;
}

.button_top {
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

/* div:hover .button_top {
 transform: translateY(-0.33em);
}

div:active .button_top {
 transform: translateY(0);
} */
</style>
