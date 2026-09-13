import { Suspense, useEffect, useLayoutEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { shops, type ShopId } from './content'
import { environmentAt } from './environment'
import { Shop, Terrain } from './Architecture'
import { configureReferenceCamera, projectPoint } from './camera'
import { Foreground } from './Foreground'
import { PostProcessing } from './PostProcessing'

type Props = { minutes: number; mobile: boolean; onOpen: (id: ShopId) => void; onReady: () => void }

// Keep the reference desktop framing; center Berryon's storefront on small screens.
function CameraRig({ mobile }: Pick<Props, 'mobile'>) {
  const { camera, size, invalidate } = useThree()
  useLayoutEffect(() => {
    configureReferenceCamera(camera, size.width, size.height, mobile, mobile ? 1.1 : -1.05)
    if (import.meta.env.DEV) {
      const project = (x: number, y: number, z: number) => projectPoint(camera, size.width, size.height, [x,y,z])
      camera.userData.landmarks = { doors: shops.map((s,i) => project(s.x,0,1.42+[-.35,.2,.7][i])), peaks: shops.map((s,i)=>project(s.x,[4.7,5.0,5.05][i]+1.15,1.42+[-.35,.2,.7][i])) }
      document.querySelector('.world-region')?.setAttribute('data-camera', JSON.stringify(camera.userData.landmarks))
    }
    invalidate()
  }, [camera, size.width, size.height, mobile, invalidate])
  return null
}

function Scene(props: Props) {
  const env = environmentAt(props.minutes)
  useEffect(() => { props.onReady() }, [props.onReady])
  return <>
    <ambientLight color="#a0b3e3" intensity={env.ambient * .63} />
    <hemisphereLight args={['#849acb', '#393b51', .23]} />
    <directionalLight position={[-Math.cos(env.sunAngle) * 10, Math.max(2, Math.sin(env.sunAngle) * 12), 6]} color={env.sunlight} intensity={env.daylight} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={10} shadow-camera-bottom={-8} shadow-normalBias={.025} shadow-bias={-.0001} />
    <directionalLight position={[-6, 12, 10]} color="#f4c491" intensity={.30 + env.daylight * .3} />
    <directionalLight position={[0, 8, -7]} color="#8aa3ff" intensity={1.1} />
    <Terrain env={env} />
    {shops.map((shop, index) => <Shop key={shop.id} mobile={props.mobile} index={index} env={env} onOpen={props.onOpen} />)}
    <CameraRig mobile={props.mobile} />

    <Foreground mobile={props.mobile} />
    <PostProcessing glow={env.windows} mobile={props.mobile} />

  </>
}

export default function World(props: Props) {
  return <Canvas orthographic shadows={props.mobile ? false : { type: THREE.PCFShadowMap }} frameloop="demand" dpr={props.mobile ? .85 : 1} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} camera={{ position: [4.6, 8.2, 16], zoom: 50, near: .1, far: 100 }} onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.1 }}>
    <Suspense fallback={null}><Scene {...props} /></Suspense>
  </Canvas>
}
