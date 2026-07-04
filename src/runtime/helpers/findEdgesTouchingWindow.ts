import { settings } from "../settings.js"
import type { EdgeSide, LayoutFrame } from "../types/index.js"

/**
 * Checks which window edges a frame touches and how.
 *
 * @returns Record mapping touched sides to `"full"` (spans the entire edge) or `"partial"` (touches but doesn't span fully). Only touched sides are included as keys.
 */
export function findEdgesTouchingWindow(frame: LayoutFrame): Partial<Record<EdgeSide, "full" | "partial">> {
	const maxInt = settings.maxInt
	const result: Partial<Record<EdgeSide, "full" | "partial">> = {}

	const spansVertical = frame.y === 0 && frame.y + frame.height === maxInt
	const spansHorizontal = frame.x === 0 && frame.x + frame.width === maxInt

	if (frame.x === 0) {
		result.left = spansVertical ? "full" : "partial"
	}
	if (frame.x + frame.width === maxInt) {
		result.right = spansVertical ? "full" : "partial"
	}
	if (frame.y === 0) {
		result.top = spansHorizontal ? "full" : "partial"
	}
	if (frame.y + frame.height === maxInt) {
		result.bottom = spansHorizontal ? "full" : "partial"
	}

	return result
}
