import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { walk } from "@alanscodelog/utils/walk"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { createTestWindow, w } from "./utils.js"

import { applyFrameChanges } from "../src/runtime/layout/applyFrameChanges.js"
import { getFrameDockInfo } from "../src/runtime/layout/getFrameDockInfo.js"
import { getFrameUndockInfo } from "../src/runtime/layout/getFrameUndockInfo.js"
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
describe("getFrameDockInfo", () => {
	/**
		* In the example frame A will be getting dragged to the corresponding edge.
		*
		* ┌─────┬─────┬─────┐
		* │B    │C    │A    │
		* ├─────┴─────┴─────┤
		* │D                │
		* └─────────────────┘
		*
		*/
	const layout = {
		...testWindow,
		frames: {
			B: { id: "B", x: 0, y: 0, width: w.third, height: w.half },
			C: { id: "C", x: w.third, y: 0, width: w.third, height: w.half },
			A: { id: "A", x: w.third * 2, y: 0, width: w.third + 1, height: w.half },
			D: { id: "D", x: 0, y: w.half, width: w.full, height: w.half }
		}
	}
	expect(layout.frames.A.width + layout.frames.B.width + layout.frames.C.width).toBe(w.full)
	expect(layout.frames.B.height + layout.frames.D.height).toBe(w.full)
	expect(layout.frames.C.height + layout.frames.D.height).toBe(w.full)
	expect(layout.frames.A.height + layout.frames.D.height).toBe(w.full)

	const halfOfThird = w.third / 2
	it("docks to left", () => {
		const clone = walk(layout, undefined, { save: true })
		/**
		 *
		 * C gets slightly bigger because it first fills the space A leaves behind
		 * ┌─────┬─const changes = getFramesRedistributeInfo(win, redistributeSide, otherFrameIds, -shrinkAmount, true)───┬──────┐
		 * │A    │B   │C     │
		 * │     ├────┴──────┤
		 * │     │D          │
		 * └─────┴───────────┘
		 *
		 */
		applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "A", "left", w.third)))

		expect(clone.frames.A.width + clone.frames.B.width + clone.frames.C.width).toBe(w.full)
		expect(clone.frames.D.width + clone.frames.A.width).toBe(w.full)

		// its a bit hard to predict these number so we just check everything is relatively close

		expect(clone.frames.A).toEqual(expect.objectContaining({
			...layout.frames.A,
			x: 0,
			y: 0,
			width: w.third,
			height: w.full,
			docked: "left"
		}))

		expect(clone.frames.B.width).toBeLessThan(layout.frames.C.width)
		expect(clone.frames.B.x).toEqual(w.third)
		expect(clone.frames.C.width).toBeGreaterThan(layout.frames.A.width)
		expect(clone.frames.D).toEqual(expect.objectContaining({
			...layout.frames.D,
			x: w.third,
			width: w.full - w.third,
			height: w.half
		}))
	})

	it("docks to right", () => {
		const clone = walk(layout, undefined, { save: true })
		/**
		 *
		 * ┌────┬──────┬─────┐
		 * │B   │C     │A    │
		 * ├────┴──────┤     │
		 * │D          │     │
		 * └───────────┴─────┘
		 *
		 */

		applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "A", "right", w.third)))

		expect(clone.frames.B.width + clone.frames.C.width + clone.frames.A.width).toBe(w.full)
		expect(clone.frames.D.width + clone.frames.A.width).toBe(w.full)
		expect(clone.frames.A).toEqual(expect.objectContaining({
			x: w.full - w.third,
			y: 0,
			width: w.third,
			height: w.full,
			docked: "right"
		}))
		expect(clone.frames.B.width).toBeLessThan(layout.frames.C.width)
		expect(clone.frames.B.x).toEqual(0)
		expect(clone.frames.C.width).toBeGreaterThan(layout.frames.A.width)

		expect(clone.frames.D).toEqual(expect.objectContaining({
			...layout.frames.D,
			x: 0,
			width: w.full - w.third,
			height: w.half
		}))
	})
	it("docks to top", () => {
		/**
		 *  ┌─────────────────┐
		 *  │A                │
		 *  ├─────┬───────────┤
		 *  │B    │C          │
		 *  ├─────┴───────────┤
		 *  │D                │
		 *  └─────────────────┘
		 *
		 */
		const clone = walk(layout, undefined, { save: true })
		applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "A", "top", w.third)))

		expect(clone.frames.A.height + clone.frames.B.height + clone.frames.D.height).toBe(w.full)
		expect(clone.frames.A.height + clone.frames.C.height + clone.frames.D.height).toBe(w.full)

		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({
				...layout.frames.A,
				x: 0,
				y: 0,
				width: w.full,
				height: w.third,
				docked: "top"
			}),
			B: expect.objectContaining({
				...layout.frames.B,
				y: w.third,
				height: w.half - halfOfThird - 0.5
			}),
			C: expect.objectContaining({
				...layout.frames.C,
				y: w.third,
				height: w.half - halfOfThird - 0.5,
				width: w.full - w.third
			}),
			D: expect.objectContaining({
				...layout.frames.D,
				y: w.third + (w.half - halfOfThird) - 0.5,
				height: w.half - halfOfThird + 0.5
			})
		}))
	})
	it("docks to bottom", () => {
		/**
		 *  ┌────────┬────────┐
		 *  │B       │C       │
		 *  ├────────┴────────┤
		 *  │D                │
		 *  ├─────────────────┤
		 *  │A                │
		 *  └─────────────────┘
		 *
		 */
		const clone = walk(layout, undefined, { save: true })
		applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "A", "bottom", w.third)))

		expect(clone.frames.B.height + clone.frames.D.height + clone.frames.A.height).toBe(w.full)
		expect(clone.frames.C.height + clone.frames.D.height + clone.frames.A.height).toBe(w.full)


		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({
				...layout.frames.A,
				x: 0,
				y: w.full - w.third,
				width: w.full,
				height: w.third,
				docked: "bottom"
			}),
			B: expect.objectContaining({
				...layout.frames.B,
				y: 0,
				height: w.half - halfOfThird + 0.5
			}),
			C: expect.objectContaining({
				...layout.frames.C,
				y: 0,
				height: w.half - halfOfThird + 0.5,
				width: w.full - w.third
			}),
			D: expect.objectContaining({
				...layout.frames.D,
				y: w.half - halfOfThird + 0.5,
				height: w.half - halfOfThird - 0.5
			})
		}))
	})
	it("docking over docked edge fails", () => {
		const clone = walk(layout, undefined, { save: true })
		/**
		 *
		 * ┌─────┬─────┬─────┐
		 * │A    │B    │C    │
		 * │     ├─────┴─────┤
		 * │     │D          │
		 * └─────┴───────────┘
		 *
		 */

		applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "A", "left")))
		const info = getFrameDockInfo(clone, "B", "left")
		expect(info).toBeInstanceOf(KnownError)
		if (info instanceof KnownError) {
			expect(info.code).toBe(LAYOUT_ERROR.FRAME_ALREADY_DOCKED_ON_SIDE)
		}
	})
	it("can't dock if it would leave no frames undocked", () => {
		/**
		 * ┌─────┬─────┐
		 * │A*   │B    │
		 * │     │     │
		 * │     │     │
		 * └─────┴─────┘
		 */
		const layout = {
			...testWindow,
			frames: {
				A: { id: "A", x: 0, y: 0, width: w.half, height: w.full, docked: "left" },
				B: { id: "B", x: 0, y: 0, width: w.half, height: w.full }
			}
		}
		expect(layout.frames.A.width + layout.frames.B.width).toBe(w.full)
		const clone = walk(layout, undefined, { save: true })
		const info = getFrameDockInfo(clone, "B", "right")
		expect(info).toBeInstanceOf(KnownError)
		if (info instanceof KnownError) {
			expect(info.code).toBe(LAYOUT_ERROR.CANT_LEAVE_NO_UNDOCKED_FRAMES)
		}
	})
	it("dock with rearrangement (B right to top)", () => {
		/**
		 * ┌─────┬─────┐
		 * │A    │B    │
		 * │     │     │
		 * │     │     │
		 * └─────┴─────┘
		 *
		 * ┌───────────┐
		 * │B*Top      │
		 * ├───────────┤
		 * │A          │
		 * └───────────┘
		 */

		const layout = {
			...testWindow,
			frames: {
				A: { id: "A", x: 0, y: 0, width: w.half, height: w.full },
				B: { id: "B", x: w.half, y: 0, width: w.half, height: w.full }
			}
		}
		expect(layout.frames.A.width + layout.frames.B.width).toBe(w.full)
		const clone = walk(layout, undefined, { save: true })
		applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "B", "top", w.half)))

		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({
				...layout.frames.A,
				x: 0,
				y: w.half,
				height: w.half,
				width: w.full
			}),
			B: expect.objectContaining({
				...layout.frames.B,
				x: 0,
				y: 0,
				height: w.half,
				width: w.full,
				docked: "top"
			})

		}))
	})
	it("dock with rearrangement complex (C right to top)", () => {
		/**
		 * ┌──┬──┬─────┐
		 * │A │B │C    │
		 * │  │  │     │
		 * │  │  │     │
		 * └──┴──┴─────┘
		 *
		 * ┌───────────┐
		 * │C*Top      │
		 * ├──┬────────┤
		 * │A │B       │
		 * └──┴────────┘
		 */

		const layout = {
			...testWindow,
			frames: {
				A: { id: "A", x: 0, y: 0, width: w.forth, height: w.full },
				B: { id: "B", x: w.forth, y: 0, width: w.forth, height: w.full },
				C: { id: "C", x: w.half, y: 0, width: w.half, height: w.full }
			}
		}
		expect(layout.frames.A.width + layout.frames.B.width + layout.frames.C.width).toBe(w.full)
		const clone = walk(layout, undefined, { save: true })
		applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "C", "top", w.half)))

		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({
				...layout.frames.A,
				height: w.half,
				y: w.half,
				x: 0,
				width: w.forth
			}),
			B: expect.objectContaining({
				...layout.frames.B,
				height: w.half,
				y: w.half,
				width: w.full - w.forth
			}),
			C: expect.objectContaining({
				...layout.frames.C,
				docked: "top",
				x: 0,
				y: 0,
				height: w.half,
				width: w.full
			})
		}))
	})
	it("more scenarios - docks left to top", () => {
	/**
		*
		* ┌─────┬─────┐
		* │A    │B    │
		* │     ├─────┤
		* │     │C    │
		* └─────┴─────┘
		*
		*/
		const layout = {
			...testWindow,
			frames: {
				A: { id: "A", x: 0, y: 0, width: w.half, height: w.full },
				B: { id: "B", x: w.half, y: 0, width: w.half, height: w.half - 2000 },
				C: { id: "C", x: w.half, y: w.half - 2000, width: w.half, height: w.half + 2000 }
			}
		}
		expect(layout.frames.A.width + layout.frames.B.width).toBe(w.full)
		const clone = walk(layout, undefined, { save: true })

		applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "A", "top", w.forth)))
		expect(clone.frames.A.docked).toBe("top")
		expect(clone.frames.A.collapsed).toBe(undefined)
		expect(clone.frames.A.width).toBe(w.full)
		expect(clone.frames.A.x).toBe(0)

		expect(clone.frames.B.width).toBe(w.full)
		expect(clone.frames.B.x).toBe(0)
		expect(clone.frames.B.y).toBe(clone.frames.A.height)

		expect(clone.frames.C.width).toBe(w.full)
		expect(clone.frames.C.x).toBe(0)
		expect(clone.frames.C.y).toBe(clone.frames.B.y + clone.frames.B.height)
	})

	describe("multiple docks", () => {
		/**
			* Frames dragged will be identified by *
			* ┌─────┬─────┬─────┐
			* │B    │C    │A    │
			* ├─────┴─────┴─────┤
			* │D                │
			* └─────────────────┘
			*
			*/
		const layout = {
			...testWindow,
			frames: {
				B: { id: "B", x: 0, y: 0, width: w.third, height: w.half },
				C: { id: "C", x: w.third, y: 0, width: w.third, height: w.half },
				A: { id: "A", x: w.third * 2, y: 0, width: w.third, height: w.half },
				D: { id: "D", x: 0, y: w.half, width: w.full, height: w.half }
			}
		}
		expect(layout.frames.B.height + layout.frames.D.height).toBe(w.full)

		it("a left then b top", () => {
			const clone = walk(layout, undefined, { save: true })
			/**
			 *
			 * ┌─────┬───────────┐
			 * │A*   │B*         │
			 * │     ├───────────┤
			 * │     │C          │
			 * │     ├───────────┤
			 * │     │D          │
			 * └─────┴───────────┘
			 *
			 */
			applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "A", "left", w.third)))
			applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "B", "top", w.third)))

			expect(clone.frames).toEqual(expect.objectContaining({
				A: expect.objectContaining({
					...layout.frames.A,
					x: 0,
					y: 0,
					width: w.third,
					height: w.full,
					docked: "left"
				}),
				B: expect.objectContaining({
					...layout.frames.B,
					x: w.third, // very important bit, A takes priority because it's already docked
					y: 0,
					width: w.full - w.third,
					height: w.third,
					docked: "top"
				}),
				C: expect.objectContaining({
					...layout.frames.C,
					x: w.third,
					y: w.third,
					width: w.full - w.third - 1,
					// B was w.half - halfOfThird after A's dock
					// So C and D redistribute into remaining height
					height: (w.full - w.third) / 2 - 0.5
				}),
				D: expect.objectContaining({
					...layout.frames.D,
					x: w.third,
					y: w.third + (w.full - w.third) / 2 - 0.5,
					width: w.full - w.third,
					height: (w.full - w.third) / 2 + 0.5
				})
			}))
		})
		it("moving already docked frame", () => {
			/**
			 * ┌─────┬─────┐
			 * │A*   │B    │
			 * │     │     │
			 * │     │     │
			 * └─────┴─────┘
			 */
			const layout = {
				...testWindow,
				frames: {
					A: { id: "A", x: 0, y: 0, width: w.half, height: w.full, docked: "left", collapsed: undefined },
					B: { id: "B", x: w.half, y: 0, width: w.half, height: w.full }
				}
			}
			expect(layout.frames.A.width + layout.frames.B.width).toBe(w.full)
			const clone = walk(layout, undefined, { save: true })
			applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "A", "top", w.half)))
			expect(clone.frames).toEqual(expect.objectContaining({
				A: expect.objectContaining({
					...layout.frames.A,
					x: 0,
					height: w.half,
					width: w.full,
					docked: "top"
				}),
				B: expect.objectContaining({
					...layout.frames.B,
					x: 0,
					y: w.half,
					height: w.half,
					width: w.full
				})
			}))
		})
	})
})

describe("getFrameUndockInfo", () => {
	it("single dock", () => {
		/**
		 * One frame is easy as we can just set docked to false and delete the collapsed property.
		 * ┌─────┬─────┐
		 * │A*   │B    │
		 * │     │     │
		 * │     │     │
		 * └─────┴─────┘
		 */
		const layout = {
			...testWindow,
			frames: {
				A: { id: "A", x: 0, y: 0, width: w.half, height: w.full, docked: "left", collapsed: undefined },
				B: { id: "B", x: w.half, y: 0, width: w.half, height: w.full }
			}
		}
		expect(layout.frames.A.width + layout.frames.B.width).toBe(w.full)
		const clone = walk(layout, undefined, { save: true })
		applyFrameChanges(clone, throwIfError(getFrameUndockInfo(clone, "A")))

		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({
				...layout.frames.A,
				docked: undefined
			}),
			B: expect.objectContaining({
				...layout.frames.B
			})
		}))
	})


	it("multiple docks", () => {
		/**
		 * Multiple docs get complicated because the other docs take priority.
		 * Note that the scenario without C is impossible since when docking,
		 * we ensure that we always leave one frame undocked so as not to loose a reference to undock frames to like would happen if we removed C
		 * ┌─────┬──────┐
		 * │A*   │B*    │
		 * │     ├──────┤
		 * │     │C     │
		 * │     ├──────┤
		 * │     │D*    │
		 * └─────┴──────┘
		 */
		const layout = {
			...testWindow,
			frames: {
				A: { id: "A", x: 0, y: 0, width: w.third, height: w.full, docked: "left" },
				B: { id: "B", x: w.third, y: 0, width: w.full - w.third, height: w.third, docked: "top" },
				C: { id: "C", x: w.third, y: w.third, width: w.full - w.third, height: w.third },
				D: { id: "D", x: w.third, y: w.third * 2, width: w.full - w.third, height: w.third + 1, docked: "bottom" }
			}
		}
		const clone = walk(layout, undefined, { save: true })
		applyFrameChanges(clone, throwIfError(getFrameUndockInfo(clone, "A")))

		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({
				...layout.frames.A,
				y: layout.frames.B.height,
				height: layout.frames.D.y - layout.frames.B.height,
				docked: undefined,
				collapsed: undefined
			}),
			B: expect.objectContaining({
				...layout.frames.B,
				x: 0,
				width: w.full
			}),
			C: expect.objectContaining({
				...layout.frames.C,
				x: clone.frames.A.x + clone.frames.A.width,
				width: w.full - (clone.frames.A.x + clone.frames.A.width)
			}),
			D: expect.objectContaining({
				...layout.frames.D,
				x: 0,
				width: w.full
			})
		}))
	})
})

