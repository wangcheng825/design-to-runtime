# Design to Runtime

**Figma 或 Penpot → 现有前端技术栈 → 经真实运行页面验证的 UI。**

[English](README.md)

Design to Runtime 是一个面向前端工程师的开源 Codex Skill。它不会另建一套前端项目，而是读取准确的设计目标，检查现有仓库的组件、Token、图标和布局约定，在原技术栈中完成实现，并使用真实路由截图和 DOM 几何证据验证结果。

## 主要能力

- 同时支持 Figma 和 Penpot；
- MCP 不可用时可使用导出的 PNG 作为视觉基准，SVG 仍可作为实现资产；
- 优先复用项目已有组件、Design Token、图标和路由；
- 先实现页面结构和响应式约束，再调整视觉细节；
- 验证真实运行路由、数据状态、字体和异步内容；
- 确认参考图与运行截图尺寸一致；
- 使用局部裁剪和 DOM 测量复核有争议的偏差；
- 分别记录视觉、响应式、交互、可访问性、自动化和人工验收证据。

## 安装

在 Codex 中使用：

```text
$skill-installer Install the skill from https://github.com/wangcheng825/design-to-runtime
```

也可以将仓库复制到项目目录：

```text
<repo>/.agents/skills/design-to-runtime/
```

或者用户级目录：

```text
~/.agents/skills/design-to-runtime/
```

## 使用示例

```text
$design-to-runtime 在当前前端项目中实现指定的 Penpot Dashboard，目标路由为 /dashboard。
复用现有组件库和 Token，验证 1440x900 与 390x844 两个视口，
截取真实运行页面，并分别报告视觉、响应式、交互和可访问性证据。
```

建议至少提供：

- 准确的 Figma Frame/Layer 或 Penpot Page/Board/Shape；
- 目标路由与视口；
- 需要出现的数据和 UI 状态；
- 允许修改的文件范围；
- 项目中无法自动发现的运行和验证命令。

Provider MCP 不可用时，应提供与目标视口和设备缩放一致的 PNG。SVG 可以用于图标等实现资产，但不能直接替代截图验收基准；需要先稳定渲染为目标尺寸的 PNG。

## 工具脚本

检查两张 PNG 的像素尺寸是否一致：

```bash
node scripts/verify-png-pair.mjs reference.png runtime.png
```

生成标准化评审记录：

```bash
node scripts/create-review-record.mjs \
  --provider penpot \
  --design-ref "file/page/board" \
  --runtime-url "http://localhost:3000/dashboard" \
  --viewport 1440x900 \
  --reference-image reference.png \
  --runtime-image runtime.png
```

脚本只使用 Node.js 内置模块，不需要安装运行依赖。

## 验证仓库

```bash
npm test
npm run validate
```

## 来源与许可证

本项目吸收了 [front-UI-check](https://github.com/kentLin0/front-UI-check) 的运行态视觉评审思想，以及 [Penpot](https://github.com/penpot/penpot) 的开放设计系统、Flex/Grid、Design Token 和双向 MCP 工作流。

具体归属见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。本项目使用 [MIT License](LICENSE)。
