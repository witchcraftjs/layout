import { castType } from "@alanscodelog/utils"
import { keys } from "@alanscodelog/utils/keys"

import { addPointsToIntersection } from "./addPointsToIntersection.js"
import { edgeToPoints } from "./edgeToPoints.js"
import { getEdgeOrientation } from "./getEdgeOrientation.js"
import { inRange } from "./inRange.js"

import { getMaxInt } from "../settings.js"
import type {
	Edge, IntersectionEntry,
	Orientation,
	Point
} from "../types/index.js"

export function getIntersections(
	visualEdges: Edge[]
): IntersectionEntry[] {
	type Intersections = Record<number, Record<number, number>>
	const intersections: Intersections = {
		// x: {y: count}
	}
	for (const edge of visualEdges) {
		addPointsToIntersection(intersections, Object.values(edgeToPoints(edge)))
	}

	const points: IntersectionEntry[] = []
	const maxInt = getMaxInt()
	for (const x of keys(intersections)) {
		for (const y of keys(intersections[x])) {
			// careful, x and y are really strings
			castType<string>(x)
			castType<string>(y)
			const xInt = Number.parseInt(x, 10)
			const yInt = Number.parseInt(y, 10)
			const isWindowEdge = xInt === 0 || yInt === 0 || xInt === maxInt || yInt === maxInt
			const sharedEdges = findEdgesTouchingPoint(visualEdges, {
				x: xInt,
				y: yInt
			})
			points.push({
				point: { x: xInt, y: yInt },
				count: intersections[x][y],
				sharesEdge: sharedEdges.horizontal.length > 0 || sharedEdges.vertical.length > 0,
				sharedEdges,

				isWindowEdge

			})
		}
	}
	return points
}

function findEdgesTouchingPoint(
	edges: Edge[],
	point: Point,
	{
		firstOnly = false,
		orientation: direction = undefined,
		inclusive = true
	}: {
		orientation?: Orientation
		firstOnly?: boolean
		inclusive?: boolean
	} = {}
): { horizontal: Edge[], vertical: Edge[] } {
	const edgesContainingPoint: { horizontal: Edge[], vertical: Edge[] } = {
		horizontal: [],
		vertical: []
	}
	for (const edge of edges) {
		const orientation = getEdgeOrientation(edge)
		if (orientation === "horizontal" && (!direction || direction === "horizontal")) {
			if (edge.startY === point.y && inRange(point.x, edge.startX, edge.endX, inclusive)) {
				edgesContainingPoint.horizontal.push(edge)
				if (firstOnly) break
			}
		} else if (!direction || direction === "vertical") {
			if (edge.startX === point.x && inRange(point.y, edge.startY, edge.endY, inclusive)) {
				edgesContainingPoint.vertical.push(edge)
				if (firstOnly) break
			}
		}
	}
	return edgesContainingPoint
}
