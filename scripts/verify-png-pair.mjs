#!/usr/bin/env node

import { open } from "node:fs/promises"
import { pathToFileURL } from "node:url"

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

export async function readPngDimensions(filePath) {
  const handle = await open(filePath, "r")
  try {
    const header = Buffer.alloc(24)
    const { bytesRead } = await handle.read(header, 0, header.length, 0)
    if (bytesRead < header.length) throw new Error(`${filePath}: file is too short to be a PNG`)
    if (!header.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error(`${filePath}: invalid PNG signature`)
    if (header.toString("ascii", 12, 16) !== "IHDR") throw new Error(`${filePath}: missing PNG IHDR header`)

    const width = header.readUInt32BE(16)
    const height = header.readUInt32BE(20)
    if (width === 0 || height === 0) throw new Error(`${filePath}: invalid PNG dimensions`)
    return { width, height }
  } finally {
    await handle.close()
  }
}

export async function verifyPngPair(referencePath, runtimePath) {
  const [reference, runtime] = await Promise.all([
    readPngDimensions(referencePath),
    readPngDimensions(runtimePath),
  ])
  return {
    reference: { path: referencePath, ...reference },
    runtime: { path: runtimePath, ...runtime },
    sameDimensions: reference.width === runtime.width && reference.height === runtime.height,
  }
}

async function main() {
  const [referencePath, runtimePath] = process.argv.slice(2)
  if (!referencePath || !runtimePath) {
    console.error("Usage: node scripts/verify-png-pair.mjs <reference.png> <runtime.png>")
    process.exitCode = 2
    return
  }

  const result = await verifyPngPair(referencePath, runtimePath)
  console.log(JSON.stringify(result, null, 2))
  if (!result.sameDimensions) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 2
  })
}
