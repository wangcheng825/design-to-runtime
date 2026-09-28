# Evidence record

Use a persistent record when the screen will be reviewed, handed off, or revisited. The included generator creates JSON with this shape:

```json
{
  "schemaVersion": 1,
  "design": {
    "provider": "figma-or-penpot",
    "reference": "file/page/frame/board/shape",
    "targetId": "provider identifier",
    "image": "path/to/reference.png"
  },
  "runtime": {
    "url": "http://localhost:3000/route",
    "viewport": { "width": 1440, "height": 900 },
    "deviceScale": 1,
    "image": "path/to/runtime.png",
    "capturedAt": "ISO-8601"
  },
  "validation": {
    "directAutomation": "not_run",
    "build": "not_run",
    "runtime": "not_run",
    "visual": "not_run",
    "responsive": "not_run",
    "interaction": "not_run",
    "accessibility": "not_run",
    "humanAcceptance": "not_run"
  },
  "findings": [],
  "limitations": []
}
```

Use only statuses defined by the receiving project. The generator uses `not_run` as a neutral starting state; update it with actual evidence instead of deriving one layer from another.

Do not store access tokens, authorization URLs, cookies, credentials, private design content, or personal data in a public evidence record.
