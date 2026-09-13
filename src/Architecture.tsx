import { useLayoutEffect, useMemo, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { shops, type ShopId } from './content'
import { environmentAt } from './environment'

export type Env = ReturnType<typeof environmentAt>
type V3 = [number, number, number]
type Block = { p: V3; s: V3; c: string; r?: V3 }
const grain = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v) }
const shade = (base: string, seed: number, range = .18) => new THREE.Color(base).multiplyScalar(1 - range / 2 + grain(seed) * range).getStyle()

function chamferedCube() {
  const s = new THREE.Shape()
  s.moveTo(-.46, -.46); s.lineTo(.46, -.46); s.lineTo(.46, .46); s.lineTo(-.46, .46); s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth: .92, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 1, steps: 1 })
  g.translate(0, 0, -.46)
  g.computeVertexNormals()
  const positions = g.getAttribute('position'), normals = g.getAttribute('normal'), uv: number[] = []
  for (let i = 0; i < positions.count; i++) {
    const n = [Math.abs(normals.getX(i)), Math.abs(normals.getY(i)), Math.abs(normals.getZ(i))]
    uv.push((n[0] > n[2] ? positions.getZ(i) : positions.getX(i)) + .5, (n[1] > .7 ? positions.getZ(i) : positions.getY(i)) + .5)
  }
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  return g
}

function roofTile() {
  const shape = new THREE.Shape()
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * i / 8, x = Math.cos(a) * .48, y = Math.sin(a) * .45
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y)
  }
  for (let i = 8; i >= 0; i--) {
    const a = Math.PI * i / 8
    shape.lineTo(Math.cos(a) * .38, Math.sin(a) * .31 - .03)
  }
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, steps: 1 })
  geometry.translate(0, 0, -.5)
  geometry.rotateY(Math.PI / 2)
  const positions = geometry.getAttribute('position'), uv: number[] = []
  for (let i = 0; i < positions.count; i++) uv.push(positions.getX(i) + .5, positions.getZ(i) + .5)
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  return geometry
}

function StoneMaterial({ tile = false }: { tile?: boolean }) {
  const source = useLoader(THREE.TextureLoader, '/assets/textures/material-surfaces.png')
  const map = useMemo(() => {
    const t = source.clone(); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false
    t.repeat.set(.492, .492); t.offset.set(tile ? .504 : .004, .504); t.needsUpdate = true; return t
  }, [source, tile])
  return <meshStandardMaterial map={map} roughness={.9} onBeforeCompile={shader => {
    shader.vertexShader = 'varying vec3 stonePosition;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nstonePosition=position;')
    shader.fragmentShader = 'varying vec3 stonePosition;\n' + shader.fragmentShader.replace('#include <map_fragment>', `
      vec4 surfaceColor=texture2D(map,vMapUv);
      diffuseColor.rgb*=mix(vec3(1.),surfaceColor.rgb,.55);
    `).replace('#include <color_fragment>', `#include <color_fragment>
      vec3 grainCell=floor(stonePosition*38.);
      float grainValue=fract(sin(dot(grainCell,vec3(12.9898,78.233,37.719)))*43758.5453);
      diffuseColor.rgb*=.91+grainValue*.16;
    `)
  }} />
}

// Repeated real stones and tiles share geometry and draw calls, but retain depth and bevels.
function Blocks({ items, bevel = true, tiles = false }: { items: Block[]; bevel?: boolean; tiles?: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const geometry = useMemo(() => tiles ? roofTile() : bevel ? chamferedCube() : new THREE.BoxGeometry(), [bevel, tiles])
  useLayoutEffect(() => {
    const object = new THREE.Object3D(), color = new THREE.Color()
    items.forEach((b, i) => {
      object.position.set(...b.p); object.scale.set(...b.s); object.rotation.set(...(b.r ?? [0, 0, 0])); object.updateMatrix()
      mesh.current!.setMatrixAt(i, object.matrix); mesh.current!.setColorAt(i, color.set(b.c))
    })
    mesh.current!.instanceMatrix.needsUpdate = true
    if (mesh.current!.instanceColor) mesh.current!.instanceColor.needsUpdate = true
    mesh.current!.computeBoundingSphere()
  }, [items])
  return <instancedMesh ref={mesh} args={[geometry, undefined, items.length]} castShadow receiveShadow><StoneMaterial tile={tiles} /></instancedMesh>
}

export function Solid({ p, s, c = '#8a7964', r, emission = 0, unlit = false }: { p: V3; s: V3; c?: string; r?: V3; emission?: number; unlit?: boolean }) {
  return <mesh position={p} rotation={r} castShadow receiveShadow><boxGeometry args={s} />{unlit ? <meshBasicMaterial color={c} /> : <meshStandardMaterial color={c} roughness={.83} emissive={c} emissiveIntensity={emission} />}</mesh>
}

export function Greenery({ position, size = .7, kind = 0 }: { position: V3; size?: number; kind?: number }) {
  const source = useLoader(THREE.TextureLoader, '/assets/sprites/greenery.png')
  const texture = useMemo(() => {
    const t = source.clone(), top = kind < 2
    t.colorSpace = THREE.SRGBColorSpace; t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false
    t.repeat.set(.5, top ? 560 / 1254 : 694 / 1254); t.offset.set((kind % 2) * .5, top ? 694 / 1254 : 0); t.needsUpdate = true
    return t
  }, [source, kind])
  return <sprite position={position} scale={[size * 1.55, size * (kind === 1 ? .9 : 1.6), 1]} center={[.5, .055]}><spriteMaterial map={texture} color="#bccca1" alphaTest={.2} transparent /></sprite>
}

export function Lantern({ position, env, wall = false }: { position: V3; env: Env; wall?: boolean }) {
  const h = wall ? .65 : 2.9
  return <group position={position}>
    {!wall && <><Solid p={[0, h / 2, 0]} s={[.07, h, .07]} c="#273441" /><Solid p={[0, .12, 0]} s={[.32, .24, .32]} c="#59616a" /><Solid p={[0, .3, 0]} s={[.16, .28, .16]} c="#38434a" /></>}
    {wall && <><Solid p={[0, h + .38, -.24]} s={[.075, .075, .68]} c="#343744" /><Solid p={[0, h + .1, -.53]} s={[.15, .7, .08]} c="#353440" /></>}
    <Solid p={[0, h, 0]} s={[.27, .45, .27]} c="#ffbf65" emission={.3 + env.windows * .9} />
    {[-1, 1].flatMap(x => [-1, 1].map(z => <Solid key={`${x}${z}`} p={[x * .145, h, z * .145]} s={[.045, .52, .045]} c="#303543" unlit />))}
    <mesh position={[0, h + .37, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[.32, .25, 4]} /><meshBasicMaterial color="#323e4c" /></mesh>
    <Solid p={[0, h + .23, 0]} s={[.41, .05, .41]} c="#5b5960" unlit /><Solid p={[0, h - .25, 0]} s={[.37, .07, .37]} c="#4a4445" unlit />
    <pointLight position={[0, h - .4, .45]} color="#ffad48" intensity={env.windows * (wall ? 5 : 18)} distance={5} decay={1.5} />
  </group>
}

function Interior({ index, p, size, env }: { index: number; p: V3; size: [number, number]; env: Env }) {
  const source = useLoader(THREE.TextureLoader, '/assets/textures/shop-interiors.png')
  const map = useMemo(() => {
    const t = source.clone(); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false
    t.repeat.set(1 / 3 - .006, .97); t.offset.set(index / 3 + .003, .015); t.needsUpdate = true; return t
  }, [source, index])
  return <mesh position={p}><planeGeometry args={size} /><meshStandardMaterial map={map} emissiveMap={map} emissive="#ffcc84" emissiveIntensity={.35 + env.windows * .85} color="#ffe4b2" roughness={1} /></mesh>
}

function RecessedWindow({ x, y, z, w, h, index, env, upper = false }: { x: number; y: number; z: number; w: number; h: number; index: number; env: Env; upper?: boolean }) {
  return <group position={[x, y, z]}>
    <Solid p={[0, 0, -.18]} s={[w + .18, h + .18, .14]} c="#2d2426" />
    <Interior index={index} p={[0, 0, -.09]} size={[w, h]} env={env} />
    {[-1, 1].map(d => <Solid key={d} p={[d * (w / 2 + .045), 0, .06]} s={[.1, h + .22, .28]} c={upper ? '#b9a282' : '#6a4e37'} />)}
    {[-1, 1].map(d => <Solid key={d} p={[0, d * (h / 2 + .04), .06]} s={[w + .2, .095, .28]} c={upper ? '#bea47e' : '#785039'} />)}
    <Solid p={[0, 0, .07]} s={[.045, h, .09]} c="#594134" />
    <Solid p={[0, h * .17, .07]} s={[w, .04, .09]} c="#594134" />
    <Solid p={[0, -h / 2 - .14, .12]} s={[w + .36, .13, .44]} c="#c3a886" />
    {upper && [-1, 1].map(d => <group key={d} position={[d * (w / 2 + .19), 0, .03]} rotation={[0, d * .22, 0]}>
      <Solid p={[0, 0, 0]} s={[.2, h + .08, .06]} c={['#527a6b', '#92604d', '#726778'][index]} />
      {Array.from({ length: 6 }, (_, i) => <Solid key={i} p={[0, -.36 + i * .14, .04]} s={[.22, .035, .05]} c="#b09b71" />)}
    </group>)}
  </group>
}

function Roof({ height, index }: { height: number; index: number }) {
  const tiles = useMemo(() => {
    const out: Block[] = [], colors = ['#a55239', '#ad593d', '#9a4938']
    for (const side of [-1, 1]) for (let row = 0; row < 9; row++) for (let col = 0; col < 14; col++) {
      const t = row / 8, x = side * (.11 + t * 1.64), y = height + 1.13 - t * 1.13
      out.push({ p: [x, y, -1.51 + col * .239 + (row % 2) * .035], s: [.29, .13, .26], r: [0, 0, -side * .60], c: shade(colors[index], row * 63 + col * 29 + side, .36) })
    }
    for (let j = 0; j < 15; j++) out.push({ p: [0, height + 1.19, -1.58 + j * .24], s: [.28, .19, .26], c: shade('#c0744b', j, .3) })
    return out
  }, [height, index])
  return <>
    <Solid p={[-.84, height + .54, .1]} s={[2.12, .13, 3.45]} r={[0, 0, .60]} c="#493a39" />
    <Solid p={[.84, height + .54, .1]} s={[2.12, .13, 3.45]} r={[0, 0, -.60]} c="#493a39" />
    <Blocks items={tiles} tiles />
    {[-1, 1].map(s => <Solid key={s} p={[s * .87, height + .51, 1.91]} s={[2.09, .13, .18]} r={[0, 0, -s * .6]} c="#cd8a59" />)}
  </>
}

export function Shop({ index, env, onOpen }: { index: number; env: Env; onOpen: (id: ShopId) => void }) {
  const shop = shops[index], height = [4.0, 4.35, 3.9][index], front = 1.42
  const wallColor = ['#708e83', '#c6ad89', '#b79b9c'][index]
  const chimneyX = index === 1 ? -1.08 : .65
  const masonry = useMemo(() => {
    const list: Block[] = []
    for (let row = 0; row < 22; row++) for (let col = 0; col < 9; col++) {
      const x = -1.5 + col * .37 + (row % 2) * .13, y = .11 + row * .2
      if (x > 1.65 || y > height) continue
      const lowerHole = y < 1.87 && y > .18 && (Math.abs(x + .92) < .43 || Math.abs(x - .53) < .69)
      const upperHole = Math.abs(y - (height - .76)) < .53 && (Math.abs(x + .83) < .40 || Math.abs(x - .83) < .40)
      if (!lowerHole && !upperHole) list.push({ p: [x, y, front], s: [.35, .185, .16 + grain(row + col) * .04], c: shade(wallColor, row * 49 + col, .20) })
    }
    for (let row = 0; row < 21; row++) for (let col = 0; col < 8; col++) {
      const y = .12 + row * .2; if(y>height) continue
      list.push({ p: [1.64, y, -1.32 + col * .38 + (row % 2) * .11], s: [.17, .185, .35], c: shade(wallColor, row * 71 + col, .22) })
    }
    // Separate corner quoins catch the side light.
    for (let row = 0; row < Math.floor((height - .35) / .36) + 1; row++) for (const side of [-1, 1]) list.push({ p: [side * 1.58, .2 + row * .36, front + .11], s: [.25 + row % 2 * .13, .30, .24], c: shade('#9b9f95', row + side * 52) })
    return list
  }, [height, wallColor])
  const gable = useMemo(() => new THREE.Shape([new THREE.Vector2(-1.64, 0), new THREE.Vector2(1.64, 0), new THREE.Vector2(0, 1.15)]), [])
  return <group position={[shop.x, 0, -.45]}>
    <Solid p={[0, height / 2, -.32]} s={[3.25, height, 2.55]} c="#56514c" />
    <Solid p={[0, .15, 0]} s={[3.5, .3, 3]} c="#969483" />
    <Blocks items={masonry} />
    <mesh position={[0, height, front]} castShadow><shapeGeometry args={[gable]} /><meshStandardMaterial color={wallColor} roughness={1} /></mesh>
    <Roof height={height} index={index} />
    <Solid p={[0, height + .45, front + .1]} s={[.12, .88, .12]} c="#615347" />
    <Solid p={[0, height + .08, front + .13]} s={[3.13, .12, .17]} c="#766151" />
    {index !== 1 ? <group position={[0, height + .43, front + .21]}>
      <mesh><circleGeometry args={[.23, 16]} /><meshStandardMaterial color={index === 0 ? '#c9ba91' : '#658eaa'} emissive="#e6ad57" emissiveIntensity={env.windows * .16} /></mesh>
      <mesh position={[0, 0, .015]}><torusGeometry args={[.24, .038, 5, 16]} /><meshStandardMaterial color="#ac8a64" roughness={.85} /></mesh>
      <Solid p={[0, .065, .06]} s={[.025, .13, .02]} c="#4e4b44" />
      <Solid p={[.05, 0, .06]} s={[.11, .025, .02]} c="#4e4b44" />
    </group> : <group position={[0, height + .43, front + .21]}>
      <Solid p={[0, 0, 0]} s={[.45, .40, .09]} c="#413c3b" />
      {Array.from({length:4},(_,i)=><Solid key={i} p={[0,-.14+i*.09,.06]} s={[.43,.045,.08]} c="#a78b65" r={[.3,0,0]} />)}
    </group>}
    <Solid p={[chimneyX, height + 1.02, -.67]} s={[.40, 1.02, .44]} c="#8c7e77" />
    {Array.from({ length: 4 }, (_, i) => <Solid key={i} p={[chimneyX, height + .6 + i * .24, -.67]} s={[.44, .034, .48]} c="#5c6063" />)}
    <Solid p={[chimneyX, height + 1.57, -.67]} s={[.64, .14, .65]} c="#bdb39e" />
    <Solid p={[chimneyX, height + 1.66, -.67]} s={[.40, .05, .40]} c="#363139" />
    <Solid p={[0, 2.41, front + .1]} s={[3.44, .18, .28]} c="#76604a" />
    {[-.83, .83].map(x => <RecessedWindow key={x} x={x} y={height - .76} z={front + .12} w={.61} h={.85} index={index} env={env} upper />)}
    {[-.83, .83].map(x => <Greenery key={x} position={[x, height - 1.32, front + .27]} size={.66} kind={1} />)}
    <Solid p={[0, 2.23, front + .17]} s={[3.16, .46, .23]} c="#e3c697" emission={env.windows * .07} />
    <Solid p={[0, 2.48, front + .19]} s={[3.29, .075, .33]} c="#88684b" />
    <Solid p={[0, 1.99, front + .19]} s={[3.26, .07, .31]} c="#88684b" />
    <Html transform position={[0, 2.24, front + .302]} distanceFactor={4} zIndexRange={[20, 0]}><button className={`shop-sign sign-${shop.id}`} onClick={() => onOpen(shop.id)} aria-label={`进入${shop.label}`}>{shop.sign}</button></Html>
    <group position={[0, 1.91, front + .49]} rotation={[.28, 0, 0]}>
      {Array.from({ length: 12 }, (_, i) => <group key={i} position={[(i - 5.5) * .269, 0, 0]}>
        <Solid p={[0, 0, 0]} s={[.267, .065, .82]} c={i % 2 ? '#e5cda3' : shop.accent} />
        <Solid p={[0, -.115, .39]} s={[.267, .24, .055]} c={i % 2 ? '#e5cda3' : shop.accent} />
        <mesh position={[0, -.23, .39]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.132, .132, .05, 8, 1, false, 0, Math.PI]} /><meshStandardMaterial color={i % 2 ? '#e5cda3' : shop.accent} roughness={1} /></mesh>
      </group>)}
    </group>
    <RecessedWindow x={.52} y={.91} z={front + .14} w={1.18} h={1.42} index={index} env={env} />
    <RecessedWindow x={-.95} y={.96} z={front + .14} w={.62} h={1.61} index={index} env={env} />
    <Solid p={[-.95, .34, front + .24]} s={[.62, .51, .10]} c="#77533b" />
    <Solid p={[-.72, .8, front + .33]} s={[.05, .13, .07]} c="#edc275" />
    <Solid p={[-.95, .045, front + .4]} s={[1.07, .12, .6]} c="#bab29b" />
    <pointLight position={[.3, 1.2, front + .75]} intensity={env.windows * 6.5} distance={4.8} decay={1.5} color="#ffac49" />
    <Lantern position={[-1.45, 1.0, front + .44]} env={env} wall />
    <Greenery position={[-1.59, .07, front + .55]} size={.55} />
    <Greenery position={[1.39, .06, front + .60]} size={.73} />
    <Greenery position={[1.53, 1.15, front + .25]} size={1.7} kind={3} />
    <Greenery position={[-1.52, 2.21, front + .22]} size={1.5} kind={3} />
    <group position={[1.19, .02, 2.21]} rotation={[0, -.12, 0]}>
      <Solid p={[0, .42, 0]} s={[.48, .76, .07]} c="#8a633e" r={[-.13, 0, 0]} />
      <Solid p={[0, .45, .05]} s={[.36, .58, .045]} c="#334e51" r={[-.13, 0, 0]} />
      <Solid p={[0, .24, -.23]} s={[.42, .5, .05]} c="#76573e" r={[.34, 0, 0]} />
      <Solid p={[0, .58, .085]} s={[.18, .03, .02]} c="#bdbd91" />
      <Solid p={[0, .48, .1]} s={[.24, .025, .02]} c="#bdbd91" />
    </group>
    <mesh position={[0, 1, front + .39]} onClick={e => { e.stopPropagation(); onOpen(shop.id) }}><planeGeometry args={[2.8, 1.7]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
  </group>
}

export function Terrain({ env, onWalk }: { env: Env; onWalk: (p: THREE.Vector3) => void }) {
  const stones = useMemo(() => {
    const list: Block[] = []
    // Broad continuous upper street; coarser visible pavers with actual relief.
    for (let row = 0; row < 25; row++) for (let col = 0; col < 46; col++) {
      const x = -9 + col * .40 + (row % 2) * .20, z = -2.5 + row * .36
      list.push({ p: [x, -.055 + grain(row * 13 + col) * .025, z], s: [.37, .14, .32], c: shade('#8a8e87', row * 345 + col * 71, .40), r: [0, (grain(row * 8 + col) - .5) * .08, 0] })
    }
    // Massive coursed retaining wall continues down below the viewport, with buttresses.
    for (let row = 0; row < 13; row++) for (let col = 0; col < 26; col++) {
      const x = -9.2 + col * .73 + row % 2 * .36
      if (x > -.35 && x < 2.6) continue
      list.push({ p: [x, -.30 - row * .37, 6.64], s: [.68, .33, .48], c: shade('#6c727b', row * 159 + col, .35) })
    }
    // Lower street joins the descending staircase and runs off the image edge.
    for(let row=0;row<11;row++) for(let col=0;col<36;col++) list.push({p:[-9+col*.54,-2.70,10.1+row*.45],s:[.50,.15,.41],c:shade('#646c76',row*145+col,.3)})
    return list
  }, [])
  const caps = useMemo(() => {
    const out: Block[] = []
    for (let i = 0; i < 29; i++) {
      const x = -9.3 + i * .68; if(x>-.6 && x<2.85) continue
      out.push({ p:[x,.08,6.65], s:[.63,.17,.76], c:shade('#b1b1a0',i,.22) })
    }
    for(const x of [-8.9,-6.4,-3.9,3.6,6.1,8.6]) {
      for(let j=0;j<9;j++) out.push({p:[x,-.28-j*.42,6.94],s:[.55,.38,.48],c:shade('#80838a',j+x,.3)})
      out.push({p:[x,.43,6.69],s:[.37,.84,.41],c:'#8b979d'})
      out.push({p:[x,.9,6.69],s:[.56,.17,.59],c:'#c6c0a8'})
    }
    return out
  }, [])
  return <group>
    <Solid p={[0,-4.25,1.9]} s={[19.2,8.4,9.5]} c="#414958" />
    <Solid p={[0,-5.3,13]} s={[40,5,14]} c="#424a55" />
    <Blocks items={stones} /><Blocks items={caps} />
    {Array.from({length:12},(_,i)=><Solid key={i} p={[1.1,-.12-i*.225,6.72+i*.31]} s={[2.72,.24,.53]} c={shade('#a5a79c',i,.17)} />)}
    {[-.48,2.69].map(x=><group key={x}>
      <Solid p={[x,-1.08,8.39]} s={[.27,.35,4.45]} r={[.60,0,0]} c="#8c969e" />
      {Array.from({length:6},(_,i)=><Solid key={i} p={[x,.21-i*.44,6.95+i*.63]} s={[.33,.59,.35]} c="#939fa4" />)}
    </group>)}
    {[-7.7,-5.2,4.85,7.35].map(x=><group key={x}><Solid p={[x,.58,6.7]} s={[2.23,.09,.12]} c="#555454" /><Solid p={[x,.34,6.7]} s={[2.23,.07,.10]} c="#555454" /></group>)}
    <mesh rotation={[-Math.PI/2,0,0]} position={[.5,.045,2.4]} onClick={e=>{e.stopPropagation();onWalk(e.point)}}><planeGeometry args={[17.8,7.8]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    <Lantern position={[-5.5,.04,3.4]} env={env} /><Lantern position={[7.6,.04,1.3]} env={env} />
    <Lantern position={[-3.7,.08,6.50]} env={env} /><Lantern position={[5.9,.08,6.50]} env={env} />
    <Greenery position={[-6.3,.05,5.7]} size={1.15} kind={2} /><Greenery position={[6.6,.05,5.8]} size={1.0} kind={2} />
    <Greenery position={[-7.2,.05,1.1]} size={1.3} kind={2} />
    {[-7.6,-5.0,-2.7,4.7,7.5].map((x,i)=><Greenery key={x} position={[x,-1.7-(i%2)*.35,7.25]} size={1.75} kind={3} />)}
    {[-8,-5.1,4.8,7.3].map(x=><Greenery key={x} position={[x,.13,6.5]} size={.85} kind={1} />)}
    <group position={[-4.75,.08,5.55]}>
      {[0,1,2,3].map(i=><Solid key={i} p={[0,.43,-.22+i*.15]} s={[1.65,.075,.12]} c="#8b6945" />)}
      {[0,1,2].map(i=><Solid key={i} p={[0,.69+i*.14,-.29]} s={[1.65,.11,.07]} c="#8c724e" />)}
      {[-.65,.65].map(x=><Solid key={x} p={[x,.28,0]} s={[.08,.55,.48]} c="#343d40" />)}
    </group>
    {/* A connected raised lane behind the shops anchors them into the hillside. */}
    <Solid p={[7.95,1.1,-2.8]} s={[4.0,2.2,4.2]} c="#535c64" />
    {Array.from({length:7},(_,i)=><Solid key={i} p={[7.9,.15+i*.30,1.1-i*.45]} s={[1.45,.30,.59]} c="#929889" />)}
    <Greenery position={[8.9,2.2,-1.9]} size={1.5} kind={2} />
  </group>
}
