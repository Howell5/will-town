# Prototype Instructions

## Approved project direction

Will Town is an explorable Three.js pixel town for an independent developer, with products represented as shops. Use a small, close street view before expanding into a district. Keep warm windows and legible shop entrances. The first real product is https://berryon.ai. Will's character has short black hair, blue goggles and a black shirt.

Use browser local time for an approximate sunny day cycle; do not add location permissions, weather services, rain or snow. Support direct HTML product access alongside optional keyboard/touch exploration. Keep source prompts and asset provenance separate from runtime assets. The public repository is Howell5/will-town; do not publish the original personal reference attachment.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

The user explicitly prefers ego-lite / ego-browser for actual browser validation and debugging. Use its skill and CLI task space; favor semantic snapshots and compact state checks, taking screenshots for visual inspection.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
