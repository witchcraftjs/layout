import { getMaxInt } from "../settings.js"

/** Convert a scaled point to pixel coords for a given window. */
export function scaledPointToPx(
	point: { x: number, y: number },
	win: { pxWidth: number, pxHeight: number, pxX: number, pxY: number },
	scale: number = getMaxInt()
): { x: number, y: number } {
	return {
		x: point.x / scale * win.pxWidth + win.pxX,
		y: point.y / scale * win.pxHeight + win.pxY
	}
}
