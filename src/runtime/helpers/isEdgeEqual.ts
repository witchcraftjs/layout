import { getEdgeOrientation } from "./getEdgeOrientation.js"
import { isEdgeParallel } from "./isEdgeParallel.js"

import { type Edge, type Orientation } from "../types/index.js"


export function isEdgeEqual(edgeA: Edge, edgeB: Edge, orientation?: Orientation): boolean {
	if (orientation === undefined) {
		orientation = getEdgeOrientation(edgeA)
	}
	if (!isEdgeParallel(edgeA, edgeB)) return false
	if (orientation === "horizontal") {
		return edgeA.startY === edgeB.startY && edgeB.endY === edgeA.endY
	} else {
		return edgeA.startX === edgeB.startX && edgeB.endX === edgeA.endX
	}
}
