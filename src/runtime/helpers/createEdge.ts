import { type Edge } from "../types/index.js"

/**
 * Ensures the edge given is sorted (start < end coordinates). Mutates given edge if it's not.
 */

export function createEdge(edge: Edge): Edge {
	if (edge.startX > edge.endX) {
		const end = edge.endX
		edge.endX = edge.startX
		edge.startX = end
	}
	if (edge.startY > edge.endY) {
		const end = edge.endY
		edge.endY = edge.startY
		edge.startY = end
	}
	return edge
}
