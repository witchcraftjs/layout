import { findSafeSplitEdgeAndPosition } from "./findSafeSplitEdge.js"
import { frameCreate } from "./frameCreate.js"

import { cloneFrame } from "../helpers/cloneFrame.js"
import { settings } from "../settings.js"
import {
	type Direction,
	LAYOUT_ERROR,
	type LayoutChange,
	type LayoutFrame,
	type Point,
	type Size
} from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

/**
 * Returns a {@link LayoutChange} with the information necessary to split a frame in the given direction.
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 */
export function getFrameSplitInfo(
	frame: LayoutFrame,
	dir: Direction,
	movePointOrPosition: Point | number | "midpoint" = "midpoint",
	minSize: Size = settings.minSizeScaled,
	snapAmount: Point = settings.snapPointScaled
): LayoutChange
	| KnownError<typeof LAYOUT_ERROR.CANT_SPLIT_FRAME_TOO_SMALL>
	| KnownError<typeof LAYOUT_ERROR.CANT_SPLIT_DOCKED_FRAME> {
	if (frame.docked) {
		return new KnownError(
			LAYOUT_ERROR.CANT_SPLIT_DOCKED_FRAME,
			`Can't split docked frame ${frame.id}.`,
			{ frame }
		)
	}

	frame = cloneFrame(frame)
	let newFrame = { ...frame }
	const isHorz = dir === "left" || dir === "right"

	const sizeKey: "width" | "height" = isHorz ? "width" : "height"
	const posKey: "x" | "y" = isHorz ? "x" : "y"

	const position = movePointOrPosition === "midpoint"
		? (isHorz ? frame.x + (frame.width / 2) : frame.y + (frame.height / 2))
		: typeof movePointOrPosition === "number"
			? movePointOrPosition
			: movePointOrPosition[isHorz ? "x" : "y"]

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
	return { modified: [frame], created: [newFrame], deleted: [] }
}
