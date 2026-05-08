import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { walk } from "@alanscodelog/utils/walk"
import { describe, expect, it } from "vitest"

import { applyFrameChanges } from "../../src/runtime/layout/applyFrameChanges.js"
import { getFrameDockInfo } from "../../src/runtime/layout/getFrameDockInfo.js"
import { settings } from "../../src/runtime/settings.js"
import type { LayoutChange, LayoutWindow } from "../../src/runtime/types/index.js"
import { createTestWindow, w } from "../utils.js"


const testWindow = createTestWindow()


describe("Bug 1: docking a floating frame should use latest docked frame boundaries", () => {
	/*
	* ├───────────┤     │
	* │B          │     │
	* ├───────────┤     │
	* │C          │     │
	* ├───────────┤     │
	* │D          │     │
	* └───────────┴─────┘
	*
	* When we dock B to the left, A grows upwards to fill the gap left, but that change needs to be kept in mind by the docked boundary calculations.
	*/

	const layout: LayoutWindow = {
		...testWindow,
		frames: {
			A: {
				id: "A",
				width: w.third * 2,
				height: w.forth,
				x: 0,
				y: 0,
				docked: "top",
				collapsed: false
			},
			B: {
				id: "B",
				width: w.third * 2,
				height: w.forth,
				x: 0,
				y: w.forth
			},
			C: {
				id: "C",
				width: w.third * 2,
				height: w.forth,
				x: 0,
				y: w.half
			},
			D: {
				id: "D",
				width: w.third * 2,
				height: w.forth,
				x: 0,
				y: w.forth * 3,
				docked: "bottom",
				collapsed: false
			},
			E: {
				id: "E",
				width: w.third + 1,
				height: w.full,
				x: w.third * 2,
				y: 0,
				docked: "right",
				collapsed: false
			}
		}
	}

	it("docking undocked frame to left should have height constrained by adjacent frames", () => {
		const clone = walk(layout, undefined, { save: true })

		const result = throwIfError(getFrameDockInfo(clone, "C", "left"))

		applyFrameChanges(clone, result)
		expect((result as LayoutChange).modified.length).toBeGreaterThan(0)

		expect(clone.frames.C.height).toBe(clone.frames.B.height)
		expect(clone.frames.C.y).toBe(clone.frames.B.y)
	})
})
