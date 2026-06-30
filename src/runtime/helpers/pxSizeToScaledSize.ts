import { unreachable } from "@alanscodelog/utils/unreachable"

import { numberToScaledPercent } from "./numberToScaledPercent.js"

import { settings } from "../settings.js"
import type { LayoutWindow, PxSize, Size } from "../types/index.js"

export function pxSizeToScaledSize(
	win: Pick<LayoutWindow, "pxWidth" | "pxHeight">,
	size: PxSize | number,
	scale: number = settings.maxInt
): Size {
	const scaledSize = {
		width: numberToScaledPercent(
			typeof size === "number" ? size : size.pxWidth,
			win.pxWidth,
			scale
		),
		height:
			numberToScaledPercent(
				typeof size === "number" ? size : size.pxHeight,
				win.pxHeight,
				scale
			)
	}
	if (scaledSize.width > scale) unreachable()
	return scaledSize
}
