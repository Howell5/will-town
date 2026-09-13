import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { shops, type ShopId } from './content'
import { environmentAt } from './environment'
import { move, nearestShop, type WorldRuntime } from './movement'

type Env = ReturnType<typeof environmentAt>
type Materials = Record<'stone' | 'roof' | 'ground' | 'wood', THREE.Texture>
type Props = { minutes: number; runtime: WorldRuntime; reduced: boolean; mobile: boolean; onOpen: (id: ShopId) => void; onNear: (id: ShopId | null) => void; onExplore: () => void; onReady: () => void; region: RefObject<HTMLDivElement | null> }

function useMaterials(): Materials {
  const atlas = useLoader(THREE.TextureLoader, '/assets/textures/town-materials.png')
  return useMemo(() => {
    const tile = (x: number, y: number) => {
      const t = atlas.clone()
      t.colorSpace = THREE.SRGBColorSpace
      t.magFilter = t.minFilter = THREE.NearestFilter
      t.generateMipmaps = false
      t.offset.set(x + .002, y + .002)
      t.repeat.set(.496, .496)
      t.needsUpdate = true
      return t
    }
    return { stone: tile(0, .5), roof: tile(.5, .5), ground: tile(0, 0), wood: tile(.5, 0) }
  }, [atlas])
}

function Box({ at, size, color = '#ffffff', map, rotation, glow = 0 }: { at: [number, number, number]; size: [number, number, number]; color?: string; map?: THREE.Texture; rotation?: [number, number, number]; glow?: number }) {
  return <mesh position={at} rotation={rotation} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} map={map} roughness={.92} emissive={color} emissiveIntensity={glow} />
  </mesh>
}

function Greenery({ position, size = .7, kind }: { position: [number, number, number]; size?: number; kind?: number }) {
  const source = useLoader(THREE.TextureLoader, '/assets/sprites/greenery.png')
  const variant = kind ?? (position[1] > 1 ? 1 : size > 1 ? 2 : 0)
  const texture = useMemo(() => {
    const t = source.clone(), top = variant < 2
    t.colorSpace = THREE.SRGBColorSpace; t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false
    t.repeat.set(.5, top ? 560 / 1254 : 694 / 1254)
    t.offset.set((variant % 2) * .5, top ? 694 / 1254 : 0); t.needsUpdate = true
    return t
  }, [source, variant])
  return <sprite position={position} scale={[size * 1.7, size * (variant === 1 ? 1 : 1.65), 1]} center={[.5, .055]}><spriteMaterial map={texture} color="#d0cfba" alphaTest={.12} transparent /></sprite>
}

function Lamp({ position, env }: { position: [number, number, number]; env: Env }) {
  return <group position={position}>
    <Box at={[0, 1.6, 0]} size={[.1, 3.2, .1]} color="#313d40" />
    <Box at={[0, .1, 0]} size={[.4, .2, .4]} color="#42484b" />
    <Box at={[0, 3.4, 0]} size={[.36, .53, .36]} color="#ffc375" glow={env.windows * 2.4} />
    <Box at={[0, 3.75, 0]} size={[.55, .12, .55]} color="#394146" />
    <Box at={[0, 3.08, 0]} size={[.44, .1, .44]} color="#394146" />
    {[-1, 1].flatMap(x => [-1, 1].map(z => <Box key={`${x}${z}`} at={[x * .17, 3.42, z * .17]} size={[.055, .55, .055]} color="#494039" />))}
    <pointLight position={[0, 3.3, .4]} color="#ffbd76" intensity={env.windows * 5} distance={5.2} decay={2} />
  </group>
}

function Window({ x, y, z, width = .86, height = 1.05, env, wood }: { x: number; y: number; z: number; width?: number; height?: number; env: Env; wood: THREE.Texture }) {
  return <group position={[x, y, z]}>
    <Box at={[0, 0, -.06]} size={[width + .18, height + .18, .16]} color="#4a352b" map={wood} />
    <Box at={[0, 0, .035]} size={[width, height, .04]} color="#edac58" glow={.1 + env.windows * .9} />
    <Box at={[0, 0, .085]} size={[.065, height, .08]} color="#5c412c" />
    <Box at={[0, -.02, .085]} size={[width, .065, .08]} color="#5c412c" />
    <Box at={[0, -height / 2 - .12, .04]} size={[width + .3, .15, .34]} color="#987954" map={wood} />
  </group>
}

function Shop({ index, materials: m, env, onOpen }: { index: number; materials: Materials; env: Env; onOpen: Props['onOpen'] }) {
  const shop = shops[index]
  const height = index === 1 ? 4.6 : 4.2
  const front = 1.4
  const gable = useMemo(() => new THREE.Shape([new THREE.Vector2(-1.65, 0), new THREE.Vector2(1.65, 0), new THREE.Vector2(0, 1.1)]), [])
  return <group position={[shop.x, 0, -.35]}>
    <Box at={[0, height / 2, 0]} size={[3.25, height, 2.7]} map={m.stone} color={index === 0 ? '#a9bc9f' : index === 1 ? '#efd2ae' : '#c7b9c3'} />
    <Box at={[0, .18, 0]} size={[3.5, .36, 2.9]} map={m.stone} color="#a69987" />
    <mesh position={[0, height, front - .02]}>
      <shapeGeometry args={[gable]} /><meshStandardMaterial color={index === 0 ? '#a3b193' : '#ceb68c'} roughness={1} />
    </mesh>
    <mesh position={[0, height, -1.4]} rotation={[0, Math.PI, 0]}>
      <shapeGeometry args={[gable]} /><meshStandardMaterial color="#aa9075" roughness={1} />
    </mesh>
    <Box at={[-.88, height + .53, 0]} size={[2.12, .2, 3.15]} map={m.roof} rotation={[0, 0, .58]} />
    <Box at={[.88, height + .53, 0]} size={[2.12, .2, 3.15]} map={m.roof} rotation={[0, 0, -.58]} />
    <Box at={[0, height + 1.12, 0]} size={[.22, .18, 3.25]} map={m.roof} color="#db8e57" />
    <Box at={[-1.06, height + 1.12, -.7]} size={[.42, 1.35, .44]} map={m.stone} color="#ad8d75" />
    <Box at={[-1.06, height + 1.82, -.7]} size={[.6, .18, .6]} map={m.roof} />
    {[-1.52, 1.52].map(x => <Box key={x} at={[x, height / 2, front]} size={[.16, height, .15]} color="#715944" map={m.wood} />)}
    <Box at={[0, 2.64, front + .08]} size={[3.38, .16, .24]} color="#8c6a45" map={m.wood} />
    {[-.83, .83].map(x => <Window key={x} x={x} y={height - .83} z={front + .1} width={.73} height={.95} env={env} wood={m.wood} />)}
    {[-.82, .83].map(x => <Greenery key={x} position={[x, height - 1.61, front + .28]} size={.75} />)}
    <Box at={[0, 2.38, front + .16]} size={[3.08, .55, .22]} color="#f5d7a1" glow={env.windows * .18} />
    <Html transform position={[0, 2.38, front + .285]} distanceFactor={4} zIndexRange={[20, 0]}>
      <button className={`shop-sign sign-${shop.id}`} onClick={() => onOpen(shop.id)} aria-label={`进入${shop.label}`}>{shop.sign}</button>
    </Html>
    <group position={[0, 1.97, front + .52]} rotation={[.25, 0, 0]}>
      {Array.from({ length: 10 }, (_, i) => <Box key={i} at={[(i - 4.5) * .315, 0, 0]} size={[.32, .13, 1.02]} color={i % 2 ? '#ead9b5' : shop.accent} />)}
      {Array.from({ length: 10 }, (_, i) => <Box key={i + 10} at={[(i - 4.5) * .315, -.14, .48]} size={[.32, .27, .06]} color={i % 2 ? '#ead9b5' : shop.accent} />)}
    </group>
    <Box at={[-.76, .89, front + .11]} size={[.98, 1.62, .13]} color="#4b392d" map={m.wood} />
    <Window x={-.76} y={1.17} z={front + .2} width={.71} height={.85} env={env} wood={m.wood} />
    <Box at={[-.48, .69, front + .25]} size={[.07, .08, .05]} color="#e7b863" glow={.2} />
    <Window x={.72} y={.99} z={front + .16} width={1.15} height={1.35} env={env} wood={m.wood} />
    <Box at={[.72, .47, front + .28]} size={[1.22, .09, .3]} color="#805437" />
    {[0, 1, 2].map(i => <Box key={i} at={[.33 + i * .36, .64 + i % 2 * .12, front + .3]} size={[.2, .29, .18]} color={['#6e9391', '#dbc293', '#b98164'][i]} />)}
    <Box at={[-.77, .1, front + .44]} size={[1.24, .18, .78]} map={m.ground} color="#c5b095" />
    <Greenery position={[-1.56, .05, front + .53]} size={.62} />
    <Greenery position={[1.54, .05, front + .6]} size={.74} />
    <Greenery position={[-1.46, 2.45, front + .22]} size={.9} kind={3} />
    <pointLight position={[0, 1.1, front + 1.1]} color="#ffd296" intensity={env.windows * 7} distance={4} decay={2} />
    {/* A visible threshold and a generous pointer target share the same product action. */}
    <mesh position={[0, 1.3, front + .35]} onClick={e => { e.stopPropagation(); onOpen(shop.id) }}>
      <planeGeometry args={[3.1, 2.3]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  </group>
}

function Plaza({ materials: m, env, onWalk }: { materials: Materials; env: Env; onWalk: (p: THREE.Vector3) => void }) {
  return <group>
    <Box at={[.5, -.72, 1.3]} size={[18, 1.4, 10.6]} map={m.stone} color="#8c9099" />
    {Array.from({ length: 9 }, (_, x) => Array.from({ length: 5 }, (_, z) => <Box key={`${x}${z}`} at={[-7.5 + x * 2, -.025, -2.7 + z * 2]} size={[1.99, .13, 1.99]} map={m.ground} color="#c4bba9" />))}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[.5, .052, 2.4]} onClick={e => { e.stopPropagation(); onWalk(e.point) }}>
      <planeGeometry args={[17.8, 7.8]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
    {[-7.5, -5.3, -3.1, 5.6, 7.8].map(x => <group key={x}>
      <Box at={[x, .55, 6.45]} size={[.34, 1.2, .36]} color="#827663" map={m.wood} />
      <Box at={[x, 1.18, 6.45]} size={[.44, .14, .46]} color="#a09071" />
    </group>)}
    <Box at={[-5.2, .85, 6.45]} size={[4.7, .11, .12]} color="#655141" />
    <Box at={[6.7, .85, 6.45]} size={[2.4, .11, .12]} color="#655141" />
    <Box at={[-5.2, .4, 6.45]} size={[4.7, .11, .12]} color="#655141" />
    {[0, 1, 2].map(i => <Box key={i} at={[1.2, -.17 - i * .19, 6.68 + i * .38]} size={[2.8, .2, .7]} map={m.stone} color="#ad9f8a" />)}
    <Lamp position={[-5.5, .04, 3.4]} env={env} /><Lamp position={[7.6, .04, 1.3]} env={env} />
    <Greenery position={[-6.3, .03, 5.7]} size={1.35} />
    <Greenery position={[6.6, .03, 5.8]} size={1.35} />
    <Greenery position={[-7.2, .03, 1.1]} size={1.5} />
    <group position={[-4.75, .08, 5.55]}>
      <Box at={[0, .5, 0]} size={[1.65, .14, .53]} map={m.wood} />
      <Box at={[0, 1, -.21]} size={[1.65, .6, .12]} map={m.wood} />
      {[-.6, .6].map(x => <Box key={x} at={[x, .25, 0]} size={[.12, .5, .4]} color="#343f40" />)}
    </group>
  </group>
}

function Character({ runtime, onNear, region, reduced }: Pick<Props, 'runtime' | 'onNear' | 'region' | 'reduced'>) {
  const source = useLoader(THREE.TextureLoader, '/assets/sprites/will-walk.png')
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

function CameraRig({ runtime, mobile, reduced }: Pick<Props, 'runtime' | 'mobile' | 'reduced'>) {
  const { camera, size } = useThree()
  const focusX = useRef(mobile ? 1.1 : -2.3)
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = mobile ? size.width / 10.6 : size.width / 20.5
      camera.updateProjectionMatrix()
    }
  }, [camera, size.width, mobile])
  useFrame((_, dt) => {
    const home = mobile ? 1.1 : -2.3
    const deadZone = mobile ? 1.5 : 3.5
    const diff = runtime.position.x - 1.1
    const wanted = Math.abs(diff) > deadZone ? home + Math.sign(diff) * (Math.abs(diff) - deadZone) : home
    focusX.current = THREE.MathUtils.damp(focusX.current, wanted, reduced ? 40 : 3, Math.min(dt, .05))
    const targetY = mobile ? 2.5 : 3 + THREE.MathUtils.clamp((size.height / size.width - .56) / .15, 0, 1) * .9
    camera.position.set(focusX.current + 4.3, targetY + 5.85, 16)
    camera.lookAt(focusX.current, targetY, 1)
  })
  return null
}

function Clouds({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, dt) => { if (group.current && !reduced) { group.current.position.x += Math.min(dt, .05) * .05; if (group.current.position.x > 12) group.current.position.x = -14 } })
  return <group ref={group} position={[-9, 9, -9]}>
    {[0, 1, 2].map(i => <mesh key={i} position={[i * .9, i === 1 ? .25 : 0, 0]}><boxGeometry args={[1.8, .35, .12]} /><meshBasicMaterial color="#d7c5cf" transparent opacity={.18} depthWrite={false} /></mesh>)}
  </group>
}

function Scene(props: Props) {
  const m = useMaterials()
  const env = environmentAt(props.minutes)
  useEffect(() => { props.onReady() }, [props.onReady])
  return <>
    <ambientLight color="#d7dced" intensity={env.ambient} />
    <hemisphereLight args={['#c7dcff', '#89725f', .7]} />
    <directionalLight position={[-Math.cos(env.sunAngle) * 10, Math.max(2, Math.sin(env.sunAngle) * 12), 6]} color={env.sunlight} intensity={env.daylight} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={10} shadow-camera-bottom={-8} shadow-normalBias={.08} />
    <directionalLight position={[0, 8, -7]} color="#879fdf" intensity={.55} />
    <Plaza materials={m} env={env} onWalk={point => { props.runtime.target = { x: Math.max(-7, Math.min(8, point.x)), z: Math.max(1.65, Math.min(6.1, point.z)) }; props.onExplore() }} />
    {shops.map((shop, index) => <Shop key={shop.id} index={index} materials={m} env={env} onOpen={props.onOpen} />)}
    <Character runtime={props.runtime} onNear={props.onNear} region={props.region} reduced={props.reduced} />
    <CameraRig runtime={props.runtime} mobile={props.mobile} reduced={props.reduced} />
    <Clouds reduced={props.reduced} />
    {env.daylight > .15 && <mesh position={[-Math.cos(env.sunAngle) * 10 - 4, 7 + Math.sin(env.sunAngle) * 3, -12]}><sphereGeometry args={[.4, 12, 8]} /><meshBasicMaterial color="#f8d4a0" /></mesh>}
  </>
}

export default function World(props: Props) {
  const visible = useVisibility()
  return <Canvas orthographic shadows={props.mobile ? false : { type: THREE.PCFShadowMap }} frameloop={visible ? 'always' : 'never'} dpr={props.mobile ? .85 : 1} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} camera={{ position: [4.6, 8.2, 16], zoom: 50, near: .1, far: 100 }} onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.15 }}>
    <Suspense fallback={null}><Scene {...props} /></Suspense>
  </Canvas>
}

function useVisibility(): boolean {
  const [visible, setVisible] = useState(!document.hidden)
  useEffect(() => { const update = () => setVisible(!document.hidden); document.addEventListener('visibilitychange', update); return () => document.removeEventListener('visibilitychange', update) }, [])
  return visible
}
