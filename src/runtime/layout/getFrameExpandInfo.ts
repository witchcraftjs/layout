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
 * Returns a {@link LayoutChange} with the information necessary to expand a frame touching a window edge by a given amount.
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 *
 * It expands the frame by redistributing space from neighboring frames.
 */
export function getFrameExpandInfo(
	win: LayoutWindow,
	frameId: string,
	amount: number,
	expandSide: EdgeSide
): LayoutChange
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS>
	| KnownError<typeof LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE>
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES>
	| KnownError<typeof LAYOUT_ERROR.CANT_RESIZE_SINGLE_FRAME> {
	win = walk(win, undefined, { save: true })
	const frame = win.frames[frameId]
	if (!frame) { throw new Error(`Unknown frame ${frameId}`) }
	if (!frame.docked) { throw new Error(`Frame ${frameId} is not docked.`) }
	const toExtract = [frame.id]

	if (Object.keys(win.frames).length === 1) {
		return new KnownError(LAYOUT_ERROR.CANT_RESIZE_SINGLE_FRAME, `Frame ${frameId} is the only frame, cannot expand.`, { frame })
	}

	// verify the frame actually touches the specified edge
	if (!(expandSide in findEdgesTouchingWindow(frame))) {
		throw new Error(`Frame ${frameId} does not touch the ${expandSide} edge.`)
	}


	const isVertical = frame.docked === "left" || frame.docked === "right"
	const sizeKey = isVertical ? "width" : "height" as const
	const posKey = isVertical ? "x" : "y"
	const currentSize = frame[sizeKey]


	const dockedSide = frame.docked as EdgeSide

	const { applyFixes, toFix } = framesRedistributeFix(win, frame, dockedSide, posKey, sizeKey, "expand")

	// note fully collapsed frames without an area are already excluded by getFramesRedistributeInfo
	const otherFrameIds = Object.keys(win.frames).filter(id => id !== frameId)

	const redistributeSide = oppositeSide(frame.docked)

	const pinnedEdgeCoordinates: number[] = getPinnedEdgesForCollapsedFrames(win, frame, dockedSide, posKey, sizeKey)

	const changes = getFramesRedistributeInfo(win, redistributeSide, otherFrameIds, amount, { pinnedEdgeCoordinates })

	if (changes instanceof KnownError) {
		return changes
	}

	applyFrameChanges(win, changes)
	pushIfNotIn(toExtract, changes.modified.map(_ => _.id))

	applyFixes()
	pushIfNotIn(toExtract, toFix)

	frame[sizeKey] = currentSize + amount

	if (frame.docked === "right" || frame.docked === "bottom") {
		frame[posKey] -= amount
	}

	return { modified: toExtract.map(_ => win.frames[_]), created: [], deleted: [] }
}
