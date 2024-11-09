import { findSafeSplitEdgeAndPosition } from "./findSafeSplitEdge.js"
import { frameCreate } from "./frameCreate.js"

import { cloneFrame } from "../helpers/cloneFrame.js"
import { getMarginSize,getSnapPoint } from "../settings.js"
import {
	type Direction,
	LAYOUT_ERROR,
	type LayoutFrame,
	type Point,
	type Size,
} from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getFrameSplitInfo(
	frame: LayoutFrame,
	dir: Direction,
	dragPointOrPosition: Point | number | "midpoint" = "midpoint",
	minSize: Size = getMarginSize(),
	snapAmount: Point = getSnapPoint()
) {
	frame = cloneFrame(frame)
	let newFrame = { ...frame }
	const isHorz = dir === "left" || dir === "right"

	const sizeKey: "width" | "height" = isHorz ? "width" : "height"
	const posKey: "x" | "y" = isHorz ? "x" : "y"

	const position = dragPointOrPosition === "midpoint"
		? (isHorz ? frame.x + (frame.width / 2) : frame.y + (frame.height / 2))
		: typeof dragPointOrPosition === "number"
		? dragPointOrPosition
		: dragPointOrPosition[isHorz ? "x" : "y"]

	const safePosition = findSafeSplitEdgeAndPosition(
		frame,
		dir,
		position,
		snapAmount,
		minSize
	)

	const newSize = dir === "right" || dir === "down"
		? (frame[sizeKey] + frame[posKey]) - safePosition.position
		: safePosition.position - frame[posKey]


	if (newSize < minSize[sizeKey]) {
		return new KnownError(
			LAYOUT_ERROR.CANT_SPLIT_FRAME_TOO_SMALL,
			`Can't split frame ${frame.id} in direction ${dir}, frame is too small to be split.`,
			{ frame, newSize, minSize: minSize[sizeKey] }
		)
	}

	newFrame[sizeKey] = newSize
	frame[sizeKey] -= newSize
	if (dir === "right" || dir === "down") {
		newFrame[posKey] = safePosition.position
	} else {
		frame[posKey] = safePosition.position
	}

	newFrame = frameCreate({ ...newFrame, id: undefined })
	return { splitFrame: frame, newFrame }
}
