import { getFrameZones } from "./getFrameZones.js"
import { getWindowZones } from "./getWindowZones.js"
import { isPointInRect } from "./isPointInRect.js"

import type { MoveState, WindowEdgeZone, Zone } from "../types/index.js"

/**
 * Find the drag zone under the drag point.
 */
export function getZones(
	state: Pick<MoveState, "movePoint" | "moveHoveredFrame" | "frames" | "win">,
	{ frameEdgePx, windowEdgePx }: { frameEdgePx: number, windowEdgePx: number }
): Zone | undefined {
	const { movePoint, win } = state
	const frameId = state.moveHoveredFrame?.id
	if (!frameId) return

	const frame = state.frames[frameId]
	if (!frame || !movePoint) return

	const frameZones = getFrameZones(frame, frameEdgePx, win.pxWidth, win.pxHeight)

	const windowZones = getWindowZones(win, windowEdgePx)

	let matchedZone: Zone | undefined
	for (const zone of windowZones) {
		if (isPointInRect(zone, movePoint)) {
			matchedZone = {
				...zone,
				type: "window"
			} as WindowEdgeZone
			break
		}
	}

	if (!matchedZone) {
		for (const zone of frameZones) {
			if (isPointInRect(zone, movePoint)) {
				matchedZone = zone
				break
			}
		}
	}

	if (!matchedZone) return undefined

	return matchedZone
}
