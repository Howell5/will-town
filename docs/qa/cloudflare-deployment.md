# Cloudflare 发布记录

- 地址：https://will-town.haruhowell.workers.dev
- 时间：2026-09-14（Asia/Shanghai）
- 部署源码：`ee1bffb`，本次后续提交仅增加线上地址与验收记录。
- Worker：`will-town`，Workers Static Assets，无运行时 Worker 模块。
- 部署 ID：`eec7d76cb997427b90f6363c6683295b`。
- 通过官方 Cloudflare MCP 创建上传会话、发布版本并启用 workers.dev；使用会话限定的临时凭据上传本地构建资源，完成后删除临时文件。
- 上传目录：`dist/client`，17 个文件，共 18,096,265 字节。Wrangler 的 23 项扫描结果包含目录。
- `pnpm build` 通过；仍有既有 Three.js 分包超过 500 kB 的构建提示。
- 线上首页 HTTP 200，Cloudflare 静态托管响应正常。
- ego-lite：桌面 1487 × 1058 与移动视口 390 × 844，3D ready，Berryon 店铺面板链接为 https://berryon.ai/，Escape 返回正常，黄昏切换正常。
- 浏览器捕获的 error、unhandledrejection、console.error 均为空，资源计时记录没有 HTTP 4xx/5xx，移动视口无横向溢出。
- 实际线上截图：`cloudflare-desktop.png`、`cloudflare-mobile.png`。

本次是当前版本的部署验收，不改变 `design-qa.md` 中完整美术验收尚未通过的结论。
