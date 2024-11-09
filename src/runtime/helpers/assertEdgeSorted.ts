import { getEdgeOrientation } from "./getEdgeOrientation.js"

import { type Edge } from "../types/index.js"


export function assertEdgeSorted(edge: Edge): void {
	const dir = getEdgeOrientation(edge)
	if ((dir === "horizontal" && edge.startX > edge.endX) ||
		(dir === "vertical" && edge.startY > edge.endY)) {
		throw new Error("Edge start/end is revered.")
	}
}
