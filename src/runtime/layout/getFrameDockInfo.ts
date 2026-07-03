import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { applyFrameChanges } from "./applyFrameChanges.js"
import { getFillEmptySpaceInfo } from "./getFillEmptySpaceInfo.js"
import { getFramesRedistributeInfo } from "./getFramesRedistributeInfo.js"
import { getFrameUndockInfo } from "./getFrameUndockInfo.js"

import { cloneFrame } from "../helpers/cloneFrame.js"
import { getDockBoundaries } from "../helpers/getDockBoundaries.js"
import { getPinnedEdgesForCollapsedFrames } from "../helpers/getPinnedEdgesForCollapsedFrames.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { settings } from "../settings.js"
import type { EdgeSide, LayoutChange, LayoutWindow } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

/**
 * Returns a {@link LayoutChange} with the information necessary to dock a frame to a  window edge.
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 */
export function getFrameDockInfo(
	win: LayoutWindow,
	frameId: string,
	side: EdgeSide,
	maxPerpendicularLength?: number
):
	| LayoutChange
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS>
	| KnownError<typeof LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE>
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES>
	| KnownError<typeof LAYOUT_ERROR.CANT_LEAVE_NO_UNDOCKED_FRAMES>
	| KnownError<typeof LAYOUT_ERROR.FRAME_ALREADY_DOCKED_ON_SIDE>
	| KnownError<typeof LAYOUT_ERROR.CANT_UNDOCK_COLLAPSED_FRAME>
	| KnownError<typeof LAYOUT_ERROR.NO_FILL_CANDIDATES> {
	// its easier to just clone the window and extract changes later
	// setting the var ensures we don't accidentally mutate the original
	win = walk(win, undefined, { save: true }) as typeof win
	const frame = win.frames[frameId]
	if (!frame) { throw new Error(`Unknown frame ${frameId}`) }
	if (frame.docked === side) throw new Error(`Frame ${frameId} is already docked on side ${side}.`)

	const alreadyDockedOnSide = Object.values(win.frames).find(f => f.docked === side)

	if (alreadyDockedOnSide) {
		return new KnownError(LAYOUT_ERROR.FRAME_ALREADY_DOCKED_ON_SIDE, `Frame ${alreadyDockedOnSide.id} already docked on side ${side}.`, { id: alreadyDockedOnSide.id, side })
	}

	// if the frame is already docked on a different side, undock it first
	// so it keeps its original dimensions when re-docking
	if (frame.docked && frame.docked !== side) {
		const undockInfo = getFrameUndockInfo(win, frameId)
		if (undockInfo instanceof Error) return undockInfo
		applyFrameChanges(win, undockInfo)
	}

	const isHorizontal = side === "left" || side === "right"
	const perpendicular = isHorizontal ? "width" : "height"
	const posKey = isHorizontal ? "x" : "y"
	const sizeKey = isHorizontal ? "width" : "height"


	const oldFrame = cloneFrame(frame)
	const otherFrameIds = Object.keys(win.frames).filter(_ => _ !== frameId)
	const nonDockedFrameIds = otherFrameIds.filter(id => !win.frames[id].docked)
	if (nonDockedFrameIds.length === 0) {
		return new KnownError(LAYOUT_ERROR.CANT_LEAVE_NO_UNDOCKED_FRAMES, `Can't dock frame ${frameId} because there are no other undocked frames.`, { frameId })
	}

	// if its the only frame allow it to be as big as it likes
	const maxPerpendicular = maxPerpendicularLength ?? settings.maxPerpendicularLengthScaled.width
	const perpendicularLength = otherFrameIds.length > 0 ? Math.min(frame[perpendicular], maxPerpendicular) : frame[perpendicular]

	frame.docked = side
	frame.collapsed = undefined

	const toExtract = [frame.id]

	if (frame[perpendicular] === perpendicularLength) {
		return { modified: toExtract.map(_ => win.frames[_]), created: [], deleted: [] }
	}

	// fills just the hole left by the frame when it was moved
	const changes = getFillEmptySpaceInfo(win, oldFrame, [], [frameId])
	if (changes instanceof Error) return changes
	applyFrameChanges(win, changes)
	pushIfNotIn(toExtract, changes.modified.map(_ => _.id))


	// redistribute other non-docked frames to make room for the new dock.
	const sideToPushTowards = oppositeSide(side)
	
	const pinnedEdgeCoordinates: number[] = getPinnedEdgesForCollapsedFrames(win, frame, side, posKey, sizeKey)

	const redistributeChanges = getFramesRedistributeInfo(win, sideToPushTowards, nonDockedFrameIds, perpendicularLength, { pinnedEdgeCoordinates })

	if (redistributeChanges instanceof KnownError) {
		return redistributeChanges
	}
	applyFrameChanges(win, redistributeChanges)
	pushIfNotIn(toExtract, redistributeChanges.modified.map(_ => _.id))


	const { minX, maxX, minY, maxY } = getDockBoundaries(win)
	switch (side) {
		case "left":
			frame.x = 0
			frame.y = minY
			frame.width = perpendicularLength
			frame.height = maxY - minY
			break
		case "right":
			frame.x = settings.maxInt - perpendicularLength
			frame.y = minY
			frame.width = perpendicularLength
			frame.height = maxY - minY
			break
		case "top":
			frame.x = minX
			frame.y = 0
			frame.width = maxX - minX
			frame.height = perpendicularLength
			break
		case "bottom":
			frame.x = minX
			frame.y = settings.maxInt - perpendicularLength
			frame.width = maxX - minX
			frame.height = perpendicularLength
			break
	}


	const res = toExtract.map(_ => win.frames[_])

	return { modified: res, created: [], deleted: [] }
}
