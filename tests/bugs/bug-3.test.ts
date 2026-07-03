import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { walk } from "@alanscodelog/utils/walk"
import { expect, it } from "vitest"

import { getFrameUndockInfo } from "../../src/module.js"
import { validateLayoutShape } from "../../src/runtime/helpers/validateLayoutShape.js"
import { applyFrameChanges } from "../../src/runtime/layout/applyFrameChanges.js"
import { getFrameDockInfo } from "../../src/runtime/layout/getFrameDockInfo.js"
import { settings } from "../../src/runtime/settings.js"
import type { LayoutWindow } from "../../src/runtime/types/index.js"
import { createTestWindow, w } from "../utils.js"


const testWindow = createTestWindow()

it("Bug 3: docking a frame already at the dock position should not shift other frames", () => {
	/*
	* ┌────┬────┬────┐
	* │A   │B   │C   │
	* └────┴────┴────┘
	* Docking/Undocking C should not shift A or B if C is dock size
	*/

	const layout: LayoutWindow = {
		...testWindow,
		frames: {
			A: {
				id: "A",
				width: w.fifth * 2,
				height: w.full,
				x: 0,
				y: 0
			},
			B: {
				id: "B",
				width: w.fifth * 2,
				height: w.full,
				x: w.fifth * 2,
				y: 0
			},
			C: {
				id: "C",
				width: w.fifth,
				height: w.full,
				x: w.fifth * 4,
				y: 0
			}
		}
	}

	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	const result = throwIfError(getFrameDockInfo(clone, "C", "right"))
	applyFrameChanges(clone, result)

	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
	expect(clone.frames.A.width).toBe(w.fifth * 2)
	expect(clone.frames.B.width).toBe(w.fifth * 2)
	expect(clone.frames.C.docked).toBe("right")
	expect(clone.frames.C.width).toBe(w.fifth)

	const result2 = throwIfError(getFrameUndockInfo(clone, "C"))
	applyFrameChanges(clone, result2)
	expect(clone.frames.A.width).toBe(w.fifth * 2)
	expect(clone.frames.B.width).toBe(w.fifth * 2)
	expect(clone.frames.C.docked).toBe(undefined)
	expect(clone.frames.C.width).toBe(w.fifth)
})
