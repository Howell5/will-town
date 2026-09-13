import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Html } from '@react-three/drei'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { shops, type ShopId } from './content'
import { environmentAt } from './environment'
import { move, nearestShop, type WorldRuntime } from './movement'
import { Shop, Terrain } from './Architecture'
import { configureReferenceCamera, projectPoint } from './camera'
import { Foreground } from './Foreground'
import { PostProcessing } from './PostProcessing'

type Props = { showIntro: boolean; minutes: number; runtime: WorldRuntime; reduced: boolean; mobile: boolean; onOpen: (id: ShopId) => void; onNear: (id: ShopId | null) => void; onExplore: () => void; onReady: () => void; region: RefObject<HTMLDivElement | null> }

function Character({ runtime, onNear, region, reduced }: Pick<Props, 'runtime' | 'onNear' | 'region' | 'reduced'>) {
  const source = useLoader(THREE.TextureLoader, '/assets/sprites/will-pixel-v2.png')
  const sprite = useRef<THREE.Sprite>(null)
  const shadow = useRef<THREE.Mesh>(null)
  const lastNear = useRef<ShopId | null>(null)
  const elapsed = useRef(0)
  const texture = useMemo(() => {
    const t = source.clone(); t.repeat.set(.25, .25); t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; return t
  }, [source])
  useFrame((_, dt) => {
    let dx = 0, dz = 0
    if (runtime.active && !runtime.paused) {
      dx = Number(runtime.keys.has('d') || runtime.keys.has('arrowright')) - Number(runtime.keys.has('a') || runtime.keys.has('arrowleft'))
      dz = Number(runtime.keys.has('s') || runtime.keys.has('arrowdown')) - Number(runtime.keys.has('w') || runtime.keys.has('arrowup'))
      if (dx || dz) runtime.target = null
      else if (runtime.target) {
        dx = runtime.target.x - runtime.position.x; dz = runtime.target.z - runtime.position.z
        if (Math.hypot(dx, dz) < .09) { runtime.target = null; dx = dz = 0 }
      }
      const next = move(runtime.position, dx, dz, dt)
      if (next.x === runtime.position.x && next.z === runtime.position.z) { runtime.target = null; dx = dz = 0 }
      runtime.position = next
    }
    const walking = Math.hypot(dx, dz) > .001
    if (walking) runtime.direction = Math.abs(dx) > Math.abs(dz) ? (dx > 0 ? 2 : 1) : dz > 0 ? 0 : 3
    elapsed.current += Math.min(dt, .05)
    const frame = walking && !reduced ? Math.floor(elapsed.current * 8) % 4 : 1
    texture.offset.set(frame * .25, (3 - runtime.direction) * .25)
    if (sprite.current) sprite.current.position.set(runtime.position.x, .1, runtime.position.z)
    if (shadow.current) shadow.current.position.set(runtime.position.x, .055, runtime.position.z)
    const near = nearestShop(runtime.position)
    if (near !== lastNear.current) { lastNear.current = near; onNear(near) }
    if (region.current) {
      region.current.dataset.position = `${runtime.position.x.toFixed(2)},${runtime.position.z.toFixed(2)}`
      region.current.dataset.walking = String(walking)
    }
  })
  return <>
    <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.4, 12]} /><meshBasicMaterial color="#172132" transparent opacity={.3} depthWrite={false} /></mesh>
    <sprite ref={sprite} scale={[1.68, 1.68, 1]} center={[.5, .06]}><spriteMaterial map={texture} transparent alphaTest={.5} toneMapped={false} /></sprite>
  </>
}

// The desktop camera is locked to the selected 1487 × 1058 composition.
// Resizing changes framing only, never yaw, pitch or roll.
function CameraRig({ runtime, mobile, reduced }: Pick<Props, 'runtime' | 'mobile' | 'reduced'>) {
  const { camera, size } = useThree()
  const focusX = useRef(mobile ? 1.1 : -1.05)
  useFrame((_, dt) => {
    const wanted = mobile ? runtime.position.x : -1.05
    focusX.current = mobile ? THREE.MathUtils.damp(focusX.current, wanted, reduced ? 40 : 4, Math.min(dt, .05)) : wanted
    configureReferenceCamera(camera, size.width, size.height, mobile, focusX.current)
    if (import.meta.env.DEV) {
      const project = (x: number, y: number, z: number) => projectPoint(camera,size.width,size.height,[x,y,z])
      camera.userData.landmarks = { feet: project(runtime.position.x,.1,runtime.position.z), doors: shops.map((s,i) => project(s.x,0,1.42+[-.35,.2,.7][i])), peaks: shops.map((s,i)=>project(s.x,[4.7,5.0,5.05][i]+1.15,1.42+[-.35,.2,.7][i])) }
      document.querySelector('.world-region')?.setAttribute('data-camera', JSON.stringify(camera.userData.landmarks))
    }
  })
  return null
}

function Scene(props: Props) {
  const env = environmentAt(props.minutes)
  useEffect(() => { props.onReady() }, [props.onReady])
  return <>
    <ambientLight color="#a0b3e3" intensity={env.ambient * .85} />
    <hemisphereLight args={['#849acb', '#464153', .3]} />
    <directionalLight position={[-Math.cos(env.sunAngle) * 10, Math.max(2, Math.sin(env.sunAngle) * 12), 6]} color={env.sunlight} intensity={env.daylight} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={10} shadow-camera-bottom={-8} shadow-normalBias={.025} shadow-bias={-.0001} />
    <directionalLight position={[-6, 12, 10]} color="#f4c491" intensity={.60 + env.daylight * .3} />
    <directionalLight position={[0, 8, -7]} color="#638ee7" intensity={.85} />
    <Terrain env={env} onWalk={point => { props.runtime.target = { x: Math.max(-7, Math.min(8, point.x)), z: Math.max(1.65, Math.min(8.9, point.z)) }; props.onExplore() }} />
    {shops.map((shop, index) => <Shop key={shop.id} index={index} env={env} onOpen={props.onOpen} />)}
    {props.showIntro && !props.mobile && <Html center position={[-2.88,6.26,2.1]} zIndexRange={[28,21]}><button className="shop-peek" onClick={()=>props.onOpen('journal')}><strong>开发手记</strong><span>记录想法，连接灵感。</span><small>看看小镇的建造过程 →</small></button></Html>}
    <Character runtime={props.runtime} onNear={props.onNear} region={props.region} reduced={props.reduced} />
    <CameraRig runtime={props.runtime} mobile={props.mobile} reduced={props.reduced} />

    <Foreground mobile={props.mobile} />
    <PostProcessing glow={env.windows} mobile={props.mobile} />

  </>
}

export default function World(props: Props) {
  const visible = useVisibility()
  return <Canvas orthographic shadows={props.mobile ? false : { type: THREE.PCFShadowMap }} frameloop={visible ? 'always' : 'never'} dpr={props.mobile ? .85 : 1} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} camera={{ position: [4.6, 8.2, 16], zoom: 50, near: .1, far: 100 }} onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.1 }}>
    <Suspense fallback={null}><Scene {...props} /></Suspense>
  </Canvas>
}

function useVisibility(): boolean {
  const [visible, setVisible] = useState(!document.hidden)
  useEffect(() => { const update = () => setVisible(!document.hidden); document.addEventListener('visibilitychange', update); return () => document.removeEventListener('visibilitychange', update) }, [])
  return visible
}
