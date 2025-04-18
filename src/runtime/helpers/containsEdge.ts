import { getEdgeOrientation } from "./getEdgeOrientation.js"
import { isEdgeParallel } from "./isEdgeParallel.js"

import type { Edge, Orientation } from "../types/index.js"

export function containsEdge(edge: Edge, limitEdge: Edge, dir?: Orientation): boolean {
	dir ??= getEdgeOrientation(edge)
	if (!isEdgeParallel(edge, limitEdge)) return false
	if (dir === "horizontal") {
		if (limitEdge.startY !== edge.startY) return false
		return limitEdge.startX <= edge.startX && edge.endX <= limitEdge.endX
	} else {
		if (limitEdge.startX !== edge.startX) return false
		return limitEdge.startY <= edge.startY && edge.endY <= limitEdge.endY
	}
}
