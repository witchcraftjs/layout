import { assertValidWinAndFrameIds } from "./assertValidWinAndFrameIds.js"

import {
	type Layout,
	type LayoutFrame,
	type LayoutWindow
} from "../types/index.js"


export function assertValidWinAndFrame(
	layout: Layout,
	win?: LayoutWindow,
	frame?: LayoutFrame
): { win: LayoutWindow, frame: LayoutFrame } {
	assertValidWinAndFrameIds(layout.windows, win?.id, frame?.id)
	return { win: win!, frame: frame! }
}
