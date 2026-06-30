import type { LayoutFrame } from "../types/index.js"

/**
 * For testing, validates the resulting layout is valid (frames do not overlap, have no gaps between them and form a rectangular area.
 */
export function validateLayoutShape(frames: Pick<LayoutFrame, "x" | "y" | "width" | "height">[]): boolean {
	const n = frames.length
	if (n === 0) return false

	// check area mismatch (non-rectangular, or has gaps)
	let totalArea = 0
	let minX = Infinity, minY = Infinity
	let maxX = -Infinity, maxY = -Infinity

	for (const f of frames) {
		totalArea += f.width * f.height
		minX = Math.min(minX, f.x)
		minY = Math.min(minY, f.y)
		maxX = Math.max(maxX, f.x + f.width)
		maxY = Math.max(maxY, f.y + f.height)
	}

	const boundingArea = (maxX - minX) * (maxY - minY)

	if (Math.abs(totalArea - boundingArea) > 0.001) {
		return false
	}

	// check overlaps
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			const a = frames[i]
			const b = frames[j]


			if (a.x < b.x + b.width
				&& a.x + a.width > b.x
				&& a.y < b.y + b.height
				&& a.y + a.height > b.y) {
				return false
			}
		}
	}

	return true
}
