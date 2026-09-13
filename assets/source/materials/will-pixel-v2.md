# Will pixel avatar v2

- Tool: built-in image_gen imagegen. One initial atlas generation, then one targeted background-extraction edit. No CLI fallback and no bitmap edits.
- Final source: exec-cde844a2-6264-4da8-83f5-d3e6434dfcde.png.
- Runtime asset: public/assets/sprites/will-pixel-v2.png, copied unchanged from final generated output.
- Actual dimensions: 1254 × 1254 pixels, RGBA PNG.
- Alpha verification: sips hasAlpha: yes; independent standard-library PNG decoding found alpha min 0, max 255, with 1,159,407 fully transparent pixels out of 1,572,516 (73.7%).
- Layout: 4 columns × 4 rows; row directions front / left / right / back. Consistent slim black-haired figure with forehead goggles, dark jacket, ivory shirt and navy trousers.
- Visual limitations: some walking poses repeat; head remains larger than requested one-quarter proportion. Generated art is an improvement toward the reference, not an exact traced sprite.
- Reference role: supplied town concept was used only for its lower-center pixel character style. Original personal portrait was not included in generation and is not published.
- Initial source exec-63463163-0241-4767-9918-db2da39b2d55.png was rejected because it was RGB with a baked checkerboard. Its project copy was replaced by this corrected RGBA output.

## Initial generation exact prompt

```text
Use case: stylized-concept. Asset type: production transparent walking sprite atlas for a Three.js HD-2D village.
Create ONE PNG with genuine alpha transparency, 4 columns × 4 rows of 16 full-body walking frames. Layout is exactly equal cells. Output square 1024×1024 if possible. No grid lines. Each frame centered in its cell with equal scale and consistent foot baseline. Row 1 faces viewer/front; row 2 faces LEFT; row 3 faces RIGHT; row 4 faces AWAY/back. Four columns are sequential walking poses: left stride, passing, right stride, passing. All frames depict the exact same adult male character.
Style reference image 1: use ONLY the slim crisp pixel character standing in the bottom-center of the town reference as the visual style/proportions target. Ignore all architecture/UI. Classic 2D JRPG sprite, very clear square pixel clusters, approximately 32 by 48 source-pixel detail per character. Slim limbs, mature compact body with head approximately one quarter full height, NOT half the height. Spiky black hair, light skin, small blue goggles resting atop forehead, eyes visible, black open jacket, ivory shirt, dark navy pants, dark shoes with subtle warm highlights. Warm cream edge highlights consistent with dusk town lighting. Use a small cohesive palette with hand-placed pixels and firm stepped outlines, only a few shade bands per material.
All sixteen characters must occupy the same 75% height of their cell and remain wholly inside cells; margin around each frame. Real alpha=0 background everywhere outside the character silhouettes, no checkerboard drawn into pixels, no ground, no cast shadow, no vignette, no labels, no words, no watermark, no background scene. Absolutely avoid glossy 3D render, oversized chibi head, enormous sunglasses, smooth antialiased illustration, or high-resolution texture noise.
```

## Background extraction exact prompt

```text
Use case: background-extraction. Edit the supplied walking sprite atlas with ONE change only: remove the entire gray/white checkerboard background and make every non-character pixel genuinely transparent alpha zero. This must be an RGBA PNG with real transparent background, not painted checks, not white, not black. Keep the 16 character silhouettes, pixel art colors, all poses, exact size, every position, 4-column × 4-row grid, cell spacing and full image geometry unchanged. Preserve the slim black-haired man, goggles on forehead, black jacket, ivory shirt, navy trousers. Remove checkerboard from spaces between arms/legs and hair gaps too. Preserve crisp dark character edges and warm highlights. No cast shadows or added text.
```
