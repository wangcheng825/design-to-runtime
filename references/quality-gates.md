# Frontend quality gates

Apply the gates that match the user's requested scope. Report each layer separately; one layer does not substitute for another.

## Source and structure

- The exact design target and reference state are recorded.
- Existing components, tokens, icons, and layout primitives were evaluated before new ones were created.
- Repeated structures are data-driven where the surrounding codebase uses that pattern.
- The implementation preserves the repository's public interfaces and architecture.

## Direct automation

- Directly related tests, lint, type checks, and build steps use repository-confirmed commands.
- Failures are reported with their affected layer; unrelated existing failures are not silently attributed to this change.

## Runtime

- The intended route renders in the real application.
- Required data and asynchronous content are present.
- The authoritative screenshot is fresh and dimension-matched.
- Important layout invariants are supported by DOM geometry where useful.

## Responsive behavior

Verify each requested viewport. Check:

- fixed versus fluid regions;
- wrapping and reflow;
- minimum and maximum widths;
- horizontal and vertical overflow;
- sticky or fixed regions;
- clipped content and unreachable controls.

Do not extrapolate mobile or tablet acceptance from one desktop screenshot.

## Interaction and accessibility basics

For controls changed by the task, check the relevant items:

- keyboard reachability and visible focus;
- semantic element or accessible role and name;
- disabled behavior;
- hover, pressed, selected, expanded, loading, empty, and error states;
- dialog focus entry, exit, and dismissal;
- label and error association for form controls;
- contrast or reduced-motion requirements when they are part of the product contract.

These checks support, but do not replace, a dedicated accessibility audit when one is required.

## Human acceptance

Record human visual or business acceptance as a separate status. Automated build, screenshot, DOM, and accessibility evidence cannot claim that a user completed this review.
