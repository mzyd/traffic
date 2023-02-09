<template>
  <div ref="dada" id="container">map</div>
</template>

<script setup lang="ts" name="">
import { ref, reactive, onMounted } from 'vue'
import * as THREE from 'three'
import AMapLoader from '@amap/amap-jsapi-loader'

import { AmbientLight } from 'three'
import { ThreeLayer } from '@amap/three-layer'
import { Layer3DTiles } from '@vuemap/layer-3dtiles'

// 进行地图初始化
function initMap() {
  AMapLoader.load({
    key: '345dc5b1ef25444fcc6d9533740d7965',
    version: '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  })
    .then((AMap) => {
      const map = new AMap.Map('container', {
        viewMode: '3D', // 是否为3D地图模式
        terrain: true,
        zoom: 18, // 初始化地图级别
        // center: [120.374926, 30.310678], // 初始化地图中心点位置
        center: [116.405242513021, 39.909402940539],
        layers: [
          // new AMap.TileLayer.Satellite(),
          // new AMap.TileLayer.RoadNet(),
          // new AMap.TileLayer.Traffic({
          //   zIndex: 10,
          //   zooms: [7, 22]
          // })
        ]
      })

      // 环境光
      // map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 1)
      // // 平行光
      // map.DirectionLight = new AMap.Lights.DirectionLight([1, 0, -0.5], [1, 1, 1], 0.5)
      // // 创建Object3DLayer图层
      // const object3Dlayer = new AMap.Object3DLayer()
      // map.add(object3Dlayer)
      // const sourceList = [
      //   {
      //     name: '123',
      //     url: '../../assets/model/war_plane/scene.gltf',
      //     position: [116.405242513021, 39.909402940539],
      //     scale: 5,
      //     height: 0
      //   }
      // ]
      // loadModel(sourceList, AMap, object3Dlayer)

      const layer = new ThreeLayer(map)
      layer.on('complete', () => {
        const light = new AmbientLight('#ffffff', 1)
        layer.add(light)
        const tiles = new Layer3DTiles(layer, {
          // url: 'https://raw.githubusercontent.com/yangyanggu/layer-3dtiles/master/test/hutong/tileset.json',
          // url: '/lukou/scene.gltf',
          url: 'tileset.json',
          position: [116.405242513021, 39.909402940539],
          mouseEvent: true
        })
        tiles.setRotation({
          x: 0,
          y: 0,
          z: 0
        })
        tiles.setTranslate({ x: 15, y: 15, z: 0 })
        tiles.on('click', (e) => {
          console.log('click: ', e)
        })
        console.log('layer: ', layer)
        console.log('tiles: ', tiles)
      })

      //添加插件
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye'], function () {
        //异步同时加载多个插件
        map.addControl(new AMap.HawkEye()) //显示缩略图
        map.addControl(new AMap.Scale()) //显示当前地图中心的比例尺
      })
    })
    .catch((e) => {
      console.log('Error: ', e)
    })
}

onMounted(() => {
    // initMap()
  // initMap2()
})

// 加载模型
function loadModel(sourceList, AMap, object3Dlayer) {
  const gltfObj = new AMap.GltfLoader()
  for (let i = 0; i < sourceList.length; i++) {
    // 逐个加载模型
    ;(function (count) {
      const model = sourceList[count]
      gltfObj.load(model.url, function (gltfObj) {
        console.log('加载成功')
        gltfObj.setOption({
          position: new AMap.LngLat(model.position[0], model.position[1]), // 必须
          scale: model.scale, // 非必须，默认1
          height: model.height, // 非必须，默认0
          scene: 0 // 非必须，默认0
        })
        gltfObj.rotateX(90)
        gltfObj.rotateZ(0)
        object3Dlayer.add(gltfObj)
      })
    })(i)
  }
}
</script>

<style scoped lang="scss">
#container {
  width: 100%;
  height: 100%;
  /* height: 800px; */
}
</style>
