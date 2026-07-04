import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { applyFrameChanges } from "./applyFrameChanges.js"
import { getFrameShrinkInfo } from "./getFrameShrinkInfo.js"

import { settings } from "../settings.js"
import type { LayoutChange, LayoutWindow, Size } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

/**
 * Returns a {@link LayoutChange} with the information necessary to collapse a docked frame.
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 *
 * Collapsing shrinks the frame to the configured collapse size and redistributes
 * the freed space to neighboring frames. The pre-collapse size is stored in
 * `collapsed` so it can be restored later.
 */
export function getFrameCollapseInfo(
	win: LayoutWindow,
	frameId: string,
	{
		collapseSizeScaled
	}: {
		/** Override the target collapse size. If provided, the frame will collapse to this size instead of settings.collapseSizeScaled. */
		collapseSizeScaled?: Size
	} = {}
): LayoutChange
	| KnownError<typeof LAYOUT_ERROR.CANT_COLLAPSE_NOT_DOCKED>
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES>
	| KnownError<typeof LAYOUT_ERROR.CANT_RESIZE_SINGLE_FRAME> {
	collapseSizeScaled = collapseSizeScaled ?? settings.getCollapseSizeScaled(win)
	win = walk(win, undefined, { save: true }) as typeof win
	const frame = win.frames[frameId]
	if (!frame) throw new Error(`Unknown frame ${frameId}`)
	if (!frame.docked) throw new Error(`Frame ${frameId} is not docked.`)
	if (typeof frame.collapsed === "number") throw new Error(`Frame ${frameId} is already collapsed.`)

	const toExtract = [frame.id]
	if (frame.docked === undefined) {
		return new KnownError(
			LAYOUT_ERROR.CANT_COLLAPSE_NOT_DOCKED,
			`Frame ${frameId} is not docked and cannot be collapsed.`,
			{ frame }
		)
	}

	const isVertical = frame.docked === "left" || frame.docked === "right"
	const sizeKey = isVertical ? "width" : "height" as const

	const currentSize = frame[sizeKey]
	const shrinkAmount = currentSize - collapseSizeScaled[sizeKey]

	const shrinkResult = getFrameShrinkInfo(win, frameId, shrinkAmount, frame.docked, { allowOutOfBounds: true })

	if (shrinkResult instanceof KnownError) {
		return shrinkResult
	}

	applyFrameChanges(win, shrinkResult)
	pushIfNotIn(toExtract, shrinkResult.modified.map(_ => _.id))

	frame.collapsed = currentSize
	// when we collapse to 0 it's a special case where the frame will always fit the entire window edge
	// for proper uncollapsing later
	if (collapseSizeScaled[sizeKey] === 0) {
		const oppositePosKey = isVertical ? "y" : "x"
		const oppositeSizeKey = isVertical ? "height" : "width"
		frame[oppositePosKey] = 0
		frame[oppositeSizeKey] = settings.maxInt
	}

	return { modified: toExtract.map(_ => win.frames[_]), created: [], deleted: [] }
}
