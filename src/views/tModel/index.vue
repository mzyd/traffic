<template>
  <div ref="dada" id="container1">map</div>
</template>

<script setup lang="ts" name="">
import { onMounted } from 'vue'
import * as THREE from 'three'

import AMapLoader from '@amap/amap-jsapi-loader'

// import { AmbientLight } from 'three'
// import { ThreeLayer } from '@amap/three-layer'

// import { Layer3DTiles } from '@vuemap/layer-3dtiles'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


// 进行地图初始化
function initMap() {
  AMapLoader.load({
    key: '345dc5b1ef25444fcc6d9533740d7965',
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.ToolBar', 'AMap.HawkEye']
  })
            .then(async (AMap) => {
              console.log("AAAAAAAA", AMap)
              const map = new AMap.Map('container1', {
                viewMode: '3D', // 是否为3D地图模式
                terrain: true,
                zoom: 18, // 初始化地图级别
                center: [116.405242513021, 39.909402940539]
              })

              createLayer(AMap, map)
            })
}

onMounted(() => {
  initMap()
  // mapInit()
})

function createLayer(AMap, map) {
  let camera, renderer, scene
  const customCoords = map.customCoords

  const gllayer = new AMap.GLCustomLayer({
    // 图层的层级
    zIndex: 100,
    // 初始化的操作，创建图层过程中执行一次。
    init: (gl) => {
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 1 << 30)
      renderer = new THREE.WebGLRenderer({
        context: gl // 地图的 gl 上下文
      })

      // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
      renderer.autoClear = false
      scene = new THREE.Scene()

      // 添加的一个几何体
      const mat = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 0x1e2f97,
        transparent: true,
        opacity: .4,
        depthWrite: false
      })
      const geo = new THREE.BoxBufferGeometry(500, 500, 1000)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(116.52, 39.79, 500)
      scene.add(mesh)

      // 环境光照和平行光
      const aLight = new THREE.AmbientLight(0xffffff, 0.3)
      const dLight = new THREE.DirectionalLight(0xffffff, 1)
      dLight.position.set(1000, -100, 900)
      scene.add(dLight)
      scene.add(aLight)

      // load model
      const gltfLoader = new GLTFLoader()
      const center = [116.405242513021, 39.909402940539]
      gltfLoader.load('/models/duck/Duck.gltf', (gltf) => {
        gltf.scene.position.set(center[0], center[1], 500)
        gltf.scene.scale.set(300, 300, 300)
        gltf.scene.rotation.x = 0.5 * Math.PI
        gltf.scene.position.z = 0.8
        scene.add(gltf.scene)
        // models.end = gltf.scene
      })

    },
    render: () => {
      const center = [116.405242513021, 39.909402940539]
      renderer.resetState()
      // customCoords.setCenter([116.52, 39.79])

      customCoords.setCenter(center)
      const { near, far, fov, up, lookAt, position } = customCoords.getCameraParams()
      camera.near = near
      camera.far = far
      camera.fov = fov
      camera.position.set(...position)
      camera.up.set(...up)
      camera.lookAt(...lookAt)
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
      renderer.resetState()
    },
  })
  map.add(gllayer)
}


// 动画
// function animate(map, meshes) {
//   for (let i = 0; i < meshes.length; i++) {
//     let { mesh, count } = meshes[i];
//     count += 1;
//     mesh.rotateZ(count / 180 * Math.PI);
//   }
//   map.render();
//   requestAnimationFrame(animate);
// }
// animate()

</script>

<style scoped lang="scss">
#container1 {
  width: 100%;
  height: 100%;
  /* height: 800px; */
}
</style>
