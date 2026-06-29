import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { applyFrameChanges } from "./applyFrameChanges.js"
import { getFramesRedistributeInfo } from "./getFramesRedistributeInfo.js"

import { framesRedistributeFix } from "../helpers/framesRedistributeFix.js"
import { getPinnedEdgesForCollapsedFrames } from "../helpers/getPinnedEdgesForCollapsedFrames.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
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
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES> {
	win = walk(win, undefined, { save: true })
	const frame = win.frames[frameId]
	if (!frame) { throw new Error(`Unknown frame ${frameId}`) }
	if (!frame.docked) { throw new Error(`Frame ${frameId} is not docked.`) }
	const toExtract = [frame.id]


	const isVertical = frame.docked === "left" || frame.docked === "right"
	const sizeKey = isVertical ? "width" : "height" as const
	const posKey = isVertical ? "x" : "y"
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

	const { applyFixes, toFix } = framesRedistributeFix(win, frame, dockedSide, posKey, sizeKey, "expand")

	// note fully collapsed frames without an area are already excluded by getFramesRedistributeInfo
	const otherFrameIds = Object.keys(win.frames).filter(id => id !== frameId)

	const redistributeSide = oppositeSide(frame.docked)

	const pinnedEdgeCoordinates: number[] = getPinnedEdgesForCollapsedFrames(win, frame, dockedSide, posKey, sizeKey)

	const changes = getFramesRedistributeInfo(win, redistributeSide, otherFrameIds, expandAmount, { pinnedEdgeCoordinates })

	if (changes instanceof KnownError) {
		return changes
	}

	applyFrameChanges(win, changes)
	pushIfNotIn(toExtract, changes.modified.map(_ => _.id))

	applyFixes()
	pushIfNotIn(toExtract, toFix)

	frame[sizeKey] = storedSize
	frame.collapsed = undefined

	if (frame.docked === "right" || frame.docked === "bottom") {
		frame[posKey] -= expandAmount
	}

	return { modified: toExtract.map(_ => win.frames[_]), created: [], deleted: [] }
}

