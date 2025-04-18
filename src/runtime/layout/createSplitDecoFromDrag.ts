import { createSplitDecoEdge } from "./createSplitDecoEdge.js"

import { dirToOrientation } from "../helpers/dirToOrientation.js"
import { getMarginSize, getSnapPoint } from "../settings.js"
import type { Direction, LayoutFrame, Point, RawSplitDeco, Size, SplitDeco } from "../types/index.js"

export function createSplitDecoFromDrag(
	frames: Record<string, LayoutFrame>,
	frame: LayoutFrame,
	dragDirection: Direction,
	dragPoint: Point,
	snapAmount: Point = getSnapPoint(),
	minSize: Size = getMarginSize()
): SplitDeco {
	const orientation = dirToOrientation(dragDirection)
	const deco: RawSplitDeco = {
		type: "split",
		id: frame.id,
		position: dragPoint[orientation === "horizontal" ? "x" : "y"],
		direction: dragDirection
	}
	;(deco as SplitDeco).shapes = createSplitDecoEdge(frames, deco, snapAmount, minSize)
	return deco as SplitDeco
}
