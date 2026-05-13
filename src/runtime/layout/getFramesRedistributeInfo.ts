import { settings } from "../settings.js"
import type { EdgeSide, LayoutChange, LayoutFrame, LayoutWindow } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"


/**
 * Returns a {@link LayoutChange} with the information necessary to redistribute frames to expand/shrink a certain amount towards the given side.
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 *
 * While it checks for bounds/space issues (unless allowOutOfBounds is true), it does not check that all the frames correctly share/fill the start/end edges.
 *
 * If you try to resize a layout like this to the right, you will get issues with frame edges not lining up as frame B would be resized less than A. If you had a frame at the empty space that you excluded, it's right edge would no longer align with B's.
 *
 * See {@link getFrameCollapseInfo} and {@link getFrameUncollapseInfo} for how to work around this (you must move frames like A to share the edge then move them back). Excluding them from the calcuation usually leads to subtler errors. Such as if there are frames after A and B to the right, excluding A would mean A's right edge would stop aligning with those other frames.
 *
 * ┌────────────┐
 * │A           │
 * └──┬─────────┤
 *    │B        │
 *    └─────────┘
 *
 * Also note that it automatically excludes all collapsed frames without an area (height or width === 0).
 */
export function getFramesRedistributeInfo(
	win: LayoutWindow,
	/** Side to expand/shrink to. */
	side: EdgeSide,
	frameIds: string[],
	/** This can be negative to expand the frames instead (e.g. when collapsing a docked frame). */
	amountScaled: number,
	/** Allow the resize span to exceed window bounds. */
	allowOutOfBounds = false
): LayoutChange
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS>
	| KnownError<typeof LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE> {
	const isLeftOrTop = side === "left" || side === "top"
	const isHorizontalSide = side === "left" || side === "right"
	const posKey = isHorizontalSide ? "x" : "y" as const
	const sizeKey = isHorizontalSide ? "width" : "height" as const

	const frames = frameIds.map(id => win.frames[id])

	const edgeSet = new Set<number>()
	for (const frame of frames) {
		edgeSet.add(frame[posKey])
		edgeSet.add(frame[posKey] + frame[sizeKey])
	}
	const uniqueEdges = [...edgeSet].sort((a, b) => a - b)

	const maxInt = settings.maxInt
	const resizeSpan = uniqueEdges[uniqueEdges.length - 1] - uniqueEdges[0]
	const newSpan = resizeSpan - amountScaled
	if (!allowOutOfBounds && (newSpan > maxInt || newSpan < 0)) {
		return new KnownError(LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS, `Not enough space to resize frames, needed ${newSpan} but min/max as 0/${maxInt}.`, { max: maxInt, min: 0, wanted: newSpan })
	}

	const anchorEdge = isLeftOrTop ? uniqueEdges[0] : uniqueEdges[uniqueEdges.length - 1]
	const dirMultiplier = isLeftOrTop ? -1 : 1

	const newEdges: number[] = []
	for (let i = 0; i < uniqueEdges.length; i++) {
		const edge = uniqueEdges[i]
		const distFromAnchor = anchorEdge === uniqueEdges[0] ? edge - anchorEdge : anchorEdge - edge
		const rawMovement = dirMultiplier * distFromAnchor / resizeSpan * amountScaled
		const newEdge = edge + Math.trunc(rawMovement)
		newEdges.push(newEdge)
	}

	// ensure the edge opposite the anchor lands exactly on the correct position
	const oppositeEdgeIndex = isLeftOrTop ? uniqueEdges.length - 1 : 0
	newEdges[oppositeEdgeIndex] = isLeftOrTop ? anchorEdge + newSpan : anchorEdge - newSpan


	const minSize = settings.minSizeScaled[sizeKey]
	const result: LayoutFrame[] = []
	for (const frame of frames) {
		if (frame.collapsed && (frame.width === 0 || frame.height === 0)) continue
		const startEdge = frame[posKey]
		const endEdge = frame[posKey] + frame[sizeKey]
		const newStart = newEdges[uniqueEdges.indexOf(startEdge)]
		const newEnd = newEdges[uniqueEdges.indexOf(endEdge)]
		const newSize = newEnd - newStart

		if (newSize < minSize) {
			return new KnownError(LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE, `Redistribute would cause frame ${frame.id} to shrink to ${newSize} which is below minimum ${minSize}.`, { frameSizeNeeded: newSize, minFrameSize: minSize })
		}

		result.push({
			...frame,
			[posKey]: newStart,
			[sizeKey]: newSize
		})
	}

	return { modified: result, created: [], deleted: [] }
}
