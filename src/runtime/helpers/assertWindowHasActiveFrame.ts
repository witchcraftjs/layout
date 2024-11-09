import { type LayoutWindow } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"


export function assertWindowHasActiveFrame(win: LayoutWindow): asserts win is Omit<LayoutWindow, "activeFrame"> & { activeFrame: NonNullable<LayoutWindow["activeFrame"]> } {
	if (win.activeFrame === undefined) {
		throw new KnownError(LAYOUT_ERROR.NO_ACTIVE_WINDOW, "Layout has no active window.", {})
	}
}
