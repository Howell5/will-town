import * as THREE from 'three'

/** Measured against docs/references/town-concept.png (1487 × 1058). */
export const referenceCamera = { width: 1487, height: 1058, worldWidth: 19.2, yaw: 12, elevation: 14, focusX: -1.05, focusY: 4.32, focusZ: 2.5 } as const

export function configureReferenceCamera(camera: THREE.Camera, width: number, height: number, mobile: boolean, focusX = referenceCamera.focusX as number) {
  const c = referenceCamera
  if (camera instanceof THREE.OrthographicCamera) {
    camera.zoom = mobile ? width / 8.8 : Math.min(width / c.worldWidth, height / (c.height / c.width * c.worldWidth))
    camera.updateProjectionMatrix()
  }
  const yaw = THREE.MathUtils.degToRad(c.yaw), elevation = THREE.MathUtils.degToRad(c.elevation), distance = 24
  const targetY = mobile ? 3.5 : c.focusY
  camera.up.set(0, 1, 0)
  camera.position.set(focusX + Math.sin(yaw) * Math.cos(elevation) * distance, targetY + Math.sin(elevation) * distance, c.focusZ + Math.cos(yaw) * Math.cos(elevation) * distance)
  camera.lookAt(focusX, targetY, c.focusZ)
  camera.updateMatrixWorld()
}

export function projectPoint(camera: THREE.Camera, width: number, height: number, point: [number, number, number]) {
  const v = new THREE.Vector3(...point).project(camera)
  return [Math.round((v.x + 1) * width / 2), Math.round((1 - v.y) * height / 2)]
}
