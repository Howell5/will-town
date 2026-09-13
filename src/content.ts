export type ShopId = 'berryon' | 'journal' | 'studio'
export const shops = [
  { id: 'journal' as const, x: -2.5, label: '开发手记', sign: 'DEVLOG', number: '02', accent: '#799b86', title: '把想法，一点点变成现实。', subtitle: '小镇建造日志', description: '这里记录小镇从一张概念图到可探索街道的过程。场景、素材、交互和昼夜变化，都在持续生长。', url: 'https://github.com/Howell5/will-town', cta: '查看开发仓库' },
  { id: 'berryon' as const, x: 1.1, label: 'AI 创作工坊', sign: 'BERRYON', number: '01', accent: '#c68a65', title: '让脑海里的画面，成为作品。', subtitle: 'Berryon · AI 创作画布', description: '在无限创意画布上，把 AI 图像、视频、产品照片和广告创意连接起来。从一个想法出发，让创作继续发生。', url: 'https://berryon.ai', cta: '打开 Berryon' },
  { id: 'studio' as const, x: 4.7, label: '关于 Will', sign: '/LOOP', number: '03', accent: '#8791ae', title: '你好，我是 Will。', subtitle: '独立开发者的小工作室', description: '我喜欢把有趣的想法做成能用的产品，也想把个人网站变成一个值得闲逛的地方。蓝色护目镜、一个键盘，还有一些正在发芽的新点子。', url: 'https://github.com/Howell5', cta: '在 GitHub 找到我' },
]
export const getShop = (id: ShopId) => shops.find(shop => shop.id === id)!
