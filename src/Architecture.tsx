import { useLayoutEffect, useMemo, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { BookOpen, GearSix, Camera } from '@phosphor-icons/react'
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
  return <sprite position={position} scale={[size * 1.55, size * (kind === 1 ? .9 : 1.6), 1]} center={[.5, .055]}><spriteMaterial map={texture} color="#ffffff" alphaTest={.2} transparent /></sprite>
}

export function Lantern({ position, env, wall = false }: { position: V3; env: Env; wall?: boolean }) {
  const h = wall ? .65 : 2.9
  return <group position={position}>
    {!wall && <><Solid p={[0, h / 2, 0]} s={[.07, h, .07]} c="#273441" /><Solid p={[0, .12, 0]} s={[.32, .24, .32]} c="#59616a" /><Solid p={[0, .3, 0]} s={[.16, .28, .16]} c="#38434a" /></>}
    {!wall && [h-.45,h-.33,.48,.62].map(y=><mesh key={y} position={[0,y,0]} castShadow><cylinderGeometry args={[.09,.11,.06,8]}/><meshStandardMaterial color="#242d39" metalness={.35} roughness={.5}/></mesh>)}
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
    {upper ? <mesh position={[0,0,-.09]}><planeGeometry args={[w,h]}/><meshStandardMaterial color="#ffce68" emissive="#ffad32" emissiveIntensity={.25+env.windows*1.25} roughness={.5}/></mesh> : <Interior index={index} p={[0, 0, -.09]} size={[w, h]} env={env} />}
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
    for (const side of [-1, 1]) for (let row = 0; row < 6; row++) for (let col = 0; col < 10; col++) {
      const t = row / 5, x = side * (.11 + t * 1.64), y = height + 1.13 - t * 1.13
      out.push({ p: [x, y, -1.40 + col * .35 + (row % 2) * .04], s: [.44, .21, .36], r: [0, 0, -side * .60], c: shade(colors[index], row * 63 + col * 29 + side, .36) })
    }
    for (let j = 0; j < 15; j++) out.push({ p: [0, height + 1.19, -1.58 + j * .24], s: [.35, .24, .29], c: shade('#c0744b', j, .3) })
    return out
  }, [height, index])
  return <>
    <Solid p={[-.84, height + .54, .1]} s={[2.12, .13, 3.45]} r={[0, 0, .60]} c="#493a39" />
    <Solid p={[.84, height + .54, .1]} s={[2.12, .13, 3.45]} r={[0, 0, -.60]} c="#493a39" />
    <Blocks items={tiles} tiles />
    <Blocks items={[-1,1].flatMap(side=>Array.from({length:8},(_,i)=>({p:[side*(.11+i*.23),height+1.14-i*.157,1.85] as V3,s:[.29,.24,.34] as V3,r:[0,0,-side*.60] as V3,c:shade('#bf7048',i+side*9,.22)})))} />
  </>
}

export function Shop({ index, env, onOpen }: { index: number; env: Env; onOpen: (id: ShopId) => void }) {
  const shop = shops[index], height = [4.7, 5.0, 5.05][index], front = 1.42
  const signY = [3.30, 3.72, 3.92][index], awningY = signY - .52
  const wallColor = ['#758d79', '#c1a47c', '#b59c8e'][index]
  const chimneyX = index === 1 ? 1.21 : 1.25
  const masonry = useMemo(() => {
    const list: Block[] = []
    for (let row = 0; row < 34; row++) for (let col = 0; col < 12; col++) {
      const x = -1.52 + col * .285 + (row % 2) * .14, y = .09 + row * .18
      const gableTop = height + Math.max(0,1-Math.abs(x)/1.64)*1.15
      if (x > 1.65 || y > gableTop) continue
      const lowerHole = y < awningY-.22 && y > .12 && (Math.abs(x - .86) < .49 || Math.abs(x + .65) < .77)
      const upperHole = Math.abs(y - (height - .60)) < .62 && Math.abs(x) < .43
      if (!lowerHole && !upperHole) list.push({ p:[x,y,front],s:[.265,.16,.18+grain(row+col)*.025], c:shade(wallColor,row*49+col,.16) })
    }
    for(let row=0;row<31;row++) for(let col=0;col<9;col++) {
      const y=.1+row*.18;if(y>height)continue
      list.push({p:[1.64,y,-1.33+col*.34],s:[.17,.16,.32],c:shade(wallColor,row*71+col,.22)})
    }
    for(let row=0;row<Math.floor(height/.28);row++) for(const side of [-1,1]) list.push({p:[side*1.59,.14+row*.28,front+.09],s:[.20+row%2*.10,.24,.22],c:shade(wallColor,row+side*52,.2)})
    return list
  },[height,awningY,wallColor])
  const gable=useMemo(()=>new THREE.Shape([new THREE.Vector2(-1.64,0),new THREE.Vector2(1.64,0),new THREE.Vector2(0,1.15)]),[])
  const displayH=awningY-.41, displayY=displayH/2+.13
  return <group position={[shop.x,0,[-.35,.2,.7][index]]}><group scale={[1,1,.68]} position={[0,0,front*.32]}>
    <Solid p={[0,height/2,-.32]} s={[3.25,height,2.55]} c={wallColor} />
    <Solid p={[0,.04,0]} s={[3.5,.18,3]} c="#b6ae8d" />
    <Blocks items={masonry} />
    <mesh position={[0,height,front-.08]} castShadow><shapeGeometry args={[gable]} /><meshStandardMaterial color={wallColor} roughness={1} /></mesh>
    <Roof height={height} index={index} />
    <Solid p={[chimneyX,height+.85,-.77]} s={[.44,1.34,.46]} c="#aaa499" />
    {Array.from({length:6},(_,i)=><group key={i}><Solid p={[chimneyX,height+.25+i*.22,-.77]} s={[.47,.028,.49]} c="#59626b" /><Solid p={[chimneyX+(i%2?.08:-.1),height+.35+i*.22,-.53]} s={[.024,.2,.016]} c="#62646b" /></group>)}
    <Solid p={[chimneyX,height+1.59,-.77]} s={[.64,.17,.63]} c="#975432" /><Solid p={[chimneyX,height+1.70,-.77]} s={[.38,.06,.38]} c="#343440" />
    <RecessedWindow x={0} y={height-.60} z={front+.12} w={.77} h={1.02} index={index} env={env} upper />
    {[-.98,.97].map(x=><Greenery key={x} position={[x,signY+.44,front+.27]} size={.69} kind={1} />)}
    <Solid p={[0,signY,front+.21]} s={[3.20,.59,.22]} c="#ead3a1" emission={env.windows*.11} />
    <Solid p={[0,signY+.32,front+.21]} s={[3.28,.06,.30]} c="#ab8052" /><Solid p={[0,signY-.32,front+.21]} s={[3.28,.06,.30]} c="#98714c" />
    {[-1.43,1.43].flatMap(x=>[-.20,.20].map(y=><mesh key={x+','+y} position={[x,signY+y,front+.34]}><sphereGeometry args={[.03,6,4]} /><meshStandardMaterial color="#615a48" /></mesh>))}
    <Html transform position={[0,signY,front+.335]} distanceFactor={4} zIndexRange={[20,0]}><button className={`shop-sign sign-${shop.id}`} onClick={()=>onOpen(shop.id)} aria-label={`进入${shop.label}`}>{index===0?<BookOpen weight="duotone"/>:index===1?<GearSix weight="fill"/>:<Camera weight="fill"/>}{shop.sign}</button></Html>
    <group position={[0,awningY,front+.48]} rotation={[.22,0,0]}>
      {Array.from({length:12},(_,i)=><group key={i} position={[(i-5.5)*.273,0,0]}>
        <Solid p={[0,0,0]} s={[.271,.065,.87]} c={i%2?'#f2dfbb':shop.accent} />
        <Solid p={[0,-.105,.42]} s={[.271,.20,.055]} c={i%2?'#f2dfbb':shop.accent} />
        <mesh position={[0,-.205,.42]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.133,.133,.05,8,1,false,0,Math.PI]} /><meshStandardMaterial color={i%2?'#f2dfbb':shop.accent} roughness={1} /></mesh>
      </group>)}
    </group>
    <RecessedWindow x={-.65} y={displayY} z={front+.13} w={1.33} h={displayH} index={index} env={env} />
    <RecessedWindow x={.91} y={displayY} z={front+.13} w={.71} h={displayH} index={index} env={env} />
    <Solid p={[.91,.40,front+.27]} s={[.72,.61,.11]} c={['#695b35','#785733','#85634f'][index]} />
    {[-.22,.22].map(x=><Solid key={x} p={[.91+x,.40,front+.34]} s={[.026,.48,.025]} c="#b8955d" />)}
    <Solid p={[.61,1.0,front+.35]} s={[.06,.16,.07]} c="#edc275" />
    <Solid p={[.91,.035,front+.40]} s={[1.10,.10,.64]} c="#c7bd9d" />
    <pointLight position={[.3,1.5,front+.85]} intensity={env.windows*13} distance={5} decay={1.5} color="#ffb04b" />
    <Lantern position={[1.46,1.26,front+.45]} env={env} wall />
    <Greenery position={[-1.50,.05,front+.60]} size={.87} />
    <Greenery position={[1.50,.03,front+.76]} size={.76} />
    {[-1.67,1.66].map((x,i)=><group key={x}><Greenery position={[x,.8,front+.35]} size={2.0} kind={3} /><Greenery position={[x,2.55+i*.28,front+.20]} size={1.72} kind={3} /><Greenery position={[x,4.20,front-.03]} size={1.20} kind={3} /></group>)}
    <group position={[index===0?-1.95:1.20,.03,2.67]} rotation={[0,-.10,0]}>
      <Solid p={[0,.55,0]} s={[.79,1.02,.10]} c="#916b42" r={[-.14,0,0]} /><Solid p={[0,.60,.07]} s={[.64,.83,.06]} c="#253542" r={[-.14,0,0]} />
      <Solid p={[0,.35,-.30]} s={[.65,.70,.06]} c="#785332" r={[.32,0,0]} />
      <Html transform position={[0,.62,.17]} distanceFactor={4} zIndexRange={[15,0]}><span className="chalk-icon" aria-hidden="true">{index===0?<BookOpen weight="duotone"/>:index===1?<GearSix weight="fill"/>:<Camera weight="fill"/>}</span></Html>
    </group>
    <pointLight position={[0,.7,front+1.5]} intensity={env.windows*18} distance={4.5} decay={2} color="#ffad36" />
    <mesh position={[0,1.3,front+.39]} onClick={e=>{e.stopPropagation();onOpen(shop.id)}}><planeGeometry args={[2.8,2.3]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
  </group></group>
}

export function Terrain({ env, onWalk }: { env: Env; onWalk: (p: THREE.Vector3) => void }) {
  const stones = useMemo(() => {
    const list: Block[] = []
    // Broad continuous upper street; coarser visible pavers with actual relief.
    for (let row = 0; row < 49; row++) for (let col = 0; col < 43; col++) {
      const x = -7.5 + col * .40 + (row % 2) * .20, z = -2.5 + row * .36
      if(z > streetEdge(x)-.18) continue
      list.push({ p: [x, -.055 + grain(row * 13 + col) * .025, z], s: [.37, .14, .32], c: shade('#8a8e87', row * 345 + col * 71, .40), r: [0, (grain(row * 8 + col) - .5) * .08, 0] })
    }
    // Massive coursed retaining wall continues down below the viewport, with buttresses.
    for (let row = 0; row < 13; row++) for (let col = 0; col < 24; col++) {
      const x = -7.55 + col * .73 + row % 2 * .36
      list.push({ p: [x, -.30 - row * .37, streetEdge(x)], s: [.78, .33, .48], r:[0,-Math.atan(.5),0], c: shade('#6c727b', row * 159 + col, .35) })
    }
    // Lower street joins the descending staircase and runs off the image edge.
    for(let row=0;row<11;row++) for(let col=0;col<36;col++) list.push({p:[-9+col*.54,-2.70,10.1+row*.45],s:[.50,.15,.41],c:shade('#646c76',row*145+col,.3)})
    return list
  }, [])
  const caps = useMemo(() => {
    const out: Block[] = []
    for (let i = 0; i < 26; i++) {
      const x = -7.65 + i * .68;
      out.push({ p:[x,.08,streetEdge(x)], s:[.73,.17,.76], r:[0,-Math.atan(.5),0], c:shade('#b1b1a0',i,.22) })
    }
    for(const x of [-7.5,-5.0,-2.5,0,2.5,5.0,7.5,10.0]) {
      for(let j=0;j<9;j++) out.push({p:[x,-.28-j*.42,streetEdge(x)+.3],s:[.55,.38,.48],c:shade('#80838a',j+x,.3)})
      out.push({p:[x,.43,streetEdge(x)],s:[.37,.84,.41],c:'#8b979d'})
      out.push({p:[x,.9,streetEdge(x)],s:[.56,.17,.59],c:'#c6c0a8'})
    }
    return out
  }, [])
  return <group>
    <GroundMass />
    <Solid p={[0,-5.3,13]} s={[40,5,14]} c="#424a55" />
    <Blocks items={stones} /><Blocks items={caps} />
    {[-6.25,-3.75,-1.25,1.25,3.75,6.25,8.75].map(x=><group key={x}><Solid p={[x,.58,streetEdge(x)]} r={[0,-Math.atan(.5),0]} s={[2.57,.09,.12]} c="#555454" /><Solid p={[x,.34,streetEdge(x)]} r={[0,-Math.atan(.5),0]} s={[2.57,.07,.10]} c="#555454" /></group>)}
    <mesh rotation={[-Math.PI/2,0,0]} position={[.5,.045,5.1]} onClick={e=>{e.stopPropagation();onWalk(e.point)}}><planeGeometry args={[15.8,8.0]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    <Lantern position={[-6.0,.04,2.4]} env={env} /><Lantern position={[7.5,2.35,.25]} env={env} />

    <Greenery position={[-4.5,.05,8.8]} size={1.15} kind={2} /><Greenery position={[4.0,.05,8.8]} size={1.0} kind={2} />
    <Greenery position={[-7.2,.05,1.1]} size={1.3} kind={2} />
    {[-7.6,-5.0,-2.7,4.7,7.5].map((x,i)=><Greenery key={x} position={[x,-1.7-(i%2)*.35,streetEdge(x)+.7]} size={1.75} kind={3} />)}
    {[-8,-5.1,4.8,7.3].map(x=><Greenery key={x} position={[x,.13,streetEdge(x)-.1]} size={.85} kind={1} />)}
    <group position={[-1.3,.08,8.3]}>
      {[0,1,2,3].map(i=><Solid key={i} p={[0,.43,-.22+i*.15]} s={[1.65,.075,.12]} c="#8b6945" />)}
      {[0,1,2].map(i=><Solid key={i} p={[0,.69+i*.14,-.29]} s={[1.65,.11,.07]} c="#8c724e" />)}
      {[-.65,.65].map(x=><Solid key={x} p={[x,.28,0]} s={[.08,.55,.48]} c="#343d40" />)}
    </group>
    <BoundaryWall />
  </group>
}

function BoundaryWall(){
 const stones=useMemo(()=>{
  const out:Block[]=[]
  for(let row=0;row<4;row++)for(let col=0;col<10;col++)out.push({p:[-8.6+col*.43+row%2*.2,.14+row*.22,1.12],s:[.40,.20,.34],c:shade('#81908c',row*41+col,.26)})
  for(let row=0;row<29;row++)for(let col=0;col<6;col++)out.push({p:[7.25+col*.38+row%2*.16,.13+row*.24,-.75],s:[.35,.22,.47],c:shade('#989993',row*57+col,.25)})
  return out
 },[])
 return <><Blocks items={stones}/>{[-8.0,-6.9,-5.1].map(x=><Greenery key={x} position={[x,.95,1.06]} size={.70} kind={1}/>)}<Greenery position={[8.5,4.6,-.4]} size={2.3} kind={3}/>{Array.from({length:10},(_,i)=><Solid key={i} p={[7.25,.1+i*.23,3.1-i*.36]} s={[1.28,.22,.48]} c="#a0a198"/>)}</>
}

// A horizontal street with an angled plan boundary: never a tilted slab.
const streetEdge=(x:number)=>9.64+.5*(x-.7)
function GroundMass(){
 const shape=useMemo(()=>new THREE.Shape([new THREE.Vector2(-7.8,-2.9),new THREE.Vector2(9.2,-2.9),new THREE.Vector2(9.2,streetEdge(9.2)),new THREE.Vector2(-7.8,streetEdge(-7.8))]),[])
 return <mesh rotation={[Math.PI/2,0,0]} position={[0,-.13,0]} receiveShadow><extrudeGeometry args={[shape,{depth:8.4,bevelEnabled:false,steps:1}]}/><meshStandardMaterial color="#4e5963" roughness={1}/></mesh>
}
