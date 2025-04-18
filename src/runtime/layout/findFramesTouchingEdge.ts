import { containsEdge } from "../helpers/containsEdge.js"
import { dirToSide } from "../helpers/dirToSide.js"
import { frameToEdges } from "../helpers/frameToEdges.js"
import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { inRange } from "../helpers/inRange.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { toCoord } from "../helpers/toCoord.js"
import type { Direction, Edge, EdgeSide, LayoutFrame, Point } from "../types/index.js"

/**
 * Given an edge or visualEdge (which might touch/contain several frame edges, see {@link getVisualEdges }), returns the frame edges that match the given criteria. If no criteria is given, just returns all touching frames.
 *
 * Useful, for implementing drag related features.
 *
 * A visual explanation of the options:
 * ```
 * frames (A,B,C,D):
 * ┌──────────────────┐
 * │A       ╏B        │
 * │        ╏         │
 * ├────────╏         │
 * │C       ╏─────────┤
 * │        ╏D        │
 * │        ╏         │
 * │      < ╏ > searchDirections
 * │        ╏         │
 * │     + referencePoint*
 * │        ╏         │
 * └──────────────────┘
 *          ^visualEdge
 *
 * Note the reference point is not on the line. The coordinate used depends on the orientation of the visualEdge.
 * ```
 * So given the middle visual edge, the point `+` and the right search direction, would return the left edge of frame D.
 *
 * Given the left direction instead it would return C.
 *
 * Given no point, and the right direction it would return B and D.
 */

export function findFramesTouchingEdge(
	edge: Edge,
	frames: LayoutFrame[],
	criteria: {
		/**
		 * If a position (e.g. a cursor position) is given, only edges within the corresponding horizontal/vertical range will be returned.
		 *
		 * For example, if the visual edge is vertical, the function will only return edges that contain the y position, ignoring the x position. See the function documentation for a visual example.
		 */
		referencePoint?: Point
		/**
		 * Several frames can lay to either side of a visual edge. This limits the directions in which to look. Otherwise we look in the directions perpendicular to the visual edge.
		 *
		 * See the function documentation for a visual example.
		 */
		searchDirections?: Direction[]
	} = {}
): ({ edge: Edge, frame: LayoutFrame, side: EdgeSide })[] {
	const visualEdge = edge
	const res: ({ edge: Edge, frame: LayoutFrame, side: EdgeSide })[] = []
	const visualEdgeDirection = getEdgeOrientation(visualEdge)

	const searchDirections = criteria.searchDirections
		?? (visualEdgeDirection === "horizontal"
			? ["up", "down"]
			: ["left", "right"])

	// the side opposite to the direction is the one touching the visual edge
	const frameSearchSides = searchDirections.map(dir => oppositeSide(dirToSide(dir)))

	const coord = toCoord(visualEdgeDirection)
	const coordUpper: "X" | "Y" = coord.toUpperCase() as any

	for (const frame of frames) {
		const frameEdges = frameToEdges(frame, frameSearchSides)
		const edges = Object.entries(frameEdges)

		for (const [side, edge] of edges as [EdgeSide, Edge][]) {
			if (containsEdge(edge, visualEdge, visualEdgeDirection)) {
				if (criteria.referencePoint) {
					const isInRange = inRange(criteria.referencePoint[coord], edge[`start${coordUpper}`], edge[`end${coordUpper}`])
					if (isInRange) {
						res.push({ edge, frame, side })
					}
				} else {
					res.push({ edge, frame, side })
				}
			}
		}
	}
	return res
}
