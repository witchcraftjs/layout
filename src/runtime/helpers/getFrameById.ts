import { getFrameConstant } from "./getFrameConstant.js"

import type {
	FrameId, LayoutFrame,
	LayoutWindow
} from "../types/index.js"

export function getFrameById<T extends boolean = false>(
	win: LayoutWindow,
	frameId: FrameId,
	assert: T = false as T
): T extends true ? LayoutFrame : LayoutFrame | undefined {
	const frameId_ = getFrameConstant(win, frameId, assert)
	return win.frames[frameId_ as any]
}
