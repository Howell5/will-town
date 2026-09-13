import { Mesh, Sprite, type Object3D, type WebGLRenderer, type WebGLRenderTarget } from 'three'
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js'
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js'

/** Short-range crevice shading for solid geometry; never occlude image billboards or hit planes. */
export class ContactOcclusion extends SSAOPass {
  private cachedCamera = ''
  private composite: FullScreenQuad | null = null
  override dispose(){ this.composite?.dispose();super.dispose() }
  override setSize(width: number, height: number) {
    this.cachedCamera=''
    super.setSize(Math.max(1,Math.round(width*.65)),Math.max(1,Math.round(height*.65)))
  }
  override render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean) {
    // The opaque town is static and the moving character is excluded. Reuse AO
    // until framing changes instead of redrawing the town's normals every frame.
    const key=this.camera.matrixWorld.elements.join(',')+'|'+this.camera.projectionMatrix.elements.join(',')
    if(this.cachedCamera===key){
      this.composite??=new FullScreenQuad(this.copyMaterial)
      const target=renderer.getRenderTarget(),clear=renderer.autoClear
      renderer.setRenderTarget(readBuffer);renderer.autoClear=false
      this.composite.render(renderer)
      renderer.autoClear=clear;renderer.setRenderTarget(target)
      return
    }
    const hidden:Object3D[]=[]
    this.scene.traverse(object=>{
      const materials=object instanceof Mesh ? (Array.isArray(object.material)?object.material:[object.material]) : []
      if(object.visible && (object instanceof Sprite || materials.some(m=>!m.depthWrite || m.transparent || m.alphaTest>0))) {
        hidden.push(object);object.visible=false
      }
    })
    this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix)
    this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse)
    try { super.render(renderer,writeBuffer,readBuffer,deltaTime,maskActive);this.cachedCamera=key }
    finally { for(const object of hidden)object.visible=true }
  }
}
