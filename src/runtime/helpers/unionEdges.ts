import { last } from "@alanscodelog/utils/last.js"

import { type Edge, type Orientation } from "../types/index.js"


export function unionEdges(edges: Edge[], dir: Orientation): Edge {
	const startKey = dir === "horizontal" ? "startX" : "startY"
	const endKey = dir === "horizontal" ? "endX" : "endY"
	edges.sort((a, b) => a[startKey] - b[startKey])
	const newEdge = { ...edges[0], [startKey]: edges[0][startKey], [endKey]: last(edges)[endKey] }
	return newEdge
}
