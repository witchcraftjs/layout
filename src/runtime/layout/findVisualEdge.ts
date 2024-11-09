import { containsEdge } from "../helpers/containsEdge.js"
import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { type Edge } from "../types/index.js"


export function findVisualEdge(visualEdges: Edge[], edge: Edge): Edge | undefined {
	const edgeDirection = getEdgeOrientation(edge)
	for (const visualEdge of visualEdges) {
		if (containsEdge(visualEdge, edge, edgeDirection)) return visualEdge
	}
	return undefined
}
