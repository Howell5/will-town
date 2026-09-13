import { expect, it } from 'vitest'
import { OrthographicCamera } from 'three'
import { configureReferenceCamera, projectPoint } from './camera'

const cameraAt = (w: number, h: number) => {
  const c = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, .1, 100)
  configureReferenceCamera(c, w, h, false)
  return c
}
it('keeps measured entrance and roof anchors within 25px of the reference', () => {
  const c = cameraAt(1487, 1058)
  const anchors: { world: [number,number,number]; screen: [number,number] }[] = [
    { world:[1.1,0,1.62], screen:[922,848] },
    { world:[1.1,6.15,1.62], screen:[922,378] },
    { world:[4.7,0,2.12], screen:[1200,882] },
    { world:[4.7,6.20,2.12], screen:[1195,406] },
  ]
  for(const a of anchors){
    const actual = projectPoint(c,1487,1058,a.world)
    expect(Math.hypot(actual[0]-a.screen[0],actual[1]-a.screen[1])).toBeLessThan(25)
  }
})
it('resizing cannot rotate the desktop camera or tilt vertical building edges', () => {
  const c = cameraAt(1487,1058), other = cameraAt(1280,720)
  expect(c.quaternion.angleTo(other.quaternion)).toBeLessThan(.000001)
  expect(projectPoint(c,1487,1058,[1.1,0,1.62])[0]).toBe(projectPoint(c,1487,1058,[1.1,6,1.62])[0])
})
