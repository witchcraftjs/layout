import { getEdgeOrientation } from "./getEdgeOrientation.js"

import type { Edge } from "../types/index.js"

export function getEdgeLength(edge: Edge): number {
	const orientation = getEdgeOrientation(edge)
	return orientation === "horizontal"
		? Math.abs(edge.endX - edge.startX)
		: Math.abs(edge.endY - edge.startY)
}
