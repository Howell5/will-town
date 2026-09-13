# Greenery sprite atlas provenance

Generated 2026-09-13 with the built-in imagegen tool. No third-party resource pack used.

Runtime asset: `public/assets/sprites/greenery.png`.
Selected original generation: `exec-ae47e234-89f6-483d-a68f-32ace39f2f43.png`; the unchanged selected image is stored at the runtime path above.
Dimensions: 1254 × 1254. PNG RGBA, 8 bits/channel. Alpha verified by decoding PNG: 943157 completely transparent pixels, 742 fully opaque pixels, 628617 partially transparent pixels. Most leaf/pot pixels have partial alpha; alpha testing should be checked against the rendered background.

Visual order: top-left terracotta flowers; top-right wooden planter; bottom-left tall potted shrub; bottom-right hanging ivy.

## Runtime placement caveat

The generated layout is approximately 2×2 but the bottom-row foliage begins above the exact 627-pixel midpoint. Exact equal quadrant UVs would clip top leaves and include slivers of the bottom props in the top cells. Use custom pixel crop rectangles in UVs instead, without editing the image:
- Top-left: x0–626, y0–559.
- Top-right: x627–1253, y0–559.
- Bottom-left: x0–626, y560–1253.
- Bottom-right: x627–1253, y560–1253.

These separate the visible props cleanly. Container bases are not exactly90% cell height; use actual visible bounds to position sprites on the ground. The selected PNG is unchanged.

## Exact generation prompt

```text
Use case: stylized-concept
Asset type: transparent production HD-2D pixel-art prop sprite atlas for a warm handcrafted retro JRPG village rendered with 3D buildings and flat pixel foliage.
One square PNG image, exactly 2x2 equal cells, each cell contains one fully isolated prop. TRANSPARENT BACKGROUND with genuine alpha throughout empty space, no color backdrop, no checkerboard painted into the image. No grid, gutters, text, frames.
TOP LEFT: round warm terracotta flowerpot overflowing with lush small green leaves and tiny cream and pale pink flowers.
TOP RIGHT: low rectangular dark walnut wooden planter with dense green trailing leaves and tiny yellow flowers.
BOTTOM LEFT: taller potted shrub with dense organic small-leaf foliage, asymmetrical rounded shape, in a restrained warm brown clay container.
BOTTOM RIGHT: hanging ivy vertical vine cluster, graceful cascading leafy strands with irregular silhouette, no planter or wall.
All props entirely contained within their respective equal quadrant, centered horizontally, generous transparent clearance around silhouette. For the three pots place container bottom at exactly 90% of its cell height; ivy ends at90%. Front view with very slight top view consistent with a fixed HD-2D town camera. Organic soft plant silhouettes made from fine distinct square pixels, detailed tiny leaf clusters, beautiful crafted pixel artistry; NOT voxel cubes, NOT chunky block geometry, NOT smooth digital painting. Palette moss green, muted sage green and olive with warm earthy containers. Neutral diffuse lighting so runtime can relight. No floor, no horizon, no cast shadows, no background scenery, no sunlight direction, no other objects. Each prop must occupy only its own cell.
```

## Discarded edit

A targeted imagegen edit attempted exact cell containment but visibly introduced a painted checkerboard background. It is not used by the project. Original retained because its actual alpha is usable with custom UV rectangles. Discarded output: `exec-ac0ec710-2930-44fc-9ba9-65847bd2bb07.png`.

Exact edit prompt:
```text
Edit the supplied transparent production pixel sprite atlas. Preserve the exact four prop designs, pixel style, colors, and genuine transparency. Only fix sprite placement and scale to fit a strict 2 by 2 equal-cell texture atlas.
Canvas square. Strict invisible grid: vertical midpoint x=50%, horizontal midpoint y=50%. EVERY prop must be fully inside its cell with at least 8% of cell width/height EMPTY TRANSPARENT MARGIN on ALL four sides. No leaves or semitransparent pixels may cross the cell boundaries.
Top-left pink/cream flowers in terracotta pot; top-right yellow flowers in wooden planter; bottom-left tall potted shrub; bottom-right hanging ivy.
Crucial: move the BOTTOM ROW sprites DOWN and SCALE THEM DOWN so their highest leaf is below 55% of total canvas height (10% inset into bottom cell). Their lowest pixel must be above95% total canvas height. TOP row lowest pixel must be above45% total height. Keep at least 10% of total canvas height EMPTY horizontal transparent band centered at y50% separating top and bottom props. Each prop is horizontally centered in its cell. No drawn grid or labels, no new objects, no cast shadow or background. Genuine transparent PNG.
```
