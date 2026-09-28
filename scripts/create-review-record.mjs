#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises"
import { dirname } from "node:path"
import { pathToFileURL } from "node:url"

function parseViewport(value) {
  const match = /^(\d+)x(\d+)$/i.exec(value ?? "")
  if (!match) throw new Error("--viewport must use WIDTHxHEIGHT, for example 1440x900")
  const width = Number(match[1])
  const height = Number(match[2])
  if (width < 1 || height < 1) throw new Error("viewport dimensions must be positive")
  return { width, height }
}

function parseArgs(argv) {
  const values = {}
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index]
    const value = argv[index + 1]
    if (!key?.startsWith("--") || value === undefined) throw new Error(`invalid argument near ${key ?? "end"}`)
    values[key.slice(2)] = value
  }
  return values
}

export function createReviewRecord(values, capturedAt = new Date().toISOString()) {
  for (const key of ["provider", "design-ref", "runtime-url", "viewport", "reference-image", "runtime-image"]) {
    if (!values[key]) throw new Error(`missing required --${key}`)
  }

  if (!["figma", "penpot", "exported"].includes(values.provider)) {
    throw new Error("--provider must be figma, penpot, or exported")
  }

  const deviceScale = Number(values["device-scale"] ?? "1")
  if (!Number.isFinite(deviceScale) || deviceScale <= 0) throw new Error("--device-scale must be a positive number")

  return {
    schemaVersion: 1,
    design: {
      provider: values.provider,
      reference: values["design-ref"],
      targetId: values["target-id"] ?? "",
      image: values["reference-image"],
    },
    runtime: {
      url: values["runtime-url"],
      viewport: parseViewport(values.viewport),
      deviceScale,
      image: values["runtime-image"],
      capturedAt,
    },
    validation: {
      directAutomation: "not_run",
      build: "not_run",
      runtime: "not_run",
      visual: "not_run",
      responsive: "not_run",
      interaction: "not_run",
      accessibility: "not_run",
      humanAcceptance: "not_run",
    },
    findings: [],
    limitations: [],
  }
}

async function main() {
  const values = parseArgs(process.argv.slice(2))
  const output = values.output ?? "design-runtime-review.json"
  const record = createReviewRecord(values)
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(record, null, 2)}\n`, "utf8")
  console.log(output)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 2
  })
}
