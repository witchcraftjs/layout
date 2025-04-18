import { clampNumber, snapNumber } from "@alanscodelog/utils"

import { dirToOrientation } from "../helpers/dirToOrientation.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { getMarginSize, getSnapPoint } from "../settings.js"
import type { Direction, Edge, LayoutFrame, Point, Size } from "../types/index.js"

export function findSafeSplitEdgeAndPosition(
	frame: LayoutFrame,
	dragDirection: Direction,
	dragPointOrPosition: Point | number,
	snapAmount: Point = getSnapPoint(),
	minSize: Size = getMarginSize()
): { edge: Edge, position: number } {
	const orientation = dirToOrientation(dragDirection)
	const position
		= typeof dragPointOrPosition === "number"
			? dragPointOrPosition
			: dragPointOrPosition[orientation === "horizontal" ? "x" : "y"]

	const coordKey = orientation === "vertical" ? "y" : "x"
	const sizeKey = orientation === "vertical" ? "height" : "width"
	const pos = snapNumber(position, snapAmount[coordKey])
	const lowerLimit = snapNumber(frame[coordKey] + minSize[sizeKey], snapAmount[coordKey], "floor")
	const upperLimit = snapNumber(frame[coordKey] + frame[sizeKey] - minSize[sizeKey], snapAmount[coordKey], "floor")
	const clampedPos = clampNumber(pos, lowerLimit, upperLimit)

	const oppositeCoordKey = oppositeSide(coordKey)
	const oppositeSizeKey = oppositeSide(sizeKey)
	const frameStart = snapNumber(frame[oppositeCoordKey], snapAmount[oppositeCoordKey])
	const frameEnd = snapNumber(frameStart + frame[oppositeSizeKey], snapAmount[oppositeCoordKey])

	// createEdge is not needed, we can be sure edge created is sorted
	const edge = orientation === "vertical"
		? { startY: clampedPos, endY: clampedPos, startX: frameStart, endX: frameEnd }
		: { startX: clampedPos, endX: clampedPos, startY: frameStart, endY: frameEnd }

	return { edge, position: clampedPos }
}
