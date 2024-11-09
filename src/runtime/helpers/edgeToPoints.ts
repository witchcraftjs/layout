import { type Edge, type Point } from "../types/index.js"


export function edgeToPoints(edge: Edge): Point[] {
	return [{ x: edge.startX, y: edge.startY }, { x: edge.endX, y: edge.endY }]
}
