import { getEdgeSharedDirection } from "./getEdgeSharedDirection.js"

import type { Edge, Orientation } from "../types/index.js"

export function isEdgeParallel(edgeA: Edge, edgeB: Edge, dir?: Orientation): boolean {
	const sharedDir = getEdgeSharedDirection(edgeA, edgeB)
	if (dir === undefined) return sharedDir !== false
	if (dir === sharedDir) return true
	return false
}
