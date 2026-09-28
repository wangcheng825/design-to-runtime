# Contributing

Contributions should improve a repeatable design-to-runtime decision or its evidence, rather than add framework-specific boilerplate.

## Before opening a pull request

1. Keep `SKILL.md` concise and provider-neutral.
2. Put provider-specific or conditional detail in `references/`.
3. Avoid assuming an MCP tool exists; document capability discovery and fallbacks.
4. Add deterministic scripts only when repeated logic benefits from automation.
5. Run:

```bash
npm test
npm run validate
```

Include a realistic request that demonstrates the behavior being added or corrected. Do not include private design files, access tokens, screenshots containing customer data, or proprietary repository content.
