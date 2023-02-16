<template>
  <div ref="dada" class="dada" id="dada">
    <el-button @click="handleReset">reset</el-button>
    <el-button @click="handlePlay">continue</el-button>
    <el-button @click="handleSeek">seek</el-button>
    <el-button @click="handlePause">pause</el-button>
  </div>
</template>

<script setup lang="ts" name="">
import { ref, reactive, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'
import { useLoader, useLoaderByGLB } from './loadModel.ts'

import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin.js'

gsap.registerPlugin(MotionPathPlugin)

let animateGasp: gsap.core.Tween | null

const dada = ref<HTMLElement | null>(null)

onMounted(() => {
  initThree(dada)
})

const initThree = async (instance: HTMLElement | null) => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  // scene.background = new THREE.Color(0x000000)
  // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const camera = new THREE.PerspectiveCamera(
    75, // 视野角度
    window.innerWidth / window.innerHeight, // 屏幕比例
    1, // 近截面
    1000 // 远截面
  )
  camera.position.y = 100
  camera.position.z = 150 // 远近值

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // 创建环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 4) // 创建环境光
  scene.add(ambientLight) // 将环境光添加到场景

  // 200表示网格模型的尺寸大小，25表示纵横细分线条数量
  const gridHelper = new THREE.GridHelper(800, 30)
  scene.add(gridHelper)

  // const spotLight = new THREE.SpotLight(0xffffff) // 创建聚光灯
  // spotLight.position.set(-40, 60, -10)
  // spotLight.castShadow = true
  // scene.add(spotLight)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding

  instance.value.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(5, 5, 5)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  // const material = new THREE.MeshBasicMaterial({ color: 0xF56C6C })
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

  // usePlane(scene)
  const road = await useLoaderByGLB(scene, '/src/assets/model/road/', 30, (glb) => {
    glb.scene.scale.set(0.1, 0.1, 0.1)
    glb.scene.position.set(16, 0, 20)
  })

  const car = await useLoader(scene, '/src/assets/model/car/', -10, (glb) => {
    glb.scene.position.set(-6, 0, -100)
  })

  const { x, y, z } = car.scene.position
  const tempZ = z + 100
  gsap.to(car.scene.position, {
    duration: 2,
    x,
    y,
    z: tempZ,
    onComplete: () => {
      const angle = Math.PI / 2

      gsap.to(car.scene.position, {
        duration: 4,
        x: x + 60,
        y,
        z: tempZ,
        onComplete: () => {
          console.log('complete---')
        }
      })

      const { rotation } = car.scene
      gsap.to(car.scene.rotation, {
        duration: 1,
        x: rotation.x,
        y: angle,
        z: rotation.z,
        onComplete: () => {
          console.log('complete---')
        }
      })
    }
  })

  const oldCar = await useLoaderByGLB(scene, '/src/assets/model/rusty-car/', 30, (glb) => {
    glb.scene.scale.set(0.1, 0.1, 0.1)
    glb.scene.position.set(6, 0, -30)
  })

  testGo(oldCar)
}

function testGo(obj) {
  const targetZ = obj.scene.position.z + 20
  console.log('zzzzz', targetZ)
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

const createLight = () => {
  //环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1) // 创建环境光
  this.scene.add(ambientLight) // 将环境光添加到场景
  const spotLight = new THREE.SpotLight(0xffffff) // 创建聚光灯
  spotLight.position.set(-40, 60, -10)
  spotLight.castShadow = true
  this.scene.add(spotLight)
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
