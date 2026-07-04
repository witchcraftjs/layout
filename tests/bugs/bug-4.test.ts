import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { walk } from "@alanscodelog/utils/walk"
import { expect, it } from "vitest"

import { validateLayoutShape } from "../../src/runtime/helpers/validateLayoutShape.js"
import { applyFrameChanges } from "../../src/runtime/layout/applyFrameChanges.js"
import { getFrameDockInfo } from "../../src/runtime/layout/getFrameDockInfo.js"
import { settings } from "../../src/runtime/settings.js"
import type { LayoutWindow } from "../../src/runtime/types/index.js"
import { createTestWindow, w } from "../utils.js"

it("bug-4: docking a frame to top when another frame is docked right should not break layout", () => {
	const testWindow = createTestWindow()

	/*
	 * ┌───┬───┬───┐
	 * │A  │B  │C* │
	 * └───┴───┴───┘
	 * Docking B to top when C is docked right breaks layout shape
	 */

	const layout: LayoutWindow = {
		...testWindow,
		frames: {
			A: { id: "A", width: w.fifth * 2, height: w.full, x: 0, y: 0 },
			B: { id: "B", width: w.fifth * 2, height: w.full, x: w.fifth * 2, y: 0 },
			C: { id: "C", width: w.fifth, height: w.full, x: w.fifth * 4, y: 0, docked: "right" as const }
		}
	}

	const clone = walk(layout, undefined, { save: true })
	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)

	const dockInfo = throwIfError(getFrameDockInfo(clone, "B", "top", settings.maxPerpendicularLengthScaled.width))
	applyFrameChanges(clone, dockInfo)

	expect(validateLayoutShape(Object.values(clone.frames))).toBe(true)
})
