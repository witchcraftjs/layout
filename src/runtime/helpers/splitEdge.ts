import { last } from "@alanscodelog/utils/last.js"

import { type Edge, type Orientation } from "../types/index.js"


export function splitEdge(edge: Edge, edgeDirection: Orientation, splits: number[]): Edge[] {
	const startKey = edgeDirection === "horizontal" ? "startX" : "startY"
	const endKey = edgeDirection === "horizontal" ? "endX" : "endY"
	const newEdges: Edge[] = []
	if (splits.length === 0) throw new Error("There must be at least one split position.")
	for (const [i, splitPos] of splits.entries()) {
		if (i === 0) {
			newEdges.push({ ...edge, [startKey]: edge[startKey], [endKey]: splitPos })
		} else {
			const prevEdge = newEdges[i - 1]
			newEdges.push({ ...prevEdge, [startKey]: prevEdge[endKey], [endKey]: splitPos })
		}
	}
	const prevEdge = last(newEdges)
	if (prevEdge[endKey] !== edge[endKey]) {
		newEdges.push({ ...prevEdge, [startKey]: prevEdge[endKey], [endKey]: edge[endKey] })
	}
	return newEdges
}
