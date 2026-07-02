import { walk } from "@alanscodelog/utils/walk"
import { afterEach, expect, it } from "vitest"

import { createTestWindow, w } from "./utils.js"

import { applyFrameChanges } from "../src/module.js"
import { validateLayoutShape } from "../src/runtime/helpers/validateLayoutShape.js"
import { getUpdateWindowSizeInfo } from "../src/runtime/layout/getUpdateWindowSizeInfo.js"
import { settings } from "../src/runtime/settings.js"


const testWindow = createTestWindow()

afterEach(() => {
	settings.resetToDefaults()
})

const doesntMatter = w.forth

it("window grows - all four sides collapsed to non-0", () => {
	settings.collapseSizePx = { width: 25, height: 25 }
	const layout = {
		...testWindow,
		frames: {
			/**
				* ┌───┬──────────────────┐
				* │A~ │B~                │
				* │   ├──────────────┬───┤
				* │   │E             │C~ │
				* │   │              │   │
				* │   │              │   │
				* │   │              │   │
				* ├───┴──────────────┤   │
				* │D~                │   │
				* └──────────────────┴───┘
				* ~ - are docked and collapsed
				*/
			A: { id: "A", x: 0, y: 0, width: w.forth, height: w.full - w.forth, docked: "left" as const, collapsed: doesntMatter },
			B: { id: "B", x: w.forth, y: 0, width: w.full - w.forth, height: w.forth, docked: "top" as const, collapsed: doesntMatter },
			C: { id: "C", x: w.full - w.forth, y: w.forth, width: w.forth, height: w.full - w.forth, docked: "right" as const, collapsed: doesntMatter },
			D: { id: "D", x: 0, y: w.full - w.forth, width: w.full - w.forth, height: w.forth, docked: "bottom" as const, collapsed: doesntMatter },
			E: { id: "E", x: w.forth, y: w.forth, width: w.full - w.forth * 2, height: w.full - w.forth * 2 }
		}
	}
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	applyFrameChanges(clone, getUpdateWindowSizeInfo(clone, { pxWidth: clone.pxWidth * 2, pxHeight: clone.pxHeight * 2 }))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	expect(clone.frames.A.width).toBe(Math.round(w.forth / 2))
	expect(clone.frames.A.width / settings.maxInt * clone.pxWidth).toBe(settings.collapseSizePx.width)

	expect(clone.frames.C.width).toBe(Math.round(w.forth / 2))
	expect(clone.frames.C.width / settings.maxInt * clone.pxWidth).toBe(settings.collapseSizePx.width)

	expect(clone.frames.B.height).toBe(Math.round(w.forth / 2))
	expect(clone.frames.B.height / settings.maxInt * clone.pxHeight).toBe(settings.collapseSizePx.height)

	expect(clone.frames.D.height).toBe(Math.round(w.forth / 2))
	expect(clone.frames.D.height / settings.maxInt * clone.pxHeight).toBe(settings.collapseSizePx.height)

	expect(clone.frames.E.x).toBe(clone.frames.A.width)
	expect(clone.frames.E.y).toBe(clone.frames.B.height)
	expect(clone.frames.E.x + clone.frames.E.width).toBe(clone.frames.C.x)
	expect(clone.frames.E.y + clone.frames.E.height).toBe(clone.frames.D.y)
})

it("window shrinks - all four sides collapsed to non-0", () => {
	settings.collapseSizePx = w.forth / w.full * testWindow.pxWidth
	settings.minSize = 15
	const smallSize = settings.minSizeScaled.width
	const layout = {
		...testWindow,
		frames: {
			/**
				* ┌───┬──────────────────┐
				* │A~ │B~                │
				* │   ├───┬──────────┬───┤
				* │   │E  │F         │C~ │
				* │   │   │          │   │
				* │   │   │          │   │
				* │   │   │          │   │
				* ├───┴───┴──────────┤   │
				* │D~                │   │
				* └──────────────────┴───┘
				* ~ - are docked and collapsed
				*/
			// infinity because it doesn't matter
			A: { id: "A", x: 0, y: 0, width: w.forth, height: w.full - w.forth, docked: "left" as const, collapsed: doesntMatter },
			B: { id: "B", x: w.forth, y: 0, width: w.full - w.forth, height: w.forth, docked: "top" as const, collapsed: doesntMatter },
			C: { id: "C", x: w.full - w.forth, y: w.forth, width: w.forth, height: w.full - w.forth, docked: "right" as const, collapsed: doesntMatter },
			D: { id: "D", x: 0, y: w.full - w.forth, width: w.full - w.forth, height: w.forth, docked: "bottom" as const, collapsed: doesntMatter },
			E: { id: "E", x: w.forth, y: w.forth, width: smallSize, height: w.full - w.forth * 2 },
			F: { id: "F", x: w.forth + smallSize, y: w.forth, width: w.full - w.forth * 2 - smallSize, height: w.full - w.forth * 2 }

		}
	}
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	const scale = 2 / 3
	applyFrameChanges(clone, getUpdateWindowSizeInfo(clone, {
		pxWidth: clone.pxWidth * scale,
		pxHeight: clone.pxHeight * scale
	}))
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	expect(clone.frames.A.width).toBeGreaterThan(layout.frames.A.width)
	expect(Math.round(clone.frames.A.width / settings.maxInt * clone.pxWidth)).toBe(settings.collapseSizePx.width)

	expect(clone.frames.C.width).toBeGreaterThan(layout.frames.C.width)
	expect(Math.round(clone.frames.C.width / settings.maxInt * clone.pxWidth)).toBe(settings.collapseSizePx.width)

	expect(clone.frames.B.height).toBeGreaterThan(layout.frames.B.height)
	expect(Math.round(clone.frames.B.height / settings.maxInt * clone.pxHeight)).toBe(settings.collapseSizePx.height)

	expect(clone.frames.D.height).toBeGreaterThan(layout.frames.D.height)
	expect(Math.round(clone.frames.D.height / settings.maxInt * clone.pxHeight)).toBe(settings.collapseSizePx.height)

	expect(clone.frames.E.width).toBeGreaterThanOrEqual(settings.minSize.width)
	expect(clone.frames.F.width).toBeGreaterThanOrEqual(settings.minSize.width)
})

it("will shrink as much as possible, otherwise normally if a frame would get shrunk to 0 or below", () => {
	// in these cases we must sacrifice the size of the collapsed frame so as to not break the layout
	settings.minSize = 15
	const smallSize = settings.minSizeScaled.width
	settings.collapseSizePx = { width: 25, height: 25 }
	const layout = {
		...testWindow,
		// infinity because it doesn't matter
		frames: {
			/**
				* ┌───┬──────────────────┐
				* │A~ │B~                │
				* │   ├───┬──────────┬───┤
				* │   │E  │F         │C~ │
				* │   │   │          │   │
				* │   │   │          │   │
				* │   │   │          │   │
				* ├───┴───┴──────────┤   │
				* │D~                │   │
				* └──────────────────┴───┘
				* ~ - are docked and collapsed
				*/
			// infinity because it doesn't matter
			A: { id: "A", x: 0, y: 0, width: w.forth, height: w.full - w.forth, docked: "left" as const, collapsed: doesntMatter },
			B: { id: "B", x: w.forth, y: 0, width: w.full - w.forth, height: w.forth, docked: "top" as const, collapsed: doesntMatter },
			C: { id: "C", x: w.full - w.forth, y: w.forth, width: w.forth, height: w.full - w.forth, docked: "right" as const, collapsed: doesntMatter },
			D: { id: "D", x: 0, y: w.full - w.forth, width: w.full - w.forth, height: w.forth, docked: "bottom" as const, collapsed: doesntMatter },
			E: { id: "E", x: w.forth, y: w.forth, width: smallSize, height: w.full - w.forth * 2 },
			F: { id: "F", x: w.forth + smallSize, y: w.forth, width: w.full - w.forth * 2 - smallSize, height: w.full - w.forth * 2 }

		}
	}
	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	const oldPxWidth = clone.pxWidth
	const oldPxHeight = clone.pxHeight

	const res = getUpdateWindowSizeInfo(clone, {
		pxWidth: Math.floor(oldPxWidth / 2),
		pxHeight: Math.floor(oldPxHeight / 2)
	})
	applyFrameChanges(clone, res)
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	// because of the order attempted, A and B will succeed while C and D will stay the same
	// in real usage, it would not be so brusque since user resizes a bit at a time
	expect(clone.pxWidth).toBe(oldPxWidth / 2)
	expect(clone.pxHeight).toBe(oldPxHeight / 2)

	expect(Math.round(clone.frames.A.width / settings.maxInt * clone.pxWidth)).toBe(settings.collapseSizePx.width)

	expect(Math.round(clone.frames.B.width / settings.maxInt * clone.pxWidth)).toBe(settings.collapseSizePx.width)

	expect(clone.frames.C.width).toBeGreaterThan(0)
	expect(Math.round(clone.frames.C.width / settings.maxInt * clone.pxWidth)).toBeLessThan(settings.collapseSizePx.width)

	expect(clone.frames.D.height).toBeGreaterThan(0)
	expect(Math.round(clone.frames.D.height / settings.maxInt * clone.pxHeight)).toBeLessThan(settings.collapseSizePx.height)

	expect(clone.frames.E.width).toBeGreaterThan(0)
	expect(clone.frames.E.height).toBeGreaterThan(0)
	expect(clone.frames.F.width).toBeGreaterThan(0)
	expect(clone.frames.F.height).toBeGreaterThan(0)
})
