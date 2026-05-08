import { findSafeSplitEdgeAndPosition } from "./findSafeSplitEdge.js"

import { getMarginSize, getSnapPoint } from "../settings.js"
import type { LayoutFrame, LayoutShape, Point, RawSplitDeco, Size } from "../types/index.js"

export function createSplitDecoShapes(
	frames: Record<string, LayoutFrame>,
	deco: RawSplitDeco,
	snapAmount: Point = getSnapPoint(),
	minSize: Size = getMarginSize(),
	classes: {
		/** @default "deco-split-edge bg-red-500" */
		splitEdge?: string
		/** @default "deco-split-new-frame bg-blue-500/50" */
		splitNewFrame?: string
	} = {}

): LayoutShape[] {
	const frame = frames[deco.id]
	const { edge, position } = findSafeSplitEdgeAndPosition(frame, deco.direction, deco.position, snapAmount, minSize)
	const newFrame = { x: frame.x, y: frame.y, width: frame.width, height: frame.height }

	switch (deco.direction) {
		case "right":
			newFrame.x = position
			newFrame.width = frame.x + frame.width - position
			break
		case "left":
			newFrame.width = position - frame.x
			break
		case "down":
			newFrame.y = position
			newFrame.height = frame.y + frame.height - position
			break
		case "up":
			newFrame.height = position - frame.y
			break
	}

	return [
		{ type: "edge", data: edge, attrs: { class: classes.splitEdge ?? "deco-split-edge bg-red-500" } },
		{ type: "square", data: newFrame, attrs: { class: classes.splitNewFrame ?? "deco-split-new-frame bg-blue-500/50" } }
	]
}
