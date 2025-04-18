import { getWindowConstant } from "./getWindowConstant.js"

import type { Layout, LayoutWindow, WindowId } from "../types/index.js"

export function getWinById<T extends boolean = false>(
	layout: Layout,
	winId: WindowId,
	assert: T = false as T
): T extends true ? LayoutWindow : LayoutWindow | undefined {
	const winId_ = getWindowConstant(layout, winId, assert)
	return layout.windows[winId_ as any]
}
