// import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import _ from 'lodash-es'

const gltfLoader = new GLTFLoader()
const basePath = '/src/assets/models'

export function useLoaderByGLB(scene: any, path: string, callback: Function) {
	// const dracoLoader = new DRACOLoader()
	// dracoLoader.setDecoderPath( '/src/assets/model/tokyo/' )
  // const p = basePath + _.dropRight(path.split('/').toString().replace(',', '/'))
  // .join('')
  const modelName = _.last(path.split('/'))
  const _p = basePath + _.dropRight(path.split('/')).join(',').replaceAll(',', '/')
  const _path = _.last(_p.split('')) !== '/' ? _p + '/' : _p
  return new Promise((resolve, reject) => {
    // gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.setPath(_path)
    gltfLoader.load(
      modelName,
      (glb: any) => {
        glb.scene.traverse((child: any) => {
          if (child.isMesh) {
            // child.material.metalness = 0
            // child.material.emissiveMap = child.material.map
          }
        })
        callback(glb)
        scene.add(glb.scene)
        resolve(glb)
      },
      undefined,
      (err: any) => {
        console.log('Load Error ----> ', err)
        reject(err)
      }
    )
  })
}

export function useLoaderByGLTF(scene: any, path: string, callback: Function) {
  return new Promise((resolve, reject) => {
    gltfLoader.setPath(path)
    gltfLoader.load(
      'scene.gltf',
      (glb: any) => {
        glb.scene.traverse((child: any) => {
          if (child.isMesh) {
            // console.log("mmmmmmm", child)
            child.material.emissiveMap = child.material.map
          }
        })
        callback(glb)
        scene.add(glb.scene)
        resolve(glb)
      },
      undefined,
      (err: any) => {
        console.log('Load Error ----> ', err)
        reject(err)
      }
    )
  })
}
