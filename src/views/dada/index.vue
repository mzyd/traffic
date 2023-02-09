<template>
  <div ref="dada" class="dada" id="dada"></div>
</template>

<script setup lang="ts" name="">
import { ref, reactive, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'
import { usePlane } from './plane.ts'

const dada = ref<HTMLElement | null>(null)

onMounted(() => {
  initThree(dada)
})

const initThree = (instance: HTMLElement | null) => {
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
  camera.position.z = 18 // 远近值

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // 创建环境光
  scene.add(ambientLight) // 将环境光添加到场景

  // const spotLight = new THREE.SpotLight(0xffffff) // 创建聚光灯
  // spotLight.position.set(-40, 60, -10)
  // spotLight.castShadow = true
  // scene.add(spotLight)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  instance.value.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const material = new THREE.MeshBasicMaterial({ color: 0xF56C6C })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minPolarAngle = 0
  controls.maxPolarAngle = Math.PI
  // this.enableZoom = true // Set to false to disable zooming
  // this.zoomSpeed = 1.0

  const animate = () => {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  animate()

  usePlane(scene)

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
