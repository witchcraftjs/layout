import { toId } from "../helpers/toId.js"
import type { Layout, LayoutWindow } from "../types/index.js"

export function layoutRemoveWindow(layout: Layout, win: LayoutWindow | string): void {
	const id = toId(win)
	delete layout.windows[id]
}
