import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { applyFrameChanges } from "./applyFrameChanges.js"
import { getFramesRedistributeInfo } from "./getFramesRedistributeInfo.js"

import { oppositeSide } from "../helpers/oppositeSide.js"
import { settings } from "../settings.js"
import type { EdgeSide, LayoutChange, LayoutWindow } from "../types/index.js"
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
	frameId: string
): LayoutChange
	| KnownError<typeof LAYOUT_ERROR.CANT_UNCOLLAPSE_NOT_COLLAPSED>
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS>
	| KnownError<typeof LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE> {
	win = walk(win, undefined, { save: true })
	const frame = win.frames[frameId]
	if (!frame) { throw new Error(`Unknown frame ${frameId}`) }
	if (!frame.docked) { throw new Error(`Frame ${frameId} is not docked.`) }
	const toExtract = [frame.id]

	const storedSize = frame.collapsed
	if (storedSize === false || storedSize === undefined) {
		return new KnownError(
			LAYOUT_ERROR.CANT_UNCOLLAPSE_NOT_COLLAPSED,
			`Frame ${frameId} is not collapsed.`,
			{ frame }
		)
	}

	const isVertical = frame.docked === "left" || frame.docked === "right"
	const sizeKey = isVertical ? "width" : "height" as const
	const posKey = isVertical ? "x" : "y"
	const currentSize = frame[sizeKey]
	const expandAmount = storedSize - currentSize

	const dockedSide = frame.docked as EdgeSide

	/**
	 * Mirrors the framesToFix logic in getFrameCollapseInfo:
	 *
	 * The only difference being we can skip the fixes if the frame was fully collapsed to 0.
	 *
	 * Why is this? Well take this example where A is docked and collapsed and B is docked, in the following two cases we would have no problems expanding as B ends where A begins, but if B shares the edge and A is not fully collapsed it is no longer aligned with the "end" of A.
	 *
	 * Ok:
	 * A - fully collapsed to 0
	 * ~ ┌──────────┐
	 * │ │B*        │
	 * │ ├──────────┤
	 * │ │          │
	 * │ │          │
	 * │ └──────────┘
	 *
	 * Ok:
	 * A collapsed to non-zero size
	 * Note B still shares A's right edge
	 * ┌──┬─────────┐
	 * │A~│B*       │
	 * │  ├─────────┤
	 * │  │         │
	 * │  │         │
	 * └──┴─────────┘
	 *
	 * Causes issues:
	 * A collapsed to non-zero size with B docked first
	 * B looses alignment with A causing issues when redistributing
	 * ┌────────────┐
	 * │B*          │
	 * ├──┬─────────┤
	 * │A~│         │
	 * │  │         │
	 * └──┴─────────┘
	 */
	const framesToFix: ({
		id: string
		posKey: "x" | "y"
		sizeKey: "width" | "height"
		type: "start" | "end"
	})[] = []

	const opposite = oppositeSide(dockedSide)
	if (frame[sizeKey] !== 0) {
		for (const other of Object.values(win.frames)) {
			if (frame.id === other.id || !other.docked) continue
			if (other.width === 0 || other.height === 0) continue

			if (other.docked === opposite) continue
			if (dockedSide === "left" || dockedSide === "top") {
				if	(other[posKey] !== 0) continue
				other[posKey] = frame[posKey] + frame[sizeKey]
				other[sizeKey] -= frame[sizeKey] // this is collapsed size
				framesToFix.push({
					id: other.id,
					posKey: posKey,
					sizeKey: sizeKey,
					type: "start"
				})
			} else {
				if (other[posKey] + other[sizeKey] !== settings.maxInt) continue
				other[sizeKey] -= frame[sizeKey]
				framesToFix.push({
					id: other.id,
					posKey: posKey,
					sizeKey: sizeKey,
					type: "end"
				})
			}
		}
	}

	// note fully collapsed frames without an area are already excluded by getFramesRedistributeInfo
	const otherFrameIds = Object.keys(win.frames).filter(id => id !== frameId)

	const redistributeSide = oppositeSide(frame.docked)

	const changes = getFramesRedistributeInfo(win, redistributeSide, otherFrameIds, expandAmount)

	if (changes instanceof KnownError) {
		return changes
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

	frame[sizeKey] = storedSize
	frame.collapsed = false

	if (frame.docked === "right" || frame.docked === "bottom") {
		frame[posKey] -= expandAmount
	}

	return { modified: toExtract.map(_ => win.frames[_]), created: [], deleted: [] }
}
