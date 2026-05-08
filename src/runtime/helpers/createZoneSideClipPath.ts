/**
 * Get the clip-path polygon for a zone's side. Ends the shape at a 45° angle.
 *
 * e.g. for a right zone, it looks like it's cutting the top and bottom left corners.
 *
 * Accepts scaled coordinates.
 */

import type { DragZone } from "../types/index.js"

export function createZoneSideClipPath(
	zone: DragZone,
	{ frameEdgePx, windowEdgePx }: { frameEdgePx: number, windowEdgePx: number }
): string | undefined {
	const side = zone.side
	const thicknessPx = zone.type === "window" ? windowEdgePx : frameEdgePx
	const pxLength = zone.side === "center"
		? 0
		: zone.side === "right" || zone.side === "left"
			? zone.pxHeight
			: zone.pxWidth

	if (side === "center") return undefined

	const t = thicknessPx
	const l = pxLength

	if (side === "bottom")
		return `polygon(${t}px 0px, ${l - t}px 0px, ${l}px ${t}px, 0px ${t}px)`

	if (side === "left")
		return `polygon(0px 0px, ${t}px ${t}px, ${t}px ${l - t}px, 0px ${l}px)`

	if (side === "top")
		return `polygon(0px 0px, ${t}px ${t}px, ${l - t}px ${t}px, ${l}px 0px)`

	if (side === "right")
		return `polygon(${t}px 0px, 0px ${t}px, 0px ${l - t}px, ${t}px ${l}px)`

	return undefined
}
