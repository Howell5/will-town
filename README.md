# Will Town · Will 的小镇

一个人，慢慢建起一条街。

**在线体验：[will-town.haruhowell.workers.dev](https://will-town.haruhowell.workers.dev)**

以像素小镇呈现独立开发者的产品：每家店代表一个产品，访客可以直接点击店铺，也可以控制像素分身沿街探索。天空与灯光跟随设备当地时间变化。

**当前状态：材质与灯光细化版，完整美术验收未通过。** 锁定桌面镜头，按参考图校准门槛、屋顶和角色位置；改为水平路面、斜向延伸的实体岸墙、更高的店面和修长像素角色。保留 Will 像素角色、Berryon 产品入口及设备当地时间的昼夜变化。视觉质量优先于新增玩法。

![视觉重做版实际运行截图，黄昏预览](docs/qa/material-lighting-desktop.png)

上图为 ego-lite 实际运行截图。对照 [修改前](docs/preview.jpg)、[视觉概念稿](docs/references/town-concept.png)、[本轮参考与结构修改](docs/visual-direction.md) 和 [验收记录](design-qa.md)。这轮细化了叠压屋瓦、石块倒角、木构表面、上层窗内陈设和局部阴影；镜头参数保持不变。几个屏幕定位点的误差小于 25px 不等于整图 90% 相似度。屋瓦、石材、花卉密度和光照精细度仍有明显差距。

## 首版目标

- 一个小广场与三个店面，保持近距离、能看清像素分身和橱窗的取景。
- 完成至少一家店的“发现 → 了解 → 打开真实产品”流程。
- 桌面端方向键 / WASD 走动，靠近后按 E 查看产品，Esc 返回；同时提供直接点击入口。
- 固定角度镜头，小人接近画面边缘时平滑跟随。
- 根据当地时间展示晨曦、上午、午间、下午、黄昏和夜晚，配合预设太阳路径与轻微云动画。
- 支持录制约 25 秒的演示，开发预览可调时间；正常访问按真实时间运行。

## 运行

使用 Node.js 22.12 或以上及 pnpm 9.15。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Vite 会输出本地地址。开发验收使用端口 4173；也可运行 `pnpm dev --port 4173 --strictPort`。

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm test:sites
```

构建输出位于 `dist/client/`。仓库保留了可选 Sites 部署结构。

## Cloudflare 部署

使用 Workers Static Assets 发布 `dist/client/`，配置位于 `wrangler.jsonc`。初次部署前通过 `pnpm exec wrangler login` 登录目标 Cloudflare 账户，再执行：

```sh
pnpm deploy:cloudflare
```

命令会重新构建并上传静态产物；公开地址以 Wrangler 成功部署时的输出为准。单页导航由 Cloudflare 返回 `index.html`，无需数据库或运行时密钥。原始参考附件和源码不会作为部署目录上传。

当前已通过官方 Cloudflare MCP 和 Static Assets 直传 API 发布到上述地址，Worker 名为 `will-town`。MCP 授权与本机 Wrangler 登录独立；使用命令行更新时仍需有效的 Wrangler 登录。

## 操作

- 点击「来小镇逛逛」，方向键或 WASD 移动；也可点击地面设定目的地。
- 靠近店铺按 E，或直接点击店招查看内容；Esc 返回并恢复焦点。
- 手机上支持屏幕方向按钮和直接点击店铺。
- 右下角时钟可切换晨光、正午、黄昏、夜晚，或加速播放一天。默认跟随设备时间。
- 时间面板内「干净取景」隐藏主要导航，便于手动录屏；Esc 退出。预览状态保留标注。
- 产品入口不依赖 3D 成功加载；关闭 JavaScript 时仍提供 Berryon 的普通链接。

## 技术栈

TypeScript + React + Vite + Three.js + React Three Fiber，使用 pnpm 管理依赖，兼容版本已锁定在 pnpm-lock.yaml。

Three.js 渲染小镇，React 组织网页内容，React Three Fiber 将场景组织成可复用组件。首版采用纯前端单应用，没有运行时后端或数据库。

详见 [架构方案](docs/architecture.md)、[昼夜方案](docs/day-cycle.md) 与 [素材制作与管理](assets/README.md)。

## 当前边界

三个店面分别为 Berryon、开发手记、Will 工作室。进店打开 HTML 展示面板，尚没有可行走的室内场景；右侧台阶目前是视觉结构，活动范围仍在上层街道；前方岸墙边界有碰撞限制。角色动作使用生成帧，仍存在少量帧间差异；远景是分层氛围图，不对应真实天气或天文日出日落。PNG 素材保留原始质量，公开发布前仍可进一步优化下载体积。

下一步根据样片反馈调整建筑细节、角色步态和镜头，再录制对外演示。
