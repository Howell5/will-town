import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowUpRight, ArrowLeft, ArrowRight, MoonStars, Sun, SlidersHorizontal, X, ArrowCounterClockwise, Play, Pause, BookOpen, Cube, Check } from '@phosphor-icons/react'
import { environmentAt, localMinutes, phaseName, timeLabel } from './environment'
import { getShop, shops, type ShopId } from './content'
type Panel = ShopId | 'products' | null
const streetImage = '/assets/streetscape/street-dusk-v2.png'
const storefronts = [{ id: 'journal', x: 36.6, y: 52.2, w: 14, h: 26.5 }, { id: 'berryon', x: 54.2, y: 52.2, w: 14.6, h: 28.6 }, { id: 'studio', x: 73.2, y: 53.2, w: 14.6, h: 29.2 }] as const
function useMedia(query: string) {
  const [value, setValue] = useState(() => window.matchMedia(query).matches)
  useEffect(() => { const media = window.matchMedia(query); const update = () => setValue(media.matches); media.addEventListener('change', update); update(); return () => media.removeEventListener('change', update) }, [query])
  return value
}
export default function App() {
  const region = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDialogElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const [imageReady, setImageReady] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [panel, setPanel] = useState<Panel>(null)
  const [clock, setClock] = useState(localMinutes), [preview, setPreview] = useState<number | null>(null)
  const [toolsOpen, setToolsOpen] = useState(false), [playing, setPlaying] = useState(false), [cinema, setCinema] = useState(false)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const minutes = preview ?? clock, env = environmentAt(minutes)
  const onOpen = useCallback((id: Panel) => {
    restoreFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setPanel(id)
  }, [])
  const onClose = useCallback(() => {
    setPanel(null)
    requestAnimationFrame(() => { const target = restoreFocus.current; (target?.isConnected ? target : region.current)?.focus({ preventScroll: true }) })
  }, [])
  const reset = () => { setCinema(false); setToolsOpen(false) }
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
      if (e.key === 'Escape' && !panel) { setToolsOpen(false); setCinema(false) }
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [panel])
  const previewTime = (m: number) => { setPreview(m); setPlaying(false) }
  const selected = panel && panel !== 'products' ? getShop(panel) : null
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const sceneBrightness = 1 + (env.backdrop - 1) * .15
  return <main className={`town-app ${cinema ? 'is-cinema' : ''}`} style={{ '--scene-brightness': sceneBrightness } as CSSProperties}>
    <a href="#content-navigation" className="skip-link">跳到产品入口</a>
    <header className="header"><button className="brand" onClick={reset} aria-label="回到小镇首页"><span className="brand-mark" aria-hidden="true"><img src="/assets/streetscape/leaf-mark.png" alt="" /></span><span>WILL <span className="brand-cn">的小镇</span></span></button><nav id="content-navigation" aria-label="主导航"><button onClick={() => onOpen('products')}>产品</button><button onClick={() => onOpen('journal')}>开发手记</button><button onClick={() => onOpen('studio')}>关于我</button></nav></header>
    <section className="introduction" aria-label="欢迎来到 Will 的小镇"><p className="eyebrow"><span className="status-dot" /> 一个独立开发者的数字住处</p><h1>小镇的灯亮着，<br />新的<span>想法</span>也在生长。</h1><p className="intro-copy">我是 Will，一名独立开发者。<br />这里的每家小店，都放着我做的产品。</p><div className="intro-actions"><button className="primary-button" onClick={() => onOpen('products')}>查看我的产品<ArrowUpRight size={20} /></button><button className="text-button" onClick={() => onOpen('journal')}>读读开发手记 <ArrowRight size={16} /></button></div><div className="tiny-note"><Cube size={14} /> 一条小街，一些正在发生的事。</div></section>
    <section ref={region} className="streetscape" tabIndex={-1} aria-label="Will 的小镇，点击店铺查看产品与故事" data-ready={imageReady} data-phase={env.phase}>
      <div className="scene-frame">
        <img className="scene-image" src={streetImage} width={1487} height={1058} alt="傍晚的小镇街景：三间暖灯小店、花箱、长椅与厚实石岸" fetchPriority="high" onLoad={() => { setImageReady(true); setImageFailed(false) }} onError={() => setImageFailed(true)} />
        {imageReady && <img className="window-light" src={streetImage} width={1487} height={1058} alt="" aria-hidden="true" />}
        {storefronts.map(shop => <button key={shop.id} className={`storefront-hit hit-${shop.id}`} style={{ left: `${shop.x}%`, top: `${shop.y}%`, width: `${shop.w}%`, height: `${shop.h}%` }} onClick={() => onOpen(shop.id)} aria-label={`查看${getShop(shop.id).label}`} aria-haspopup="dialog"><span className="shop-tooltip">{getShop(shop.id).label}<ArrowUpRight size={14} /></span></button>)}
      </div>
      {imageFailed && <p className="scene-fallback" role="status">街景暂时未能加载，你仍可通过「查看我的产品」访问全部内容。</p>}
    </section>
    <footer className="bottom-bar"><div className="location"><span className="status-dot" /><span>WILL TOWN</span><span className="location-detail">小镇开放中</span></div><button className={`time-button ${preview !== null ? 'previewing' : ''}`} onClick={() => setToolsOpen(v => !v)} aria-expanded={toolsOpen} aria-controls="environment-controls">{env.daylight < .2 ? <MoonStars size={17} /> : <Sun size={17} />}<span>{timeLabel(minutes)}</span><span>{env.phase}</span><SlidersHorizontal size={15} /></button></footer>
    {cinema && <button className="exit-cinema" onClick={() => setCinema(false)}><X size={16} /> 退出取景</button>}{preview !== null && <div className="preview-label">{playing ? '昼夜加速演示' : '时段预览'} · {timeLabel(minutes)}</div>}
    {toolsOpen && <aside className="environment-tools" id="environment-controls" aria-label="昼夜预览设置"><div className="tools-heading"><span><SlidersHorizontal size={17} /> 小镇的时间</span><button className="icon-button" aria-label="关闭时间设置" onClick={() => setToolsOpen(false)}><X size={18} /></button></div><p>{preview === null ? `跟随设备时间 · ${timezone}` : '正在预览；不会更改你的设备时间。'}</p><div className="time-readout">{timeLabel(minutes)}<span>{phaseName(minutes)}</span></div><label className="sr-only" htmlFor="time-range">预览一天中的时间</label><input id="time-range" type="range" min="0" max="1439" value={Math.floor(minutes)} onChange={e => previewTime(Number(e.target.value))} /><div className="period-buttons">{[{ m: 390, label: '晨光' }, { m: 750, label: '正午' }, { m: 1110, label: '黄昏' }, { m: 1290, label: '夜晚' }].map(p => <button key={p.m} onClick={() => previewTime(p.m)} aria-pressed={preview === p.m}>{p.label}</button>)}</div><div className="tool-actions"><button onClick={() => { setPreview(null); setPlaying(false) }}><ArrowCounterClockwise size={15} /> 当地时间</button><button disabled={reduced} onClick={() => { setPreview(m => m ?? clock); setPlaying(v => !v) }}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? '暂停' : '播放一天'}</button></div>{reduced && <p>已按设备偏好减少动态效果。</p>}<button className="cinema-button" onClick={() => { setCinema(true); setToolsOpen(false) }}><Cube size={15} /> 干净取景 · 录制演示</button></aside>}
    <dialog ref={panelRef} className="product-dialog" onCancel={e => { e.preventDefault(); onClose() }} aria-labelledby="panel-title"><button className="close-dialog" onClick={onClose} aria-label="关闭，返回小镇"><X size={22} /></button>
      {panel === 'products' ? <div className="directory-content"><p className="eyebrow">MADE BY WILL</p><h2 id="panel-title">小店里的东西</h2><p className="dialog-description">挑一家店，看看里面的新想法。</p><div className="directory-list">{[shops[1], shops[0], shops[2]].map(shop => <button key={shop.id} onClick={() => setPanel(shop.id)}><span className="directory-number">{shop.number}</span><span><strong>{shop.id === 'berryon' ? 'Berryon' : shop.label}</strong><small>{shop.subtitle}</small></span><ArrowUpRight size={22} /></button>)}</div><a className="direct-berryon" href="https://berryon.ai" target="_blank" rel="noopener noreferrer">直接打开 berryon.ai <ArrowUpRight size={16} /></a></div> : selected && <div className={`shop-interior interior-${selected.id}`}><div className="interior-visual"><span className="interior-number">NO. {selected.number} / WILL TOWN</span><div className="interior-brand">{selected.id === 'berryon' ? <><span className="berryon-wordmark">Berryon</span><p>MAKE YOUR IDEAS REAL.</p><div className="creative-labels"><span>IMAGE</span><span>VIDEO</span><span>CANVAS</span></div></> : selected.id === 'journal' ? <><BookOpen size={64} weight="duotone" /><strong>BUILD IN PUBLIC</strong><p>一点点，建起一条街。</p></> : <><Cube size={64} weight="duotone" /><strong>/loop</strong><p>有想法，就再试一次。</p></>}</div><span className="interior-stamp"><Check size={13} /> 一间正在生长的小店</span></div><div className="interior-copy"><p className="eyebrow">{selected.subtitle}</p><h2 id="panel-title">{selected.title}</h2><p className="dialog-description">{selected.description}</p>{selected.id !== 'studio' && <ul className="feature-list">{(selected.id === 'berryon' ? ['图像与视频创作', '无限创意画布', '产品照片与广告创意'] : ['从概念图到像素街景', '建筑细节与素材制作', '随本地时间变化的氛围']).map((text, i) => <li key={text}><span>0{i + 1}</span>{text}</li>)}</ul>}<a className="primary-button product-link" href={selected.url} target="_blank" rel="noopener noreferrer">{selected.cta}<ArrowUpRight size={20} /></a><button className="text-button back-to-town" onClick={onClose}><ArrowLeft size={15} /> 回小镇继续逛</button></div></div>}
    </dialog>
  </main>
}
