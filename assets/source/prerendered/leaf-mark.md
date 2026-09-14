# Pixel leaf mark

- Input reference: `docs/design/street-approval-v1.png`, header's existing green pixel leaf.
- Output: `public/assets/streetscape/leaf-mark.png`.
- Tool: built-in `image_gen.imagegen`, one extraction edit.
- Generated source: `/Users/willhong/.codex/generated_images/01a09ed3-632f-7830-a39f-88702e84aa35/exec-b5789eab-a2d2-4200-810f-652cfa4fa343.png`.
- Dimensions: 1254 × 1254 PNG, unchanged original output.
- Inspection: stepped green silhouette and green blocks preserved in direction and general appearance, no text or surrounding scene. The generated image includes more blue margin than requested: leaf bounds approximately x418–836,y369–887. Use a CSS crop if needed. Background visually deep navy but not guaranteed exactly uniform #10224c. This is a generated reproduction, not a pixel-identical crop.

## Exact prompt

```text
Use case: background-extraction.
Input image is the approved website art. Extract ONLY the tiny stepped green pixel leaf symbol at the top left, directly left of the words WILL 的小镇. Reproduce that EXACT logo's silhouette, pixel staircase, and green color blocks. The symbol rises diagonally from lower-left to upper-right, with lime lit blocks toward upper-right and olive darker lower-left blocks. Do not invent a new leaf shape, do not use a line-art outline, do not smooth or round its pixel edges. Remove all text, all scene art and every other element.
Output a square icon, tightly framed with approximately10% padding around the original symbol. Preserve its original approximately33pixel wide by41pixel tall proportions, scaled evenly within square. Flat solid background #10224c, uniformly covering entire canvas (not transparent checkerboard). Flat crisp nearest-neighbor pixel appearance, no shadow, no glow, no extra graphics. This is extraction of the existing green leaf mark only.
```

