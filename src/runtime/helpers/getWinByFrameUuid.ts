import type { AnyUuid, Layout, LayoutWindow } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

export function getWinByFrameUuid<T extends boolean = false>(
	layout: Layout,
	frameId: AnyUuid,
	assert: T = false as T
): T extends true ? LayoutWindow : LayoutWindow | undefined {
	for (const win of Object.values(layout.windows)) {
		if (win.frames[frameId]) {
			return win
		}
	}
	if (assert) {
		throw new KnownError(LAYOUT_ERROR.INVALID_ID, "Could not find window with frame with that id.", { id: frameId })
	}
	return undefined as any
}
