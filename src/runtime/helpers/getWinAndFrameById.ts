import { getFrameConstant } from "./getFrameConstant.js"
import { getWinByFrameUuid } from "./getWinByFrameUuid.js"
import { getWindowConstant } from "./getWindowConstant.js"

import {
	type AnyUuid, type FrameId, type Layout,
	type LayoutFrame,
	type LayoutWindow, type WindowId
} from "../types/index.js"


export function getWinAndFrameById<T extends boolean = false>(
	layout: Layout,
	/** winId can be undefined only if frameId is a uuid */
	winId: WindowId | undefined,
	frameId: AnyUuid | FrameId,
	assert: T = false as T
): T extends true ? { win: LayoutWindow, frame: LayoutFrame } : { win?: LayoutWindow, frame?: LayoutFrame } {
	let win: LayoutWindow | undefined
	if (winId === undefined) {
		win = getWinByFrameUuid(layout, frameId, assert)
	} else {
		win = layout.windows[getWindowConstant(layout, winId, assert) as any]
	}

	const maybeFrameId = (win !== undefined ? getFrameConstant(win, frameId, assert) : undefined)
	const frame = win?.frames[maybeFrameId as any]
	return { win, frame } satisfies { win?: LayoutWindow, frame?: LayoutFrame } as any
}
