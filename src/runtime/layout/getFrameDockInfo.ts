import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { applyFrameChanges } from "./applyFrameChanges.js"
import { getFillEmptySpaceInfo } from "./getFillEmptySpaceInfo.js"
import { getFramesRedistributeInfo } from "./getFramesRedistributeInfo.js"
import { getFrameUndockInfo } from "./getFrameUndockInfo.js"

import { cloneFrame } from "../helpers/cloneFrame.js"
import { getDockBoundaries } from "../helpers/getDockBoundaries.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { getMaxInt, getMaxPerpendicularLength } from "../settings.js"
import { type EdgeSide, LAYOUT_ERROR, type LayoutFrame, type LayoutWindow } from "../types/index.js"
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

	const oldFrame = cloneFrame(frame)
	const otherFrameIds = Object.keys(win.frames).filter(_ => _ !== frameId)
	const nonDockedFrameIds = otherFrameIds.filter(id => !win.frames[id].docked)
	if (nonDockedFrameIds.length === 0) {
		return new KnownError(LAYOUT_ERROR.CANT_LEAVE_NO_UNDOCKED_FRAMES, `Can't dock frame ${frameId} because there are no other undocked frames.`, { frameId })
	}

	// if its the only frame allow it to be as big as it likes
	const effectiveMaxPerpendicular = maxPerpendicularLength ?? getMaxPerpendicularLength()
	const perpendicularLength = otherFrameIds.length > 0 ? Math.min(frame[perpendicular], effectiveMaxPerpendicular) : frame[perpendicular]

	// determine the inner area by looking at already docked frames
	let minX = 0
	let maxX = getMaxInt()
	let minY = 0
	let maxY = getMaxInt()

	if (otherFrameIds.length > 0) {
		for (const f of Object.values(win.frames)) {
			if (f.id === frameId || !f.docked) continue
			if (f.docked === side) {
				return new KnownError(LAYOUT_ERROR.FRAME_ALREADY_DOCKED_ON_SIDE, `Frame ${f.id} already docked on side ${side}.`, { id: f.id, side })
			}
			if (f.docked === "left") minX = Math.max(minX, f.x + f.width)
			if (f.docked === "right") maxX = Math.min(maxX, f.x)
			if (f.docked === "top") minY = Math.max(minY, f.y + f.height)
			if (f.docked === "bottom") maxY = Math.min(maxY, f.y)
		}
	}


	frame.docked = side
	frame.collapsed = false

	const toExtract = [frame.id]

	// fills just the hole left by the frame when it was moved
	const changes = getFillEmptySpaceInfo(win, oldFrame, [], [frameId])
	if (changes instanceof Error) return changes
	applyFrameChanges(win, changes)
	pushIfNotIn(toExtract, changes.modified.map(_ => _.id))


	// redistribute other non-docked frames to make room for the new dock.
	const sideToPushTowards = oppositeSide(side)

	const redistributeChanges = getFramesRedistributeInfo(win, sideToPushTowards, nonDockedFrameIds, perpendicularLength)

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
			frame.x = getMaxInt() - perpendicularLength
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
			frame.y = getMaxInt() - perpendicularLength
			frame.width = maxX - minX
			frame.height = perpendicularLength
			break
	}


	const res = toExtract.map(_ => win.frames[_])

	return { modified: res, created: [], deleted: [] }
}
