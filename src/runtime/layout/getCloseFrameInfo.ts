import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { readable } from "@alanscodelog/utils/readable"
import { unreachable } from "@alanscodelog/utils/unreachable"

import { findFramesTouchingEdge } from "./findFramesTouchingEdge.js"
import { findVisualEdge } from "./findVisualEdge.js"

import { cloneFrame } from "../helpers/cloneFrame.js"
import { dirToSide } from "../helpers/dirToSide.js"
import { findFrameDraggableEdges } from "../helpers/findFrameDraggableEdges.js"
import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { getMarginSize } from "../settings.js"
import { type Direction, type Edge, type EdgeSide, LAYOUT_ERROR, type LayoutFrame, type Size } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

/**
 * Returns the information necessary to close a frame or frames (if force: true).
 *
 * Can close by direction or by frame edge.
 *
 * - Closing A in the left direction or by it's right edge would close A and expand B.
 *
 * - Closing A in the right direction or by it's left edge is not possible, since it's left edge is a window edge.
 *
 * ```
 * ┌──┬──┐
 * │A │B │
 * └──┴──┘
 * ```
 * A list of possible directions/edges can be given to attempt closing by those directions/edges in that order.
 *
 * Frame closing does not always succeed:
 *
 * ## `force: false` (default)
 *
 * If two frames share a visual edge exactly, they can always be closed to either side.
 * ```
 *  🭮  🭬
 * ┌──┬──┐
 * │A │B │
 * └──┴──┘
 * ```
 *
 * ## `force: true`
 *
 * If the visual edge contains multiple frames, `force: true` must be specified to be able to close them. Force is not guaranteed to succeed either though.
 *
 * There's two main scenarios to consider when we have multiple frames:
 *
 * - The frames all share an edge on the closing side. We can force close both without problems.
 *
 * So, for example, here A & B can be force closed to the left since they share their left edge (vertically).
 * ```
 *    ─🭬
 * ┌──┬──┐
 * │A │C │
 * ├──┤  │
 * │B │  │
 * └──┴──┘
 * ```
 * - If they do not share an edge to that side, we will attempt to close the frame IF it's the smallest frame and only modify the size of the others.
 *
 * For this to succeed, the difference between the smallest frame and the next smallest frame must be greater than the minimum size.
 *
 * For example, here, we have frames A, B, and C to the left of the visual edge. A and B are the smallest. A can be closed and the rest modified, but only if the difference between A and B is greater than the minimum size.
 * ```
 *         🭮──
 *┌──────┬──┬──┐
 *│E     │A │F │
 *├───┬──┴──┤  │
 *│F  │B    │  │
 *├───┴─────┤  │
 *│C        │  │
 *└─────────┴──┘
 * ```
 */

export function getCloseFrameInfo<T extends "edge" | "dir">(
	frames: LayoutFrame[],
	visualEdges: Edge[],
	frame: LayoutFrame,
	/**
	 * The direction or edge (if closeBy = "edge") to search for possible closes.
	 *
	 * For example, a frame that touches the right window edge can only be closed "to the right" in the horizontal direction or by it's left edge. Another way to think about it is the left edge is "collapsed" towards the "right".
	 */
	closeDirOrSide: (T extends "dir" ? Direction : EdgeSide),
	closeBy: T = "dir" as any as T,
	force: boolean = false,
	minSize: Size = getMarginSize()
): { modifiedFrames: LayoutFrame[], deletedFrames: LayoutFrame[] }
	| KnownError<
		| typeof LAYOUT_ERROR.CANT_CLOSE_NEARBY_FRAMES_TOO_SMALL
		| typeof LAYOUT_ERROR.CANT_CLOSE_NO_DRAG_EDGE
		| typeof LAYOUT_ERROR.CANT_CLOSE_SINGLE_FRAME
		| typeof LAYOUT_ERROR.CANT_CLOSE_WITHOUT_FORCE
	> {
	if (frames.length === 1) {
		return new KnownError(LAYOUT_ERROR.CANT_CLOSE_SINGLE_FRAME,
			`Can't close frame ${frame.id}, it is the last frame in the window.`,
			{ frame })
	}
	const side = closeBy === "dir"
		? oppositeSide(dirToSide(closeDirOrSide as Direction))
		: closeDirOrSide as EdgeSide
	const sideOpposite = oppositeSide(side)

	const draggableEdges = findFrameDraggableEdges(frame, visualEdges, !force, [side])
	if (!draggableEdges) return new KnownError(LAYOUT_ERROR.CANT_CLOSE_NO_DRAG_EDGE, `Could not find draggable edge for frame ${frame.id}`, { frame })
	const { edge: frameEdge } = draggableEdges[0]

	const visualEdge = findVisualEdge(visualEdges, frameEdge)
	if (visualEdge === undefined) unreachable()
	const direction = oppositeSide(getEdgeOrientation(visualEdge))
	const entriesInVisualEdges = findFramesTouchingEdge(visualEdge, frames)

	if (entriesInVisualEdges.length === 0) unreachable()
	const sizeKey = direction === "horizontal" ? "width" : "height"
	const coordKey = direction === "horizontal" ? "x" : "y"
	const thisFrameSize = frame[sizeKey]
	const frameSizes: number[] = []
	const oppositeSideEntries: typeof entriesInVisualEdges = []
	const sameSideEntries: typeof entriesInVisualEdges = []

	for (const _ of entriesInVisualEdges) {
		if (_.side === side) {
			sameSideEntries.push(_)
			const size = _.frame[sizeKey]
			pushIfNotIn(frameSizes, [size])
		} else {
			oppositeSideEntries.push(_)
		}
	}

	frameSizes.sort((a, b) => a - b)

	const smallest: number = frameSizes[0]
	const secondSmallest: number | undefined = frameSizes[1]

	if (smallest < thisFrameSize) {
		const nearbyErrorFrames = sameSideEntries.filter(_ => _.frame[sizeKey] < thisFrameSize).map(_ => _.frame)
		return new KnownError(
			LAYOUT_ERROR.CANT_CLOSE_NEARBY_FRAMES_TOO_SMALL,
			// it's too complicated to calculate, happens in last example, if we get frame B, frame A is smaller
			// attempting to resize it is very complicated
			`Cannot close ${frame.id}, nearby affected frame/s ${readable(nearbyErrorFrames.map(_ => _.id))} are smaller than this one, we cannot calculate how to close it.`,
			{ frame, nearbyFrames: nearbyErrorFrames, minSize }
		)
	}
	if (thisFrameSize !== smallest) { unreachable() }
	if (secondSmallest) {
		if (secondSmallest - smallest < minSize[sizeKey]) {
			const nearbyErrorFrames = sameSideEntries.filter(_ => frame[sizeKey] < minSize[sizeKey]).map(_ => _.frame)
			return new KnownError(
				LAYOUT_ERROR.CANT_CLOSE_NEARBY_FRAMES_TOO_SMALL,
				`Closing this frame ${frame.id} would leave the following frame/s ${readable(nearbyErrorFrames.map(_ => _.id))} below the minimum size specified.`,
				{ frame, nearbyFrames: nearbyErrorFrames, minSize }
			)
		}
	}
	const modifiedFrames = []
	const deletedFrames = []
	const moveAmount = thisFrameSize

	for (const entry of sameSideEntries) {
		if (entry.frame[sizeKey] > thisFrameSize) {
			const clone = cloneFrame(entry.frame)
			if (side === "top" || side === "left") {
				clone[coordKey] += moveAmount
			}
			clone[sizeKey] -= moveAmount
			modifiedFrames.push(clone)
		} else if (entry.frame[sizeKey] === thisFrameSize) deletedFrames.push(entry.frame)
		else unreachable()
	}
	if (deletedFrames.length > 1 && !force) {
		return new KnownError(
			LAYOUT_ERROR.CANT_CLOSE_WITHOUT_FORCE,
			`Cannot close in this direction, there are multiple frames in the same direction (${readable(deletedFrames.map(_ => _.id))}). Use force: true to close them.`,
			{ frame, minSize, framesRequiredToBeDeleted: deletedFrames }
		)
	}
	for (const entry of oppositeSideEntries) {
		const clone = cloneFrame(entry.frame)
		if (sideOpposite === "top" || sideOpposite === "left") {
			clone[coordKey] -= moveAmount
		}
		clone[sizeKey] += moveAmount
		modifiedFrames.push(clone)
	}
	return { modifiedFrames, deletedFrames }
}
