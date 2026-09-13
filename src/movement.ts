import { shops, type ShopId } from './content'
export type Position = { x: number; z: number }
export const spawn = { x: 1.1, z: 4.5 }
export const bounds = { minX: -7.0, maxX: 8, minZ: 1.65, maxZ: 6.1 }
const obstacles = [
  { x1: -5.85, x2: -3.7, z1: 5.05, z2: 6.05 }, // bench
  { x1: -5.82, x2: -5.18, z1: 3.08, z2: 3.72 }, // lamp
  { x1: -6.95, x2: -5.72, z1: 5.25, z2: 6.1 },
  { x1: 6.0, x2: 7.2, z1: 5.25, z2: 6.1 },
]
const blocked = (x: number, z: number) => obstacles.some(o => x > o.x1 && x < o.x2 && z > o.z1 && z < o.z2)
export function move(position: Position, dx: number, dz: number, dt: number): Position {
  const length = Math.hypot(dx, dz)
  if (!length) return position
  const distance = 2.7 * Math.min(Math.max(dt, 0), .05)
  let x = Math.max(bounds.minX, Math.min(bounds.maxX, position.x + dx / length * distance))
  let z = Math.max(bounds.minZ, Math.min(bounds.maxZ, position.z + dz / length * distance))
  if (blocked(x, position.z)) x = position.x
  if (blocked(x, z)) z = position.z
  return { x, z }
}
export function nearestShop(position: Position): ShopId | null {
  const found = shops.find(shop => Math.hypot(shop.x - position.x, 2.05 - position.z) < 1.35)
  return found?.id ?? null
}
export type WorldRuntime = { position: Position; keys: Set<string>; target: Position | null; active: boolean; paused: boolean; frame: number; direction: number; reset: number }
export const makeRuntime = (): WorldRuntime => ({ position: { ...spawn }, keys: new Set(), target: null, active: false, paused: false, frame: 0, direction: 0, reset: 0 })
