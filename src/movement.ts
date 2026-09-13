import { shops, type ShopId } from './content'
export type Position = { x: number; z: number }
export const spawn = { x: -.1, z: 2.9 }
export const bounds = { minX: -7.0, maxX: 8, minZ: 1.65, maxZ: 8.9 }
const obstacles = [
  { x1: -2.4, x2: -.2, z1: 7.8, z2: 8.9 }, // bench
  { x1: -6.32, x2: -5.68, z1: 2.08, z2: 2.72 }, // lamp
  { x1: -5.1, x2: -3.9, z1: 8.3, z2: 9.2 },
  { x1: 3.4, x2: 4.6, z1: 8.3, z2: 9.2 },
]
const blocked = (x: number, z: number) => (x > 3 && x < 6.5 && z < 2.5) || obstacles.some(o => x > o.x1 && x < o.x2 && z > o.z1 && z < o.z2)
export function move(position: Position, dx: number, dz: number, dt: number): Position {
  const length = Math.hypot(dx, dz)
  if (!length) return position
  const distance = 2.7 * Math.min(Math.max(dt, 0), .05)
  let x = Math.max(bounds.minX, Math.min(bounds.maxX, position.x + dx / length * distance))
  let z = Math.max(bounds.minZ, Math.min(bounds.maxZ, position.z + dz / length * distance))
  if (blocked(x, position.z)) x = position.x
  if (blocked(x, z)) z = position.z
  // The quay edge is diagonal in plan; the walking surface itself stays level.
  if(z > 9.14 + .5 * (x - .7)){ x = position.x; z = Math.min(position.z, 9.14 + .5 * (x - .7)) }
  return { x, z }
}
export function nearestShop(position: Position): ShopId | null {
  const found = shops.find(shop => Math.hypot(shop.x - position.x, 2.05 - position.z) < 1.35)
  return found?.id ?? null
}
export type WorldRuntime = { position: Position; keys: Set<string>; target: Position | null; active: boolean; paused: boolean; frame: number; direction: number; reset: number }
export const makeRuntime = (): WorldRuntime => ({ position: { ...spawn }, keys: new Set(), target: null, active: false, paused: false, frame: 0, direction: 0, reset: 0 })
