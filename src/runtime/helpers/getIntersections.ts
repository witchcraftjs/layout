import { keys } from "@alanscodelog/utils/keys.js"

import { addPointsToIntersection } from "./addPointsToIntersection.js"
import { edgeToPoints } from "./edgeToPoints.js"

import {
	type Edge, type IntersectionEntry,
	type Intersections
} from "../types/index.js"


export function getIntersections(edges: Edge[]): IntersectionEntry[] {
	const intersections: Intersections = {
		// x: {y: count}
	}
	for (const edge of edges) {
		addPointsToIntersection(intersections, Object.values(edgeToPoints(edge)))
	}
	const points: IntersectionEntry[] = []
	for (const x of keys(intersections)) {
		for (const y of keys(intersections[x])) {
			points.push({ point: { x, y }, count: intersections[x][y] })
		}
	}
	return points
}
