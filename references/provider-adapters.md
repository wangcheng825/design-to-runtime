# Design provider adapters

Use only the section for the active design provider. Tool names evolve; discover the tools available in the current client and treat the names below as capability examples.

## Shared source contract

Record the provider, file, exact target, target dimensions, excluded annotations, and whether the captured reference contains the complete product viewport. Parent containers can include visible siblings or overflow content missing from a nested export.

Provider reads are the default for code implementation. Modify a design file only when the user requested design changes, and keep those writes within the named page or sandbox.

## Figma

Use the exact frame or layer URL, including its node identifier. Prefer these capabilities when available:

- metadata or outline inspection for large files;
- structured design context for the exact target;
- variable and style definitions;
- an authoritative screenshot or export;
- motion context when animation is part of the acceptance target;
- Code Connect or an equivalent mapping when the design system already maps to code.

Common tool names include `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`, and `get_motion_context`. A remote server normally requires a frame or layer link; selection-based flows may require the desktop server.

Do not treat generated React-like design context as production code. Translate it into the repository's framework, components, tokens, and state model.

## Penpot

Penpot MCP acts on the currently focused page in the active Penpot tab. Record the file, page, board or shape identifier, and keep the tab and MCP plugin active during the task.

Start with read-only inspection. Useful capabilities include:

- `high_level_overview` for page structure;
- `penpot_api_info` when the required Plugin API surface is unclear;
- read-only `execute_code` for components, variants, tokens, layout, and shape metadata;
- `export_shape` for an authoritative design image or asset;
- `import_image` only in local mode and only when the task requires a design-file write.

`execute_code` can also mutate the focused page. Keep inspection code free of create, update, move, rename, delete, and restyle operations unless design modification is explicitly in scope.

Map Penpot concepts directly where possible:

| Penpot | Frontend |
| --- | --- |
| Flex Layout | CSS flex layout |
| Grid Layout | CSS grid layout |
| Component | Reusable UI component |
| Variant properties | Component props or state variants |
| Design Tokens | CSS variables, theme tokens, or typed tokens |

## Exported-reference fallback

When no provider MCP is available, accept a fresh PNG plus the target viewport, device scale, font information, and interaction notes. Treat that PNG as the authoritative visual fallback. SVG files can supply icons or other implementation assets, but do not use an SVG directly as the matched screenshot baseline; first obtain or produce a deterministic PNG at the target viewport and device scale. Record that component hierarchy, token bindings, overflow siblings, and hidden states were not independently inspected.

Do not invent missing design structure from a bitmap. Ask for the smallest missing fact that changes implementation, or preserve the uncertainty in the delivery record.
