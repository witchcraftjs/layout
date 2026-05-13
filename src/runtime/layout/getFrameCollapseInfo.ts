import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { applyFrameChanges } from "./applyFrameChanges.js"
import { getFramesRedistributeInfo } from "./getFramesRedistributeInfo.js"

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
	frameId: string
): LayoutChange
	| KnownError<typeof LAYOUT_ERROR.CANT_COLLAPSE_NOT_DOCKED> {
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

	const collapseSize: Size = settings.collapseSizeScaled

	const currentSize = frame[sizeKey]
	const collapseAmount = collapseSize[sizeKey]
	const shrinkAmount = currentSize - collapseAmount

	const dockedSide = frame.docked as EdgeSide


	/**
	 * When multiple frames are docked* they may share an edge like this:
	 * For example, if we collapse A, we need to allow everything else to expand,
	 * but if we expand D it will overflow the bounds of the window and we'd get an error.
	 * To avoid this, we shrink these frames towards the opposite side first.
	 *
	 * collapsed size/amount
	 * ├──┘
	 * │  shrink amount
	 * │  ├───┘
	 * ├──────┬───────────┐
	 * │A*│   │B*         │
	 * │      ├──────┬────┤
	 * │  │   │E     │C*  │
	 * │      │      │    │
	 * ├──┴───┴──────┤    │
	 * │D*           │    │
	 * └──────┬──────┴────┘
	 *        │we would shrink D to here
	 *
	 *  D.x = A.x + A.width, and then subtract the difference from it's width
	 *
	 * ***IMPROTANT: It needs to stay aligned with the right side of A and the rest of the frames, or redistribute doesn't know how to redistribute it properly.
	 *
	 * When redistribute expands it again by shrinkAmount it will end up at A.x + collapseSize.
	 *
	 * This works fine when collapseSize is 0, but otherwise breaks so we keep a list of
	 * fixes to make after redistributing to place it's left edge back at the right place (it's right edge will have been moved by redistribute).
	 */

	const framesToFix: ({
		id: string
		posKey: "x" | "y"
		sizeKey: "width" | "height"
		type: "start" | "end"
	})[] = []
	const opposite = oppositeSide(dockedSide)
	for (const other of Object.values(win.frames)) {
		if (frame.id === other.id || !other.docked) continue

		if (other.docked === opposite) continue
		if (dockedSide === "left" || dockedSide === "top") {
			if (other[posKey] !== 0) continue
			other[posKey] = frame[posKey] + frame[sizeKey]
			other[sizeKey] -= frame[sizeKey]
			framesToFix.push({
				id: other.id,
				posKey,
				sizeKey,
				type: "start"
			})
		} else {
			if (other[posKey] + other[sizeKey] !== settings.maxInt) continue
			other[sizeKey] -= frame[sizeKey]
			framesToFix.push({
				id: other.id,
				posKey,
				sizeKey,
				type: "end"
			})
		}
	}

	// note fully collapsed frames without an area are already excluded by getFramesRedistributeInfo
	const otherFrameIds = Object.keys(win.frames).filter(id => id !== frameId)

	const redistributeSide = oppositeSide(dockedSide)

	const changes = getFramesRedistributeInfo(win, redistributeSide, otherFrameIds, -shrinkAmount, true)

	if (changes instanceof KnownError) {
		// we should never get out of bounds and because this is a collapse there should always be space
		if (changes.code === LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS || LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE) {
			changes.message = `This error should never happen, please file a bug report: ${changes.message}`
			throw changes
		}
		return changes as any // in case of other errors
	}
	applyFrameChanges(win, changes)
	pushIfNotIn(toExtract, changes.modified.map(_ => _.id))

	for (const fix of framesToFix) {
		const other = win.frames[fix.id]
		if (fix.type === "start") {
			const sizeDiff = other[fix.posKey]
			other[fix.posKey] = 0
			other[fix.sizeKey] += sizeDiff
		} else {
			const sizeDiff = settings.maxInt - (other[fix.posKey] + other[fix.sizeKey])
			other[fix.sizeKey] += sizeDiff
		}
	}
	pushIfNotIn(toExtract, framesToFix.map(_ => _.id))

	if (frame.docked === "right" || frame.docked === "bottom") {
		frame[posKey] = frame[posKey] + (frame[sizeKey] - collapseSize[sizeKey])
	}
	frame[sizeKey] = collapseSize[sizeKey]
	frame.collapsed = currentSize
	// when we collapse to 0 it's a special case where the frame will always fit the entire window edge
	// for proper uncollapsing later
	if (collapseSize[sizeKey] === 0) {
		frame[oppositePosKey] = 0
		frame[oppositeSizeKey] = settings.maxInt
	}

	return { modified: toExtract.map(_ => win.frames[_]), created: [], deleted: [] }
}
