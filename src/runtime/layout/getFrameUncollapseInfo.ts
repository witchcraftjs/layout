import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { applyFrameChanges } from "./applyFrameChanges.js"
import { getFrameExpandInfo } from "./getFrameExpandInfo.js"

import type { EdgeSide, LayoutChange, LayoutWindow, Size } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

/**
 * Returns a {@link LayoutChange} with the information necessary to uncollapse a docked frame.
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 *
 * Uncollapsing restores the frame to its pre-collapse size, shrinking neighboring
 * frames to make room.
 */
export function getFrameUncollapseInfo(
	win: LayoutWindow,
	frameId: string,
	{
		restoreSize
	}: {
		/** Override the size to restore the frame to. */
		restoreSize?: Size
	} = {}
): LayoutChange
	| KnownError<typeof LAYOUT_ERROR.CANT_UNCOLLAPSE_NOT_COLLAPSED>
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS>
	| KnownError<typeof LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE>
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES>
	| KnownError<typeof LAYOUT_ERROR.CANT_RESIZE_SINGLE_FRAME> {
	win = walk(win, undefined, { save: true })
	const frame = win.frames[frameId]
	if (!frame) { throw new Error(`Unknown frame ${frameId}`) }
	if (!frame.docked) { throw new Error(`Frame ${frameId} is not docked.`) }
	const toExtract = [frame.id]


	const isVertical = frame.docked === "left" || frame.docked === "right"
	const sizeKey = isVertical ? "width" : "height" as const
	const currentSize = frame[sizeKey]

	const storedSize = (restoreSize !== undefined ? restoreSize[sizeKey] : frame.collapsed)!

	if (frame.collapsed === undefined) {
		return new KnownError(
			LAYOUT_ERROR.CANT_UNCOLLAPSE_NOT_COLLAPSED,
			`Frame ${frameId} is not collapsed.`,
			{ frame }
		)
	}

	const expandAmount = storedSize - currentSize


	const dockedSide = frame.docked as EdgeSide

	const expandResult = getFrameExpandInfo(win, frameId, expandAmount, dockedSide)
	if (expandResult instanceof KnownError) {
		return expandResult
	}
	applyFrameChanges(win, expandResult)
	pushIfNotIn(toExtract, expandResult.modified.map(_ => _.id))

	frame.collapsed = undefined

	return { modified: toExtract.map(_ => win.frames[_]), created: [], deleted: [] }
}

