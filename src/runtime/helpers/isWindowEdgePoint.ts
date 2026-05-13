import { settings } from "../settings.js"
import type { Point } from "../types/index.js"

export function isWindowEdgePoint(point: Point): boolean {
	const max = settings.maxInt
	return (point.x === 0 || point.x === max)
		|| (point.y === 0 || point.y === max)
}
