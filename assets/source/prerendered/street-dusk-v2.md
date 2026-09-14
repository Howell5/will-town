# Street dusk v2 — targeted sky correction

- Edit target: `public/assets/streetscape/street-dusk-v1.png`.
- Supporting reference: `docs/design/street-approval-v1.png`, approved artwork.
- Output: `public/assets/streetscape/street-dusk-v2.png`.
- Dimensions: 1487 × 1058 PNG, original generated dimensions; no crop or resize.
- Tool: built-in `image_gen.imagegen`, one targeted correction after v1.
- Generated source: `/Users/willhong/.codex/generated_images/01a09ed3-632f-7830-a39f-88702e84aa35/exec-06416658-2142-4e57-bd74-61edd6004f99.png`.
- Correction: remove v1's invented coral cloud shapes behind headline area and restore quieter deep-blue/violet sky, preserving lower-left sunset and right horizon.
- Inspection: upper-left y200–340 sky now quiet, title area closer to approved source. Scene landmarks and physical sign wording remain aligned. As a generated edit there are small detail/resampling changes beyond sky; no pixel-identical extraction claim.

## Exact prompt

```text
Use case: precise-object-edit. Asset: clean website scene plate.
Image1 is the EDIT TARGET (street-dusk-v1 clean plate). Image2 is the APPROVED ARTWORK reference only, showing correct sky sparseness behind its title. Do not copy any text or UI from image2.
Make ONE targeted correction to image1: remove the newly invented dense coral-pink clouds in its upper-left headline area. ONLY edit the sky inside approximately x0–760,y78–430 of the1487x1058 image, without altering the building or hillside pixels intruding there. Restore this region to the quiet, mostly clean deep-blue/violet sky visible behind the title in image2. Keep it subtle and low contrast; no new major cloud shapes behind where the headline will sit. Retain the few small stars. Keep coral clouds near the lower-left horizon around y410–550 and towards the right horizon, matching the approved reference's distribution. Seamless natural transition.
Preserve exact1487x1058 framing, scale, camera and all town pixels as closely as possible. Do not redesign or move any buildings, roof tiles, chimneys, signs, windows, pavement, retaining wall, river, bridge, lanterns, cat, pots, plants, foreground canopy, bench, stairs or distant town. Keep all scene lighting/colorgrading identical outside that small sky correction. Keep physical words DEVLOG, BERRYON and /LOOP unchanged. No website text, no navigation, no header strip, no buttons, no human figure. Return one full-frame scene plate.
```

