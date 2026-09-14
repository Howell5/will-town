# Reference-camera fidelity QA

final result: blocked

Blocker: overall art fidelity remains below the user's requested near-identical reference. Camera anchor checks pass; they are not a 90% similarity score. This revision is a saved calibration milestone, not a completed design handoff.

## Material and lighting follow-up

The latest request scopes this revision to roof/wood, stone and lighting quality. Overall reference fidelity remains blocked; the following concrete material improvements have been implemented and verified.

- Latest actual desktop capture: `docs/qa/material-lighting-desktop.png`, 1487 × 1058, 18:30, initial pose, ego-lite. Prior baseline: `docs/qa/reference-camera-desktop.png`.
- Detail: `docs/qa/material-lighting-detail.png`, native browser capture of CSS rectangle (780,300,625,650), 1250 × 1300 pixels at native 2× capture density. It is a browser crop, not a generated mock or bitmap enhancement. Used to inspect tile overlaps, masonry edges, windows and lamp housing.
- Additional real captures: `docs/qa/material-lighting-noon.png` (1487 × 1058); `docs/qa/material-lighting-mobile-night.png` (390 × 844, emulated viewport). Source, final desktop and detail were opened together for comparison.

### Changes and observed results

1. Fine high-frequency random shader grain was removed. The existing generated atlas now provides filtered color and shallow bump relief with separate stone, clay and wood settings. Actual stone geometry has uneven dressed corners and larger bevels, with restrained size/color variation. Pavers and masonry now have more visible individual edges, although they remain more regular/stylized than the reference.
2. Roof tile courses now overlap with raised barrel profiles; ridge pieces have their own axial orientation. Dark timber supports sit below the eaves. Roof relief is clearer than the prior nearly continuous fine-grained surface; handmade ridge and tile-end fidelity still differs from the source.
3. Broad near-white facade/floor illumination was reduced. A warm spot from each storefront produces localized spill; the middle shop has a shadow map. Nearby stone/wood crevices receive low-radius screen-space occlusion. The pass explicitly uses orthographic depth, excludes billboards/hit planes and retains transparent scene coverage.
4. The opaque town is static; AO is cached until camera/projection/viewport changes. Moving character and alpha-cut plants are excluded from the normal pass. Any future animated opaque geometry must invalidate or disable this cache. Mobile omits AO and shadow maps.
5. Plants use alpha-cut upright planes so selected pots can cast light-dependent shadows. Lamp glass is tapered around a distinct bright core, with metal struts/caps/finial. Upper rooms now have curtains, books, a shelf and a small lamp instead of a flat bright panel.
6. The first noon check exposed dark text over an intrinsically dark panorama. Daytime now increases sky luminance, not only hue, restoring readable dark text. Capture was repeated after the sky transition completed.

### Scoped fidelity and runtime check

- Fonts and copy: unchanged from the previous reference-camera revision, including existing full-reference font differences.
- Layout: camera file and camera tests unchanged; all shop anchor coordinates retained exactly. No change to storefront arrangement, street boundary or headline placement.
- Colors: daylight, dusk and mobile night inspected; warm window/core light remains separated from the cool surrounding masonry.
- Image quality: no new raster assets generated this iteration; existing texture provenance preserved. Geometry/material/shadow changes are visible in the live WebGL screenshot. Whole-reference modeling differences remain open.
- Desktop keyboard + E opened Berryon with correct `https://berryon.ai/`; Escape and reset worked. Mobile touch movement + E opened the same product; no horizontal overflow.
- Reload capture: no console errors, uncaught errors or unhandled rejections; scene ready true.
- Warmed 90-frame desktop RAF sample, after dropping 16 settling frames: mean 34.63 ms, maximum 51.5 ms. This is one local browser sample (~29 fps), not a universal device/FPS guarantee.
- Typecheck, 9 tests (including fixed camera checks), build and 4 Sites packaging tests passed. Existing large-chunk warning remains.

## Evidence and normalization

- Source: `docs/references/town-concept.png`, the same selected image reattached by the user, 1487 × 1058.
- Implementation: `docs/qa/reference-camera-desktop.png`, ego-lite actual WebGL rendering, 1487 × 1058 CSS pixels, DPR 1, 18:30 preview, homepage / initial avatar position.
- Source and implementation were opened together in one comparison input after final capture; no density rescaling or image compositing. Full view covers composition, title, architecture and street; focused review of roof silhouettes, lit windows, signboards, character, foreground stonework and foliage was performed from both full-resolution images.
- Mobile smoke evidence: `docs/qa/reference-camera-mobile-night.png`, 390 × 844 CSS pixels, DPR 1, 21:30. No mobile source mock was supplied; this is usability coverage only, not pixel-fidelity acceptance.

## Findings

- [P1, open] Material and modeling fidelity. Roofs still have regular slopes and uniform fine-grained surfaces. The reference has thick, irregular curved terracotta silhouettes, distinctive light/shadow on masonry, more richly staged window displays and fuller flower beds. The current procedural mesh construction and texture scale visibly differ. Fix: redesign individual roof edge and ridge pieces, authored facade variation, scene-specific display assets and masonry surface detail; compare close-up crops before art signoff.
- [P1, improved but open] Lighting quality. Warm light reaches the level street and the backdrop matches the navy/coral palette more closely. Light pooling is still broad and uniform, while the reference has stronger occlusion, detailed amber falloff and richer warm/cool separation. Current upper windows are simpler lit glass. Fix: localized contact shadow and display lighting with authored window contents, without overexposing the street.
- [P2, open] Reference details. The source has fuller pink/white flower pots, a cat, an ornate lamp and irregular foliage; current plants and lamps remain simpler. The new character silhouette is closer, but animation frames have repeated poses and remain stylistically distinct.
- [P2, open] Typography and exact composition. Title, CTA and navigation positions were brought close, but the available pixel font differs from the source's heavier irregular glyphs; logo is a library leaf. Tooltip is about 10px left/up, and the right threshold remains about 20px away. These are not exact 1:1 matches.
- [resolved for camera behavior] Fixed desktop framing. Camera yaw/pitch/roll no longer follow the desktop avatar. Same-camera projected vertical edges are vertical, and resizing changes scale/framing without rotating the camera. Five selected reference anchors are within 25px; this is a limited geometric test only.
- [resolved structurally] Street mass and orientation. Road surface stays level; angled quay outline and continuous extruded foundation run out of frame. No central artificial staircase cutout remains. Collision follows the diagonal front boundary.

## Five fidelity surfaces

- Fonts/typography: source-like two-line heading, scale and warm emphasis restored; exact font shape still differs (P2).
- Spacing/layout: original header height, CTA placement, approximate building/character anchor positions restored; whole roof silhouettes and right threshold still drift (P1/P2).
- Colors/tokens: navy/coral backdrop, amber windows and green/rust/mauve shop accents present; detailed lighting remains open (P1).
- Image quality: true-alpha pixel atlas verified; generated background and keyed foreground used only as scenery layers. Actual roofs, shops and ground remain geometry. Foliage key tolerance tightened after first screenshot showed edge spill. No game assets or source screenshot substituted for the 3D foreground. Fine material fidelity remains open (P1).
- Copy/content: actual Berryon, development journal and Will studio intentionally replace conceptual NOTES/FLOW/PIXEL products. CTA and description now follow the source meaning. Product links are real.

## Comparison history

1. Previous rebuild: `docs/qa/visual-rebuild-desktop.png`; steep-looking coarse composition rejected by user. Archived report: `docs/qa/previous-visual-rebuild-qa.md`.
2. First correction: taller shops and 22°/8° camera aligned thresholds but left deep roofs too dominant; actual ego screenshot inspected, camera still not accepted.
3. Second correction: 14°/12° fixed camera, shortened roof depth, slim pixel avatar and new distant backdrop. Anchor positions improved, but horizontal quay edge still differed from the reference.
4. Third correction: diagonal plan boundary with level road and thick extruded foundation, matched foreground framing, window/sign details and stronger light pooling. Final desktop image captured again and compared together with source. Major remaining art findings retained above; no 90% claim.

## Runtime validation

- ego-lite desktop: ArrowRight held from spawn moved character to (1.16,2.90); E opened Berryon and `https://berryon.ai/`; Escape closed, reset restored initial framing. The three shop projection coordinates stayed unchanged while the character moved.
- ego-lite mobile: touch movement reached (1.48,2.90), E opened correct Berryon link, Escape and reset worked; night screenshot inspected. No horizontal overflow. This is viewport emulation, not a physical phone test.
- Reload instrumentation captured console errors, uncaught errors and unhandled rejections: empty. Scene ready true.
- Typecheck and 9 tests passed, including two reference camera tests; production build and 4 Sites packaging checks passed. Existing bundle-size warning remains; no device-wide performance claim.

## Remaining implementation checklist

1. Author roof and facade detail at the source's material scale.
2. Rework window staging, flower beds and lamp silhouette, then localized light/shadow.
3. Repeat full-resolution source/actual comparison; do not turn anchor tolerances into a whole-image similarity claim.
