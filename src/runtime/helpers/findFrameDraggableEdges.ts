import { findDraggableEdge } from "./findDraggableEdge.js"
import { frameToEdges } from "./frameToEdges.js"
import { isWindowEdge } from "./isWindowEdge.js"
import { sideToOrientation } from "./sideToOrientation.js"

import type {
	Edge,
	EdgeSide, LayoutFrame
} from "../types/index.js"

export function findFrameDraggableEdges(
	frame: LayoutFrame,
	edges: Edge[],
	/** See {@link findDraggableEdge} */
	exact: boolean = true,
	sides: EdgeSide[] = ["left", "right", "top", "bottom"]
): { edge: Edge, side: EdgeSide }[] | undefined {
	const frameEdges = frameToEdges(frame)
	const res = []
	for (const side of sides) {
		const edge = frameEdges[side]
		const edgeDirection = sideToOrientation(side)
		const isWinEdge = isWindowEdge(edge, edgeDirection)

		if (isWinEdge) continue
		const maybeEdge = findDraggableEdge(edge, edges, exact, edgeDirection)

		if (maybeEdge) res.push({ edge: maybeEdge, side })
	}
	if (res.length > 0) return res
	return undefined
}
