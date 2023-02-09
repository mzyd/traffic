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

const canvas = ref<HTMLDivElement | null>(null)

const wall = new Wall('gray')
const road1 = ref(null)

wall.draw = function (ct) {
  ct.beginPath()
  ct.clearRect(0, 0, wall.w, wall.h)
  ct.fillStyle = wall.color
  ct.fillRect(0, 0, window.innerWidth, window.innerHeight)
  ct.stroke()
}

onMounted(() => {
  // window.requestAnimFrame = (function () {
  //   return window.requestAnimationFrame ||
  //          window.webkitRequestAnimationFrame ||
  //          window.mozRequestAnimationFrame    ||
  //          window.oRequestAnimationFrame      ||
  //          window.msRequestAnimationFrame     ||
  //          function( callback ){
  //            window.setTimeout(callback, 1000 / 60)
  //          }
  // })()

  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  const context = canvas.value.getContext('2d')

  wall.draw(context)

  // for(var i=1; i<=10; i++){
  //   context.save();
  //   context.translate(400,300);
  //   context.rotate(36 * i * Math.PI / 180);
  //   context.fillStyle = "rgba(255,0,0,0.25)";
  //   context.fillRect(0, -200, 200, 200);
  //   context.restore();
  // }

/*

  context.fillStyle = '#00AAAA'
  context.fillRect(0, 0, 200, 100)

  context.save()
  context.fillStyle = 'red'
  context.translate(300, 400)
  context.fillRect(0, 0, 200, 100)
  context.restore()

  context.save()
  context.fillStyle = 'yellow'
  context.translate(200, 0)
  context.fillRect(0, 100, 200, 100)
  context.restore()

  context.fillStyle = 'green'
  context.fillRect(100, 200, 200, 100)

  */

  // return
  drawRoad()

  const car1 = new Car('blue')
  car1.draw = function (ct, x, y) {
    const { w, h } = car1

    // ct.save()

    // ct.clearRect(x - w, y, w, h)

    // wall.draw(ct)

    ct.beginPath()
    // ct.rect(x, 520, w, h)
    ct.rect(x, y, w, h)
    ct.fillStyle = 'black'
    ct.fill() // 确定填充颜色
    ct.stroke()

    // ct.restore()
  }

  // car1.draw(context, 300, 20)

  go(context, car1, 0, 600)
})

// function animloop() {
//   drawscene()
//   requestAnimFrame(animloop)
// }

// function drawscene(){
//   intersections_arr = [];
//   ctx.fillStyle = "#4DBB4C";
//   ctx.fillRect(0,0,w,h);
//   for(var i=0;i<roads.length;i++){
//     roads[i].draw();
//   }
//   intersections();
//   drive_cars();
// }

const go = (ct, obj, n, y) => {
  setTimeout(() => {
    if (n < 500) {
      obj.draw(ct, n + 1, y)
      go(ct, obj, n + 1, y)
    }
    return
  }, 1000 / 60)
}

const drawRoad = () => {
  const { offsetWidth, offsetHeight } = canvas.value
  const roadW = 200
  const roadY = offsetHeight / 2 - Math.floor(roadW / 2)
  const ctx = canvas.value.getContext('2d')
  ctx.fillStyle = '#605A4C'
  road1.value = new Road(0, roadY, offsetWidth, roadW, function (ctx, options) {
    console.log('.........', options)
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

  console.log('----', road1.value)
  road1.value.draw(ctx, { x: 0, y: roadY, w: offsetWidth, h: roadW })
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

const getMiddleNumber = x => {
  return Math.floor(x / 2)
}

function drawCar(ctx, start, end, color?: string) {
  ctx.fillStyle = color || 'cyan'
  ctx.fillRect(0, 320, 25, 15)

  // drawAgain()
  const car = new Car(function (context, x, y) {
    function go(n) {
      ctx.clearRect(n - 25, 320, 25, 15)
      // road1.draw()
      setTimeout(() => {
        if (n < 500) {
          ctx.fillRect(n, 320, 25, 15)
          go(n + 1)
        }
        return
      }, 1000 / 60)
    }
    go(x)
  })
  car.draw(ctx, 0, 320)
}
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
