# Street dusk v1 — clean scene plate

- Source edit target: `docs/design/street-approval-v1.png`, user-approved artwork.
- Output: `public/assets/streetscape/street-dusk-v1.png`.
- Dimensions: 1487 × 1058 PNG, original generated dimensions, no resizing or cropping.
- Tool: built-in `image_gen.imagegen`, edit mode, one generation. No fallback CLI.
- Generated source: `/Users/willhong/.codex/generated_images/01a09ed3-632f-7830-a39f-88702e84aa35/exec-c130ebc1-648a-422d-a2bb-49e67e99d188.png`.
- Purpose: remove baked website header and left text/buttons so accessible HTML can be layered over the approved scene.
- Visual inspection: header and left UI are removed; all three store signs remain legible and unchanged in wording. Town composition, roofs, pavement, cat, lamp placement and foreground framing align visually with approval artwork. Newly exposed sky and upper-right canopy are reconstructed. Retained regions show minor generative resampling/detail variation; this is not a pixel-identical extraction and no exact pixel fidelity is claimed.

## Exact prompt

```text
Use case: precise-object-edit.
Asset type: clean background scene plate for an interactive website. Input image 1 is the EDIT TARGET, an already approved final artwork, not a style reference.
Primary request: Remove only the website UI from this exact image, seamlessly reconstructing the same continuous deep blue-purple dusk sky behind the removed UI. Remove the entire top horizontal header band, its thin divider line, green leaf logo, WILL 的小镇 label and three navigation labels. Remove ALL large Chinese headline typography at upper left, introductory copy, yellow CTA rectangle and its text, and secondary underlined link.
Keep EXACT 1487 x 1058 composition, camera, scale, crop, object positions, colors, rendering style, lighting and pixel detail. The empty upper-left sky should continue the existing pink clouds, distant silhouetted hills and blue sky naturally with generous quiet space for later HTML text. At the upper right extend the existing tree canopy naturally to the top edge where the header was removed.
ABSOLUTE INVARIANTS: Do not redraw or redesign the town. Preserve every building, roof tile, chimney, window, shop interior, storefront sign, awning, staircase, lantern, stone wall, pavement, bench, flower pot, cat, river reflection, bridge, distant house and foreground plant exactly as in the target. Preserve the three physical signs and their exact words DEVLOG, BERRYON, /LOOP. No human figures. No new objects. Do not alter brightness, contrast or color grading of any retained artwork. No UI, no logo, no floating text or buttons outside the three physical shop signs. This is targeted removal of overlaid UI only, not a new concept or redesign. Output one clean full-frame scene plate.
```

