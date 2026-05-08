import { settings } from "../settings.js"
import type { LayoutWindow } from "../types/index.js"

/**
 * Compute the inner boundaries of a docked region by looking at already docked frames.
 *
 * For example, if A, B, and C are docked, this returns the area of C.
 * ┌─────────┐
 * │A*       │
 * ├────┬────┤
 * │B*  │C   │
 * ├────┴────┤
 * │D*       │
 * └─────────┘
 */
export function getDockBoundaries(win: LayoutWindow): {
	minX: number
	maxX: number
	minY: number
	maxY: number
} {
	let minX = 0
	let maxX = settings.maxInt
	let minY = 0
	let maxY = settings.maxInt

	for (const f of Object.values(win.frames)) {
		if (f.docked === "left") minX = Math.max(minX, f.x + f.width)
		if (f.docked === "right") maxX = Math.min(maxX, f.x)
		if (f.docked === "top") minY = Math.max(minY, f.y + f.height)
		if (f.docked === "bottom") maxY = Math.min(maxY, f.y)
	}

	return { minX, maxX, minY, maxY }
}

