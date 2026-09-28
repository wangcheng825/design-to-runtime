import assert from "node:assert/strict"
import { mkdtemp, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import test from "node:test"
import { fileURLToPath } from "node:url"

import { createReviewRecord } from "../scripts/create-review-record.mjs"
import { readPngDimensions, verifyPngPair } from "../scripts/verify-png-pair.mjs"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))

function runScript(name, args) {
  return spawnSync(process.execPath, [join(repoRoot, "scripts", name), ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  })
}

function pngHeader(width, height) {
  const header = Buffer.alloc(24)
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(header, 0)
  header.writeUInt32BE(13, 8)
  header.write("IHDR", 12, 4, "ascii")
  header.writeUInt32BE(width, 16)
  header.writeUInt32BE(height, 20)
  return header
}

test("reads PNG dimensions and distinguishes matched and mismatched pairs", async () => {
  const directory = await mkdtemp(join(tmpdir(), "design-to-runtime-"))
  const reference = join(directory, "reference.png")
  const matching = join(directory, "matching.png")
  const different = join(directory, "different.png")
  await Promise.all([
    writeFile(reference, pngHeader(1440, 900)),
    writeFile(matching, pngHeader(1440, 900)),
    writeFile(different, pngHeader(1280, 720)),
  ])

  assert.deepEqual(await readPngDimensions(reference), { width: 1440, height: 900 })
  assert.equal((await verifyPngPair(reference, matching)).sameDimensions, true)
  assert.equal((await verifyPngPair(reference, different)).sameDimensions, false)
})

test("rejects a non-PNG input", async () => {
  const directory = await mkdtemp(join(tmpdir(), "design-to-runtime-"))
  const invalid = join(directory, "invalid.png")
  await writeFile(invalid, Buffer.from("not a png"))
  await assert.rejects(readPngDimensions(invalid), /too short|invalid PNG/)
})

test("PNG CLI returns 1 and reports mismatched dimensions", async () => {
  const directory = await mkdtemp(join(tmpdir(), "design-to-runtime-"))
  const reference = join(directory, "reference.png")
  const different = join(directory, "different.png")
  await Promise.all([
    writeFile(reference, pngHeader(1440, 900)),
    writeFile(different, pngHeader(1280, 720)),
  ])

  const result = runScript("verify-png-pair.mjs", [reference, different])
  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`)
  assert.equal(JSON.parse(result.stdout).sameDimensions, false)
})

test("PNG CLI returns 2 for missing arguments and unreadable input", () => {
  const missingArgs = runScript("verify-png-pair.mjs", [])
  assert.equal(missingArgs.status, 2, `${missingArgs.stdout}\n${missingArgs.stderr}`)
  assert.match(missingArgs.stderr, /Usage:/)

  const unreadable = runScript("verify-png-pair.mjs", ["missing-reference.png", "missing-runtime.png"])
  assert.equal(unreadable.status, 2, `${unreadable.stdout}\n${unreadable.stderr}`)
  assert.match(unreadable.stderr, /ENOENT|no such file/i)
})

test("creates an evidence record with independent validation layers", () => {
  const record = createReviewRecord({
    provider: "penpot",
    "design-ref": "file/page/board",
    "target-id": "board-1",
    "runtime-url": "http://localhost:3000/dashboard",
    viewport: "1440x900",
    "device-scale": "1",
    "reference-image": "reference.png",
    "runtime-image": "runtime.png",
  }, "2026-09-21T00:00:00.000Z")

  assert.deepEqual(record.runtime.viewport, { width: 1440, height: 900 })
  assert.equal(record.validation.visual, "not_run")
  assert.equal(record.validation.humanAcceptance, "not_run")
})

test("rejects an unsupported design provider", () => {
  assert.throws(() => createReviewRecord({
    provider: "unknown",
    "design-ref": "reference",
    "runtime-url": "http://localhost:3000",
    viewport: "1440x900",
    "reference-image": "reference.png",
    "runtime-image": "runtime.png",
  }), /provider must be/)
})

test("review-record CLI writes a JSON record with independent validation layers", async () => {
  const directory = await mkdtemp(join(tmpdir(), "design-to-runtime-"))
  const output = join(directory, "review.json")
  const result = runScript("create-review-record.mjs", [
    "--provider", "exported",
    "--design-ref", "reference.png",
    "--runtime-url", "http://localhost:3000/dashboard",
    "--viewport", "1440x900",
    "--device-scale", "1",
    "--reference-image", "reference.png",
    "--runtime-image", "runtime.png",
    "--output", output,
  ])

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  const record = JSON.parse(await readFile(output, "utf8"))
  assert.deepEqual(record.runtime.viewport, { width: 1440, height: 900 })
  assert.equal(record.runtime.deviceScale, 1)
  assert.equal(record.validation.directAutomation, "not_run")
  assert.equal(record.validation.visual, "not_run")
  assert.equal(record.validation.humanAcceptance, "not_run")
})

test("review-record CLI returns 2 for invalid viewport and device scale", () => {
  const baseArgs = [
    "--provider", "exported",
    "--design-ref", "reference.png",
    "--runtime-url", "http://localhost:3000/dashboard",
    "--viewport", "1440x900",
    "--device-scale", "1",
    "--reference-image", "reference.png",
    "--runtime-image", "runtime.png",
  ]

  const invalidViewport = [...baseArgs]
  invalidViewport[invalidViewport.indexOf("--viewport") + 1] = "invalid"
  const viewportResult = runScript("create-review-record.mjs", invalidViewport)
  assert.equal(viewportResult.status, 2, `${viewportResult.stdout}\n${viewportResult.stderr}`)
  assert.match(viewportResult.stderr, /--viewport must use WIDTHxHEIGHT/)

  const invalidScale = [...baseArgs]
  invalidScale[invalidScale.indexOf("--device-scale") + 1] = "0"
  const scaleResult = runScript("create-review-record.mjs", invalidScale)
  assert.equal(scaleResult.status, 2, `${scaleResult.stdout}\n${scaleResult.stderr}`)
  assert.match(scaleResult.stderr, /--device-scale must be a positive number/)
})

test("repository validation passes", async () => {
  const result = runScript("validate-repo.mjs", [])
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  assert.match(result.stdout, /PASS/)
  assert.ok((await readFile(join(repoRoot, "SKILL.md"), "utf8")).includes("design-to-runtime"))
})
