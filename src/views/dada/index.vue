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
import { useLoaderByGLB } from './loadModel.ts'

import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin.js'

gsap.registerPlugin(MotionPathPlugin)

let animateGasp: gsap.core.Tween | null

const dada = ref<HTMLElement | null>(null)

let old = null

const listNorth = ref([
  { x: 6, y: 0, z: -30 },
  { x: 6, y: 0, z: -60 },
  { x: 6, y: 0, z: -90 },
  { x: -6, y: 0, z: -40 }
])

onMounted(() => {
  initThree(dada)
})

const initThree = async (instance: HTMLElement | null) => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  const camera = new THREE.PerspectiveCamera(
    75, // 视野角度
    window.innerWidth / window.innerHeight, // 屏幕比例
    1, // 近截面
    1000 // 远截面
  )
  camera.position.y = 120
  camera.position.z = 150 // 远近值

  const ambientLight = new THREE.AmbientLight(0xffffff, 4) // 创建环境光
  scene.add(ambientLight) // 将环境光添加到场景

  // 200表示网格模型的尺寸大小，25表示纵横细分线条数量
  const gridHelper = new THREE.GridHelper(800, 30)
  scene.add(gridHelper)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding

  instance.value.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(5, 5, 5)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minPolarAngle = 0
  controls.maxPolarAngle = Math.PI

  // controls.rotateLeft(Math.PI)

  // this.enableZoom = true // Set to false to disable zooming
  // this.zoomSpeed = 1.0

  const animate = () => {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  animate()

  const road = await useLoaderByGLB(scene, '/src/assets/model/road/', (glb) => {
    glb.scene.scale.set(0.1, 0.1, 0.1)
    glb.scene.position.set(16, 0, 20)
  })

  listNorth.value.forEach(async (item) => {
    const { x, y, z } = item
    await useLoaderByGLB(scene, '/src/assets/model/rusty-car/', (glb) => {
      glb.scene.scale.set(0.1, 0.1, 0.1)
      glb.scene.position.set(x, y, z)
    })
  })

  const oldCar = await useLoaderByGLB(scene, '/src/assets/model/rusty-car/', (glb) => {
    glb.scene.scale.set(0.1, 0.1, 0.1)
    glb.scene.position.set(6, 0, -30)
  })

  const oldCar2 = await useLoaderByGLB(scene, '/src/assets/model/rusty-car/', (glb) => {
    glb.scene.scale.set(0.1, 0.1, 0.1)
    glb.scene.position.set(-90, 0, -4)
    old = glb.scene
    glb.scene.rotation.y = Math.PI / 2
  })

  testGo(oldCar)
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
