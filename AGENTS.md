# Prototype Instructions

## Approved project direction

Will Town is a Three.js pixel streetscape for an independent developer, with products represented as shops. Use a small, close street view before expanding into a district. Keep warm windows and legible shop entrances. The first real product is https://berryon.ai.

2026-09-14: The user explicitly removed characters and walking to prioritize visual quality. Do not reintroduce avatars, WASD/arrow movement, ground navigation, proximity triggers, collision handling, touch movement pads or camera following. Keep fixed framing and direct shop/product interactions. Concentrate future visual work on architecture, material relief, localized warm lighting and restrained atmospheric motion. Character assets are retired under assets/source/avatar/retired, outside deployed assets. This supersedes the older exploration and character-related notes below.

Visual quality is the first acceptance criterion. The user rejected the initial floating slab and coarse repeated building shells. Ground must read as continuous solid land with substantial stone retaining walls, connected steps and terrain below. Use the original concept and Octopath Traveler screenshots to guide real architectural depth, detailed roof silhouettes, recessed windows, shop displays, shadows and atmospheric depth. Working animation does not compensate for weak visuals.

Use browser local time for an approximate sunny day cycle; do not add location permissions, weather services, rain or snow. Support direct HTML product access alongside optional keyboard/touch exploration. Keep source prompts and asset provenance separate from runtime assets. The public repository is Howell5/will-town; do not publish the original personal reference attachment.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

The user explicitly prefers ego-lite / ego-browser for actual browser validation and debugging. Use its skill and CLI task space; favor semantic snapshots and compact state checks, taking screenshots for visual inspection.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

The user requires the selected reference camera/composition to match, allowing only small modeling differences. Treat roof peaks, shop thresholds, character feet, and retaining-wall edges as measured screen-space anchors at 1487 × 1058. Lock desktop camera yaw/pitch/roll; movement must not drift the desktop composition. Do not claim 90% visual similarity without evidence. The image must never replace the interactive 3D foreground.

For material/light refinements, retain the calibrated camera. Make roof overlap, masonry edges and wood surfaces readable at the final viewport, avoid dense random shader noise, and verify midday readability as well as warm dusk/night lighting. ContactOcclusion caches the static opaque town; invalidate it if future opaque geometry animates.
