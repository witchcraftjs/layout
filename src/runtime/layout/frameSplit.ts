import { keys } from "@alanscodelog/utils/keys.js"

import { type LayoutFrame, type LayoutWindow } from "../types/index.js"

/**
 * Apply a frame split. See {@link getFrameSplitInfo}
 * ```ts
 * // undefined if we can't split
 * const splitInfo = getFrameSplitInfo()
 * if (splitInfo) {
 * 	frameSplit(win, splitInfo)
 *
 * }
 * ```
 */


export function frameSplit(
	win: LayoutWindow,
	{ splitFrame, newFrame }: {
		splitFrame: LayoutFrame
		newFrame: LayoutFrame
	}
): LayoutFrame | undefined {
	const winFrame = win.frames[splitFrame.id]
	for (const key of keys(splitFrame)) {
		// @ts-expect-error wut
		winFrame[key] = splitFrame[key]
	}
	win.frames[newFrame.id] = newFrame
	return newFrame
}
