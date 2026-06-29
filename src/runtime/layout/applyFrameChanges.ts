import { LAYOUT_ERROR, type LayoutChange, type LayoutWindow } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

/**
 *
 * Most actions that change the layout will return a LayoutChange object without mutating the window.
 *
 * This function applies the changes returned by them.
 *
 * Mutates the frame positions in the window given.
 */
export function applyFrameChanges(
	win: LayoutWindow,
	change: LayoutChange<any>
): void {
	for (const frame of change.modified) {
		const target = win.frames[frame.id]
		if (!target) {
			throw new KnownError(LAYOUT_ERROR.INVALID_ID, `Frame ${frame.id} not found in window ${win.id}`, { id: frame.id })
		}
		if ("docked" in frame) { target.docked = frame.docked }
		if ("collapsed" in frame) { target.collapsed = frame.collapsed }
		target.x = frame.x
		target.y = frame.y
		target.width = frame.width
		target.height = frame.height
	}

	for (const frame of change.created) {
		if (win.frames[frame.id]) {
			throw new KnownError(LAYOUT_ERROR.ID_ALREADY_EXISTS, `Frame ${frame.id} already exists in window ${win.id}`, { id: frame.id })
		}
		win.frames[frame.id] = frame
	}

	for (const frame of change.deleted) {
		delete win.frames[frame.id]
	}
	if (change.window) {
		for (const [key, value] of Object.entries(change.window)) {
			;(win as any)[key] = value as any
		}
	}
}
