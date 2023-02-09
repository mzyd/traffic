import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
// import { OrbitControls } from '@three-ts/orbit-controls'

const loader = new OBJLoader()
const mtlLoader = new MTLLoader()
const gltfLoader = new GLTFLoader()
// const fbxLoader = new FBXLoader()

export function usePlane(scene: any) {
  mtlLoader.load('./src/assets/model/Cottage_FREE.mtl', function (material) {
    material.preload()
    loader.setMaterials(material)

    loader.load(
      './src/assets/model/Cottage_FREE.obj',
      function (obj: any) {
        console.log("obj--", obj)
        const modelMaterial = new THREE.MeshLambertMaterial({
          color: 0x0739c1
          // color: 0xffffff
        })
        obj.children.forEach((child: any) => {
          // 设置模型颜色, 初始化时设置一个和背景鲜明对比的颜色, 方便识别
          child.material = modelMaterial
          // child.geometry.computeFaceNormals()
          // child.geometry.computevertexNormals()
        })
        // 调整模型比例和角度
        // obj.scale.set(100, 100, 100)
        // obj.rotation.x = -0.3
        scene.add(obj)
      },
      // called when loading is in progresses
      function (xhr: any) {
        console.log((xhr.loaded / (xhr.total * 100) + '% loaded'))
      },
      function (error: any) {
        console.error('An error happened -- ', error)
      }
    )
  })

  gltfLoader.load('./src/assets/model/war_plane/scene.gltf', (gltf: any) => {
    console.log("ggggggg", gltf)
    // obj.scale.set(100, 100, 100)
    // const modelMaterial = new THREE.MeshLambertMaterial({
    //   color: 0x0739c1
    // })
    gltf.scene.position.set(10, 0, 0)
    gltf.scene.traverse((child: any) => {
      // 修改模型材质
      // object.material = modelMaterial
      if (child.isMesh) {
        child.material.emissiveMap = child.material.map
      }
    })
    scene.add(gltf.scene)
  })
}
