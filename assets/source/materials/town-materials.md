# Town materials atlas provenance

Generated on 2026-09-13 using the built-in imagegen tool. No external third-party texture pack was used. The town concept was visually inspected for palette and material direction; no reference image was passed to the generator.

Runtime asset: `public/assets/textures/town-materials.png`.

Actual output: **1254 × 1254 pixels** (the generator did not follow the requested 1024 × 1024 size). Each quadrant is 627 × 627 pixels. Original file preserved without resizing.

Original output: `exec-3764b3b2-c9a5-49f6-b327-58e91596f632.png`.

Layout: equal 2×2 quadrants, no gutters. Top-left tan masonry; top-right terracotta roofing; bottom-left grey cobblestone; bottom-right walnut boards. Use each quadrant separately with an inset at the edge to prevent neighboring quadrant bleed. Visual inspection confirms the requested arrangement and neutral surface presentation. This is an artistic albedo texture: the roof contains local crevice shading, but no global directional sunlight. Seamless repetition is an artistic approximation, not mathematically validated.

## Exact generation prompt

```text
Use case: stylized-concept
Asset type: production albedo texture atlas for a genuine modular 3D HD-2D pixel town.
Generate one 1024x1024 square raster texture atlas, exactly 2x2 equal quadrants, each 512x512. Each material fills its entire quadrant all the way to its edges. No gutters, no borders, no labels, no text.
TOP LEFT: muted warm tan stone masonry wall, staggered rectangular handcut stones and thin dark mortar, sparse tiny muted olive moss flecks.
TOP RIGHT: terracotta reddish orange layered roof tiles in overlapping horizontal courses, fine detailed tile texture.
BOTTOM LEFT: warm grey cobblestone paving, small varied handcut stones fitting together, restrained subtle color variation.
BOTTOM RIGHT: dark walnut wooden vertical boards, narrow seams and fine irregular grain.
Style: high quality hand-crafted retro JRPG pixel art, crisp distinct square pixel grain approximately 4 output pixels per logical pixel, restrained natural palette, detailed fine texture. Flat orthographic frontal surface views, seamless-looking per-quadrant material patterns. Neutral diffuse illumination with gentle inherent texture shading only. These maps receive real runtime lighting.
Absolutely no cast shadows, no directional sunlight, no lighting gradients, no perspective, no scenic objects, no buildings, no grass tufts or props sticking out, no whole houses, no vignette. This is a tightly packed material texture atlas only.
```
