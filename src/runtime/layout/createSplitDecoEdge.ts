import { findSafeSplitEdgeAndPosition } from "./findSafeSplitEdge.js"

import { getMarginSize, getSnapPoint } from "../settings.js"
import type { LayoutFrame, Point, RawSplitDeco, Size, SplitDecoShapes } from "../types/index.js"

export function createSplitDecoEdge(
	frames: Record<string, LayoutFrame>,
	deco: RawSplitDeco,
	snapAmount: Point = getSnapPoint(),
	minSize: Size = getMarginSize()
): SplitDecoShapes {
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

	return { edge, newFrame }
}
