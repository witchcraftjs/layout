import { type Edge, type Orientation } from "../types/index.js"


export function getEdgeOrientation(edge: Edge): Orientation {
	if (edge.startX === edge.endX) return "vertical"
	return "horizontal"
}
