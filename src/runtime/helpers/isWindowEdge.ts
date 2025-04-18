import { getEdgeOrientation } from "./getEdgeOrientation.js"

import { getMaxInt } from "../settings.js"
import type { Edge, Orientation } from "../types/index.js"

export function isWindowEdge(edge: Edge, edgeDirection?: Orientation): boolean {
	edgeDirection ??= getEdgeOrientation(edge)
	const max = getMaxInt()
	return (edgeDirection === "vertical" && (edge.startX === 0 || edge.startX === max))
		|| (edgeDirection === "horizontal" && (edge.startY === 0 || edge.startY === max))
}
