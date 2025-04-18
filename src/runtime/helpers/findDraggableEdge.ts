import { containsEdge } from "./containsEdge.js"
import { getEdgeOrientation } from "./getEdgeOrientation.js"
import { isEdgeEqual } from "./isEdgeEqual.js"

import type { Edge, Orientation } from "../types/index.js"

export function findDraggableEdge(
	edge: Edge,
	edges: Edge[],
	/** Whether the edge must match exactly and does not "contain/touch" another frame. */
	exact: boolean = true,
	edgeOrientation?: Orientation
): Edge | undefined {
	edgeOrientation ??= getEdgeOrientation(edge)
	for (const otherEdge of edges) {
		const didFindEdge = exact
			? isEdgeEqual(edge, otherEdge, edgeOrientation)
			: containsEdge(edge, otherEdge, edgeOrientation)
		if (didFindEdge) {
			return otherEdge
		}
	}
	return undefined
}
