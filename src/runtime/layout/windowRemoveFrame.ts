import { toId } from "../helpers/toId.js"
import type { LayoutFrame, LayoutWindow } from "../types/index.js"

export function windowRemoveFrame(win: LayoutWindow, frame: LayoutFrame | string): void {
	const id = toId(frame)
	delete win.frames[id]
}
