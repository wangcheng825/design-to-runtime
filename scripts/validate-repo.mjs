#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const requiredFiles = [
  "SKILL.md",
  "README.md",
  "LICENSE",
  "agents/openai.yaml",
  "references/provider-adapters.md",
  "references/implementation-contract.md",
  "references/runtime-review.md",
  "references/quality-gates.md",
  "references/evidence-record.md",
]

async function collectTextFiles(directory = repoRoot) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if ([".git", "node_modules"].includes(entry.name)) continue
    const fullPath = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await collectTextFiles(fullPath))
    else if (/\.(md|ya?ml|json|mjs)$/i.test(entry.name)) files.push(fullPath)
  }
  return files
}

function relativeLinks(markdown) {
  const links = []
  for (const match of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split("#", 1)[0]
    if (target && !/^(?:[a-z]+:|#)/i.test(target)) links.push(target)
  }
  return links
}

async function main() {
  await Promise.all(requiredFiles.map((relativePath) => access(join(repoRoot, relativePath))))

  const skill = await readFile(join(repoRoot, "SKILL.md"), "utf8")
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(skill)?.[1]
  if (!frontmatter) throw new Error("SKILL.md is missing YAML frontmatter")
  const frontmatterKeys = [...frontmatter.matchAll(/^([a-zA-Z0-9-]+):/gm)].map((match) => match[1])
  const allowedKeys = new Set(["name", "description", "license", "allowed-tools", "metadata"])
  const unexpectedKeys = frontmatterKeys.filter((key) => !allowedKeys.has(key))
  if (unexpectedKeys.length) throw new Error(`unexpected SKILL.md frontmatter keys: ${unexpectedKeys.join(", ")}`)
  if (!/^name:\s*design-to-runtime\s*$/m.test(frontmatter)) throw new Error("SKILL.md name must be design-to-runtime")
  const name = /^name:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim()
  if (!name || name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error("SKILL.md name must be hyphen-case and no longer than 64 characters")
  }
  const description = /^description:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim()
  if (!description || description.length < 40) throw new Error("SKILL.md needs a discriminating description")
  if (description.length > 1024 || /[<>]/.test(description)) {
    throw new Error("SKILL.md description must be at most 1024 characters and contain no angle brackets")
  }

  const openaiYaml = await readFile(join(repoRoot, "agents/openai.yaml"), "utf8")
  if (!openaiYaml.includes("$design-to-runtime")) throw new Error("default_prompt must mention $design-to-runtime")

  const unfinishedPattern = new RegExp(`\\[${"TO" + "DO"}|${"TO" + "DO"}:`, "i")
  const textFiles = await collectTextFiles()
  for (const file of textFiles) {
    const content = await readFile(file, "utf8")
    if (unfinishedPattern.test(content)) throw new Error(`unfinished placeholder in ${file}`)
  }

  for (const markdownPath of textFiles.filter((file) => file.endsWith(".md"))) {
    const markdown = await readFile(markdownPath, "utf8")
    for (const link of relativeLinks(markdown)) {
      await access(resolve(dirname(markdownPath), decodeURIComponent(link)))
    }
  }

  console.log("design-to-runtime repository validation: PASS")
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
