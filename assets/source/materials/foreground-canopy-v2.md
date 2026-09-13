# Foreground canopy v2

Status: REJECTED FOR RUNTIME — the built-in image tool returned an RGB PNG with a painted checkerboard, even after a targeted transparency correction. Do not load as a full-viewport overlay. No alpha removal, shell image editing, or replacement API was used.

Mode: built-in image generation and one built-in edit.

Requested image: 1487 x 1058 transparent foliage-only overlay. Actual image: 1487 x 1058 PNG, no alpha (verified with macOS sips hasAlpha).

Saved unchanged: public/assets/backgrounds/foreground-canopy-v2.png

Initial source basename: exec-041e9b92-e297-433f-a613-7974f96a2213.png

Final source basename: exec-e54be275-9b1b-4c8c-8150-61ef6f046176.png

Reference: user-supplied town concept, composition and foliage silhouettes only. No game screenshot assets were copied.

## Initial prompt

Use case: stylized-concept
Asset type: transparent full-viewport foreground foliage overlay for an HD-2D pixel-art town website.
Reference image role: composition and artistic reference ONLY. Generate a new standalone transparent foreground asset, not the complete screenshot.
Output requested: PNG with genuine alpha transparency, landscape canvas 1487 x 1058 or closest same aspect ratio.
Primary request: ONLY near-camera dark leafy framing: one dark oak bough enters the upper-right corner, with leaves occupying approximately the rightmost 20% and top 18%, irregular naturally tapering silhouette. Restrained blurred dark teal/olive shrub silhouettes occupy bottom-left and bottom-right corners only; bottom left reaches about 15% width and bottom 24% height; bottom right reaches about 15% width and bottom 20% height. Bottom center stays entirely empty.
Style: HD-2D pixel game scenery, crisp blocky pixel clumps in upper foliage, subtle near-focus softness on bottom corner shrub clumps. Very dark navy green, deep teal and muted olive with a few tiny restrained warm ochre bokeh leaf glints. Match the reference's foliage silhouette placements and limited visual weight.
Critical transparency: all central area is fully alpha-transparent; entire upper-left 70% of image fully transparent; spaces between individual leaf clusters transparent. Transparent empty canvas, no sky gradient, no painted checkerboard, no white or black matte.
Avoid: buildings, ground, terrain, streets, water, characters, signs, typography, UI, borders, frames, full forest, any scenery or objects except the sparse corner foliage. Do not recreate screenshot. No leaves across the middle or bottom center.

## Targeted correction prompt

Use case: background-extraction. Edit target is the attached foliage-only image. Keep the existing foliage silhouettes, colors, size and pixel style exactly unchanged. Remove every gray and white checkerboard square from the background and replace it with REAL ALPHA TRANSPARENCY in the output PNG file. This is a production overlay, so an RGB image showing a checkerboard is unusable. The PNG must have an RGBA color mode, with alpha=0 everywhere currently occupied by the checkered empty canvas, including between leaves. Output a genuinely transparent PNG, 1487 x 1058. Do not paint a transparency grid, white, gray, black, or any background. Do not add objects. Only fix transparency.


Rejected runtime candidate was moved out of public assets and is not included in this repository. The keyed sibling is the consumed asset.
