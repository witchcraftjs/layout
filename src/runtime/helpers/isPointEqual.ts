import { type Point } from "../types/index.js"


export function isPointEqual(pointA: Point, pointB: Point): boolean {
	return pointA.x === pointB.x && pointA.y === pointB.y
}
