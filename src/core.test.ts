import { describe, expect, it } from 'vitest'
import { environmentAt, localMinutes, phaseName, wrapMinutes } from './environment'
import { bounds, move, nearestShop } from './movement'

describe('a local day', () => {
  it('uses device wall-clock time', () => expect(localMinutes(new Date(2026, 8, 13, 18, 30, 0))).toBe(1110))
  it('wraps midnight continuously', () => {
    expect(wrapMinutes(-1)).toBe(1439)
    expect(environmentAt(1440)).toEqual(environmentAt(0))
    expect(environmentAt(1439).windows).toBeCloseTo(environmentAt(0).windows)
  })
  it('keeps all daily samples finite and illuminated', () => {
    for (let m = 0; m < 1440; m++) {
      const env = environmentAt(m)
      expect(env.ambient).toBeGreaterThan(.5)
      expect(Number.isFinite(env.daylight)).toBe(true)
      expect(env.windows).toBeGreaterThanOrEqual(0)
    }
    expect(phaseName(1110)).toBe('黄昏')
    expect(phaseName(1300)).toBe('夜晚')
  })
})
describe('walking and entrances', () => {
  it('normalizes diagonal walking', () => {
    const a = move({ x: 0, z: 3 }, 1, 0, .02), b = move({ x: 0, z: 3 }, 1, 1, .02)
    expect(Math.hypot(a.x, a.z - 3)).toBeCloseTo(Math.hypot(b.x, b.z - 3))
  })
  it('cannot pass the shopfront or plaza edge', () => {
    expect(move({ x: bounds.maxX, z: bounds.minZ }, 1, -1, 10)).toEqual({ x: bounds.maxX, z: bounds.minZ })
  })
  it('offers E only within reach of a real entrance', () => {
    expect(nearestShop({ x: 1.1, z: 2.3 })).toBe('berryon')
    expect(nearestShop({ x: 1.1, z: 5 })).toBeNull()
  })
  it('blocks the bench while allowing movement along its edge', () => {
    const p = move({ x: -4.8, z: 5.04 }, 1, 1, .05)
    expect(p.z).toBe(5.04)
    expect(p.x).toBeGreaterThan(-4.8)
  })
})
