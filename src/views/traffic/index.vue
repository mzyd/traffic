<template>
  <div ref="dada" class="dada" id="dada">
    <el-button @click="handleReset">reset</el-button>
    <el-button @click="handlePlay">continue</el-button>
    <el-button @click="handleSeek">seek</el-button>
    <el-button @click="handlePause">pause</el-button>
    <el-button @click="handleTurn">turn</el-button>
  </div>
</template>

<script setup lang="ts" name="">
import { ref, reactive, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'
import { useLoaderByGLB, useLoaderByGLTF } from './loadModel.ts'
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js'

import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin.js'

gsap.registerPlugin(MotionPathPlugin)

let animateGasp: gsap.core.Tween | null

const dada = ref<HTMLElement | null>(null)

let old = null
let scene = null
let camera = null
let renderer = null

const flow = null
let progress = 0
const velocity = 0.001
let model = null
let curve = null

const listNorth = ref([
  { x: 6, y: 0, z: -30, type: 0 },
  { x: 6, y: 0, z: -60, type: 1 },
  { x: 6, y: 0, z: -90, type: 0 },
  { x: -6, y: 0, z: -40, type: 1 }
])

onMounted(() => {
  initThree(dada)
  initCurve()
})

const initCurve = async () => {
  const oldCar = await useLoaderByGLB(scene, '/rusty-car/scene.glb', (glb) => {
    glb.scene.scale.set(0.1, 0.1, 0.1)
    glb.scene.position.set(6, 0, -30)
  })
  model = oldCar.scene

  curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(100, 0, -100),
    new THREE.Vector3(100, 0, 100),
    new THREE.Vector3(-100, 0, 100),
    new THREE.Vector3(-100, 0, -100)
  ])

  console.log('ccccccccc', curve)
  curve.curveType = "centripetal" // 曲线的类型
  curve.closed = true // 曲线是否闭合
  curve.tension = 0.5
  // 样条曲线均匀分割100分，返回51个顶点坐标
  const points = curve.getPoints(100)

  const lineObject = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0x00ff00 })
  )
  scene.add(lineObject)

  // flow = new Flow(mesh)
  // flow.updateCurve(0, curve)
  // scene.add(flow.object3D)

  moveOnCurve(curve)

  render()
}

function render() {
  requestAnimationFrame(render)
  moveOnCurve()
  renderer.render(scene, camera)
  // if (flow) {
  //   flow.moveAlongCurve(0.006)
  // }
}

// 物体沿线移动方法
function moveOnCurve() {
  if (curve == null || model == null) {
    console.log('Loading')
  } else {
    if (progress <= 1 - velocity) {
      const point = curve.getPointAt(progress) //获取样条曲线指定点坐标
      const pointBox = curve.getPointAt(progress + velocity) //获取样条曲线指定点坐标

      if (point && pointBox) {
        model.position.set(point.x, point.y, point.z)
        // model.lookAt(pointBox.x, pointBox.y, pointBox.z);//因为这个模型加载进来默认面部是正对Z轴负方向的，所以直接lookAt会导致出现倒着跑的现象，这里用重新设置朝向的方法来解决。

        const targetPos = pointBox //目标位置点
        const offsetAngle = 0 //目标移动时的朝向偏移

        // //以下代码在多段路径时可重复执行
        const mtx = new THREE.Matrix4() //创建一个4维矩阵
        // .lookAt ( eye : Vector3, target : Vector3, up : Vector3 ) : this,构造一个旋转矩阵，从eye 指向 target，由向量 up 定向。
        mtx.lookAt(model.position, targetPos, model.up) //设置朝向
        mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, offsetAngle, 0)))
        const toRot = new THREE.Quaternion().setFromRotationMatrix(mtx) //计算出需要进行旋转的四元数值
        model.quaternion.slerp(toRot, 0.2)
      }
      progress += velocity
    } else {
      progress = 0
    }
  }
}

const initThree = async (instance: HTMLElement | null) => {
  setupScene()
  setupCamera()

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  instance.value.appendChild(renderer.domElement)

  // setupBox(renderer)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minPolarAngle = 0
  controls.maxPolarAngle = Math.PI

  // const road = await useLoaderByGLB(scene, '/lukou/scene.glb', (glb) => {
  //   glb.scene.position.set(0, 0, 0)
  //   glb.scene.scale.set(2.0, 2.0, 2.0)
  // })

  // const tokyo = await useLoaderByGLB(scene, '/tokyo/scene.glb', (glb) => {
  //   glb.scene.scale.set(10, 10, 10)
  //   glb.scene.position.set(26, 0, 20)
  // })

  // listNorth.value.forEach(async (item) => {
  //   const { x, y, z } = item
  //   const path = item.type === 0 ? '/src/assets/model/rusty-car/' : '/src/assets/model/truck/'
  //   console.log("path-->", path)
  //   await useLoaderByGLB(scene, path, (glb) => {
  //     glb.scene.scale.set(0.1, 0.1, 0.1)
  //     glb.scene.position.set(x, y, z)
  //   })
  // })

  const oldCar = await useLoaderByGLB(scene, '/rusty-car/scene.glb', (glb) => {
    glb.scene.scale.set(0.1, 0.1, 0.1)
    glb.scene.position.set(6, 0, -30)
  })

  const oldCar2 = await useLoaderByGLB(scene, '/rusty-car/scene.glb', (glb) => {
    glb.scene.scale.set(0.1, 0.1, 0.1)
    glb.scene.position.set(-90, 0, -4)
    old = glb.scene
    glb.scene.rotation.y = Math.PI / 2
  })
  testGo(oldCar)
}

function setupScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  const ambientLight = new THREE.AmbientLight(0x333333, 4) // 创建环境光
  scene.add(ambientLight) // 将环境光添加到场景
  // 200表示网格模型的尺寸大小，25表示纵横细分线条数量
  const gridHelper = new THREE.GridHelper(800, 30)
  scene.add(gridHelper)
}

function setupBox(renderer) {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  const animate = () => {
    requestAnimationFrame(animate)
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  animate()
}

function setupCamera() {
  camera = new THREE.PerspectiveCamera(
    75, // 视野角度
    window.innerWidth / window.innerHeight, // 屏幕比例
    1, // 近截面
    1000 // 远截面
  )
  camera.position.y = 100
  camera.position.z = 250 // 远近值
}

function handleTurn() {
  old.rotation.y += Math.PI * 2 * 0.1
}

function testGo(obj) {
  const targetZ = obj.scene.position.z + 20
  if (targetZ > 100) {
    return () => {
      console.log("It's done.")
    }
  }
  animateGasp = gsap.to(obj.scene.position, {
    z: targetZ,
    duration: 1,
    ease: 'none',
    repeat: 0,
    yoyo: true,
    delay: 0,
    onComplete: () => {
      console.log('complete..')
      testGo(obj)
    }
    // onStart: () => {}
  })
}

function handleReset() {
  animateGasp.reverse()
}
function handlePlay() {
  animateGasp.play()
}
function handleSeek() {
  animateGasp.seek(2)
}
function handlePause() {
  animateGasp.pause()
}
</script>

<style scoped lang="scss">
.dada {
  width: 100%;
  height: 100%;
  #content {
    width: 100%;
    height: 100%;
  }
}
</style>
