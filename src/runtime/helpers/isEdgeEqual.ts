import { getEdgeOrientation } from "./getEdgeOrientation.js"

import type { Edge, Orientation } from "../types/index.js"

export function isEdgeEqual(edgeA: Edge, edgeB: Edge, orientation?: Orientation): boolean {
	orientation ??= getEdgeOrientation(edgeA)
	if (orientation === "horizontal") {
		return edgeA.startX === edgeB.startX && edgeB.endX === edgeA.endX && edgeA.startY === edgeB.startY && edgeB.endY === edgeA.endY
	} else {
		return edgeA.startX === edgeB.startX && edgeB.endX === edgeA.endX && edgeA.startY === edgeB.startY && edgeB.endY === edgeA.endY
	}
}
