import { snapNumber } from "@alanscodelog/utils/snapNumber.js"

import { numberToScaledPercent } from "./numberToScaledPercent.js"

import { getSnapPoint } from "../settings.js"
import { type LayoutWindow, type Point } from "../types/index.js"


export function toWindowCoord(
	win: LayoutWindow,
	e: Pick<PointerEvent, "clientX" | "clientY">,
	snapAmount: Point = getSnapPoint()
): Point {
	const x = numberToScaledPercent((e.clientX - win.pxX), win.pxWidth)
	const y = numberToScaledPercent((e.clientY - win.pxY), win.pxHeight)

	if (snapAmount) {
		return {
			x: snapNumber(x, snapAmount.x),
			y: snapNumber(y, snapAmount.x),
		}
	}
	return { x, y }
}
