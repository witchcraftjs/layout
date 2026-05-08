import { getFrameDragZones } from "./getFrameDragZones.js"
import { getWindowDragZones } from "./getWindowDragZones.js"
import { isPointInRect } from "./isPointInRect.js"

import type { DragState, DragZone, WindowEdgeZone } from "../types/index.js"

/**
 * Find the drag zone under the drag point.
 */
export function getDragZones(
	state: Pick<DragState, "dragPoint" | "dragHoveredFrame" | "frames" | "win">,
	{ frameEdgePx, windowEdgePx }: { frameEdgePx: number, windowEdgePx: number }
): DragZone | undefined {
	const { dragPoint, win } = state
	const frameId = state.dragHoveredFrame?.id
	if (!frameId) return

	const frame = state.frames[frameId]
	if (!frame || !dragPoint) return

	const frameZones = getFrameDragZones(frame, frameEdgePx, win.pxWidth, win.pxHeight)

	const windowZones = getWindowDragZones(win, windowEdgePx)

	let matchedZone: DragZone | undefined
	for (const zone of windowZones) {
		if (isPointInRect(zone, dragPoint)) {
			matchedZone = {
				...zone,
				type: "window"
			} as WindowEdgeZone
			break
		}
	}

	if (!matchedZone) {
		for (const zone of frameZones) {
			if (isPointInRect(zone, dragPoint)) {
				matchedZone = zone
				break
			}
		}
	}

	if (!matchedZone) return undefined

	return matchedZone
}
