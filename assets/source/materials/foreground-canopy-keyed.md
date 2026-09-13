# Foreground canopy chroma-key asset

Mode: built-in imagegen edit. Saved unchanged; no bitmap postprocessing.

File: public/assets/backgrounds/foreground-canopy-keyed.png

Source basename: exec-215d5a34-b0ec-490e-a49e-dd3a7e38e9f1.png

Dimensions: 1487 x 1058; RGB PNG, no alpha. Intended only for runtime WebGL chroma-key rendering, not a normal opaque image overlay.

Input: previous generated foliage candidate, with corner silhouettes based on the user-supplied town reference. The edit replaced the painted checkerboard with a visually uniform magenta key background. Original rejected candidate was preserved.

## Pixel inspection

The background is visually flat but is **not exact #FF00FF**. Read-only PNG pixel decoding found:

- Center rectangle x=400..999, y=300..749: RGB channel ranges R248–252, G3–8, B246–250; most common RGB(250,5,248).
- Upper-left rectangle x=0..899, y=0..499: R238–253, G1–12, B238–251; most common RGB(250,5,248).

A tolerant magenta key is necessary. Match high red/blue with low green; account for blended edge pixels to avoid magenta halos. Visual verification after shader integration remains the responsibility of the implementation task.

## Exact prompt

Use case: precise-object-edit. Edit target: the foliage corner-overlay image. Replace ONLY all gray-and-white checkerboard background pixels with a completely uniform solid pure magenta RGB(255,0,255), hex #FF00FF. Every empty pixel between foliage leaves also must be this same pure magenta. Preserve foliage silhouettes, leaf cluster placement, dark teal/olive colors, tiny warm ochre highlights, pixel grain and slight bottom-corner softness exactly. Output 1487 x 1058 PNG with opaque solid magenta background, intended for runtime WebGL chroma key. No transparency, no checkerboard, no texture or shading in magenta background, no gradient, no magenta spill on leaves, no objects added. Entire upper-left and central negative space must be perfectly flat pure #FF00FF.
