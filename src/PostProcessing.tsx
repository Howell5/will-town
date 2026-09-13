import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { NoBlending, Vector2 } from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { SavePass } from 'three/addons/postprocessing/SavePass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'

export function PostProcessing({ glow, mobile }: { glow: number; mobile: boolean }) {
  const { gl, scene, camera, size } = useThree()
  const pipeline = useRef<{ composer: EffectComposer; bloom: UnrealBloomPass } | null>(null)
  useEffect(() => {
    const composer = new EffectComposer(gl)
    const render = new RenderPass(scene, camera), alpha = new SavePass()
    const bloom = new UnrealBloomPass(new Vector2(1, 1), .10, .25, 1.6)
    const output = new OutputPass()
    // Preserve the original scene coverage. Bloom must not turn the transparent sky black.
    const finish = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, sceneAlpha: { value: null } },
      vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform sampler2D tDiffuse; uniform sampler2D sceneAlpha; varying vec2 vUv; void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float a=texture2D(sceneAlpha,vUv).a; a=max(a,min(max(c.r,max(c.g,c.b))*.28,.3));float edge=smoothstep(.15,.82,length((vUv-.5)*vec2(1.,.7)));gl_FragColor=vec4(c*(1.-edge*.13)*a,a);}',
    })
    finish.uniforms.sceneAlpha.value = alpha.renderTarget.texture
    finish.material.blending = NoBlending
    for (const pass of [render, alpha, bloom, output, finish]) composer.addPass(pass)
    composer.setPixelRatio(mobile ? .85 : 1)
    composer.setSize(size.width, size.height)
    pipeline.current = { composer, bloom }
    return () => {
      pipeline.current = null
      for (const pass of [render, alpha, bloom, output, finish]) pass.dispose()
      composer.dispose()
    }
  }, [gl, scene, camera, mobile])
  useEffect(() => { pipeline.current?.composer.setSize(size.width, size.height) }, [size])
  useFrame((_, dt) => {
    if (import.meta.env.DEV) gl.domElement.dataset.composer = pipeline.current ? 'active' : 'fallback'
    if (!pipeline.current) { gl.render(scene, camera); return }
    pipeline.current.bloom.strength = glow * (mobile ? .07 : .10)
    pipeline.current.composer.render(dt)
  }, 1)
  return null
}
