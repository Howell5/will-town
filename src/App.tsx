import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import { ArrowUpRight, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Leaf, MoonStars, Sun, SlidersHorizontal, X, ArrowCounterClockwise, Play, Pause, BookOpen, Cube, Check } from '@phosphor-icons/react'
import { environmentAt, localMinutes, phaseName, timeLabel } from './environment'
import { getShop, shops, type ShopId } from './content'
import { makeRuntime, move, spawn } from './movement'
const World = lazy(() => import('./World'))
type Panel = ShopId | 'products' | null

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <div className="scene-fallback"><p>小镇场景暂时没能加载。</p><p>你仍然可以通过顶部「产品」打开 Berryon。</p><button onClick={() => window.location.reload()}>重新加载</button></div> : this.props.children }
}
function useMedia(query: string) {
  const [value, setValue] = useState(() => window.matchMedia(query).matches)
  useEffect(() => { const media = window.matchMedia(query); const update = () => setValue(media.matches); media.addEventListener('change', update); update(); return () => media.removeEventListener('change', update) }, [query])
  return value
}
export default function App() {
  const runtime = useRef(makeRuntime()).current
  const region = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDialogElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const [ready, setReady] = useState(false), [exploring, setExploring] = useState(false)
  const [near, setNear] = useState<ShopId | null>(null), [panel, setPanel] = useState<Panel>(null)
  const [clock, setClock] = useState(localMinutes), [preview, setPreview] = useState<number | null>(null)
  const [toolsOpen, setToolsOpen] = useState(false), [playing, setPlaying] = useState(false), [cinema, setCinema] = useState(false)
  const mobile = useMedia('(max-width: 760px)'), reduced = useMedia('(prefers-reduced-motion: reduce)')
  const minutes = preview ?? clock, env = environmentAt(minutes)
  const onReady = useCallback(() => setReady(true), [])
  const onExplore = useCallback(() => { runtime.active = true; setExploring(true); region.current?.focus({ preventScroll: true }) }, [runtime])
  const onOpen = useCallback((id: Panel) => {
    restoreFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    runtime.keys.clear(); runtime.target = null; runtime.paused = true; setPanel(id)
  }, [runtime])
  const onClose = useCallback(() => {
    setPanel(null); runtime.paused = false
    requestAnimationFrame(() => { const target = restoreFocus.current; (target?.isConnected ? target : region.current)?.focus({ preventScroll: true }) })
  }, [runtime])
  const reset = () => { runtime.position = { ...spawn }; runtime.direction = 0; runtime.target = null; runtime.keys.clear(); runtime.active = false; setNear(null); setExploring(false); setCinema(false) }
  useEffect(() => {
    const update = () => setClock(localMinutes()), timer = window.setInterval(update, 1000)
    document.addEventListener('visibilitychange', update)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', update) }
  }, [])
  useEffect(() => {
    if (!playing || reduced) return
    const timer = window.setInterval(() => setPreview(m => ((m ?? localMinutes()) + 6) % 1440), 100)
    return () => clearInterval(timer)
  }, [playing, reduced])
  useEffect(() => {
    if (panel && panelRef.current && !panelRef.current.open) panelRef.current.showModal()
    if (!panel && panelRef.current?.open) panelRef.current.close()
  }, [panel])
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'escape') { if (!panel) { setToolsOpen(false); setCinema(false) } return }
      if (panel || e.ctrlKey || e.metaKey || e.altKey) return
      const target = e.target as HTMLElement
      if (target.matches('input, textarea, select, button, a, [contenteditable="true"]')) return
      if (key === 'e' && near) { e.preventDefault(); onOpen(near); return }
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault()
        if (!runtime.keys.has(key)) {
          const dx = Number(key === 'd' || key === 'arrowright') - Number(key === 'a' || key === 'arrowleft')
          const dz = Number(key === 's' || key === 'arrowdown') - Number(key === 'w' || key === 'arrowup')
          runtime.position = move(runtime.position, dx, dz, 1 / 60)
          runtime.direction = dx ? (dx > 0 ? 2 : 1) : dz > 0 ? 0 : 3
        }
        runtime.keys.add(key); runtime.target = null; runtime.active = true; setExploring(true)
      }
    }
    const up = (e: KeyboardEvent) => runtime.keys.delete(e.key.toLowerCase())
    const clear = () => { runtime.keys.clear(); runtime.target = null }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', clear); document.addEventListener('visibilitychange', clear)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', clear); document.removeEventListener('visibilitychange', clear) }
  }, [near, panel, runtime, onOpen])
  const previewTime = (m: number) => { setPreview(m); setPlaying(false) }
  const selected = panel && panel !== 'products' ? getShop(panel) : null
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return <main className={`town-app ${env.daylight > 1 ? 'is-day' : ''} ${exploring ? 'is-exploring' : ''} ${cinema ? 'is-cinema' : ''}`} style={{ '--sky-tint': env.tint, '--backdrop-brightness': env.backdrop } as CSSProperties}>
    <a href="#content-navigation" className="skip-link">跳到产品入口</a>
    <div className="backdrop" aria-hidden="true"><img src="/assets/backgrounds/reference-dusk-v2.png" alt="" /><div className="sky-tint" /></div>
    <header className="header"><button className="brand" onClick={reset} aria-label="回到小镇首页"><Leaf size={36} weight="duotone" /><span>WILL <span className="brand-cn">的小镇</span></span><span className="edition">VOL. 001</span></button><nav id="content-navigation" aria-label="主导航"><button onClick={() => onOpen('products')}>产品<span className="nav-dot" /></button><button onClick={() => onOpen('journal')}>开发手记</button><button onClick={() => onOpen('studio')}>关于我 <ArrowUpRight size={14} /></button></nav></header>
    <section className="introduction" aria-label="欢迎来到 Will 的小镇"><p className="eyebrow"><span className="status-dot" /> 一个独立开发者的数字住处</p><h1>小镇的灯亮着，<br />新的<span>想法</span><br className="mid-break" />也在生长。</h1><p className="intro-copy">我是 Will，一名独立开发者。<br />这里的每家小店，都放着我做的产品。</p><div className="intro-actions"><button className="primary-button" onClick={onExplore} disabled={!ready}>{ready ? '逛逛我的产品' : '正在布置小镇…'}<ArrowRight size={20} /></button><button className="text-button" onClick={() => onOpen('products')}>直接查看产品列表 <ArrowUpRight size={16} /></button></div><div className="tiny-note"><Cube size={14} /> 一条小街，一些正在发生的事。</div></section>
    <div ref={region} className="world-region" tabIndex={0} role="region" aria-label="可探索的小镇。方向键或 WASD 移动，靠近店铺按 E 进入。也可直接点击店招。" data-ready={ready} data-phase={env.phase}><SceneBoundary><Suspense fallback={null}><World showIntro={!exploring} minutes={minutes} runtime={runtime} reduced={reduced} mobile={mobile} onOpen={onOpen} onNear={setNear} onExplore={onExplore} onReady={onReady} region={region} /></Suspense></SceneBoundary></div>
    <div className="place-caption" aria-hidden="true"><span>01 — 创作者小街</span><small>每一个想法，都有一扇亮着的窗。</small></div>
    {near && exploring && !panel && <div className="entrance-prompt"><button onClick={() => onOpen(near)}><kbd>E</kbd><span>走进{getShop(near).label}</span><ArrowRight size={16} /></button></div>}
    <footer className="bottom-bar"><div className="location"><span className="status-dot" /><span>WILL TOWN</span><span className="location-detail">小镇开放中</span></div><div className="keyboard-hint"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span>散步</span><i /><kbd>E</kbd><span>进店</span><i /><span>也可以点击地面与店招</span></div><button className={`time-button ${preview !== null ? 'previewing' : ''}`} onClick={() => setToolsOpen(v => !v)} aria-expanded={toolsOpen} aria-controls="environment-controls">{env.daylight < .2 ? <MoonStars size={17} /> : <Sun size={17} />}<span>{timeLabel(minutes)}</span><span>{env.phase}</span><SlidersHorizontal size={15} /></button></footer>
    {mobile && exploring && !panel && <div className="touch-controls" aria-label="移动控制">{[{ key: 'arrowleft', label: '向左走', icon: ArrowLeft }, { key: 'arrowup', label: '向前走', icon: ArrowUp }, { key: 'arrowdown', label: '向后走', icon: ArrowDown }, { key: 'arrowright', label: '向右走', icon: ArrowRight }].map(item => <button key={item.key} aria-label={item.label} onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); runtime.target = null; const dx = Number(item.key === 'arrowright') - Number(item.key === 'arrowleft'); const dz = Number(item.key === 'arrowdown') - Number(item.key === 'arrowup'); runtime.position = move(runtime.position, dx, dz, 1 / 30); runtime.direction = dx ? (dx > 0 ? 2 : 1) : dz > 0 ? 0 : 3; runtime.keys.add(item.key); runtime.active = true }} onPointerUp={() => runtime.keys.delete(item.key)} onPointerCancel={() => runtime.keys.delete(item.key)} onLostPointerCapture={() => runtime.keys.delete(item.key)}><item.icon size={20} /></button>)}</div>}
    {exploring && !cinema && <button className="return-home" onClick={reset}><ArrowLeft size={15} /> 回到起点</button>}{cinema && <button className="exit-cinema" onClick={() => setCinema(false)}><X size={16} /> 退出取景</button>}{preview !== null && <div className="preview-label">{playing ? '昼夜加速演示' : '时段预览'} · {timeLabel(minutes)}</div>}
    {toolsOpen && <aside className="environment-tools" id="environment-controls" aria-label="昼夜预览设置"><div className="tools-heading"><span><SlidersHorizontal size={17} /> 小镇的时间</span><button className="icon-button" aria-label="关闭时间设置" onClick={() => setToolsOpen(false)}><X size={18} /></button></div><p>{preview === null ? `跟随设备时间 · ${timezone}` : '正在预览；不会更改你的设备时间。'}</p><div className="time-readout">{timeLabel(minutes)}<span>{phaseName(minutes)}</span></div><label className="sr-only" htmlFor="time-range">预览一天中的时间</label><input id="time-range" type="range" min="0" max="1439" value={Math.floor(minutes)} onChange={e => previewTime(Number(e.target.value))} /><div className="period-buttons">{[{ m: 390, label: '晨光' }, { m: 750, label: '正午' }, { m: 1110, label: '黄昏' }, { m: 1290, label: '夜晚' }].map(p => <button key={p.m} onClick={() => previewTime(p.m)} aria-pressed={preview === p.m}>{p.label}</button>)}</div><div className="tool-actions"><button onClick={() => { setPreview(null); setPlaying(false) }}><ArrowCounterClockwise size={15} /> 当地时间</button><button disabled={reduced} onClick={() => { setPreview(m => m ?? clock); setPlaying(v => !v) }}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? '暂停' : '播放一天'}</button></div>{reduced && <p>已按设备偏好减少动态效果。</p>}<button className="cinema-button" onClick={() => { setCinema(true); setExploring(true); setToolsOpen(false) }}><Cube size={15} /> 干净取景 · 录制演示</button></aside>}
    <dialog ref={panelRef} className="product-dialog" onCancel={e => { e.preventDefault(); onClose() }} aria-labelledby="panel-title"><button className="close-dialog" onClick={onClose} aria-label="关闭，返回小镇"><X size={22} /></button>
      {panel === 'products' ? <div className="directory-content"><p className="eyebrow">MADE BY WILL</p><h2 id="panel-title">小店里的东西</h2><p className="dialog-description">挑一家店，看看里面的新想法。</p><div className="directory-list">{[shops[1], shops[0], shops[2]].map(shop => <button key={shop.id} onClick={() => setPanel(shop.id)}><span className="directory-number">{shop.number}</span><span><strong>{shop.id === 'berryon' ? 'Berryon' : shop.label}</strong><small>{shop.subtitle}</small></span><ArrowUpRight size={22} /></button>)}</div><a className="direct-berryon" href="https://berryon.ai" target="_blank" rel="noopener noreferrer">直接打开 berryon.ai <ArrowUpRight size={16} /></a></div> : selected && <div className={`shop-interior interior-${selected.id}`}><div className="interior-visual"><span className="interior-number">NO. {selected.number} / WILL TOWN</span><div className="interior-brand">{selected.id === 'berryon' ? <><span className="berryon-wordmark">Berryon</span><p>MAKE YOUR IDEAS REAL.</p><div className="creative-labels"><span>IMAGE</span><span>VIDEO</span><span>CANVAS</span></div></> : selected.id === 'journal' ? <><BookOpen size={64} weight="duotone" /><strong>BUILD IN PUBLIC</strong><p>一点点，建起一条街。</p></> : <><div className="portrait-sprite" /><strong>/loop</strong><p>有想法，就再试一次。</p></>}</div><span className="interior-stamp"><Check size={13} /> 一间正在生长的小店</span></div><div className="interior-copy"><p className="eyebrow">{selected.subtitle}</p><h2 id="panel-title">{selected.title}</h2><p className="dialog-description">{selected.description}</p>{selected.id !== 'studio' && <ul className="feature-list">{(selected.id === 'berryon' ? ['图像与视频创作', '无限创意画布', '产品照片与广告创意'] : ['从概念图到三维街道', '像素分身与素材制作', '随本地时间变化的天空']).map((text, i) => <li key={text}><span>0{i + 1}</span>{text}</li>)}</ul>}<a className="primary-button product-link" href={selected.url} target="_blank" rel="noopener noreferrer">{selected.cta}<ArrowUpRight size={20} /></a><button className="text-button back-to-town" onClick={onClose}><ArrowLeft size={15} /> 回小镇继续逛</button></div></div>}
    </dialog>
  </main>
}
