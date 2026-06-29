import { clampNumber } from "@alanscodelog/utils/clampNumber"

import { getEdgeOrientation } from "./getEdgeOrientation.js"
import { getResizeLimit } from "./getResizeLimit.js"

import { settings } from "../settings.js"
import type {
	Direction,
	Edge,
	LayoutFrame,
	Point,
	Size
} from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

export function getMoveEdgeInfo(
	touchingFrames: LayoutFrame[],
	edge: Edge,
	/** Window scaled/snaped position. See {@link toWindowCoord} */
	position: Point,
	margin: Size = settings.minSizeScaled,
	clamp = true,
	/** Skip the collapsed frame check. Used internally during window resize adjustments. */
	ignoreCollapsedCheck = false
): {
	x: number
	y: number
	dir: Direction
	isPassedLimit: boolean
	pos: number
	distance: number
} | KnownError<typeof LAYOUT_ERROR.CANT_RESIZE_COLLAPSED_FRAME> {
	// prevent moving edges that touch collapsed frames
	if (!ignoreCollapsedCheck) {
		for (const frame of touchingFrames) {
			// we check with a falsy check on PURPOSE, frames collapsed to 0 aren't an issue, they are ignored anyways
			if (frame.collapsed) {
				return new KnownError(LAYOUT_ERROR.CANT_RESIZE_COLLAPSED_FRAME, `Cannot resize non-0 collapsed frame ${frame.id}.`, { frame })
			}
		}
	}

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
