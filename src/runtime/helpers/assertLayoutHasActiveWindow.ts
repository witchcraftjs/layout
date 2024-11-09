import { type Layout } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"


export function assertLayoutHasActiveWindow(layout: Layout): asserts layout is Omit<Layout, "activeWindow"> & { activeWindow: NonNullable<Layout["activeWindow"]> } {
	if (layout.activeWindow === undefined) {
		throw new KnownError(LAYOUT_ERROR.NO_ACTIVE_WINDOW, "Layout has not active window.", {})
	}
}
