import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
// import { OrbitControls } from '@three-ts/orbit-controls'

const loader = new OBJLoader()
const mtlLoader = new MTLLoader()
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()


export function useLoader(scene: any, path: string, x: number, callback: Function) {
  gltfLoader.setPath(path)
  return new Promise((resolve, reject) => {
    gltfLoader.load('scene.gltf', (gltf: any) => {
      gltf.scene.position.set(x || -10, 0, 0)

      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          // child.material.emissiveMap = child.material.map
        }
      })

      if (callback) {
        callback(gltf)
      }

      scene.add(gltf.scene)
      resolve(gltf)
    })
  })
}
export function useLoaderByGLB(scene: any, path: string, x: number, callback: Function) {
  return new Promise((resolve, reject) => {
    gltfLoader.setPath(path)
    gltfLoader.load('scene.glb', (glb: any) => {
      glb.scene.position.set(x || -10, 0, 0)
      glb.scene.traverse((child: any) => {
        if (child.isMesh) {
          // child.material.emissiveMap = child.material.map
        }
      })

      if (callback) {
        callback(glb)
      }

      scene.add(glb.scene)
      resolve(glb)
    })
  })
}
