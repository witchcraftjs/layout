import { assertItemIn } from "./assertItemIn.js"

import type { FrameId, LayoutWindows, WindowId } from "../types/index.js"

export function assertValidWinAndFrameIds(windows: LayoutWindows, winId?: WindowId, frameId?: FrameId): void {
	assertItemIn(windows, winId)
	const win = windows[winId]
	assertItemIn(win.frames, frameId)
}
