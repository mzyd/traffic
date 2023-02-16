<template>
  <div class="heaven">
    <canvas ref="canvas" id="canvas"> Your browser seems doesn't support canvas. </canvas>
  </div>
</template>

<script setup lang="ts" name="">
import { ref, reactive, onMounted } from 'vue'
import { Wall, Car, Road } from '../traffic/Thing.ts'

const canvas = ref<HTMLDivElement | null>(null)
const car1 = new Car('blue')
const wall = new Wall('gray')
const road1 = ref(null)

wall.draw = function (ct) {
  ct.beginPath()
  ct.clearRect(0, 0, wall.w, wall.h)
  ct.fillStyle = wall.color
  ct.fillRect(0, 0, window.innerWidth, window.innerHeight)
  console.log('withd - ', window.innerWidth, '\nheight - ', window.innerHeight)
  ct.stroke()
}

onMounted(() => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  const context = canvas.value.getContext('2d')
  wall.draw(context)
  drawRoad(context)


  // handleExecute(context)

  car1.draw = function (ct, x, y) {
    // ct.save()
    const { w, h } = car1
    ct.fillStyle = 'red'
    ct.fillRect(x, y, w, h)
    // ct.restore()
  }
  // car1.draw(context, 100, 100)

  run(car1, context)

})

function run(obj, ct) {
  // 第一帧执行的时间
  let startTime
  // 期望动画持续的时间
  // const duration = 1000
  const duration = 3000
  let count = 0

  const step = currentTime => {
    !startTime && (startTime = currentTime)
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    wall.draw(ct)
    drawRoad(ct)
    obj.draw(ct, 100 + count, 400)

    if (progress < 1) {
      count++
      requestAnimationFrame(step)
    } else {
      console.log('动画执行完毕')
      console.log(`${duration}ms内回调执行次数:${count}次`)
    }
  }

  // 向浏览器发送动画执行请求,当浏览器要进行重绘时,会调用我们传入的step方法
  requestAnimationFrame(step)
}

const drawRoad = ctx => {
  const { offsetWidth, offsetHeight } = canvas.value
  const roadW = 200
  // const roadY = offsetHeight / 2 - Math.floor(roadW / 2)
  //  do not use the offsetHeight to set the value, between the different screens it will be abnormal
  const roadY = 400
  // const ctx = canvas.value.getContext('2d')
  ctx.fillStyle = '#605A4C'
  road1.value = new Road(0, roadY, offsetWidth, roadW, function (ctx, options) {
    const { x, y, w, h, color } = options
    ctx.fillStyle = color || '#605A4C'
    ctx.fillRect(x, y, w, h)

    const yellowY = roadY + getMiddleNumber(roadW)
    const start = { x: 0, y: yellowY }
    const end = { x: offsetWidth, y: yellowY }
    strokeLine(ctx, start, end, 'yellow')

    const whiteY = roadY + getMiddleNumber(getMiddleNumber(roadW))
    const start2 = { x: 0, y: whiteY }
    const end2 = { x: offsetWidth, y: whiteY }
    strokeLine(ctx, start2, end2, 'white', true)

    const whiteY2 = roadY + getMiddleNumber(roadW) + getMiddleNumber(getMiddleNumber(roadW))
    const start3 = { x: 0, y: whiteY2 }
    const end3 = { x: offsetWidth, y: whiteY2 }
    strokeLine(ctx, start3, end3, 'white', true)
  })

  road1.value.draw(ctx, { x: 0, y: roadY, w: offsetWidth, h: roadW })
}

const getMiddleNumber = x => {
  return Math.floor(x / 2)
}

const strokeLine = (ctx, start, end, color, isDash) => {
  ctx.beginPath()
  if (isDash) {
    ctx.lineDashOffset = 10
    ctx.setLineDash([8, 4])
  }
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.strokeStyle = color
  ctx.stroke()
  // drawCar(ctx, 'yellow')
}

function handleExecute(ctx) {
  // 定义起点和终点的坐标
  const startX = 100
  const startY = 100
  const endX = 700
  const endY = 700

  // 初始化帧动画绘制中线段两个端点的坐标
  let prevX, prevY, nextX, nextY
  prevX  = startX
  prevY  = startY

  // 第一帧执行的时间
  let startTime;
  // 期望动画持续的时间
  const duration = 1000
  let count = 0

  const step = (currentTime) => {
    !startTime && (startTime = currentTime)
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    // 绘制方法
    const draw = () => {
      ctx.beginPath()
      ctx.moveTo(prevX, prevY)

      // 移动笔触后,计算该次线段绘制的终点,并将prevX/Y更新为此值,给下一次绘制的时候使用
      prevX = nextX = startX + (endX - startX) * progress
      prevY = nextY = startY + (endY - startY) * progress

      if (count % 2 === 0) {
        // 设置线条样式
        ctx.lineWidth = 20 * progress
        ctx.strokeStyle = `rgba(${171 * (1 - progress) + 81}, ${160 * progress}, ${255},1)`
        ctx.lineTo(nextX, nextY)
        ctx.stroke()
      }
    }
    draw()

    if (progress < 1) {
      count++
      requestAnimationFrame(step)
    } else {
      console.log('动画执行完毕')
      console.log(`${duration}ms内回调执行次数:${count}次`)
    }
  }

  // 向浏览器发送动画执行请求,当浏览器要进行重绘时,会调用我们传入的step方法
  requestAnimationFrame(step)
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
