import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { walk } from "@alanscodelog/utils/walk"
import { describe, expect, it } from "vitest"

import { applyFrameChanges } from "../../src/runtime/layout/applyFrameChanges.js"
import { getFrameUndockInfo } from "../../src/runtime/layout/getFrameUndockInfo.js"
import { settings } from "../../src/runtime/settings.js"
import { validateLayoutShape } from "../../src/runtime/helpers/validateLayoutShape.js"
import type { LayoutChange, LayoutWindow } from "../../src/runtime/types/index.js"
import { createTestWindow, w } from "../utils.js"
import { consoleDebugWindow } from "../../src/runtime/helpers/consoleDebugWindow.js"


const testWindow = createTestWindow()

describe("Bug 2: undocking a frame next to another docked frame should correctly undock", () => {
		/*
		* ┌─────────────────────┬───┐
		* │A*~                  │C* │
		* ├─────────────────────┤   │
		* │B                    │   │
		* │                     │   │
		* └─────────────────────┴───┘
		*
		* When we undock C, A which is docked and collapsed, should ftill entire top row since docked frames have priority.
		*/

		const collapsedHeight = settings.getCollapseSizeScaled(testWindow).height
		const rightDockedWidth = w.half

		const layout: LayoutWindow = {
			...testWindow,
			frames: {
				A: {
					id: "A",
					width: w.full - rightDockedWidth,
					height: collapsedHeight,
					x: 0,
					y: 0,
					docked: "top",
					collapsed: w.half
				},
				B: {
					id: "B",
					width: w.full - rightDockedWidth,
					height: w.full - collapsedHeight,
					x: 0,
					y: collapsedHeight
				},
				C: {
					id: "C",
					width: w.half,
					height: w.full,
					x: w.half,
					y: 0,
					docked: "right",
					collapsed: undefined
				}
			}
		}

	
		const clone = walk(layout, undefined, { save: true })
		consoleDebugWindow(clone)

		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

		const result = throwIfError(getFrameUndockInfo(clone, "C"))

		applyFrameChanges(clone, result)
		expect((result as LayoutChange).modified.length).toBeGreaterThan(0)

		expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
		consoleDebugWindow(clone)
		expect(clone.frames.A.x).toBe(0)
		expect(clone.frames.A.width).toBe(w.full)
})
