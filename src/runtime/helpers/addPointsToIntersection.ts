import { type Intersections, type Point } from "../types/index.js"


export function addPointsToIntersection(intersections: Intersections, points: Point[]): void {
	for (const point of points) {
		intersections[point.x] ??= {}
		intersections[point.x][point.y] ??= 0
		intersections[point.x][point.y]++
	}
}
