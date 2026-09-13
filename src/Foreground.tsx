import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

// Generated foreground framing, keyed at render time. Geometry and interaction remain behind it.
export function Foreground({ mobile }: { mobile: boolean }) {
  const map = useLoader(THREE.TextureLoader, '/assets/backgrounds/foreground-canopy-keyed.png')
  const uniforms = useMemo(() => ({ map: { value: map }, mobile: { value: mobile ? 1 : 0 } }), [map, mobile])
  return <mesh frustumCulled={false} renderOrder={1000}>
    <planeGeometry args={[2, 2]} />
    <shaderMaterial transparent depthTest={false} depthWrite={false} toneMapped={false} uniforms={uniforms}
      vertexShader="varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,.0,1.);}"
      fragmentShader={`uniform sampler2D map; uniform float mobile; varying vec2 vUv;
        void main(){
          vec4 c=texture2D(map,vUv);
          float chroma=min(c.r,c.b)-c.g;
          float alpha=1.-smoothstep(.05,.18,chroma);
          if(alpha<.35)discard;
          c.rb=min(c.rb,vec2(c.g+.04));
          gl_FragColor=vec4(pow(c.rgb,vec3(2.2)),alpha*(1.-mobile*.25));
        }`} />
  </mesh>
}
