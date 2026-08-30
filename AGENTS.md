# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable design direction

- Position the product as a public legal-education platform, not a summer-practice project showcase.
- Keep the hero title to the four characters “法润北疆”; foreground legal knowledge rather than place imagery.
- Use short, scannable copy and restrained editorial decoration: chapter numbers, margin rules, legal annotations, stamps, and index labels.
- Preserve the selected visual language: warm ivory paper, deep navy/cobalt, vermilion accents, an asymmetric hero image, and bilingual Chinese/Russian details used sparingly.
- Keep overview surfaces visually concise, but provide deeper hierarchy through topic learning paths, detailed lesson readers, authoritative source links, and category-specific risk checks.
- Each of the four legal topics should have substantive educational content and a distinct, multi-question self-check rather than sharing one generic questionnaire.
- Treat the home page as a minimal editorial cover: preserve one memorable hero, short navigation, and four topic entrances; do not place long lessons or full questionnaires directly on the home page.
- Open learning, self-check, bilingual resources, and help as distinct in-app layers. Within a lesson, reveal detailed content through compact sub-tabs instead of displaying every text block at once.
- Make learning overviews interactive: use a compact, clickable topic map to show how real-life questions connect to the four legal knowledge areas.
- Present misconception content as a direct “错误认知 → 正确理解” comparison, and action guidance as a compact connected route; avoid oversized cards with large empty areas.
