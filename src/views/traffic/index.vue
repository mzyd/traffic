<template>
  <div class="traffic">
    <canvas ref="canvas" id="canvas">
      Your browser seems doesn't support canvas. Please try other browsers to open this page.
    </canvas>
  </div>
</template>

<script setup lang="ts" name="">
import { ref, reactive, onMounted } from 'vue'
import { Wall, Car, Road } from './Thing.ts'
import * as spritejs from 'spritejs';

const canvas = ref<HTMLDivElement | null>(null)

const wall = new Wall('gray')
const road1 = ref(null)

onMounted(() => {

})

</script>

<style scoped lang="scss">
.traffic {
  width: 100%;
  height: 100%;
  border: 1px solid green;

  #canvas {
    border: 1px solid red;
    width: 100%;
    height: 100%;
    /* background: #ccc; */
  }
}
</style>
