# 素材管理

## 当前运行素材

- public/assets/streetscape/street-dusk-v2.png：用户确认稿衍生的无网页 UI 街景，1487 × 1058。内置 ImageGen 编辑，保留实体店招，去除人物与网页文案。
- public/assets/fonts/：中文像素字体，许可见 licenses/fusion-pixel。

生成方式、精确提示词、参考与已知变化见 assets/source/prerendered/。已确认整页画面为 docs/design/street-approval-v1.png；图片是预渲染美术，交互和网页文字由代码提供。

未选 v1 放在 assets/source/prerendered，旧实时纹理/远景/植物放在 assets/source/retired-realtime；人物素材放在 assets/source/avatar/retired。它们不随网站部署。原始个人头像附件不入公开仓库。生成资产未声明为 CC0。

以后引入第三方素材时逐项核验再分发条件，在 CREDITS.md 记录作者、来源、许可和修改。保留原始许可。只把实际采用的成品放进 public/assets，候选和提示词留在 assets/source。

像素叶片标志：`public/assets/streetscape/leaf-mark.png`，内置 ImageGen 基于已确认稿生成，网页通过 CSS 裁切显示；来源与提示词见 `assets/source/prerendered/leaf-mark.md`。
