<template>
  <div class="heaven">
    <canvas ref="canvas" id="canvas"> Your browser seems doesn't support canvas. </canvas>
  </div>
</template>

<script setup lang="ts" name="">
import { ref, reactive, onMounted } from 'vue'
const canvas = ref<HTMLDivElement | null>(null)

onMounted(() => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  const context = canvas.value.getContext('2d')
  context.fillStyle = '#f2f2f2'
  context.fillRect(0, 0, window.innerWidth, window.innerHeight)

  // drawLine(context, { x: 360, y: 80 }, { x: 160, y: 280 }, { strokeColor: 'cyan' })
  // drawLine(context, { x: 160, y: 280 }, { x: 440, y: 240 }, { strokeColor: '#ff4400' })
  // drawLine(context, { x: 440, y: 240 }, { x: 160, y: 80 }, { strokeColor: '#00ff00' })

  // contextLine(context, { x: 150, y: 50 }, [
        //   { x: 650, y: 50 },
        //   { x: 650, y: 550 },
        //   { x: 150, y: 550 }
  // ])


  // drawATriangle(context)
  // testImage(context)
})

const testImage = context => {
  context.beginPath()
  context.rect(0, 0, 800, 600)
  context.fillStyle = "#00ff00"
  context.fill()
  context.stroke()
  for (let i = 0; i <= 20; i++) {
    drawWhiteRect(context, 200 + 10 * i, 100 + 10 * i, 400 - 20 * i, 400 - 20 * i)
    drawBlackRect(context, 205 + 10 * i, 105 + 10 * i, 390 - 20 * i, 390 - 20 * i)
  }

  context.beginPath()
  context.rect(395, 295, 5, 5)
  context.fillStyle = 'black'
  context.lineWidth = 5

  context.fill()
  context.stroke()
}
function drawBlackRect(cxt, x, y, width, height) {
  cxt.beginPath()
  cxt.rect(x, y, width, height)

  cxt.lineWidth = 5
  cxt.strokeStyle = 'black'

  cxt.stroke()
}

function drawWhiteRect(cxt, x, y, width, height) {
  cxt.beginPath()
  cxt.rect(x, y, width, height)

  cxt.lineWidth = 5
  cxt.strokeStyle = 'white'

  cxt.stroke()
}

const drawRect = (ct, x, y, w, h, options = { lineWidth: 1, strokeStyle: 'red' }) => {
  ct.beginPath()
  ct.moveTo(x, y)
  ct.lineTo(x + w, y)
  ct.lineTo(x + w, y + h)
  ct.lineTo(x, y + h)
  for (const k in options) {
    ct[k] = options[k]
  }
  ct.closePath()
  ct.stroke()
}

const drawATriangle = ctx => {
  ctx.beginPath()
  ctx.moveTo(700, 80)
  ctx.lineTo(600, 240)
  ctx.lineTo(760, 200)
  ctx.closePath()
  ctx.fillStyle = 'red'
  ctx.fill()
  ctx.stroke()
}

const contextLine = (ctx, start, lineList) => {
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  lineList.forEach(item => {
    ctx.lineTo(item.x, item.y)
  })
  ctx.lineWidth = 8
  ctx.strokeStyle = 'blue'
  ctx.closePath() // 使用closePath()闭合图形
  ctx.stroke()
}
const drawLine = (ctx, start, end, options) => {
  const { strokeColor, lineWidth } = options
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.lineWidth = lineWidth ?? 1
  ctx.strokeStyle = strokeColor ?? 'red'
  ctx.stroke()
  // ctx.closePath()
}
</script>

<style scoped lang="scss">
.heaven {
  width: 100%;
  height: 100%;
  border: 1px solid red;
  #canvas {
    width: 100%;
    height: 100%;
    border: 1px solid blue;
  }
}
</style>
