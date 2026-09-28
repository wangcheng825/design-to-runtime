# Runtime visual review

## Authoritative inputs

Record:

- provider, file, page, and target identifier;
- whether the target is the complete screen or a nested region;
- runtime URL and route;
- viewport, device scale, browser engine, and capture time;
- required data and UI state;
- excluded annotations, cursor layers, canvas padding, and other non-product content.

The reference and runtime images must show the same product viewport and have identical pixel dimensions.

## Capture checks

Before each authoritative runtime screenshot:

1. Confirm the final URL and intended route.
2. Reject login, permission, error, loading, stale, and unintended redirect states.
3. Wait for a stable page landmark and required asynchronous content.
4. Wait for `document.fonts.ready` when the browser exposes it.
5. Confirm the requested viewport and device scale.
6. Capture a fresh image from the current application state.

## Review passes

Review original-resolution images in three passes:

1. **Layout:** regions, coordinates, widths, heights, padding, gaps, overflow, clipping, and stacking.
2. **Detail:** icons, assets, colors, borders, radii, shadows, typography, row heights, controls, and states.
3. **Completeness:** missing content, columns, rows, labels, controls, dialogs, menus, and overflow content.

Name each finding by element and observable boundary. Separate confirmed differences from possible font or rasterization effects.

## Resolve disputed findings

When a finding is uncertain or multiple reviewers repeat the same offset:

1. Crop both original images with identical coordinates.
2. Inspect the crops at original resolution.
3. Use stable container borders and landmarks before judging glyph edges.
4. Query `getBoundingClientRect()` and relevant computed styles on the runtime element.
5. Change code only when image or runtime geometry confirms the difference.

Example browser measurement:

```js
const measure = (selector) => {
  const element = document.querySelector(selector)
  if (!element) return { selector, found: false }
  const rect = element.getBoundingClientRect()
  const style = getComputedStyle(element)
  return {
    selector,
    found: true,
    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    display: style.display,
    position: style.position,
    overflow: style.overflow,
    fontFamily: style.fontFamily,
  }
}
```

Platform font fallback can change glyph width, apparent weight, and antialiasing even when component bounds match. Record that limit unless the required font is legally and technically available.
