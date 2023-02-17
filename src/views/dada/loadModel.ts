// import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader()

export function useLoaderByGLB(scene: any, path: string, callback: Function) {
  return new Promise((resolve, reject) => {
    gltfLoader.setPath(path)
    gltfLoader.load('scene.glb', (glb: any) => {
      glb.scene.traverse((child: any) => {
        if (child.isMesh) {
          // child.material.emissiveMap = child.material.map
        }
      })

      callback(glb)

      scene.add(glb.scene)
      resolve(glb)
    })
  })
}
