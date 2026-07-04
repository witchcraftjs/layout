import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { applyFrameChanges } from "../layout/applyFrameChanges.js"
import { getFrameExpandInfo } from "../layout/getFrameExpandInfo.js"
import { getFrameShrinkInfo } from "../layout/getFrameShrinkInfo.js"
import { getRelaxFramesInfo } from "../layout/getRelaxFramesInfo.js"
import { settings } from "../settings.js"
import type { LayoutChange, LayoutWindow, PxSize } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"


/**
 * Returns info to update the window size, keeping non-0 collapsed frames the same pixel size IF possible. Never returns an error.
 *
 * This sacrifices the min (percentage) size of other frames if needed, although not to the point of making them 0 size (which would break the layout).
 *
 * If there is absolutely no space, it will leave things as they are. This just means that the collapsed frame will shrink further than your ideal pixel width, but percentage size will stay the same.
 *
 * @experimental
 */
export function getUpdateWindowSizeInfo(
	win: LayoutWindow,
	event: PxSize,
	{ relaxPasses = 2 }: { relaxPasses?: number } = {}
): LayoutChange<any> {
	win = walk(win, undefined, { save: true }) as LayoutWindow

	win.pxWidth = event.pxWidth
	win.pxHeight = event.pxHeight


	const maxInt = settings.maxInt
	const frames = Object.values(win.frames)

	const dockedFrameIds = frames.filter(f => f.collapsed).map(f => f.id)

	if (dockedFrameIds.length === 0) {
		return {
			modified: [],
			created: [],
			deleted: [],
			window: { pxWidth: event.pxWidth, pxHeight: event.pxHeight }
		}
	}

	const toExtract: string[] = []
	for (const frameId of dockedFrameIds) {
		const frame = win.frames[frameId]
		const orientation = (frame.docked === "left" || frame.docked === "right") ? "horizontal" : "vertical"
		const sizeKey = orientation === "horizontal" ? "width" : "height"
		const targetPxSize = settings.collapseSizePx[sizeKey]
		const targetScaled = Math.round((targetPxSize / (orientation === "horizontal" ? win.pxWidth : win.pxHeight)) * maxInt)

		if (frame[sizeKey] === targetScaled) continue
		if (frame[sizeKey] === 0) continue

		const side = frame.docked!
		const diff = targetScaled - frame[sizeKey]

		let result: ReturnType<typeof getFrameShrinkInfo> | ReturnType<typeof getFrameExpandInfo>

		if (diff < 0) {
			result = getFrameShrinkInfo(win, frame.id, -diff, side, { allowOutOfBounds: true })
		} else {
			// in worst case scenario allow frames to shrink
			// minSize must be 1 (not 0) to avoid zero-size frames during redistribution
			const wasMinSize = { ...settings.minSize }
			settings.minSize = 1
			result = getFrameExpandInfo(win, frame.id, diff, side)
			settings.minSize = wasMinSize
		}

		if (!(result instanceof KnownError)) {
			applyFrameChanges(win, result)
			pushIfNotIn(toExtract, result.modified.map(f => f.id))
		}


		// attempt relaxation
		const result2 = getRelaxFramesInfo(win, relaxPasses)
		if (!(result2 instanceof KnownError)) {
			applyFrameChanges(win, result2)
			pushIfNotIn(toExtract, result2.modified.map(f => f.id))
		}
	}


	return {
		modified: toExtract.map(id => win.frames[id]),
		created: [],
		deleted: [],
		window: {
			pxWidth: event.pxWidth,
			pxHeight: event.pxHeight
		}
	}
}

