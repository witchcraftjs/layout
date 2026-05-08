import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { walk } from "@alanscodelog/utils/walk"
import { beforeEach, describe, expect, it } from "vitest"

import { createTestWindow, w } from "./utils.js"

import { settings } from "../src/module.js"
import { applyFrameChanges } from "../src/runtime/layout/applyFrameChanges.js"
import { getFillEmptySpaceInfo } from "../src/runtime/layout/getFillEmptySpaceInfo.js"


const testWindow = createTestWindow()

beforeEach(() => {
	settings.collapseSize = { width: 0, height: 0 }
})

describe("getFillEmptySpaceInfo", () => {
	it("prefer passed frames", () => {
		/*
		* ┌─────┬─────┐
		* │A    │*  🭯 │
		* ├─────┼───┼─┤
		* │C    │B    │
		* └─────┴─────┘
		*/
		const win = {
			...testWindow,
			frames: {
				A: { id: "A", x: 0, y: 0, width: w.half, height: w.half },
				B: { id: "B", x: w.half, y: w.half, width: w.half, height: w.half },
				C: { id: "C", x: 0, y: w.half, width: w.half, height: w.half }
			}
		}
		const empty = { x: w.half, y: 0, width: w.half, height: w.half }

		const clone = walk(win, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFillEmptySpaceInfo (clone, empty, ["B"])))

		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining(win.frames.A),
			B: expect.objectContaining({ ...win.frames.B, y: 0, height: w.full }),
			C: expect.objectContaining(win.frames.C)
		}))
	})
	it("prefer shortest edge (A)", () => {
		/*
		* ┌─────┬─────┐
		* │A    ┼🭬 *  │
		* ├─────┼─────┤
		* │C    │B    │
		* └─────┴─────┘
		*/
		const win = {
			...testWindow,
			frames: {
				A: { id: "A", x: 0, y: 0, width: w.half, height: w.half },
				B: { id: "B", x: w.half, y: w.half, width: w.half, height: w.half },
				C: { id: "C", x: 0, y: w.half, width: w.half, height: w.half }
			}
		}
		const empty = { x: w.half, y: 0, width: w.half, height: w.half }

		const clone = walk(win, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFillEmptySpaceInfo(clone, empty)))

		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({ ...win.frames.A, y: 0, width: w.full }),
			B: expect.objectContaining(win.frames.B),
			C: expect.objectContaining(win.frames.C)
		}))
	})

	it("uses frames on side of preferredFrames", () => {
		/*
		* ┌─────┬─────┬─────┐
		* │A    │*   🭮┼ C   │
		* │     │     ├─────┤
		* │     │    🭮┼ D   │
		* └─────┴─────┴─────┘
		*/
		const win = {
			...testWindow,
			frames: {
				A: { id: "A", x: 0, y: 0, width: w.third, height: w.full },
				C: { id: "C", x: w.third * 2, y: 0, width: w.third + 2, height: w.half },
				D: { id: "D", x: w.third * 2, y: w.half, width: w.third + 2, height: w.half }
			}
		}
		const empty = { x: w.third, y: 0, width: w.third, height: w.full }

		const clone1 = walk(win, undefined, { save: true }) // deep copy
		const clone2 = walk(win, undefined, { save: true }) // deep copy
		const clone3 = walk(win, undefined, { save: true }) // deep copy
		applyFrameChanges(clone1, throwIfError(getFillEmptySpaceInfo(clone1, empty, ["C"])))
		applyFrameChanges(clone2, throwIfError(getFillEmptySpaceInfo(clone2, empty, ["D"])))
		applyFrameChanges(clone3, throwIfError(getFillEmptySpaceInfo(clone3, empty, ["C", "D"])))

		for (const clone of [clone1, clone2, clone3]) {
			expect(clone.frames).toEqual(expect.objectContaining({
				A: expect.objectContaining(win.frames.A),
				C: expect.objectContaining({ ...win.frames.C, x: w.third, width: w.third * 2 + 2 }),
				D: expect.objectContaining({ ...win.frames.D, x: w.third, width: w.third * 2 + 2 })
			}))
		}
	})
	it("fails to use preferences, uses shortest edge instead", () => {
		/*
		* ┌─────┬─────┬─────┐
		* │A    │*    │C    │
		* │     │     ├─────┤
		* │     │   🭯 │     │
		* │     ├───┼─┤D    │
		* │     │B    │     │
		* └─────┴─────┴─────┘
		*/
		const win = {
			...testWindow,
			frames: {
				A: { id: "A", x: 0, y: 0, width: w.third, height: w.full },
				B: { id: "B", x: w.third, y: w.third * 2 + 1, width: w.third, height: w.third },
				C: { id: "C", x: w.third * 2, y: 0, width: w.third + 2, height: w.half },
				D: { id: "D", x: w.third * 2, y: w.half, width: w.third + 2, height: w.half }
			}
		}
		const empty = { x: w.third, y: 0, width: w.third, height: w.third * 2 + 1 }
		expect(empty.height + win.frames.B.height).toBe(w.full)

		const clone = walk(win, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFillEmptySpaceInfo(clone, empty, ["C"])))
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining(win.frames.A),
			B: expect.objectContaining({ ...win.frames.B, y: 0, height: w.full }),
			C: expect.objectContaining (win.frames.C),
			D: expect.objectContaining (win.frames.D)
		}))
	})
})
