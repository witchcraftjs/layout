import { type LayoutFrame, type LayoutWindow } from "../types/index.js"


export function windowAddFrame(win: LayoutWindow, frame: LayoutFrame): LayoutFrame {
	// todo check can add because of space
	// avoid duplicates in case of user error
	// we can't have duplicates because a frame can't be in two positions at once
	// if we implement frame linking it will have to be some other way
	win.frames[frame.id] = frame
	return frame
}
