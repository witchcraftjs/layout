import { type LayoutFrame, type LayoutWindow } from "../types/index.js"


export function closeFrames(
	win: LayoutWindow,
	deletedFrames: LayoutFrame[],
	modifiedFrames: LayoutFrame[]
): void {
	for (const f of deletedFrames) {
		delete win.frames[f.id]
	}
	for (const mod of modifiedFrames) {
		win.frames[mod.id] = mod
	}
}
