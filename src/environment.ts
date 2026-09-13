export const wrapMinutes = (minutes: number) => ((minutes % 1440) + 1440) % 1440
export const localMinutes = (date = new Date()) => date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60
export const timeLabel = (minutes: number) => {
  const m = Math.floor(wrapMinutes(minutes))
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
export const phaseName = (minutes: number) => {
  const h = wrapMinutes(minutes) / 60
  return h < 5 || h >= 20 ? '夜晚' : h < 7 ? '晨曦' : h < 11 ? '上午' : h < 15 ? '午间' : h < 18 ? '下午' : '黄昏'
}
const keys = [
  { m: 0, daylight: 0, ambient: .65, windows: 1, tint: '#29365e', sunlight: '#b3c9ff', backdrop: .36 },
  { m: 300, daylight: .08, ambient: .75, windows: .9, tint: '#696881', sunlight: '#f8b391', backdrop: .55 },
  { m: 420, daylight: 1.1, ambient: 1.15, windows: .25, tint: '#b8cddd', sunlight: '#ffdbc2', backdrop: .94 },
  { m: 720, daylight: 2.1, ambient: 1.4, windows: .12, tint: '#c8e1ed', sunlight: '#fff0d6', backdrop: 1.22 },
  { m: 960, daylight: 1.6, ambient: 1.2, windows: .25, tint: '#c7bdc4', sunlight: '#ffd6a1', backdrop: 1.0 },
  { m: 1110, daylight: .85, ambient: .85, windows: .85, tint: '#66628c', sunlight: '#ffaf70', backdrop: .69 },
  { m: 1200, daylight: 0, ambient: .65, windows: 1, tint: '#29365e', sunlight: '#b3c9ff', backdrop: .36 },
  { m: 1440, daylight: 0, ambient: .65, windows: 1, tint: '#29365e', sunlight: '#b3c9ff', backdrop: .36 },
]
const mixColor = (a: string, b: string, t: number) => {
  const channel = (s: string, i: number) => parseInt(s.slice(i, i + 2), 16)
  return '#' + [1, 3, 5].map(i => Math.round(channel(a, i) * (1 - t) + channel(b, i) * t).toString(16).padStart(2, '0')).join('')
}
export function environmentAt(minutes: number) {
  const m = wrapMinutes(minutes)
  const i = keys.findIndex((k, index) => index < keys.length - 1 && m >= k.m && m < keys[index + 1].m)
  const a = keys[Math.max(0, i)], b = keys[Math.max(0, i) + 1]
  const raw = (m - a.m) / (b.m - a.m), t = raw * raw * (3 - 2 * raw)
  const mix = (v: number, w: number) => v + (w - v) * t
  return { daylight: mix(a.daylight, b.daylight), ambient: mix(a.ambient, b.ambient), windows: mix(a.windows, b.windows), backdrop: mix(a.backdrop, b.backdrop), tint: mixColor(a.tint, b.tint, t), sunlight: mixColor(a.sunlight, b.sunlight, t), phase: phaseName(m), sunAngle: Math.PI * (m - 360) / 840 }
}
