import { getEdgeOrientation } from "./getEdgeOrientation.js"

import { type Edge } from "../types/index.js"


export function getEdgeSharedDirection(edgeA: Edge, edgeB: Edge): false | "horizontal" | "vertical" {
	const edgeDirectionA = getEdgeOrientation(edgeA)
	const edgeDirectionB = getEdgeOrientation(edgeB)
	if (edgeDirectionA !== edgeDirectionB) return false
	return edgeDirectionA
}
