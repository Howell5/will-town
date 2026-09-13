# Reference-camera fidelity QA

final result: blocked

Blocker: overall art fidelity remains below the user's requested near-identical reference. Camera anchor checks pass; they are not a 90% similarity score. This revision is a saved calibration milestone, not a completed design handoff.

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
