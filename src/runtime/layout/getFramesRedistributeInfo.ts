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
 * See {@link framesRedistributeFix} for the helper that is used internally to get around this.
 *
 * ┌────────────┐
 * │A           │
 * └──┬─────────┤
 *    │B        │
 *    └─────────┘
 *
 * Also note that it automatically excludes all collapsed frames without an area (height or width === 0).
 *
 * ## Pinned Edges
 *
 * Pinned edges will not be moved, space will be redistributed amongst remaining space. If doing this would cause edges to get "flipped", function will return {@link LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES}.
 *
 * ┌──┬──────────────┐
 * │  │              │
 * │  ├──────────┬───┤
 * │  │          │   │
 * │  │          │   │
 * └──┴──────────┴───┘
 */

export function getFramesRedistributeInfo(
	win: LayoutWindow,
	/** Side to expand/shrink to. */
	side: EdgeSide,
	frameIds: string[],
	/** This can be negative to expand the frames instead (e.g. when collapsing a docked frame). */
	amountScaled: number,
	{
		allowOutOfBounds = false,
		pinnedEdgeCoordinates,
		skipMinSizeCheck = false
	}: {
		/** Allow the resize span to exceed window bounds. */
		allowOutOfBounds?: boolean
		/** Frame IDs whose position and size must not change. Must be a subset of frameIds. */
		pinnedEdgeCoordinates?: number[]
		/** Skip the per-frame min size check. Frames may shrink very small but not to 0 or below. */
		skipMinSizeCheck?: boolean
	} = {}
): LayoutChange
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS>
	| KnownError<typeof LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE>
	| KnownError<typeof LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES> {
	const isLeftOrTop = side === "left" || side === "top"
	const isHorizontalSide = side === "left" || side === "right"
	const posKey = isHorizontalSide ? "x" : "y" as const
	const sizeKey = isHorizontalSide ? "width" : "height" as const

	const frames = frameIds.map(id => win.frames[id])

	const pinnedEdges = new Set<number>()
	if (pinnedEdgeCoordinates) {
		for (const coord of pinnedEdgeCoordinates) {
			pinnedEdges.add(coord)
		}
	}

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

	// calculate new edges using proportional algo
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

	// if we have pinned edges, force them back to their original positions
	if (pinnedEdges.size > 0) {
		for (let i = 0; i < uniqueEdges.length; i++) {
			if (pinnedEdges.has(uniqueEdges[i])) {
				newEdges[i] = uniqueEdges[i]
			}
		}

		// check for flipped frames - a non-pinned edge should not cross a pinned edge
		for (let i = 0; i < uniqueEdges.length - 1; i++) {
			const startEdge = uniqueEdges[i]
			const endEdge = uniqueEdges[i + 1]
			const newStart = newEdges[i]
			const newEnd = newEdges[i + 1]

			if (newStart > newEnd) {
				const hasPinnedEdge = pinnedEdges.has(startEdge) || pinnedEdges.has(endEdge)
				if (hasPinnedEdge) {
					return new KnownError(LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES, `Redistribution would cause frames to cross pinned edge at ${pinnedEdges.has(startEdge) ? startEdge : endEdge}.`, { problemEdgeCoordinates: [startEdge, endEdge] })
				}
			}
		}
	}

	const minSize = skipMinSizeCheck ? 0 : settings.minSizeScaled[sizeKey]
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
