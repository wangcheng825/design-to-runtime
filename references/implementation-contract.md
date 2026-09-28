# Implementation and module contract

Use this contract for complex pages, parallel implementation, or handoff between designers and frontend engineers.

## Design-to-code mapping

Before implementation, capture only mappings that affect code decisions:

| Design element | Existing code candidate | Decision | Evidence |
| --- | --- | --- | --- |
| Component or variant | Component path and props | reuse, extend, or create | API and visual fit |
| Token | CSS variable or theme token | reuse or map | resolved value and semantics |
| Icon or asset | Existing icon or asset | reuse or export | exact visual role |
| Layout region | Existing shell or layout | reuse or adapt | sizing and overflow behavior |

Prefer extending an established public interface when the new state belongs to that component. Create a separate component when combining the behavior would make the existing API ambiguous or couple unrelated regions.

## Module description

Create one short Markdown description per independently owned UI module:

```markdown
# ModuleName

## Responsibility
Visible region and owned behavior.

## Design source
- Provider:
- File/page:
- Target ID:
- Reference dimensions:

## Public interface
Props, events, slots, state inputs, and important defaults.

## States and interactions
Selected, expanded, loading, error, empty, disabled, focus, menu, dialog, sorting, pagination, and other required states.

## Assets and tokens
Existing components, icons, assets, and design-to-code token mappings.

## Layout invariants
Fixed and fluid dimensions, anchors, wrapping, clipping, overflow, z-index, and breakpoint behavior.

## Verification
Runtime route, viewport, screenshot crop, stable selectors, and measured bounds.
```

## Ownership

Give each implementation worker exclusive file or module ownership. Assign one integrator to the application shell, shared layout, public interfaces, and assembled-page verification. Workers must preserve other changes and must not rewrite shared files outside their ownership.

The reference dimensions describe one state. The layout invariants describe how the module behaves outside that state.
