# Will avatar sprite atlas

Generated 2026-09-13 with the built-in image generation tool using the user's supplied stylized avatar portrait as an identity reference. No third-party sprite assets were used.

Runtime file: `public/assets/sprites/will-walk.png`.

## Verified properties

- Original generated PNG retained without resizing or pixel edits.
- 1254 × 1254 pixels, RGBA, genuine transparent pixels (989,439 of 1,572,516 pixels have alpha 0).
- Uniform 4 × 4 UV grid. Rows from top: front/down, left, right, back/up. Columns contain four walking frames.
- Generation produced a larger figure than the requested geometry. Visible foot baselines are approximately 94% of the cell height, varying by a few pixels across frames. Use a sprite anchor near `(0.5, 0.06)` and tune visually with the ground contact shadow.
- Very low-alpha generation residue exists in transparent padding. The renderer should use an alpha test around 0.5, nearest-neighbor texture filtering and no mipmaps. Inspect in the scene before approving final motion.
- Walk poses and shading are generated, not a hand-keyed production animation. Small frame alignment/gait differences remain; appropriate for the first scene prototype.
- Shirt lettering is intentionally simplified to a white slash; goggles, spiky hair, dark shirt and trousers preserve the supplied design.

## Generation prompt

```text
Use case: stylized-concept.
Asset type: production 4-direction game WALK SPRITE ATLAS, 1024x1024 PNG, genuinely transparent background and alpha channel. This is an asset, NOT a concept mockup.
Reference image: supplied portrait is identity/design reference only. Transform the referenced person into an original crisp compact HD2D pixel game character.
Subject: young adult indie developer, spiky dark brown/black short hair, signature vivid blue reflective wraparound oval goggles with silver-dark frames, black t-shirt bearing a tiny white slash mark, charcoal trousers, dark sneakers with pale soles. Preserve the reference distinctive hair/goggles. Full body, compact adult chibi proportions, large head but readable walking limbs, arms bare. No laptop, furniture, mug, background.
CRITICAL ATLAS GEOMETRY: exactly FOUR equal columns and FOUR equal rows, 16 sprites total, no labels/gridlines. Each cell is 256x256. Center each sprite horizontally at the cell center, feet baseline at 218 pixels down from its cell top. Each character approximately 128 pixels wide and 176 pixels tall, same scale and alignment in every cell. Plenty of transparent padding. All body parts stay inside own cell.
Row1: facing camera / walking DOWN, four consecutive walk poses: left step, passing, right step, passing.
Row2: exact LEFT profile, four walk poses.
Row3: exact RIGHT profile, four walk poses.
Row4: facing BACK away from viewer, four walk poses; back of goggles strap and hair visible, no face.
Style: hand-authored retro pixel art suitable for a high quality HD2D town. Coherent square pixels, sharp nearest-neighbor edges, approximately 32x44 logical pixels per figure, limited sophisticated palette, subtle clean shading. NO smooth 3D rendering, no antialiased curves. All 16 figures use exactly same design and size.
Background MUST be real transparency with alpha=0, not white, black, gray, checkerboard, or any drawn transparency pattern. No floor shadows, no scenery, no text outside tiny shirt slash, no borders, no extra sprites.
```
