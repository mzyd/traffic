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

import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin.js'

gsap.registerPlugin(MotionPathPlugin)

let animateGasp: gsap.core.Tween | null

const dada = ref<HTMLElement | null>(null)

let old = null
let scene = null
let camera = null
let renderer = null

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

const initCurve = () => {
  const initialPoints = [
    { x: -10, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 10 }
  ]

  //Create a closed wavey loop
  const curve = new THREE.CatmullRomCurve3(initialPoints.map(i => new THREE.Vector3(i.x, i.y, i.z)))
  const points = curve.getPoints(50)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color: 0xf21010 })
  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material)
  console.log("ccccccc", curveObject)
  scene.add(curveObject)

  const addCube = (pos) => {
    console.log("....pos...", pos)
    const geometry = new THREE.BoxGeometry(3, 3, 3)
    const material = new THREE.MeshBasicMaterial(0x00ff04)
    const cube = new THREE.Mesh(geometry, material)
    cube.position.copy(pos)
    scene.add(cube)
    return cube
  }
  const cubeList = initialPoints.map(pos => addCube(pos))
  console.log("cuge list ", cubeList)

}

const initThree = async (instance: HTMLElement | null) => {
  setupScene()
  setupCamera()

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  instance.value.appendChild(renderer.domElement)

  setupBox(renderer)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minPolarAngle = 0
  controls.maxPolarAngle = Math.PI

  // controls.rotateLeft(Math.PI)

  // this.enableZoom = true // Set to false to disable zooming
  // this.zoomSpeed = 1.0


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
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
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
  camera.position.z = 100 // 远近值
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
