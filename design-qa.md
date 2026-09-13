# Will Town prototype QA — 2026-09-13

final result: blocked

This result concerns visual fidelity to the concept, not runtime availability. The first explorable prototype works, but it must not be described as a finished reproduction of the concept or as ready for a polished promotional launch.

## Visual rebuild after user rejection

The user explicitly prioritized visual quality and rejected the floating slab and coarse modeling. This revision was driven by that feedback, not by additional animation features. Current implementation evidence is `docs/qa/visual-rebuild-desktop.png` at **1487×1058 CSS and image pixels, DPR 1**, homepage, avatar at spawn, 18:30 preview. It was opened alongside the original 1487×1058 concept in the same comparison input after the final material and foliage changes. The old `docs/preview.jpg` remains the before image.

- **[P1, structurally resolved] Floating land:** the thin base was replaced by substantial coursed retaining walls, buttresses, capstones, an exposed descending stairway and lower street. The base extends beneath the viewport; neither desktop nor mobile shows a floating underside. `docs/qa/visual-rebuild-mobile-night.png` documents the 390×844 mobile night state.
- **[P1, substantially reworked; fidelity still open] Coarse shop shells:** independent beveled masonry, actual recessed windows, jambs, sills, shutters, gable details, barrel-shaped roof tiles, ridge tiles, eaves and shorter staggered chimneys replace the flat atlas-covered shells. Generated interior panels sit behind the geometry. Microtexture wear supplements geometry rather than supplying all depth.
- **[P2, improved] Flat lighting:** cool fill and warm local pools now separate the street from the background; a low-strength bloom pass softens the lamps. During iteration the alpha-composition fault that hid the scene was fixed, and overexposed metal/glow discs were removed. Final reload shows the complete scene without render errors.
- **[P2, resolved] Intermediate title/roof contact:** reframed the taller desktop scene to reveal the retaining wall, moved the first chimney away from the title and slightly reduced the heading on narrower desktops. Checked at 1487×1058 and 1280×720.
- **[P1, still open for final art acceptance] Organic density and atmosphere:** the source still has richer irregular silhouettes, more abundant greenery, a denser distant town and more integrated foreground framing. This revision is a material improvement, not an exact reproduction or final art signoff. The overall `blocked` result is retained for that reason.

Five-surface review: typography keeps the local pixel fonts with narrower-desktop sizing corrected; layout exposes more foundation and stairs; colors now separate warm shop light from cool stone shadows; image assets preserve pixel sampling while new UVs map surface wear to individual solids; product copy and real URLs remain unchanged. Important geometry, signs, avatar and surface details are readable in the exact-size full capture, so no separate magnification crop was necessary for these findings.

ego-lite checks after the rebuild: mobile directional clicks moved the avatar from `1.10,4.50` to `1.10,2.07`, Berryon opened with the correct URL, Escape returned to the town, and the 390px page had no horizontal overflow. At 1280×720, a held ArrowUp followed by E opened Berryon. Night retained readable steps, shop entrances and avatar. Final full reload's captured console contained only the existing upstream Three.Clock deprecation warning, with no errors. A short 60-frame requestAnimationFrame sample at 1487×1058 averaged **34.2ms** with a **51.9ms** maximum on this machine/browser session; this is roughly 29fps in that sample, not a general performance guarantee. Physical-phone performance is unmeasured.

References reviewed in ego-lite: Square Enix's official product page and RPGFan's Octopath Traveler II screenshots 140 and 141; observed terrain/architecture lessons and exact links are recorded in `docs/visual-direction.md`. No game art was copied into runtime assets.

## Initial prototype findings and iteration history

- **[P1, open] Architectural richness and material scale differ from the concept.** `src/World.tsx`, source vs `docs/preview.jpg`. The concept has varied façades, readable shop interiors, irregular roof silhouettes and layered stone terraces. The implementation has three repeated modular shells with dense texture grain, simple lit windows and a flat foreground wall. This loses the handmade small-town character. Next visual pass: create distinct shop façades, add product-specific window displays, unify logical pixel scale across stone/roof/ground and vary the terrace silhouette. This is the blocker for full visual acceptance.
- **[P2, open] Twilight lighting is flatter and less saturated.** The concept has strong blue distance, orange pools around entrances and more depth between foliage, buildings and background. The current dusk is lighter lavender with broad uniform window emission. Tune dusk environment keyframes and local warm-light falloff after the façade assets are settled. Do not bake time-specific lighting into every material.
- **[P2, resolved] Responsive scene placement previously collided with introduction and clipped the avatar.** Camera target and aspect-aware vertical framing were adjusted; final 1487×1058 and 1280×720 captures show readable copy, complete character and persistent controls.
- **[P2, resolved] Chinese display text lacked a pixel face.** Added locally hosted Fusion Pixel with bundled license notices; final hero has crisp pixel contours. Its thinner stroke differs from the concept's heavy lettering, a remaining P3 optical-weight refinement.
- **[P2, resolved] Decorative block foliage undermined the pixel direction.** Replaced it with generated transparent flower, shrub and ivy atlas assets. Final capture shows detailed foliage with clean silhouettes rather than placeholder blocks.
- **[P2, resolved] Brief touch input was unreliable during auto-walk.** Direction presses now clear the destination and apply an immediate small step before held movement. Retested on the mobile viewport.
- **[P2, resolved] Product title wrapping on mobile produced an isolated last character.** Added balanced heading wrapping; modal body and action remain within the viewport.

## Evidence and normalization

- Source visual truth: `docs/references/town-concept.png`, 1487×1058 pixels. It is a generated concept, not an existing app. It represents twilight with three fictional product names.
- Implementation: `http://127.0.0.1:4173/`, `docs/preview.jpg`, 1487×1058 pixels; CSS viewport 1487×1058, device pixel ratio 1. No resampling or browser chrome. Homepage, character at spawn, 18:30 preview, all panels closed.
- Source and final implementation were opened together in one comparison tool input. Initial comparison used 1488×1058; final capture corrected the one-pixel width difference.
- Additional actual browser captures: `docs/qa/desktop-default.jpg` (1280×720); `docs/qa/mobile-dusk.jpg`, `docs/qa/mobile-night.jpg`, `docs/qa/mobile-product.jpg` (390×844, DPR 1). Mobile has no matching concept source, so these check usability rather than exact fidelity.
- Screenshots are the browser's native JPEG bytes, saved with the correct extension. No image editing was performed.
- Focused crops were not needed for this pass: the exact-size full captures clearly resolve the hero, shop signs, window structures, foliage and avatar; the remaining architectural differences are large and visible without magnification. The mobile product panel is a separate focused interaction-state capture.

## Required visual surfaces

| Surface | Comparison |
| --- | --- |
| Fonts and typography | Locally hosted Fusion Pixel for Chinese display and DotGothic16 for small pixel UI. Hierarchy and two-line desktop title retained; source headline is heavier. Balanced mobile product heading, readable body fallback, no observed truncation. |
| Spacing and layout | Retains upper-left introduction and lower-right three-shop street. A footer now exposes real controls. Camera adapts to aspect ratio; mobile simplifies framing and offers direct navigation. Architectural density remains below the source. |
| Colors and tokens | Cream text and amber CTA over blue-purple sky; warm windows and muted awnings. Dusk contrast and local lighting depth remain a P2 gap. Preview time is explicitly labeled. |
| Image quality | Actual generated backdrop, material atlas, transparent avatar and foliage. No borrowed game assets. Character identity matches the supplied blue goggles and black hair. Texture frequency and shop detail remain P1. Generated walk frames show small alignment inconsistencies (P3). |
| Copy and content | Concept labels NOTES/FLOW/PIXEL intentionally replaced with DEVLOG/BERRYON//LOOP. Berryon uses the supplied real URL and product positioning checked against its public homepage. Navigation and overlay text describe actual actions; no fabricated product metrics or screenshots. |

## Functional validation

- Desktop: loaded the real canvas; clicked shop sign; opened and dismissed Berryon dialog; checked focus restoration. Started exploration, moved with arrows, approached Berryon and opened with E. Movement stays paused while the dialog is open.
- Mobile at 390×844: no horizontal document overflow; clicked ground to walk; used direction buttons; approached a store and opened its content; confirmed action visibility and modal dismissal.
- Time controls: tested noon, dusk and night presets, slider at midnight, accelerated day playback, pause and restore-local-time. Device time zone displayed as Asia/Shanghai. Moving the time slider does not move the avatar.
- Clean recording view: main navigation hides, preview remains labeled, Escape exits, home restores the introduction.
- External product action: inspected the exact `https://berryon.ai` anchor and independently verified HTTP 200. The in-app browser did not expose the target-blank destination as a controlled tab; do not count external tab navigation as browser-tested.
- `pnpm typecheck`, production build, seven core tests and four Sites worker tests passed. Core tests cover time interpolation/wrap, finite values across the day, diagonal movement, ground bounds, proximity and obstacle sliding.
- Console after the final full reload at 04:30 UTC: no new errors; one upstream Three.Clock deprecation warning remains from the scene runtime. Earlier development HMR and removed-shadow warnings were fixed and did not recur after that reload.
- Code contains visibility pause/resume, WebGL error fallback and static no-JavaScript links. These failure states were not injected in the browser. No FPS benchmark or slow-network budget measurement was performed.

### ego-lite revalidation requested by the user

Switched from Codex's in-app browser to ego-browser task space 4. Verified the actual localhost app in desktop Chromium at 1487×1058 and a 390×844 mobile emulation (not a physical phone).

- Held ArrowUp for 0.6 seconds: character moved from `1.10,4.50` to `1.10,2.79`; E opened Berryon. ArrowDown inside the modal did not move the character. Escape restored focus to the shop control after direct entry.
- Seventeen mobile direction clicks moved the character from `1.10,4.50` to `1.10,1.74`; no horizontal overflow. Berryon dialog and visible link were checked in `docs/qa/ego-mobile-product.png`.
- Dusk and night controls changed the reported phase and actual scene. `docs/qa/ego-desktop-dusk.png` is a 1487×1058 capture during the dusk color transition; the settled equal-state visual comparison remains `docs/preview.jpg`. `docs/qa/ego-mobile-night.png` records the settled 390×844 night scene.
- Emulated `prefers-reduced-motion: reduce` via CDP and verified the page media query, explanatory notice and disabled day-playback button together. Cleared the emulation afterward. Restoring local time showed the local-time description again.
- No error/exception events appeared in the drained ego-browser event queue; this does not replace the earlier explicit console review. No new functional issues found in this browser pass.

## Implementation checklist

- [x] First real product, reusable shop data and custom avatar.
- [x] Desktop and mobile exploration plus direct HTML access.
- [x] Approximate local sunny day cycle and recording controls.
- [x] Asset provenance, prompts, fonts and license notices in repository.
- [x] Build, type checks, meaningful tests and actual browser checks.
- [ ] Refine distinct façades, shop interiors and consistent pixel scale.
- [ ] Refine twilight light depth and rerun equal-state visual comparison.
- [ ] Optimize original PNG sizes and verify device performance before public launch.

## Follow-up polish

Stabilize sprite frame baselines, adjust headline optical weight, and follow the upstream Three.Clock migration. Public hosting and an exported demo video have not been created in this iteration.
