# 当前架构：预渲染街景 + HTML

2026-09-14 用户确认静态美术方案并授权接入。

React + TypeScript + Vite。`src/App.tsx` 组织首页、基于画面百分比定位的店铺按钮、原生 dialog 和时间设置；`src/content.ts` 保存产品内容；`src/environment.ts` 计算设备本地时间与美术时段；`src/styles.css` 负责固定构图、响应式裁切与克制的局部明暗动画。

`public/assets/streetscape/street-dusk-v2.png` 是选定的预渲染街景。街景与店铺按钮共用 1487 × 1058 坐标框架，缩放和手机裁切同步，不存在三维相机漂移。网页文字与控制使用 HTML，物理店招保留在图内。手机单独排版标题并展示三个店面，不强行把整张桌面海报缩到手机宽度。

无 Three.js/WebGL 依赖，无角色或移动系统。已退休材质和背景放在 assets/source/retired-realtime，历史代码可从 Git 找回。增加产品可先增加 HTML 目录项；新增实体店面需要重新制作街景并校准热点，不能承诺自动扩街。

时间仅驱动轻微亮度变化；局部橱窗使用同图遮罩叠加动画。图片失败时 HTML 导航继续工作。无需后端；Cloudflare Workers Static Assets 发布 dist/client。保留 Sites 打包兼容文件。
