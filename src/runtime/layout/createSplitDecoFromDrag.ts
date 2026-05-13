import { createSplitDecoShapes } from "./createSplitDecoShapes.js"

import { dirToOrientation } from "../helpers/dirToOrientation.js"
import { settings } from "../settings.js"
import type { Direction, LayoutFrame, Point, RawSplitDeco, Size, SplitDeco } from "../types/index.js"

export function createSplitDecoFromDrag(
	frames: Record<string, LayoutFrame>,
	frame: LayoutFrame,
	dragDirection: Direction,
	dragPoint: Point,
	snapAmount: Point = settings.snapPointScaled,
	minSize: Size = settings.minSizeScaled,
	classes: {
		/** @default "deco-split-edge bg-red-500" */
		splitEdge?: string
		/** @default "deco-split-new-frame bg-blue-500/50" */
		splitNewFrame?: string
	} = {}
): SplitDeco {
	const orientation = dirToOrientation(dragDirection)
	const deco: RawSplitDeco & Partial<SplitDeco> = {
		type: "split",
		id: frame.id,
		position: dragPoint[orientation === "horizontal" ? "x" : "y"],
		direction: dragDirection
	}
	deco.shapes = createSplitDecoShapes(frames, deco, snapAmount, minSize, classes)
	return deco as SplitDeco
}
