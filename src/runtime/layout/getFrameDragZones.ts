import { settings } from "../settings.js"
import type { DragZone } from "../types/index.js"

/**
 * Returns frame drag zones (in **unrounded** scaled coordinate space).
 *
 * If the frame is too narrow for both left+right zones, only the center zone is returned.
 *
 * Same logic applies to top/bottom for very short frames.
 *
 * Unrounded because these are for display purposes only.
 */
export function getFrameDragZones(
	frame: { x: number, y: number, width: number, height: number },
	thresholdPx: number,
	windowPxWidth: number,
	windowPxHeight: number
): DragZone[] {
// we do not round as we might undo this transform and drag along errors
	// plugs this is is for display purposes only
	const thX = thresholdPx / windowPxWidth * settings.maxInt
	const thY = thresholdPx / windowPxHeight * settings.maxInt
	const pxWidth = frame.width / settings.maxInt * windowPxWidth
	const pxHeight = frame.height / settings.maxInt * windowPxHeight

	if (frame.width <= 3 * thX || frame.height <= 3 * thY) {
		return [{
			type: "frame",
			side: "center", // this is more like center/full
			x: frame.x,
			y: frame.y,
			width: frame.width,
			height: frame.height,
			pxWidth,
			pxHeight
		}]
	}

	const zones: DragZone[] = []

	zones.push({
		type: "frame",
		side: "top",
		x: frame.x,
		y: frame.y,
		width: frame.width,
		height: thY,
		pxWidth,
		pxHeight: thresholdPx
	})

	zones.push({
		type: "frame",
		side: "bottom",
		x: frame.x,
		y: frame.y + frame.height - thY,
		width: frame.width,
		height: thY,
		pxWidth,
		pxHeight: thresholdPx
	})

	zones.push({
		type: "frame",
		side: "left",
		x: frame.x,
		y: frame.y,
		width: thX,
		height: frame.height,
		pxWidth: thresholdPx,
		pxHeight
	})

	zones.push({
		type: "frame",
		side: "right",
		x: frame.x + frame.width - thX,
		y: frame.y,
		width: thX,
		height: frame.height,
		pxWidth: thresholdPx,
		pxHeight
	})

	// center — remaining inner area
	const cw = frame.width - 2 * thX
	const ch = frame.height - 2 * thY
	zones.push({
		type: "frame",
		side: "center",
		x: frame.x + thX,
		y: frame.y + thY,
		width: cw,
		height: ch,
		pxWidth: cw / settings.maxInt * windowPxWidth,
		pxHeight: ch / settings.maxInt * windowPxHeight
	})

	return zones
}
