# Approved streetscape implementation QA

final result: passed

## Evidence and normalization

- Visual truth: docs/design/street-approval-v1.png, user approved before integration.
- Implementation: docs/qa/prerendered-desktop-v2.png, actual ego-lite browser at http://127.0.0.1:4173/.
- Source and implementation: 1487 × 1058 pixels, viewport 1487 × 1058 CSS px, DPR 1. State: homepage, no dialog/hover, 18:30 dusk, after brightness transition.
- Full comparison: docs/qa/artwork-comparison-v2.png, rendered side by side at identical scale using artwork-comparison.html.
- Focused comparison: docs/qa/detail-comparison-v2.png, source and implementation regions at 1:1 scale using detail-comparison.html. Inspected title, intro, CTA, roof silhouettes, signs, windows, masonry, foliage and local lighting.
- Mobile: docs/qa/prerendered-390.png (390 × 844), prerendered-320.png (320 × 740); tablet: prerendered-800.png (800 × 1100). DPR 1, browser viewport emulation, not physical-device testing. No mobile reference supplied; responsive usability coverage only.

## Comparison iterations

1. v1: P2 dense coral clouds behind the headline changed the quiet upper-left region; intro and CTA sat roughly 7–15 px low. Evidence: artwork-comparison-v1.png. Corrected sky using a targeted image edit, reduced title/action gaps, aligned button width and arrow directions.
2. v2: source-like quiet sky, fixed scene geometry and warm/cool palette restored. P2 tablet layout at 800 × 1100 initially left a large empty lower region; extended stacked layout breakpoint to 900 px. Replaced outline leaf with generated pixel leaf asset. A heavier title stroke made glyph counters too dense, so retained the readable lighter pixel treatment after focused comparison.
3. Final re-capture: source and revised implementation compared in full and focused views. No remaining actionable P0/P1/P2 findings for the approved pre-rendered scope. This is not a numerical similarity score or a claim of pixel-identical reconstruction.

## Reviewed surfaces

- Typography: actual HTML copy, local Fusion Pixel display font, system Chinese body font. Two-line headline and hierarchy preserved. Exact source-generated glyph shapes remain a P3 difference.
- Layout: fixed image aspect and shared percentage hotspot frame preserve shop and embankment positions. Mobile uses its own crop and text layout; all three storefront entries remain usable.
- Color and assets: navy/coral sky, cream title, yellow CTA, localized amber windows and dense stone/roof detail retained. The v2 image edit has small masonry, leaf and cloud differences from the approved mock (P3). No realtime geometry or CSS-drawn illustration substitutes.
- Content: DEVLOG, BERRYON, /LOOP physical signs; real product directory, product links, journal and studio. No human avatar or movement UI. Orange cat is part of the approved art.
- Icons: generated pixel leaf; standard Phosphor controls for arrows, close and time settings. Arrow weight and header glyphs differ slightly from the source (P3).
- Accessibility: semantic buttons and native dialog, accessible storefront labels, visible keyboard focus, Escape and restored opener focus, reduced-motion handling. Image failure leaves HTML product access available. Clock is an intentional small addition, with time previews distinct inside settings.

## Functional and build verification

- Desktop and 390 px mobile: all three storefronts open corresponding dialogs; product directory contains all three; Berryon link resolves to https://berryon.ai/.
- Escape restores opener focus. Cinema hides navigation and returns with Escape. Four time presets update state. Reduced motion hides animated layer and disables accelerated playback.
- 320, 390, 800 and 1280 px layout checks: no horizontal page overflow. Rechecked tablet after breakpoint correction.
- Browser error/unhandled-rejection listeners: zero observed during interaction checks.
- pnpm typecheck, 3 environment tests, production build, 4 Sites packaging tests: passed. App JS 236.70 KB, 73.40 KB gzip; no Three.js bundle.

## Remaining limits

P3: exact generated headline lettering and minute image-edit details differ. No supplied mobile art for fidelity comparison; emulated viewports only. Time modulates brightness subtly and preserves the dusk artwork; it does not synthesize a physically accurate daytime sky. The art is pre-rendered, while text and actions are actual web elements. Historical realtime QA remains in docs/qa/realtime-design-qa.md.

## Published verification

Cloudflare Worker will-town deployment e21470451bb94368a0c8fee5787be3a3, 2026-09-14. https://will-town.haruhowell.workers.dev/ loaded the current index-_rDmWumV.js bundle and street-dusk-v2.png. Production desktop and 390 px mobile opened Berryon correctly; image ready, local font loaded, no canvas runtime, zero observed browser errors. Actual hosted screenshot: docs/qa/prerendered-production.png. Source commit: 7c2c5cb.
