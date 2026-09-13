# Distant town backdrop

- Created: 2026-09-13
- Method: OpenAI built-in image generation tool; no CLI or external stock asset.
- Runtime asset: `public/assets/backgrounds/distant-town.png`
- Dimensions: 1536 × 1024, PNG.
- Generated original: `exec-f5f18bbd-6d4d-466e-b725-4062f1beb88f.png`
- Visual reference inspected: `docs/references/town-concept.png`. Its style informed the text prompt; no reference image was supplied to the generation call.
- Inspection: open periwinkle sky above distant slate-blue hills, village and bridge in the bottom portion. Tiny warm windows and river reflections; no text, foreground shop or character. Fine pixel edges, no large sun. Skyline occupies roughly the lower 40%; background can be tinted by the day cycle. Static baked clouds are decorative and cannot animate independently; optional cloud layers belong in the runtime scene.
- Modifications: copied unchanged from generated output; no raster editing.

## Exact generation prompt

Use case: stylized-concept.
Asset type: production background texture for a Three.js HD-2D pixel town game, behind actual 3D plaza and foreground shop buildings. Generate ONE wide landscape 1536x1024 image.
Primary request: only a DISTANT European fantasy riverside town panorama with layered slate-blue hills, small distant pitched roofs, a slender tower, an arched stone bridge across a river, and a few tiny warm windows.
Style: refined HD-2D pixel art with discrete fine square pixel grain and atmospheric layers, blue-purple twilight palette and restrained peach clouds. Keep crisp stepped silhouettes, no smooth painted brushwork, coherent fine pixel scale.
Composition: upper 65 percent is mostly OPEN moderate desaturated periwinkle blue-purple SKY with a few subtle peach cloud wisps. Lower 35 percent contains small distant village, hills, bridge and river. Distant buildings cluster center and right. The tallest tower must remain small and below the lower third boundary. This is a distant backdrop and all foreground will be supplied by real 3D separately. No close foreground at all.
Lighting: gentle dusky light, tiny warm windows, sky moderate in value NOT nearly black; application will darken via tint for night.
Constraints: NO foreground shops, NO large or close buildings, NO characters, NO text, NO logos, NO signs, NO UI, NO giant sun, NO moon, NO stars, NO foreground trees, NO decorative frame. No websites or mockup layout. Fill edge to edge with the landscape texture.
