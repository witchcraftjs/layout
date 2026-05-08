import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { walk } from "@alanscodelog/utils/walk"
import { beforeEach, describe, expect, it } from "vitest"

import { createTestWindow, w } from "./utils.js"

import { settings } from "../src/module.js"
import { applyFrameChanges } from "../src/runtime/layout/applyFrameChanges.js"
import { getFrameRearrangeInfo } from "../src/runtime/layout/getFrameRearrangeInfo.js"


const testWindow = createTestWindow()
beforeEach(() => {
	settings.collapseSize = { width: 0, height: 0 }
})

/*
* ┌─────┬─────┬─────┐
* │A    │B    │C    │
* │     │     ├─────┤
* │     │     │D    │
* └─────┴─────┴─────┘
*/
const layout1 = {
	...testWindow,
	frames: {
		A: { id: "A", x: 0, y: 0, width: w.third, height: w.full },
		B: { id: "B", x: w.third, y: 0, width: w.third, height: w.full },
		C: { id: "C", x: w.third * 2, y: 0, width: w.third + 2, height: w.half },
		D: { id: "D", x: w.third * 2, y: w.half, width: w.third + 2, height: w.half }
	}
}


describe("getFrameRearrangeInfo - shared edge", () => {
	it("A => B's left zone", () => {
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		expect(() => {
			applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "A", "B", "left")))
		}).toThrowError()
	})
	it("A => B's right zone", () => {
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "A", "B", "right")))
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({ ...layout1.frames.B, id: "A" }),
			B: expect.objectContaining({ ...layout1.frames.A, id: "B" }),
			C: expect.objectContaining(layout1.frames.C),
			D: expect.objectContaining(layout1.frames.D)
		}))
	})
	it("A => B's top zone", () => {
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "A", "B", "top")))
		/*
		* ┌───────────┬─────┐
		* │A          │C    │
		* ├───────────┼─────┤
		* │B          │D    │
		* └───────────┴─────┘
		*/
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({ ...layout1.frames.A, x: 0, height: w.half, width: w.third * 2 }),
			B: expect.objectContaining({ ...layout1.frames.B, x: 0, y: w.half, height: w.half, width: w.third * 2 }),
			C: expect.objectContaining(layout1.frames.C),
			D: expect.objectContaining(layout1.frames.D)
		}))
	})
	it("A => B's bottom zone", () => {
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "A", "B", "bottom")))
		/*
		* ┌───────────┬─────┐
		* │B          │C    │
		* ├───────────┼─────┤
		* │A          │D    │
		* └───────────┴─────┘
		*/
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({ ...layout1.frames.A, x: 0, y: w.half, height: w.half, width: w.third * 2 }),
			B: expect.objectContaining({ ...layout1.frames.B, x: 0, y: 0, height: w.half, width: w.third * 2 }),
			C: expect.objectContaining(layout1.frames.C),
			D: expect.objectContaining(layout1.frames.D)
		}))
	})
})

describe("getFrameRearrangeInfo - partially shared edge", () => {
	it("B => C's left zone", () => {
		/**
		 * Note C has shrunk due to the initial location of the split.
		 * ┌─────┬────────┬──┐
		 * │A    │B       │C │
		 * │     │        │  │
		 * │     │        │  │
		 * │     ├────────┴──┤
		 * │     │D          │
		 * │     │           │
		 * └─────┴───────────┘
		 */
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "B", "C", "left")))
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining(layout1.frames.A),
			// if we get an off by 1 on the x/width we can adjust the test
			B: expect.objectContaining({
				...layout1.frames.B,
				width: layout1.frames.B.width + layout1.frames.C.width / 2,
				height: layout1.frames.C.height
			}),
			C: expect.objectContaining({
				...layout1.frames.C,
				x: layout1.frames.C.x + layout1.frames.C.width / 2,
				width: layout1.frames.C.width / 2
			}),
			D: expect.objectContaining({
				...layout1.frames.D,
				x: layout1.frames.B.x,
				width: layout1.frames.B.width + layout1.frames.D.width
			})
		}))
	})

	it("B => C's right zone", () => {
		/**
		 * Note B has shrunk due to the initial location of the split.
		 * ┌─────┬────────┬──┐
		 * │A    │C       │B │
		 * │     │        │  │
		 * │     │        │  │
		 * │     ├────────┴──┤
		 * │     │D          │
		 * │     │           │
		 * └─────┴───────────┘
		 */
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "B", "C", "right")))
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining(layout1.frames.A),
			// if we get an off by 1 on the x/width we can adjust the test
			C: expect.objectContaining({
				...layout1.frames.C,
				x: layout1.frames.B.x,
				y: 0,
				width: layout1.frames.B.width + layout1.frames.C.width / 2,
				id: "C"
			}),
			B: expect.objectContaining({
				...layout1.frames.B,
				x: layout1.frames.C.x + layout1.frames.C.width / 2,
				width: layout1.frames.C.width / 2,
				height: layout1.frames.C.height,
				id: "B"
			}),
			D: expect.objectContaining({
				...layout1.frames.D,
				x: layout1.frames.B.x,
				width: layout1.frames.B.width + layout1.frames.D.width
			})
		}))
	})
	it("B => C's top zone", () => {
		/**
		 * ┌─────┬───────────┐
		 * │A    │B          │
		 * │     ├───────────┤
		 * │     │C          │
		 * │     ├───────────┤
		 * │     │D          │
		 * │     │           │
		 * └─────┴───────────┘
		 */
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "B", "C", "top")))
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining(layout1.frames.A),
			B: expect.objectContaining({
				...layout1.frames.B,
				width: layout1.frames.B.width + layout1.frames.C.width,
				height: layout1.frames.C.height / 2
			}),
			C: expect.objectContaining({
				...layout1.frames.C,
				x: layout1.frames.B.x,
				y: layout1.frames.C.height / 2,
				width: layout1.frames.B.width + layout1.frames.C.width,
				height: layout1.frames.C.height / 2
			}),
			D: expect.objectContaining({
				...layout1.frames.D,
				x: layout1.frames.B.x,
				width: layout1.frames.B.width + layout1.frames.D.width
			})
		}))
	})
	it("B => C's bottom zone", () => {
		/**
		 * ┌─────┬───────────┐
		 * │A    │C          │
		 * │     ├───────────┤
		 * │     │B          │
		 * │     ├───────────┤
		 * │     │D          │
		 * │     │           │
		 * └─────┴───────────┘
		 */
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "B", "C", "bottom")))
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining(layout1.frames.A),
			B: expect.objectContaining({
				...layout1.frames.B,
				y: layout1.frames.C.height / 2,
				width: layout1.frames.B.width + layout1.frames.C.width,
				height: layout1.frames.C.height / 2
			}),
			C: expect.objectContaining({
				...layout1.frames.C,
				x: layout1.frames.B.x,
				width: layout1.frames.B.width + layout1.frames.C.width,
				height: layout1.frames.C.height / 2
			}),
			D: expect.objectContaining({
				...layout1.frames.D,
				x: layout1.frames.B.x,
				width: layout1.frames.B.width + layout1.frames.D.width
			})
		}))
	})
})


describe("getFrameRearrangeInfo - none-shared edge", () => {
	const movedB = expect.objectContaining({
		...layout1.frames.B,
		x: 0, width: layout1.frames.A.width + layout1.frames.B.width
	})
	it("A => C's left zone", () => {
		/**
		 * Left
		 * ┌───────────┬──┬──┐
		 * │B          │A │C │
		 * │           │  │  │
		 * │           │  │  │
		 * │           ├──┴──┤
		 * │           │D    │
		 * │           │     │
		 * └───────────┴─────┘
		 */
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "A", "C", "left")))
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({
				...layout1.frames.A,
				x: layout1.frames.C.x,
				width: layout1.frames.C.width / 2,
				height: layout1.frames.C.height
			}),
			B: movedB,
			C: expect.objectContaining({
				...layout1.frames.C,
				x: layout1.frames.C.x + layout1.frames.C.width / 2,
				width: layout1.frames.C.width / 2
			}),
			D: expect.objectContaining(layout1.frames.D)
		}))
	})

	it("A => C's right zone", () => {
		/**
		 * Left
		 * ┌───────────┬──┬──┐
		 * │B          │C │A │
		 * │           │  │  │
		 * │           │  │  │
		 * │           ├──┴──┤
		 * │           │D    │
		 * │           │     │
		 * └───────────┴─────┘
		 */
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "A", "C", "right")))
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({
				...layout1.frames.A,
				x: layout1.frames.C.x + layout1.frames.C.width / 2,
				width: layout1.frames.C.width / 2,
				height: layout1.frames.C.height
			}),
			B: movedB,
			C: expect.objectContaining({
				...layout1.frames.C,
				width: layout1.frames.C.width / 2
			}),
			D: expect.objectContaining(layout1.frames.D)
		}))
	})
	it("A => C's top zone", () => {
		/**
		 * Top
		 * ┌───────────┬─────┐
		 * │B          │A    │
		 * │           ├─────┤
		 * │           │C    │
		 * │           ├─────┤
		 * │           │D    │
		 * │           │     │
		 * └───────────┴─────┘
		 */
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "A", "C", "top")))
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({
				...layout1.frames.A,
				x: layout1.frames.C.x,
				width: layout1.frames.C.width,
				height: layout1.frames.C.height / 2
			}),
			B: movedB,
			C: expect.objectContaining({
				...layout1.frames.C,
				y: layout1.frames.C.height / 2,
				height: layout1.frames.C.height / 2
			}),
			D: expect.objectContaining(layout1.frames.D)
		}))
	})
	it("A => C's bottom zone", () => {
		/**
		 * Bottom
		 * ┌───────────┬─────┐
		 * │B          │C    │
		 * │           ├─────┤
		 * │           │A    │
		 * │           ├─────┤
		 * │           │D    │
		 * │           │     │
		 * └───────────┴─────┘
		 */
		const clone = walk(layout1, undefined, { save: true }) // deep copy
		applyFrameChanges(clone, throwIfError(getFrameRearrangeInfo(clone, "A", "C", "bottom")))
		expect(clone.frames).toEqual(expect.objectContaining({
			A: expect.objectContaining({
				...layout1.frames.A,
				x: layout1.frames.C.x,
				y: layout1.frames.C.height / 2,
				width: layout1.frames.C.width,
				height: layout1.frames.C.height / 2
			}),
			B: movedB,
			C: expect.objectContaining({
				...layout1.frames.C,
				height: layout1.frames.C.height / 2
			}),
			D: expect.objectContaining(layout1.frames.D)
		}))
	})
})
