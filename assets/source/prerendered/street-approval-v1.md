# Street approval v1

- Date: 2026-09-14, Asia/Shanghai.
- Tool: built-in image_gen, precise-object-edit; no API/CLI fallback.
- Edit target: `docs/references/town-concept.png`, the user-selected original concept.
- Output: `docs/design/street-approval-v1.png`, original generated PNG, copied without resizing or image processing.
- Status: visual approval mockup awaiting user review. Not a screenshot of the live site; not deployed or wired into the website.
- Scope: remove the human avatar and floating tooltip, use real project storefront labels, update the CTA and selected interior props. Preserve the original composition and visual style.
- Visual inspection: reference framing and twilight palette retained; no human figure; labels read DEVLOG, BERRYON, /LOOP; thick connected embankment, stairs and grounded pots remain. Generated edit is not claimed to be pixel-identical to the reference.
- Next stage after visual acceptance: derive a clean scene plate, implement actual HTML text/navigation/product controls, and create only the local layers needed for restrained animation. Do not use the text baked into this approval image as the finished accessible UI.

## Exact generation prompt

```text
Use case: precise-object-edit.
Asset type: full website hero art-direction approval mockup, based on the provided image as the EDIT TARGET.
Primary request: Make a highly faithful edit of this EXACT approved image, preserving the beautiful high-detail HD-2D pixel streetscape. Do not redesign, reframe, zoom or change the camera. Keep the image's original approximately 1.405:1 aspect ratio and full composition, including the navy header, all left-side website typography, background city and river, three buildings, foreground retaining wall, bench, flowers, trees, lighting and depth of field.
Required localized edits ONLY:
1. Remove the human pixel avatar standing in front of the middle shop. Fill his former area seamlessly with the SAME existing paving stones and warm window light. No humans or humanoid figures anywhere. The little orange cat may remain exactly as in the reference.
2. Left shop wooden sign: replace NOTES with exact crisp pixel lettering "DEVLOG", preserving the book icon, board size, location and warm wood texture. Its interior remains a beautifully lit bookstore with layered books and warm desk light.
3. Middle shop wooden sign: replace FLOW with exact crisp pixel lettering "BERRYON" (B E R R Y O N). Keep board size and placement, fit the longer text without enlarging the building. Keep the small gear icon. This shop is an AI creative workshop: preserve the existing warmly lit open doorway and layered shelves, with a small drawing display on the counter showing a colorful creative image. Do not replace the interior with a flat photograph.
4. Right shop wooden sign: replace PIXEL with exact crisp pixel lettering "/LOOP". Replace the sign camera icon with a small simple pixel desktop-computer icon. Make only a small interior adjustment: a laptop and ceramic coffee cup on its desk, warm desk lamp, framed art and wooden shelves. Keep the pink awning, original building geometry and placement unchanged.
5. Remove the floating dark tooltip card reading 灵感笔记 above the left shop and its two white dots / connector; reconstruct the roof, distant city and sky behind it faithfully.
6. Main yellow CTA changes to exact Chinese "查看我的产品" plus its original arrow, preserving its original size, position, typography and colors. Secondary underlined link changes to "读读开发手记" with the original arrow.
Strict invariants: retain the exact low, stable reference camera, full three storefronts, intact substantial stone embankment descending out of frame, supported flowerpots resting on surfaces, connected grounded walls and stairs, genuinely thick overlapping small terracotta roof tiles, fine coherent square-pixel detail. Keep violet-blue twilight with coral clouds, warm golden lit windows casting onto cobbles, darker foreground foliage and distant cool atmospheric city. Preserve the sharp middle-ground detailed pixel craft and foreground depth of field. All structures must remain physically connected with no floating walls, pavers, plants or isolated platforms. Preserve the reference quality; no crude voxel bricks, no low-poly reinterpretation, no generic new design.
Unchanged text must remain exactly as in the target: "WILL 的小镇", header links "产品", "开发手记", "关于我"; headline "小镇的灯亮着，新的想法也在生长。"; intro "我是 Will，一名独立开发者。这里的每家小店，都放着我做的产品。".
Output one complete polished approval image at high resolution with the same framing; no added borders, annotations, comparison panels or watermark.
```
