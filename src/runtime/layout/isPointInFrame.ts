import { inRange } from "../helpers/inRange.js"
import type { LayoutFrame, Point } from "../types/index.js"

export function isPointInFrame(frame: LayoutFrame, point: Point): boolean {
	return inRange(point.x, frame.x, frame.x + frame.width)
		&& inRange(point.y, frame.y, frame.y + frame.height)
}
