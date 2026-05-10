import { inRange } from "../helpers/inRange.js"
import type { Point } from "../types/index.js"

export function isPointInRect(frame: { x: number, y: number, width: number, height: number }, point: Point): boolean {
	return inRange(point.x, frame.x, frame.x + frame.width)
		&& inRange(point.y, frame.y, frame.y + frame.height)
}
