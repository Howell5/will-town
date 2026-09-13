# 素材来源

首批场景与角色图片由内置 ImageGen 生成，未采用第三方游戏素材包。字体与图标来源如下。

## 项目概念图

- 文件：docs/references/town-concept.png
- 来源：本项目设计对话中使用 AI 图像生成工具制作。
- 用途：构图、配色和氛围参考，不是可运行场景截图。
- 图中 NOTES、FLOW、PIXEL 为概念店招，正式内容待替换。

## 运行图像

- `public/assets/sprites/will-walk.png`：按用户提供的风格化形象生成，短发、蓝色护目镜、黑色上衣；源记录见 `assets/source/avatar/README.md`。
- `public/assets/sprites/greenery.png`：生成的四种植物，源记录见 `assets/source/materials/greenery.md`。
- `public/assets/textures/town-materials.png`：首版生成材质图集，重做版不再加载，保留作为来源记录；见 `assets/source/materials/town-materials.md`。
- `public/assets/textures/shop-interiors.png`：三个橱窗的室内陈设插画，置于真实窗框后方。
- `public/assets/textures/material-surfaces.png`：应用于独立石块与弧形瓦片的表面纹理。以上两项的原始提示词和检查记录见 `assets/source/materials/visual-rebuild.md`。
- `public/assets/backgrounds/distant-town.png`：生成像素远景，源记录见 `assets/source/backdrop/provenance.md`。

这些生成图片未被标记为 CC0。原始用户头像未复制到公开仓库。

## 字体与图标

- [Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font/releases/tag/2026.09.01)，TakWolf 与项目贡献者。采用 12px proportional zh_hans OTF WOFF2 原始文件，仅重命名，未修改字体内容；SIL OFL 1.1 与组成字体许可见 `licenses/fusion-pixel/`。
- [DotGothic16](https://github.com/fontworks-fonts/DotGothic16)，Fontworks Inc.，通过 `@fontsource/dotgothic16` 本地加载 Latin 字形；SIL OFL 1.1 见 `licenses/dotgothic16-OFL.txt`。
- [Phosphor Icons](https://github.com/phosphor-icons/react)，通过 `@phosphor-icons/react` 使用标准 UI 图标；MIT，许可随 npm 包保留。

## 产品内容

Berryon 为用户指定的真实产品。介绍依据 2026-09-13 读取的 [berryon.ai](https://berryon.ai) 首页 metadata：AI 图像与视频创作、无限画布、产品照片与广告。项目未下载或复制其不可用的 OG 图片，也未伪造产品运行截图。

## 后续第三方素材记录

采用素材后记录资产名、作者、来源 URL、许可及版本、原始许可文件、实际采用的文件和修改内容。

## 参考图镜头校准版新增素材

- `public/assets/backgrounds/reference-dusk-v2.png`：根据选定概念图生成的远景，删除 UI 和前景建筑，仅用于实际三维场景背后。提示词：`assets/source/materials/reference-dusk-v2.md`。
- `public/assets/sprites/will-pixel-v2.png`：新四向像素步行动画，1254 × 1254 RGBA；修正生成的伪透明背景后验证了真实 alpha。提示词及修正：`assets/source/materials/will-pixel-v2.md`。
- `public/assets/backgrounds/foreground-canopy-keyed.png`：前景树叶框景，用运行时着色器去除洋红底色。提示词与实际像素范围：`assets/source/materials/foreground-canopy-keyed.md`。先前棋盘格候选没有投入运行，也没有复制进公开仓库。
- 上述原始 PNG 未经位图重绘或裁切。房子、门窗、屋瓦、路面和岸墙仍是 Three.js 几何场景；没有把整张效果图作为交互场景替身。
