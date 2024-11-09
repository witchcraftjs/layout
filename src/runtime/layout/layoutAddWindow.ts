import { type Layout, type LayoutWindow } from "../types/index.js"


export function layoutAddWindow(layout: Layout, win: LayoutWindow): LayoutWindow {
	layout.windows[win.id] = win
	return win
}
