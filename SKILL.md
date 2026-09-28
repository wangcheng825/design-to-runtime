---
name: design-to-runtime
description: Implement or fidelity-correct a Figma, Penpot, or exported PNG design reference in an existing frontend project, then verify the real running page with matched screenshots and runtime evidence. Use for design-to-code, UI reconstruction, pixel-alignment, or visual QA tasks with a concrete design reference. Skip open-ended UI ideation without a reference and unrelated frontend work.
---

# Design to Runtime

Turn an authoritative Figma or Penpot design into maintainable code in the repository's existing frontend stack, then verify the real application rather than judging source code or generated markup alone.

## Establish the contract

Before editing, identify:

- the design provider and exact file, page, frame, board, or shape;
- the target route, viewport, device scale, required content, and UI states;
- the allowed code scope and the project's real run and validation commands;
- whether the task includes design-file writes or only reads the design and changes code.

If any missing item would change the implementation or acceptance result, resolve it before dependent work. Do not infer permission to edit a design file from permission to edit code.

Select a provider route and read [references/provider-adapters.md](references/provider-adapters.md). Discover available tools before naming or calling them. Use a fresh exported PNG as a documented fallback when provider tools are unavailable. SVG files can supply implementation assets, but require a deterministically rendered PNG before authoritative screenshot comparison.

## Inspect before implementing

Read repository instructions, the application shell, route, neighboring implementation, design tokens, existing components, icon abstractions, installed UI packages, and directly related tests. Reuse established components and conventions when they can represent the design faithfully.

Create a compact mapping from design elements to existing code. Read [references/implementation-contract.md](references/implementation-contract.md) when the screen has multiple modules, repeated structures, shared layout ownership, or subagent delivery.

Do not add a UI library, icon package, font, or other production dependency unless the user authorized it. Use real icons or design assets instead of font-dependent text glyphs.

## Implement from structure to detail

Build in this order when it fits the page:

1. Route and application shell.
2. Viewport geometry, fixed and fluid regions, layout constraints, overflow, and stacking.
3. Repeated and data-driven structures.
4. Components, content, assets, and visual states.
5. Interactions, focus behavior, loading, empty, error, disabled, and responsive behavior required by the task.

Treat the reference viewport as one acceptance state. Preserve intended resizing, wrapping, anchoring, clipping, and overflow instead of freezing the page into screenshot coordinates.

## Verify the running application

Run the project's relevant direct checks and build. Start the real application using repository-confirmed commands. Before an authoritative capture, verify the final URL and intended route, reject login, error, loading, stale, and unintended redirect states, wait for required asynchronous content, and wait for fonts to settle.

Capture the design reference and runtime page at the same viewport and device scale. Confirm identical image dimensions. `scripts/verify-png-pair.mjs` can check PNG pairs deterministically.

Read [references/runtime-review.md](references/runtime-review.md) for screenshot review and disputed findings. Use similarity scores or pixel diffs only to locate regions; do not use a ratio alone as acceptance evidence.

Read [references/quality-gates.md](references/quality-gates.md) when the task includes responsive, interaction, accessibility, or release-level acceptance. Apply only gates relevant to the requested scope.

## Deliver evidence

Report:

- design provider and exact target;
- changed files and component/token reuse;
- runtime URL, viewport, and device scale;
- checks and build results;
- reference image, fresh runtime image, and labeled comparison when requested;
- confirmed remaining differences and environmental limits such as unavailable fonts;
- validation layers that remain for human review.

Use [references/evidence-record.md](references/evidence-record.md) when a persistent handoff record is useful. `scripts/create-review-record.mjs` creates a consistent JSON starting point.
