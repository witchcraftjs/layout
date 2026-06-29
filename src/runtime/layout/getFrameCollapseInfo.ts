import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { applyFrameChanges } from "./applyFrameChanges.js"
import { getFramesRedistributeInfo } from "./getFramesRedistributeInfo.js"

import { framesRedistributeFix } from "../helpers/framesRedistributeFix.js"
import { getPinnedEdgesForCollapsedFrames } from "../helpers/getPinnedEdgesForCollapsedFrames.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { settings } from "../settings.js"
import type { EdgeSide, LayoutChange, LayoutWindow, Size } from "../types/index.js"
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
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES> {
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
	const posKey = isVertical ? "x" : "y"
	const oppositePosKey = isVertical ? "y" : "x"
	const oppositeSizeKey = isVertical ? "height" : "width"


	const currentSize = frame[sizeKey]
	const collapseAmount = collapseSizeScaled[sizeKey]
	const shrinkAmount = currentSize - collapseAmount

	const dockedSide = frame.docked as EdgeSide

	const { applyFixes, toFix } = framesRedistributeFix(win, frame, dockedSide, posKey, sizeKey, "shrink")

	// note fully collapsed frames without an area are already excluded by getFramesRedistributeInfo
	const otherFrameIds = Object.keys(win.frames).filter(id => id !== frameId)

	const redistributeSide = oppositeSide(dockedSide)

	const pinnedEdgeCoordinates: number[] = getPinnedEdgesForCollapsedFrames(win, frame, dockedSide, posKey, sizeKey)

	const changes = getFramesRedistributeInfo(win, redistributeSide, otherFrameIds, -shrinkAmount, { allowOutOfBounds: true, pinnedEdgeCoordinates })

	if (changes instanceof KnownError) {
		// we should never get out of bounds and because this is a collapse there should always be space
		if (changes.code === LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS || changes.code === LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE) {
			changes.message = `This error should never happen, please file a bug report: ${changes.message}`
			throw changes
		}
		return changes
	}
	applyFrameChanges(win, changes)
	pushIfNotIn(toExtract, changes.modified.map(_ => _.id))


	applyFixes()
	pushIfNotIn(toExtract, toFix)

	if (frame.docked === "right" || frame.docked === "bottom") {
		frame[posKey] = frame[posKey] + (frame[sizeKey] - collapseSizeScaled[sizeKey])
	}
	frame[sizeKey] = collapseSizeScaled[sizeKey]
	frame.collapsed = currentSize
	// when we collapse to 0 it's a special case where the frame will always fit the entire window edge
	// for proper uncollapsing later
	if (collapseSizeScaled[sizeKey] === 0) {
		frame[oppositePosKey] = 0
		frame[oppositeSizeKey] = settings.maxInt
	}

	return { modified: toExtract.map(_ => win.frames[_]), created: [], deleted: [] }
}

