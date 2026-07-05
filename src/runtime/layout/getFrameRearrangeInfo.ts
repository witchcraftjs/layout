import { getFillEmptySpaceInfo } from "./getFillEmptySpaceInfo.js"
import { getFrameSplitInfo } from "./getFrameSplitInfo.js"
import { getFrameSwapInfo } from "./getFrameSwapInfo.js"

import { frameToEdges } from "../helpers/frameToEdges.js"
import { getSideTouching } from "../helpers/getSideTouching.js"
import { isEdgeEqual } from "../helpers/isEdgeEqual.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { sideToDirection } from "../helpers/sideToDirection.js"
import type { LayoutChange, LayoutWindow, Zone } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"


/**
 * Returns a {@link LayoutChange} with the information necessary to rearrange a frame relative to another.
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 *
 * Rearrangement is usually done by dragging a frame onto another frame's zone.
 *
 * The action taken depends on their placement relative to each other, see examples below.
 *
 * ## Examples
 *
 * Dragging a frame onto itself in the left/right/top/bottom zones splits it and creates a new frame. Center returns an error.
 *
 * Then there are the more typical cases:
 *
 * Shared Edge Case:
 *
 * ┌─────┬─────┬─────┐
 * │A    │B    │C    │
 * │     │     ├─────┤
 * │     │     │D    │
 * └─────┴─────┴─────┘
 *
 * A and B here are on the same edge, with A on the left of B.
 *
 * Dragging A onto B will result in the following depending on what drop zone of B the dragged frame lands on:
 *
 * Left - Error that can be safely ignored - A is already on the left of B
 * Right - Swap A and B
 * Top
 * 	- B is "split" up (we only simulate it to get the positions). The position of the new split frame is taken and applied to A to move it above B.
 * 	- The gap left behind by A is filled however possible using {@link getFillEmptySpaceInfo}.
 *
 * The result looks like this:
 *
 * ┌───────────┬─────┐
 * │A          │C    │
 * ├───────────┼─────┤
 * │B          │D    │
 * └───────────┴─────┘
 *
 * Bottom - Like top, but A ends up on the bottom of B.
 *
 *
 * Partially Shared Edge Case:
 *
 * ┌─────┬─────┬─────┐
 * │A    │B    │C    │
 * │     │     │     │
 * │     │     │     │
 * │     │     ├─────┤
 * │     │     │D    │
 * │     │     │     │
 * └─────┴─────┴─────┘
 *
 * Same case but we'll be using B and C here as they share part of an edge but not the whole edge. Dragging B onto C will result in the following:
 *
 * Left
 * 	- C will be "split" to the left. The position of the new split frame is taken and applied to B. The space left behind is filled resulting in this.
 * 	- Note how c has shrunk due to the initial location of the split.
 *
 * ┌─────┬────────┬──┐
 * │A    │B       │C │
 * │     │        │  │
 * │     │        │  │
 * │     ├────────┴──┤
 * │     │D          │
 * │     │           │
 * └─────┴───────────┘
 *
 * Right - Like left but C ends up on the right of B.
 *
 * Top
 * ┌─────┬───────────┐
 * │A    │B          │
 * │     ├───────────┤
 * │     │C          │
 * │     ├───────────┤
 * │     │D          │
 * │     │           │
 * └─────┴───────────┘
 *
 * Bottom - Like top, but B ends up on the bottom of C.
 *
 * None-Shared Edge Case:
 *
 * Same case but we'll be dragging A over C.
 * ┌─────┬─────┬─────┐
 * │A    │B    │C    │
 * │     │     │     │
 * │     │     │     │
 * │     │     ├─────┤
 * │     │     │D    │
 * │     │     │     │
 * └─────┴─────┴─────┘
 *
 * These are a bit easier to reason about because the frame usually ends up at the split location exactly.
 *
 * Left
 * ┌───────────┬──┬──┐
 * │B          │A │C │
 * │           │  │  │
 * │           │  │  │
 * │           ├──┴──┤
 * │           │D    │
 * │           │     │
 * └───────────┴─────┘
 * Right
 * ┌───────────┬──┬──┐
 * │B          │C │A │
 * │           │  │  │
 * │           │  │  │
 * │           ├──┴──┤
 * │           │D    │
 * │           │     │
 * └───────────┴─────┘
 * Top
 * ┌───────────┬─────┐
 * │B          │A    │
 * │           ├─────┤
 * │           │C    │
 * │           ├─────┤
 * │           │D    │
 * │           │     │
 * └───────────┴─────┘
 * Bottom
 * ┌───────────┬─────┐
 * │B          │C    │
 * │           ├─────┤
 * │           │A    │
 * │           ├─────┤
 * │           │D    │
 * │           │     │
 * └───────────┴─────┘
 */

export function getFrameRearrangeInfo(
	win: LayoutWindow,
	movingFrameId: string,
	hoveredFrameId: string,
	zoneSide: Zone["side"]
): LayoutChange<"split" | "swap" | "rearrange">
	| KnownError<typeof LAYOUT_ERROR.CANT_SWAP_WITH_SELF>
	| KnownError<typeof LAYOUT_ERROR.CANT_SPLIT_FRAME_TOO_SMALL>
	| KnownError<typeof LAYOUT_ERROR.CANT_REARRANGE_TO_SAME_RELATIVE_POSITION>
	| KnownError<typeof LAYOUT_ERROR.CANT_REARRANGE_WITH_DOCKED_EDGES>
	| KnownError<typeof LAYOUT_ERROR.CANT_REARRANGE_DOCKED_WITH_NON_DOCKED>
	| KnownError<typeof LAYOUT_ERROR.CANT_SPLIT_DOCKED_FRAME>
	| KnownError<typeof LAYOUT_ERROR.NO_FILL_CANDIDATES> {
	const draggingFrame = { ...win.frames[movingFrameId] }
	const hoveredFrame = { ...win.frames[hoveredFrameId] }

	if (movingFrameId === hoveredFrameId) {
		if (zoneSide === "center") return new KnownError(LAYOUT_ERROR.CANT_SWAP_WITH_SELF, `Can't swap frame with self.`, { frame: hoveredFrame, zoneSide })
	}

	if (zoneSide === "center") {
		const res = getFrameSwapInfo(win, draggingFrame.id, hoveredFrame.id)
		if (res instanceof KnownError) return res
		return {
			modified: res.modified,
			created: res.created,
			deleted: res.deleted,
			info: "swap"
		}
	}

	if (draggingFrame.docked && !hoveredFrame.docked) { // center swapping IS allowed above
		return new KnownError(LAYOUT_ERROR.CANT_REARRANGE_DOCKED_WITH_NON_DOCKED, `Can't rearrange docked frame ${movingFrameId} with non-docked frame ${hoveredFrameId}, can only swap.`, { movingFrameId, hoveredFrameId, zoneSide })
	}

	// block edge rearrange on docked frames
	if (hoveredFrame.docked) { // again center swapping docked to undocked and vice versa is allowed
		return new KnownError(LAYOUT_ERROR.CANT_REARRANGE_WITH_DOCKED_EDGES, `Can't rearrange with docked frame ${hoveredFrameId} edge, can only swap.`, { movingFrameId, hoveredFrameId, zoneSide })
	}

	const touchingSide = getSideTouching(draggingFrame, hoveredFrame)
	if (touchingSide) {
		const dragEdges = frameToEdges(draggingFrame)
		const hoverEdges = frameToEdges(hoveredFrame)
		const hoverOppositeSide = oppositeSide(touchingSide)

		if (isEdgeEqual(dragEdges[touchingSide], hoverEdges[hoverOppositeSide])) {
			if (touchingSide === zoneSide) {
				const res = getFrameSwapInfo(win, draggingFrame.id, hoveredFrame.id)
				if (res instanceof KnownError) return res
				return {
					modified: res.modified,
					created: res.created,
					deleted: res.deleted,
					info: "swap"
				}
			}
			if (hoverOppositeSide === zoneSide) {
				return new KnownError(LAYOUT_ERROR.CANT_REARRANGE_TO_SAME_RELATIVE_POSITION, `Frame ${movingFrameId} is already on the ${zoneSide} of ${hoveredFrameId}`, { movingFrameId, hoveredFrameId, zoneSide })
			}
		}
	}

	// copy of where draggedFrame was
	const emptySpace = { ...draggingFrame }

	const dir = sideToDirection(zoneSide)
	const splitResult = getFrameSplitInfo(hoveredFrame, dir, "midpoint", undefined, { x: 0.001, y: 0.001 })

	if (splitResult instanceof KnownError) {
		return splitResult
	}

	const splitFrame = splitResult.modified[0]
	const newFrame = splitResult.created[0]

	if (movingFrameId === hoveredFrameId) {
		return { ...splitResult, deleted: [], info: "split" }
	}

	// hoveredFrame takes the position where it was split
	hoveredFrame.x = splitFrame.x
	hoveredFrame.y = splitFrame.y
	hoveredFrame.width = splitFrame.width
	hoveredFrame.height = splitFrame.height

	// draggingFrame takes the position of the new frame created by the split
	draggingFrame.x = newFrame.x
	draggingFrame.y = newFrame.y
	draggingFrame.width = newFrame.width
	draggingFrame.height = newFrame.height

	// even though fill empty info wont mutate, we need the moved versions to give to it
	const winCopy = {
		...win,
		frames: {
			...win.frames,
			[hoveredFrame.id]: hoveredFrame,
			[draggingFrame.id]: draggingFrame
		}
	}
	const changes = getFillEmptySpaceInfo(winCopy, emptySpace, [hoveredFrameId, movingFrameId])
	if (changes instanceof KnownError) return changes

	// it will also be missing said changes unless it further moved the frames which is not alway
	const notMissing = changes.modified.map(_ => _.id).filter(id => id === hoveredFrame.id || draggingFrame.id)
	if (!notMissing.includes(hoveredFrame.id)) changes.modified.push(hoveredFrame)
	if (!notMissing.includes(draggingFrame.id)) changes.modified.push(draggingFrame)

	return { ...changes, info: "split" }
}
