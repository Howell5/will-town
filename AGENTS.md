# Will Town project instructions

## Current approved direction — 2026-09-14

The user approved `docs/design/street-approval-v1.png`, then authorized implementing and publishing it. Use a fixed pre-rendered streetscape with real HTML navigation and storefront hotspots. This supersedes the earlier realtime Three.js architecture. Visual composition, solid connected stone embankment, close storefront view, roof detail and localized amber lighting are the acceptance criteria. Do not claim exact pixel-for-pixel fidelity or a numerical similarity score.

No humans, avatars, walking, collisions, movement controls, proximity triggers, camera rotation or following. The orange cat in the approved artwork stays. No weather APIs, geolocation permissions or physically accurate sun claims. Device-local time may subtly modulate scene brightness while preserving the approved dusk palette.

The first real product is https://berryon.ai. Keep a directly accessible HTML product directory and native dialog interactions. Source image lettering is physical signage; navigation, hero copy and actions must be actual selectable HTML, not baked UI.

Use ego-browser / ego-lite for actual browser QA. Compare approved artwork and real implementation at 1487 × 1058, DPR 1, 18:30 preview, including focused typography and storefront regions. Check responsive layouts and direct product access. Keep generated asset prompts and provenance in assets/source; ship only selected assets in public/assets. Do not publish the original personal portrait attachment.

Repository: Howell5/will-town. Existing authorized hosting: https://will-town.haruhowell.workers.dev, Cloudflare Worker will-town. Preserve `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs` and `tests/sites-worker.test.mjs` for optional handoff compatibility. `pnpm build` must leave dist/client/index.html, dist/server/index.js and dist/.openai/hosting.json. Deploy only dist/client.

Run typecheck, unit tests, build and Sites packaging tests at meaningful milestones. Run the local preview yourself. Keep prior realtime assets under assets/source/retired-realtime, not public. Earlier design experiments are historical; current instructions and README take precedence.
