import { numberToScaledPercent } from "../helpers/numberToScaledPercent.js"
import { settings } from "../settings.js"
import type { LayoutWindow, WindowEdgeZone } from "../types/index.js"

/**
 * Returns window edge drag zones (in scaled coordinates)
 *
 */
export function getWindowZones(
	win: LayoutWindow,
	thresholdPx: number
): WindowEdgeZone[] {
	const thX = numberToScaledPercent (thresholdPx, win.pxWidth)
	const thY = numberToScaledPercent (thresholdPx, win.pxHeight)
	const maxInt = settings.maxInt

	return [
		{
			type: "window",
			side: "top",
			x: 0,
			y: 0,
			width: maxInt,
			height: thY,
			pxWidth: win.pxWidth,
			pxHeight: thresholdPx
		},
		{
			type: "window",
			side: "bottom",
			x: 0,
			y: maxInt - thY,
			width: maxInt,
			height: thY,
			pxWidth: win.pxWidth,
			pxHeight: thresholdPx
		},
		{
			type: "window",
			side: "left",
			x: 0,
			y: 0,
			width: thX,
			height: maxInt,
			pxWidth: thresholdPx,
			pxHeight: win.pxHeight
		},
		{
			type: "window",
			side: "right",
			x: maxInt - thX,
			y: 0,
			width: thX,
			height: maxInt,
			pxWidth: thresholdPx,
			pxHeight: win.pxHeight
		}
	]
}
