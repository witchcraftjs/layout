import { closeFrames } from "./closeFrames.js"
import { getCloseFrameInfo } from "./getCloseFrameInfo.js"

import { getMarginSize } from "../settings.js"
import { type Direction, type Edge, type EdgeSide, type LAYOUT_ERROR, type LayoutFrame, type LayoutWindow, type Size } from "../types/index.js"
import { type KnownError } from "../utils/KnownError.js"


export function closeFrame<T extends "edge" | "dir">(
	win: LayoutWindow,
	visualEdges: Edge[],
	frame: LayoutFrame,
	/** See {@link getCloseFrameInfo} */
	// future, support multiple dirs? return aggregate error?
	closeDirOrSide: (T extends "dir" ? Direction : EdgeSide),
	closeBy: T = "dir" as any as T,
	force: boolean = false,
	minSize: Size = getMarginSize()
): LayoutFrame[] |
	KnownError<LAYOUT_ERROR.CANT_CLOSE_NEARBY_FRAMES_TOO_SMALL | LAYOUT_ERROR.CANT_CLOSE_NO_DRAG_EDGE | LAYOUT_ERROR.CANT_CLOSE_SINGLE_FRAME> {
	const canClose = getCloseFrameInfo(Object.values(win.frames), visualEdges, frame, closeDirOrSide, closeBy, force, minSize)
	if ((canClose instanceof Error)) {
		return canClose
	}
	const { deletedFrames, modifiedFrames } = canClose
	closeFrames(win, deletedFrames, modifiedFrames)
	win.activeFrame = modifiedFrames[0].id
	return deletedFrames
}
