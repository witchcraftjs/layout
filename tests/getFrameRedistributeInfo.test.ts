import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { walk } from "@alanscodelog/utils/walk"
import { afterEach, beforeEach, expect, it } from "vitest"

import { createTestWindow, w } from "./utils.js"

import { consoleDebugWindow } from "../src/runtime/helpers/consoleDebugWindow.js"
import { validateLayoutShape } from "../src/runtime/helpers/validateLayoutShape.js"
import { applyFrameChanges } from "../src/runtime/layout/applyFrameChanges.js"
import { getFramesRedistributeInfo } from "../src/runtime/layout/getFramesRedistributeInfo.js"
import { settings } from "../src/runtime/settings.js"
import { LAYOUT_ERROR } from "../src/runtime/types/index.js"
import { KnownError } from "../src/runtime/utils/KnownError.js"


const testWindow = createTestWindow()
beforeEach(() => {
	settings.collapseSizePx = 0
})
afterEach(() => {
	settings.resetToDefaults()
})

/**
 * ┌─────┬─────┬─────┐
 * │A    │B    │C    │
 * └─────┴─────┴─────┘
 */
const layout = {
	...testWindow,
	frames: {
		A: { id: "A", x: 0, y: 0, width: w.third, height: w.full },
		B: { id: "B", x: w.third, y: 0, width: w.third, height: w.full },
		C: { id: "C", x: w.third * 2, y: 0, width: w.third + 1, height: w.full }
	}
}
expect(layout.frames.A.width + layout.frames.B.width + layout.frames.C.width).toBe(w.full)

const halfOfThird = w.third / 2
it("shrinks along horizontal", () => {
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	/**
	 * aprox end result, there is a space because the main usage is for docking and A would be the dock to expand in that case.
	 * ┌─────┐    ┌───┬───┐
	 * │A    │    │B  │C  │
	 * └─────┘    └───┴───┘
	 */
	applyFrameChanges(clone, throwIfError(getFramesRedistributeInfo(clone, "right", ["B", "C"], w.third)))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(false)

	expect(clone.frames).toEqual(expect.objectContaining({
		A: expect.objectContaining({
			...layout.frames.A
		}),
		B: expect.objectContaining({
			...layout.frames.B,
			x: w.third + halfOfThird * 2,
			width: w.third - halfOfThird - 0.5
		}),
		C: expect.objectContaining({
			...layout.frames.C,
			x: w.third * 2 + halfOfThird - 0.5,
			width: w.third + 1 - halfOfThird + 0.5
		})
	}))
})

it("shrinks along vertical and in reverse", () => {
	/**
	 * aprox end result, there is a space because the main usage is for docking and C would be the dock to expand in that case.
	 * ┌─────┐
	 * │A    │
	 * ├─────┤
	 * │B    │
	 * └─────┘
	 *
	 * ┌─────┐
	 * │C    │
	 * │     │
	 * └─────┘
	 */
	const layout = {
		...testWindow,
		frames: {
			A: { id: "A", y: 0, x: 0, width: w.full, height: w.third },
			B: { id: "B", y: w.third, x: 0, width: w.full, height: w.third },
			C: { id: "C", y: w.third * 2, x: 0, width: w.full, height: w.third + 1 }
		}
	}
	expect(layout.frames.A.height + layout.frames.B.height + layout.frames.C.height).toBe(w.full)
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	applyFrameChanges(clone, throwIfError(getFramesRedistributeInfo(clone, "top", ["A", "B"], w.third)))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(false)

	expect(clone.frames).toEqual(expect.objectContaining({
		A: expect.objectContaining({
			y: 0,
			height: w.third - halfOfThird + 0.5
		}),
		B: expect.objectContaining({
			y: w.third - halfOfThird + 0.5,
			height: w.third - halfOfThird - 0.5
		}),
		C: expect.objectContaining({
			...layout.frames.C
		})
	}))
})
it("can also expand", () => {
	/**
	 * ┌────┬────┬────┬────┐
	 * │A   │B   │C   │*   │
	 * └────┴────┴────┴────┘
	 * is the empty space we're expanding into
	 */
	const layout = {
		...testWindow,
		frames: {
			A: { id: "A", x: 0, y: 0, width: w.forth, height: w.full },
			B: { id: "B", x: w.forth, y: 0, width: w.forth, height: w.full },
			C: { id: "C", x: w.forth * 2, y: 0, width: w.forth, height: w.full }
		}
	}

	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	applyFrameChanges(clone, throwIfError(getFramesRedistributeInfo(clone, "left", ["A", "B", "C"], -w.forth)))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	expect(clone.frames).toEqual(expect.objectContaining({
		A: expect.objectContaining({
			x: 0,
			width: w.third
		}),
		B: expect.objectContaining({
			x: w.third,
			width: w.third
		}),
		C: expect.objectContaining({
			x: w.third * 2,
			width: w.full - w.third * 2
		})
	}))
})
it("out of bounds error", () => {
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	const info = getFramesRedistributeInfo(clone, "left", ["B", "C"], -w.full)

	expect(info).toBeInstanceOf(KnownError)
	if (info instanceof KnownError) {
		expect(info.code).toBe(LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS)
	}
})
it("no space error", () => {
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	const info = getFramesRedistributeInfo(clone, "left", ["B", "C"], w.third * 2)

	expect(info).toBeInstanceOf(KnownError)
	if (info instanceof KnownError) {
		expect(info.code).toBe(LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE)
	}
})
it("works with a very complex layout", () => {
	// note for complexity reasons the widths happen to be easy round numbers, the algorithm must be able to handle cases where they arent
	// all edges of resided frames should still be touching after the move
	/*
		* ┌───────────┬───┐
		* │A          │B  │
		* ├───┬───┬───┴───┤
		* │C  │D  │E      │
		* │   │   ├───────┤
		* │   │   │F      │
		* │   ├───┴───────┤
		* │   │G          │
		* └───┴───────────┘
		*
		* aprox result is just a version squished a bit to the right
		*
		*/
	const layout = {
		...testWindow,
		frames: {
			A: { id: "A", x: 0, y: 0, width: w.forth * 3, height: w.forth },
			B: { id: "B", x: w.forth * 3, y: 0, width: w.forth, height: w.forth },
			C: { id: "C", x: 0, y: w.forth, width: w.forth, height: w.forth * 3 },
			D: { id: "D", x: w.forth, y: w.forth, width: w.forth, height: w.forth * 2 },
			E: { id: "E", x: w.forth * 2, y: w.forth, width: w.forth * 2, height: w.forth },
			F: { id: "F", x: w.forth * 2, y: w.forth * 2, width: w.forth * 2, height: w.forth },
			G: { id: "G", x: w.forth, y: w.forth * 3, width: w.forth * 3, height: w.forth }
		}
	}
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	const forthOfFifth = w.fifth / 4
	applyFrameChanges(clone, throwIfError(getFramesRedistributeInfo(clone, "right", Object.keys(layout.frames), w.fifth)))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	expect(clone.frames).toEqual(expect.objectContaining({
		A: expect.objectContaining({
			...layout.frames.A,
			x: forthOfFifth * 4,
			width: w.forth * 3 - forthOfFifth * 3
		}),
		B: expect.objectContaining({
			...layout.frames.B,
			x: layout.frames.B.x + forthOfFifth,
			width: w.forth - forthOfFifth
		}),
		C: expect.objectContaining({
			...layout.frames.C,
			x: forthOfFifth * 4,
			width: w.forth - forthOfFifth
		}),
		D: expect.objectContaining({
			...layout.frames.D,
			x: layout.frames.D.x + forthOfFifth * 3,
			width: w.forth - forthOfFifth
		}),
		E: expect.objectContaining({
			...layout.frames.E,
			x: layout.frames.E.x + forthOfFifth * 2,
			width: w.forth * 2 - forthOfFifth * 2
		}),
		F: expect.objectContaining({
			...layout.frames.F,
			x: layout.frames.F.x + forthOfFifth * 2,
			width: w.forth * 2 - forthOfFifth * 2
		}),
		G: expect.objectContaining({
			...layout.frames.G,
			x: layout.frames.G.x + forthOfFifth * 3,
			width: w.forth * 3 - forthOfFifth * 3
		})

	}))
})

it("docked+collapsed frames are not redistributed when ignored - shrinking", () => {
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	clone.frames.A.collapsed = w.forth
	clone.frames.A.docked = "left"
	clone.frames.B.collapsed = w.forth
	clone.frames.B.docked = "right"

	const pinnedEdgeCoordinates = [clone.frames.C.x]
	applyFrameChanges(clone, throwIfError(getFramesRedistributeInfo(clone, "right", ["B", "C"], w.forth, { pinnedEdgeCoordinates })))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(false)

	expect(clone.frames).toEqual(expect.objectContaining({
		A: expect.objectContaining({
			...layout.frames.A
		}),
		C: expect.objectContaining({
			...layout.frames.C
		}),
		B: expect.objectContaining({
			...layout.frames.B,
			width: layout.frames.B.width - w.forth,
			x: layout.frames.B.x + w.forth
		})
	}))
})
it("docked+collapsed frames are not redistributed when ignored - expanding", () => {
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	clone.frames.A.collapsed = w.forth
	clone.frames.A.docked = "left"
	clone.frames.B.collapsed = w.forth
	clone.frames.B.docked = "right"
	const pinnedEdgeCoordinates = [clone.frames.C.x]

	applyFrameChanges(clone, throwIfError(getFramesRedistributeInfo(clone, "right", ["B", "C"], -w.forth, { pinnedEdgeCoordinates })))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(false)

	expect(clone.frames).toEqual(expect.objectContaining({
		A: expect.objectContaining({
			...layout.frames.A
		}),
		C: expect.objectContaining({
			...layout.frames.C
		}),
		B: expect.objectContaining({
			...layout.frames.B,
			width: layout.frames.B.width + w.forth,
			x: layout.frames.B.x - w.forth
		})
	}))
})
