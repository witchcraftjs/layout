import { getMaxInt } from "../settings.js"
import type { Point } from "../types/index.js"

export function isWindowEdgePoint(point: Point): boolean {
	const max = getMaxInt()
	return (point.x === 0 || point.x === max)
		|| (point.y === 0 || point.y === max)
}
