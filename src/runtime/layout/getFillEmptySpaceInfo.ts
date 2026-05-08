import { doEdgesOverlap } from "../helpers/doEdgesOverlap.js"
import { frameToEdges } from "../helpers/frameToEdges.js"
import { getEdgeLength } from "../helpers/getEdgeLength.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { getMaxInt } from "../settings.js"
import { type Edge, type EdgeSide, LAYOUT_ERROR, type LayoutFrame, type LayoutWindow } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"
/**
 * Finds a frame to fill the empty space left behind by a moved/empty frame (e.g. a dragged frame's original position).
 *
 * Returns a {@link LayoutChange} with the information necessary information..
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 *
 * Examples where * would be the empty space:
 *
 * Selection priority:
 * 1. Prefer frames listed in preferredFrames (for dragging these are the dragged and target frames).
 * ┌─────┬─────┐
 * │A    │*    │
 * ├─────┼─────┤
 * │C    │B    │
 * └─────┴─────┘
 *
 * Without preferredFrames set to B, A would be preferred as it shares the shortest edge with the empty space.
 *
 * ┌─────┬─────┐
 * │A    │B    │
 * ├─────┤     │
 * │C    │     │
 * └─────┴─────┘
 *
 * In a more complex example:
 *
 * ┌─────┬─────┬─────┐
 * │A    │*    │C    │
 * │     │     ├─────┤
 * │     │     │D    │
 * └─────┴─────┴─────┘
 *
 * If preferredFrames is C OR D (usually it's both but it might only be one, just take all other frames along that edge if they end at the empty frames end).
 *
 * ┌─────┬──────────┐
 * │A    │C         │
 * │     ├──────────┤
 * │     │D         │
 * └─────┴──────────┘
 *
 * And then in the following we would not be able to even expand C or D so we would not be able to satisfy the preference:
 *
 * ┌─────┬─────┬─────┐
 * │A    │*    │C    │
 * │     │     ├─────┤
 * │     │     │     │
 * │     ├─────┤D    │
 * │     │B    │     │
 * └─────┴─────┴─────┘
 *
 * 2. Prefer the shortest frame that shares an exact edge. Taking the previous example it would be B:
 *
 * ┌─────┬─────┬─────┐
 * │A    │B    │C    │
 * │     │     ├─────┤
 * │     │     │     │
 * │     │     │D    │
 * │     │     │     │
 * └─────┴─────┴─────┘
 */
export function getFillEmptySpaceInfo(
	win: LayoutWindow,
	emptyFrame: Omit<LayoutFrame, "id">,
	preferredFrames: string[] = [],
	skipFrames: string[] = []
): LayoutChange | KnownError<typeof LAYOUT_ERROR.NO_FILL_CANDIDATES> {
	const emptyEdges = frameToEdges(emptyFrame as LayoutFrame)
	const vacHeight = emptyFrame.height
	const vacWidth = emptyFrame.width

	type Candidate = {
		frame: LayoutFrame
		frameSide: EdgeSide
		emptySide: EdgeSide
		edgeLength: number
		exact: boolean
	}

	type SideGroup = {
		candidates: Candidate[]
		skip: boolean
		totalLength: number
		hasExact: boolean
		hasPreferred: boolean
	}

	const candidatesBySides = new Map<EdgeSide, SideGroup>()

	for (const frame of Object.values(win.frames)) {
		if (skipFrames.includes(frame.id)) continue
		const frameEdges = frameToEdges(frame)

		for (const frameSide of ["top", "bottom", "left", "right"] as EdgeSide[]) {
			const frameEdge = frameEdges[frameSide]
			const emptyOppositeSide = oppositeSide(frameSide)
			const emptyEdge = emptyEdges[emptyOppositeSide]

			if (candidatesBySides.get(emptyOppositeSide)?.skip) continue

			const exact = (
				frameEdge.startX === emptyEdge.startX
				&& frameEdge.startY === emptyEdge.startY
				&& frameEdge.endX === emptyEdge.endX
				&& frameEdge.endY === emptyEdge.endY
			)

			if (exact || doEdgesOverlap(frameEdge, emptyEdge, undefined, false)) {
				if (!candidatesBySides.has(emptyOppositeSide)) {
					candidatesBySides.set(emptyOppositeSide, { candidates: [], skip: false, totalLength: 0, hasExact: false, hasPreferred: false })
				}

				const group = candidatesBySides.get(emptyOppositeSide)!

				// for shared edges if any of the candidates exceed the empty edge we can't use that side
				// so we mark it as skip so we can skip all other candidates on that side
				if (!exact) {
					const isVertical = frameEdge.startX === emptyEdge.startX
					const extendsBeyond = isVertical
						? (frameEdge.startY < emptyEdge.startY || frameEdge.endY > emptyEdge.endY)
						: (frameEdge.startX < emptyEdge.startX || frameEdge.endX > emptyEdge.endX)

					if (extendsBeyond) {
						group.skip = true
					}
				}
				const len = getEdgeLength(frameEdge)
				group.totalLength += len
				if (exact) group.hasExact = true
				if (preferredFrames.includes(frame.id)) group.hasPreferred = true
				group.candidates.push({ frame, frameSide, emptySide: emptyOppositeSide, edgeLength: len, exact })
			}
		}
	}

	const entries = [...candidatesBySides.values()]
	const preferredSides = entries.filter(c => c.hasPreferred && !c.skip).sort((a, b) => a.totalLength - b.totalLength)
	const fallbackSides = entries.filter(c => !c.hasPreferred && !c.skip).sort((a, b) => a.totalLength - b.totalLength)

	if (preferredSides.length === 0 && fallbackSides.length === 0) return new KnownError(LAYOUT_ERROR.NO_FILL_CANDIDATES, `No fill candidates found.`, {})

	const chosenCandidates = preferredSides.length > 0 ? preferredSides[0].candidates : fallbackSides[0].candidates

	const result: LayoutFrame[] = []
	for (const chosen of chosenCandidates) {
		const { frame, frameSide } = chosen
		const updated = { ...frame }

		switch (frameSide) {
			case "top":
				updated.y -= vacHeight
				updated.height += vacHeight
				if (clamp && updated.y + updated.height > getMaxInt()) updated.height = getMaxInt() - updated.y
				break
			case "bottom":
				updated.height += vacHeight
				if (clamp && updated.y + updated.height > getMaxInt()) updated.height = getMaxInt() - updated.y
				break
			case "left":
				updated.x -= vacWidth
				updated.width += vacWidth
				if (clamp && updated.x + updated.width > getMaxInt()) updated.width = getMaxInt() - updated.x
				break
			case "right":
				updated.width += vacWidth
				if (clamp && updated.x + updated.width > getMaxInt()) updated.width = getMaxInt() - updated.x
				break
		}

		result.push(updated)
	}

	return { modified: result, created: [], deleted: [] }
}
