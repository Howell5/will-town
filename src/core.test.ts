import { describe, expect, it } from 'vitest'
import { environmentAt, localMinutes, phaseName, wrapMinutes } from './environment'

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
