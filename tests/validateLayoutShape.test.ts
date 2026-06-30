import { afterEach, beforeEach, expect, it } from "vitest"

import { type LayoutFrame, settings } from "../src/module.js"
import { validateLayoutShape } from "../src/runtime/helpers/validateLayoutShape.js"


beforeEach(() => {
	settings.collapseSizePx = 0
})
afterEach(() => {
	settings.resetToDefaults()
})


it("validates valid layout", () => {
	/**
	 * ┌─────┬─────┐
	 * │  A  │  B  │
	 * ├─────┼─────┤
	 * │  C  │  D  │
	 * └─────┴─────┘
	 */
	const frames: LayoutFrame[] = [
		{ id: "A", x: 0, y: 0, width: 100, height: 50 },
		{ id: "B", x: 100, y: 0, width: 100, height: 50 },
		{ id: "C", x: 0, y: 50, width: 100, height: 50 },
		{ id: "D", x: 100, y: 50, width: 100, height: 50 }
	]

	const result = validateLayoutShape(frames)
	expect(result).toBe(true)
})

it("detects gaps", () => {
	/**
	 * ┌─────┬─────┐
	 * │  A  │  B  │
	 * ├─────┼─────┤
	 * │  C  │     │ ← GAP (missing D)
	 * └─────┴─────┘
	 */
	const frames: LayoutFrame[] = [
		{ id: "A", x: 0, y: 0, width: 100, height: 50 },
		{ id: "B", x: 100, y: 0, width: 100, height: 50 },
		{ id: "C", x: 0, y: 50, width: 100, height: 50 }
		// D is missing - gap in bottom-right
	]

	const result = validateLayoutShape(frames)
	expect(result).toBe(false)
})

it("detects overlaps", () => {
	/**
	 * ┌─────┬─────┐
	 * │  A  │  B  │
	 * ├────┬┴┬────┤
	 * │  C │ │ D  │
	 * │    │ │    │ ← C and D overlap here
	 * └────┴─┴────┘
	 */
	const frames: LayoutFrame[] = [
		{ id: "A", x: 0, y: 0, width: 100, height: 50 },
		{ id: "B", x: 100, y: 0, width: 100, height: 50 },
		{ id: "C", x: 0, y: 50, width: 110, height: 50 }, // Overlaps D
		{ id: "D", x: 90, y: 50, width: 110, height: 50 } // Overlaps C
	]

	const result = validateLayoutShape(frames)
	expect(result).toBe(false)
})

