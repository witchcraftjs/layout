import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { walk } from "@alanscodelog/utils/walk"
import { afterEach, beforeEach, expect, it } from "vitest"

import { createTestWindow, w } from "./utils.js"

import { consoleDebugWindow } from "../src/runtime/helpers/consoleDebugWindow.js"
import { getMoveEdgeInfo } from "../src/runtime/helpers/getMoveEdgeInfo.js"
import { rotateLayout } from "../src/runtime/helpers/rotateFrames.js"
import { validateLayoutShape } from "../src/runtime/helpers/validateLayoutShape.js"
import { applyFrameChanges } from "../src/runtime/layout/applyFrameChanges.js"
import { getFrameCollapseInfo } from "../src/runtime/layout/getFrameCollapseInfo.js"
import { getFrameDockInfo } from "../src/runtime/layout/getFrameDockInfo.js"
import { getFrameUncollapseInfo } from "../src/runtime/layout/getFrameUncollapseInfo.js"
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

it("simple collapse/uncollapse", () => {
	const layout = {
		...testWindow,
		frames: {
			A: { id: "A", x: 0, y: 0, width: w.half, height: w.full },
			B: { id: "B", x: w.half, y: 0, width: w.half, height: w.full, docked: "right", collapsed: undefined }
		}
	}
	const expected = walk(layout, undefined, { save: true })

	for (const orientation of [0, 90, 180, 270] as const) {
		const clone = walk(layout, undefined, { save: true })
		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
		const expectedClone = walk(expected, undefined, { save: true })
		if (orientation !== 0) {
			rotateLayout(Object.values(clone.frames), orientation)
			rotateLayout(Object.values(expectedClone.frames), orientation)
		}

		applyFrameChanges(clone, throwIfError(getFrameCollapseInfo(clone, "B")))
		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
		applyFrameChanges(clone, throwIfError(getFrameUncollapseInfo(clone, "B")))
		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

		expect(clone).toEqual(expectedClone)
	}
})
it("simple collapse/uncollapse when collapsed size !==0", () => {
	settings.collapseSizePx = { width: 5, height: 5 }
	const layout = {
		...testWindow,
		frames: {
			A: { id: "A", x: 0, y: 0, width: w.half, height: w.full },
			B: { id: "B", x: w.half, y: 0, width: w.half, height: w.full, docked: "right", collapsed: undefined }
		}
	}
	const expected = walk(layout, undefined, { save: true })

	for (const orientation of [0, 90, 180, 270] as const) {
		const clone = walk(layout, undefined, { save: true })
		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
		const expectedClone = walk(expected, undefined, { save: true })
		if (orientation !== 0) {
			rotateLayout(Object.values(clone.frames), orientation)
			rotateLayout(Object.values(expectedClone.frames), orientation)
		}

		applyFrameChanges(clone, throwIfError(getFrameCollapseInfo(clone, "B")))
		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
		applyFrameChanges(clone, throwIfError(getFrameUncollapseInfo(clone, "B")))
		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

		expect(clone).toEqual(expectedClone)
	}
})

it("all four sides collapsed", () => {
	/**
		* ┌────┬──────────────┐
		* │A*  │B*            │
		* │    ├─────────┬────┤
		* │    │E        │C*  │
		* │    │         │    │
		* ├────┴─────────┤    │
		* │D*            │    │
		* └──────────────┴────┘
		*/
	const layout = {
		...testWindow,
		frames: {
			A: { id: "A", x: 0, y: 0, width: w.forth, height: w.forth * 3, docked: "left" },
			B: { id: "B", x: w.forth, y: 0, width: w.forth * 3, height: w.forth, docked: "top" },
			C: { id: "C", x: w.forth * 3, y: w.forth, width: w.forth, height: w.forth * 3, docked: "right" },
			D: { id: "D", x: 0, y: w.forth * 3, width: w.forth * 3, height: w.forth, docked: "bottom" },
			E: { id: "E", x: w.forth, y: w.forth, width: w.forth * 2, height: w.forth * 2 }
		}
	}
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	const clone2 = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone2.frames))).toBe(true)
	/**
		* expected sequence
		* ┌───────────────────┐
		* │B*                 │
		* ├────────────┬──────┤
		* │E           │C*    │
		* │            │      │
		* ├────────────┤      │
		* │D*          │      │
		* └────────────┴──────┘
		*
		* ┌────────────┬──────┐
		* │E           │C*    │
		* │            │      │
		* │            │      │
		* ├────────────┤      │
		* │D*          │      │
		* │            │      │
		* └────────────┴──────┘
		* ┌───────────────────┐
		* │E                  │
		* │                   │
		* │                   │
		* ├───────────────────┤
		* │D*                 │
		* │                   │
		* └───────────────────┘
		*
		* ┌───────────────────┐
		* │E                  │
		* │                   │
		* │                   │
		* │                   │
		* │                   │
		* │                   │
		* └───────────────────┘
		*/
	for (const id of ["A", "B", "C", "D"]) {
		applyFrameChanges(clone, throwIfError(getFrameCollapseInfo(clone, id)))
		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
		if (id === "A") {
			expect(clone.frames.B).toEqual(expect.objectContaining({
				...layout.frames.B,
				x: 0,
				width: w.full,
				height: w.forth
			}))
			expect(clone.frames.E.width + clone.frames.C.width).toBe(w.full)
			expect(clone.frames.D.width + clone.frames.C.width).toBe(w.full)
			expect(clone.frames.B.x).toBe(0)
			expect(clone.frames.E.x).toBe(0)
			expect(clone.frames.D.x).toBe(0)
			expect(clone.frames.C.x).toBe(clone.frames.E.width)
		}
		if (id === "B") {
			expect(clone.frames.E.x).toBe(0)
			expect(clone.frames.D.x).toBe(0)
			expect(clone.frames.C.x).toBe(clone.frames.E.width)
			expect(clone.frames.E.width + clone.frames.C.width).toBe(w.full)
			expect(clone.frames.D.width + clone.frames.C.width).toBe(w.full)
		}
		if (id === "C") {
			expect(clone.frames.E.width).toBe(w.full)
			expect(clone.frames.D.width).toBe(w.full)
		}
		if (id === "D") {
			expect(clone.frames.E).toEqual(expect.objectContaining({
				x: 0,
				y: 0,
				width: w.full,
				height: w.full
			}))
		}
	}

	for (const id of ["A", "B", "C", "D"].reverse()) {
		applyFrameChanges(clone2, throwIfError(getFrameCollapseInfo(clone2, id)))
		expect(validateLayoutShape(Object.values(clone2.frames))).toBe(true)
	}
	expect(clone2.frames.E).toEqual(expect.objectContaining({
		x: 0,
		y: 0,
		width: w.full,
		height: w.full
	}))
})
it("all four sides collapsed then uncollapsed", () => {
	/**
		* ┌────┬──────────────┐
		* │A*  │B*            │
		* │    ├─────────┬────┤
		* │    │E        │C*  │
		* │    │         │    │
		* ├────┴─────────┤    │
		* │D*            │    │
		* └──────────────┴────┘
		*/
	const layout = {
		...testWindow,
		frames: {
			A: { id: "A", x: 0, y: 0, width: w.forth, height: w.forth * 3, docked: "left" },
			B: { id: "B", x: w.forth, y: 0, width: w.forth * 3, height: w.forth, docked: "top" },
			C: { id: "C", x: w.forth * 3, y: w.forth, width: w.forth, height: w.forth * 3, docked: "right" },
			D: { id: "D", x: 0, y: w.forth * 3, width: w.forth * 3, height: w.forth, docked: "bottom" },
			E: { id: "E", x: w.forth, y: w.forth, width: w.forth * 2, height: w.forth * 2 }
		}
	}
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	const clone2 = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone2.frames))).toBe(true)

	for (const id of ["A", "B", "C", "D"]) {
		applyFrameChanges(clone, throwIfError(getFrameCollapseInfo(clone, id)))
		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	}
	/**
		* sequence would look like this, note how the end result very much depends on the order of the uncollapses
		* ┌────┬──────────────┐
		* │A*  │E             │
		* │    │              │
		* │    │              │
		* │    │              │
		* │    │              │
		* │    │              │
		* └────┴──────────────┘
		*
		* ┌───────────────────┐
		* │B*                 │
		* ├────┬──────────────┤
		* │A*  │E             │
		* │    │              │
		* │    │              │
		* │    │              │
		* └────┴──────────────┘
		* ┌──────────────┬────┐
		* │B*            │C*  │
		* ├────┬─────────┤    │
		* │A*  │E        │    │
		* │    │         │    │
		* │    │         │    │
		* │    │         │    │
		* └────┴─────────┴────┘
		* ┌──────────────┬────┐
		* │B*            │C*  │
		* ├────┬─────────┤    │
		* │A*  │E        │    │
		* │    │         │    │
		* ├────┴─────────┴────┤
		* │D*                 │
		* └───────────────────┘
		*/
	for (const id of ["A", "B", "C", "D"]) {
		applyFrameChanges(clone, throwIfError(getFrameUncollapseInfo(clone, id)))
		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	}
	expect(clone.frames.B.width + clone.frames.C.width).toBe(w.full)
	expect(clone.frames.A.width + clone.frames.E.width + clone.frames.C.width).toBe(w.full)
	expect(clone.frames.D.width).toBe(w.full)

	expect(() => {
		for (const id of ["A", "B", "C", "D"].reverse()) {
			applyFrameChanges(clone2, throwIfError(getFrameCollapseInfo(clone2, id)))
			expect(validateLayoutShape(Object.values(clone2.frames))).toBe(true)
		}
		for (const id of ["A", "B", "C", "D"].reverse()) {
			applyFrameChanges(clone2, throwIfError(getFrameUncollapseInfo(clone2, id)))
			expect(validateLayoutShape(Object.values(clone2.frames))).toBe(true)
		}
	}).not.toThrow()
})

it("collapse when collapsed size !==0", () => {
	settings.collapseSizePx = 0.05 * testWindow.pxWidth

	const collapseSize = 5000
	const remainingWidth = w.full - collapseSize

	/**
	 * ┌────────────┬──┐
	 * │A           │C~│
	 * │            │  │
	 * ├────────────┤  │
	 * │B           │  │
	 * │            │  │
	 * └────────────┴──┘
	 */
	const layout = {
		...testWindow,
		frames: {
			A: { id: "A", x: 0, y: 0, width: remainingWidth, height: w.half },
			B: { id: "B", x: 0, y: w.half, width: remainingWidth, height: w.half },
			C: { id: "C", x: remainingWidth, y: 0, width: collapseSize, height: w.full, docked: "right", collapsed: w.forth }
		}
	}

	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	applyFrameChanges(clone, throwIfError(getFrameDockInfo(clone, "A", "top", w.forth)))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	expect(clone.frames.A).toEqual(expect.objectContaining({
		x: 0,
		width: w.full - collapseSize,
		height: w.forth
	}))
	expect(clone.frames.B).toEqual(expect.objectContaining({
		height: w.full - clone.frames.A.height,
		y: clone.frames.A.height
	}))
	expect(clone.frames.C).toEqual(expect.objectContaining({
		...layout.frames.C,
		height: w.full
	}))

	applyFrameChanges(clone, throwIfError(getFrameCollapseInfo(clone, "A")))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	expect(clone.frames.A).toEqual(expect.objectContaining({
		x: 0,
		width: w.full - collapseSize,
		height: collapseSize
	}))
	expect(clone.frames.B).toEqual(expect.objectContaining({
		height: w.full - clone.frames.A.height,
		y: clone.frames.A.height
	}))
	expect(clone.frames.C).toEqual(expect.objectContaining({
		...layout.frames.C,
		height: w.full
	}))
})
it("uncollapse when collapsed size !==0", () => {
	settings.collapseSizePx = { width: 5, height: 5 }

	const collapseSize = 5000
	const remainingSize = w.full - collapseSize

	/**
	 * ┌────────────┬──┐
	 * │A~          │C~│
	 * ├────────────┤  │
	 * │            │  │
	 * │B           │  │
	 * │            │  │
	 * └────────────┴──┘
	 */
	const layout = {
		...testWindow,
		frames: {
			A: { id: "A", x: 0, y: 0, width: remainingSize, height: collapseSize, docked: "top", collapsed: w.forth },
			B: { id: "B", x: 0, y: collapseSize, width: remainingSize, height: remainingSize },
			C: { id: "C", x: remainingSize, y: 0, width: collapseSize, height: w.full, docked: "right", collapsed: w.forth }
		}
	}

	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	applyFrameChanges(clone, throwIfError(getFrameUncollapseInfo(clone, "A")))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	expect(clone.frames.A).toEqual(expect.objectContaining({
		...layout.frames.A,
		height: w.forth,
		collapsed: undefined
	}))
	expect(clone.frames.B).toEqual(expect.objectContaining({
		...layout.frames.B,
		height: w.full - w.forth,
		y: w.forth
	}))
	expect(clone.frames.C).toEqual(expect.objectContaining({
		...layout.frames.C,
		y: 0,
		height: w.full
	}))
})
it("uncollapse when collapsed size !==0 and opposite side is collapsed", () => {
	settings.collapseSizePx = { width: 5, height: 5 }

	const collapseSize = 5000

	/**
	 * ┌────────────┬──┐
	 * │A~          │C~│
	 * ├──┬─────────┤  │
	 * │B~│ D       │  │
	 * │  │         │  │
	 * │  │         │  │
	 * └──┴─────────┴──┘
	 */
	const layout = {
		...testWindow,
		frames: {
			A: { id: "A", x: 0, y: 0, width: w.full - collapseSize, height: collapseSize, docked: "top", collapsed: w.forth },
			C: { id: "C", x: w.full - collapseSize, y: 0, width: collapseSize, height: w.full, docked: "right", collapsed: w.forth },
			B: { id: "B", x: 0, y: collapseSize, width: collapseSize, height: w.full - collapseSize, collapsed: w.forth, docked: "left" },
			D: { id: "D", x: collapseSize, y: collapseSize, width: w.full - collapseSize * 2, height: w.full - collapseSize }
		}
	}

	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	applyFrameChanges(clone, throwIfError(getFrameUncollapseInfo(clone, "C")))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	expect(clone.frames.A).toEqual(expect.objectContaining({
		...layout.frames.A,
		width: w.full - w.forth
	}))
	expect(clone.frames.B).toEqual(expect.objectContaining({
		...layout.frames.B
	}))
	expect(clone.frames.C).toEqual(expect.objectContaining({
		...layout.frames.C,
		x: w.full - w.forth,
		width: w.forth,
		collapsed: undefined
	}))
	expect(clone.frames.D).toEqual(expect.objectContaining({
		...layout.frames.D,
		width: w.full - w.forth - collapseSize
	}))
})


it("multiple docks - a left (collasped) then b top", () => {
	const layout = {
		...testWindow,
		frames: {
			A: {
				id: "A",
				x: 0,
				y: 0,
				width: 0,
				height: w.full,
				collapsed: w.third,
				docked: "left"
			},
			B: { id: "B", x: 0, y: 0, width: w.full, height: w.half, docked: "top" },
			C: { id: "C", x: 0, y: w.half, width: w.full, height: w.half }
		}
	}
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	/**
		* collapsed
		* ┌────── │ ┌─────────────┐
		* │A~Left │ │B*Top        │
		* │       │ │             │
		* │       │ ├─────────────┤
		* │       │ │C            │
		* │       │ │             │
		* └────── │ └─────────────┘
		*
		*/
	applyFrameChanges(clone, throwIfError(getFrameUncollapseInfo(clone, "A")))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	expect(clone.frames).toEqual(expect.objectContaining({
		A: expect.objectContaining({
			...layout.frames.A,
			docked: "left",
			collapsed: undefined,
			width: w.third
		}),
		B: expect.objectContaining({
			...layout.frames.B,
			x: w.third,
			width: w.full - (w.third),
			docked: "top"
		}),
		C: expect.objectContaining({
			...layout.frames.C,
			x: w.third,
			width: w.full - (w.third)
		})
	}))
})

it("getMoveEdgeInfo returns error when edge touches (non-0) collapsed frame", () => {
	/**
	 * ┌─────┬─────┐
	 * │A~   │B    │
	 * └─────┴─────┘
	 */
	const frames = [
		{ id: "A", x: 0, y: 0, width: w.half, height: w.full, docked: "left" as const, collapsed: w.third },
		{ id: "B", x: w.half, y: 0, width: w.half, height: w.full }
	]
	const edge = { startX: w.half, startY: 0, endX: w.half, endY: w.full }
	const result = getMoveEdgeInfo(frames, edge, { x: w.half - 1000, y: w.half })

	expect(result).toBeInstanceOf(KnownError)
	if (result instanceof KnownError) {
		expect(result.code).toBe(LAYOUT_ERROR.CANT_RESIZE_COLLAPSED_FRAME)
		expect(result.info.frame.id).toBe("A")
	}
})
