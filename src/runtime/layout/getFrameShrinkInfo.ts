import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { applyFrameChanges } from "./applyFrameChanges.js"
import { getFramesRedistributeInfo } from "./getFramesRedistributeInfo.js"

import { findEdgesTouchingWindow } from "../helpers/findEdgesTouchingWindow.js"
import { framesRedistributeFix } from "../helpers/framesRedistributeFix.js"
import { getPinnedEdgesForCollapsedFrames } from "../helpers/getPinnedEdgesForCollapsedFrames.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import type { EdgeSide, LayoutChange, LayoutWindow } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

/**
 * Returns a {@link LayoutChange} with the information necessary to shrink a frame touching a window edge by a given amount.
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 *
 * It shrinks the frame by redistributing the freed space to neighboring frames.
 */
export function getFrameShrinkInfo(
	win: LayoutWindow,
	frameId: string,
	amount: number,
	shrinkSide: EdgeSide,
	{
		allowOutOfBounds = false
	}: {
		/** Allow the resize span to exceed window bounds. */
		allowOutOfBounds?: boolean
	} = {}
): LayoutChange
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES>
	| KnownError<typeof LAYOUT_ERROR.CANT_RESIZE_SINGLE_FRAME>
	| KnownError<typeof LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE> {
	win = walk(win, undefined, { save: true }) as typeof win
	const frame = win.frames[frameId]
	if (!frame) throw new Error(`Unknown frame ${frameId}`)

	if (Object.keys(win.frames).length === 1) {
		return new KnownError(LAYOUT_ERROR.CANT_RESIZE_SINGLE_FRAME, `Frame ${frameId} is the only frame, cannot shrink.`, { frame })
	}

	// verify the frame actually touches the specified edge
	if (!(shrinkSide in findEdgesTouchingWindow(frame))) {
		throw new Error(`Frame ${frameId} does not touch the ${shrinkSide} edge.`)
	}

	const isVertical = shrinkSide === "left" || shrinkSide === "right"
	const sizeKey = isVertical ? "width" : "height" as const
	const posKey = isVertical ? "x" : "y"

	const toExtract = [frame.id]

	const { applyFixes, toFix } = framesRedistributeFix(win, frame, shrinkSide, posKey, sizeKey, "shrink")

	// note fully collapsed frames without an area are already excluded by getFramesRedistributeInfo
	const otherFrameIds = Object.keys(win.frames).filter(id => id !== frameId)

	const redistributeSide = oppositeSide(shrinkSide)

	const pinnedEdgeCoordinates: number[] = getPinnedEdgesForCollapsedFrames(win, frame, shrinkSide, posKey, sizeKey)

	const changes = getFramesRedistributeInfo(win, redistributeSide, otherFrameIds, -amount, { allowOutOfBounds, pinnedEdgeCoordinates })

	if (changes instanceof KnownError) {
		// we should never get out of bounds and because this is a shrink there should always be space
		if (changes.code === LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS) {
			changes.message = `This error should never happen, please file a bug report: ${changes.message}`
			throw changes
		}
		return changes
	}
	applyFrameChanges(win, changes)
	pushIfNotIn(toExtract, changes.modified.map(_ => _.id))


	applyFixes()
	pushIfNotIn(toExtract, toFix)

	if (shrinkSide === "right" || shrinkSide === "bottom") {
		frame[posKey] = frame[posKey] + amount
	}
	frame[sizeKey] = frame[sizeKey] - amount

	return { modified: toExtract.map(_ => win.frames[_]), created: [], deleted: [] }
}
