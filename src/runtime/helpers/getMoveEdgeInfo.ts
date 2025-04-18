import { clampNumber } from "./clampNumber.js"
import { getEdgeOrientation } from "./getEdgeOrientation.js"
import { getResizeLimit } from "./getResizeLimit.js"

import { getMarginSize } from "../settings.js"
import type {
	Direction,
	Edge, LayoutFrame,
	Point,
	Size } from "../types/index.js"

export function getMoveEdgeInfo(
	touchingFrames: LayoutFrame[],
	edge: Edge,
	/** Window scaled/snaped position. See {@link toWindowCoord} */
	position: Point,
	margin: Size = getMarginSize(),
	clamp = true
): {
	x: number
	y: number
	dir: Direction
	isPassedLimit: boolean
	pos: number
	distance: number
} {
	const { x: posX, y: posY } = position

	const edgeDirection = getEdgeOrientation(edge)
	const dir = edgeDirection === "horizontal"
		? (posY < edge.startY ? "up" : "down")
		: (posX < edge.startX ? "left" : "right")

	const edgePos = edgeDirection === "vertical" ? edge.startX : edge.startY
	const cursorPos = edgeDirection === "vertical" ? posX : posY
	const amount = Math.abs(cursorPos - edgePos)
	if (amount === 0) {
		return {
			x: posX,
			y: posY,
			dir,
			isPassedLimit: false,
			pos: edgePos,
			distance: 0
		}
	}
	const limitInDir = getResizeLimit(edge, touchingFrames, dir, amount,
		edgeDirection === "vertical" ? margin.width : margin.height
	)

	const distanceToLimit = Math.abs(edgePos - limitInDir)
	const isPassedLimit = amount > distanceToLimit
	const reverseClamp = (dir === "right" || dir === "down")
	const pos = clamp
		? reverseClamp
			? clampNumber(cursorPos, -Infinity, limitInDir)
			: clampNumber(cursorPos, limitInDir, Infinity)
		: cursorPos
	const distance = Math.abs(pos - edgePos)

	return {
		x: posX,
		y: posY,
		dir,
		isPassedLimit,
		pos,
		distance
	}
}
