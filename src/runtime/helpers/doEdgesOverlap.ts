import { getEdgeOrientation } from "./getEdgeOrientation.js"
import { inRange } from "./inRange.js"
import { isEdgeParallel } from "./isEdgeParallel.js"

import type { Edge, Orientation } from "../types/index.js"

export function doEdgesOverlap(
	edgeA: Edge,
	edgeB: Edge,
	dir?: Orientation,
	/** If you pass inclusive true it will also match edges that start where the other edge ends or vice versa. */
	inclusive: boolean = false
): boolean {
	dir ??= getEdgeOrientation(edgeA)
	if (!isEdgeParallel(edgeA, edgeB)) return false
	if (dir === "horizontal") {
		if (edgeA.startY !== edgeB.startY) return false
		const leftMost = edgeA.startX <= edgeB.startX ? edgeA : edgeB
		const rightMost = edgeB === leftMost ? edgeA : edgeB
		const startOverlaps = inRange(leftMost.endX, rightMost.startX, rightMost.endX, inclusive)
		const endOverlaps = inRange(rightMost.startX, leftMost.startX, leftMost.endX, inclusive)
		return startOverlaps || endOverlaps
	} else {
		if (edgeA.startX !== edgeB.startX) return false
		const topMost = edgeA.startY <= edgeB.startY ? edgeA : edgeB
		const bottomMost = edgeB === topMost ? edgeA : edgeB
		const startOverlaps = inRange(topMost.endY, bottomMost.startY, bottomMost.endY, inclusive)
		const endOverlaps = inRange(bottomMost.startY, topMost.startY, topMost.endY, inclusive)
		return startOverlaps || endOverlaps
	}
}
