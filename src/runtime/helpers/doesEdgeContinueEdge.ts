import { getEdgeOrientation } from "./getEdgeOrientation.js"
import { isEdgeParallel } from "./isEdgeParallel.js"

import type { Edge, Orientation } from "../types/index.js"

export function doesEdgeContinueEdge(edgeA: Edge, edgeB: Edge, dir?: Orientation): boolean {
	dir ??= getEdgeOrientation(edgeA)
	if (!isEdgeParallel(edgeA, edgeB)) return false
	if (dir === "horizontal") {
		if (edgeA.startY !== edgeB.startY) return false
		const leftMost = edgeA.startX <= edgeB.startX ? edgeA : edgeB
		const rightMost = edgeB === leftMost ? edgeA : edgeB
		return leftMost.endX === rightMost.startX
	} else {
		if (edgeA.startX !== edgeB.startX) return false
		const topMost = edgeA.startY <= edgeB.startY ? edgeA : edgeB
		const bottomMost = edgeB === topMost ? edgeA : edgeB
		return topMost.endY === bottomMost.startY
	}
}
