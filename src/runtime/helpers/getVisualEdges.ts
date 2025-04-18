import { multisplice, MULTISPLICE_ITEM } from "@alanscodelog/utils/multisplice"

import { addPointsToIntersection } from "./addPointsToIntersection.js"
import { assertEdgeSorted } from "./assertEdgeSorted.js"
import { containsEdge } from "./containsEdge.js"
import { doEdgesOverlap } from "./doEdgesOverlap.js"
import { frameToEdges } from "./frameToEdges.js"
import { frameToPoints } from "./frameToPoints.js"
import { inRange } from "./inRange.js"
import { splitEdge } from "./splitEdge.js"
import { unionEdges } from "./unionEdges.js"

import { getMaxInt } from "../settings.js"
import type {
	Edge,
	Intersections,
	LayoutFrame, Orientation
} from "../types/index.js"

/**
 * Returns the "visual" edges that can be dragged.
 *
 * Visual edges are a combination of all edges shared by frames that must be moved together.
 *
 * For example, if we have two frames A and B, they share the center edge, and the function would return this single edge (unless `includeWindowEdges` is true).
 *
 * ```
 * ┌──┰──┐
 * │A ┃B │ returns   ┃
 * └──┸──┘
 * ```
 * Or in this example, we would get two edges:
 * - The one shared by A, B, and C, because no frame edge sharing this edge can without also moving the other frames touching the edge.
 * - The one shared by A and B.
 *```
 * ┌──┰──┐
 * │A ┃C │              ┃
 * ┝━━┫  │ returns   ━━ ┃
 * │B ┃  │              ┃
 * └──┸──┘
 * ```
 *
 * And here, we get four edges, because all four can be moved on their own (moving the edge would only affect the two frames sharing that edge).
 *```
 * ┌──┰──┐
 * │A ┃C │             ┃
 * ┝━━╋━━┥ returns   ━━ ━━
 * │B ┃D │             ┃
 * └──┸──┘
 * ```
 *
 */
export function getVisualEdges<T extends boolean = false>(
	frames: LayoutFrame[],
	{
		separateByDir = false as T,
		includeWindowEdges = false
	}: {
		/**
		 * Whether the result is separated into horizontal/vertical edges or not.
		 *
		 * @default false
		 */
		separateByDir?: T
		/**
		 * Whether to include edges along the window edges.
		 *
		 * @default false
		 */
		includeWindowEdges?: boolean
	} = {}
): T extends true ? Record<Orientation, Edge[]> : Edge[] {
	let extVertEdges: Edge[] = []
	let extHorzEdges: Edge[] = []
	const intersections: Intersections = {
		// x: {y: count}
	}
	const max = getMaxInt()
	for (const frame of frames) {
		const frameEdges = frameToEdges(frame)
		addPointsToIntersection(intersections, Object.values(frameToPoints(frame)))

		secondlabel: for (const edge of Object.values(frameEdges)) {
			const dir = edge === frameEdges.left || edge === frameEdges.right
				? "vertical"
				: "horizontal"

			const startKey = dir === "vertical" ? "startX" : "startY"
			const endKey = dir === "vertical" ? "endX" : "endY"
			const arr = dir === "vertical" ? extVertEdges : extHorzEdges
			const indexes = []
			const edges = []
			for (const [i, e] of arr.entries()) {
				if (containsEdge(edge, e, dir)) {
					continue secondlabel
				}
				if (doEdgesOverlap(e, edge, dir)) {
					indexes.push(i)
					edges.push(e)
				}
			}
			if (indexes.length > 0) {
				multisplice(arr, indexes, 1)
				edges.push(edge)
				const newEdge = unionEdges(edges, dir)
				arr.push(newEdge)
			} else if (includeWindowEdges || (edge[startKey] !== 0 && edge[endKey] !== max)) {
				arr.push(edge)
			}
		}
	}
	const changesV: Record<number, Edge[]> = {}
	for (const [i, edge] of extVertEdges.entries()) {
		const possibleIntersections = intersections[edge.startX]
		assertEdgeSorted(edge)
		if (possibleIntersections) {
			const splits = Object.keys(possibleIntersections).filter(_y => {
				const y = Number.parseInt(_y, 10)
				const isIntersection = possibleIntersections[_y as any as number] === 4
				return isIntersection && inRange(y, edge.startY, edge.endY)
			}).map(_ => Number.parseInt(_, 10))
			if (splits.length === 0) continue
			changesV[i] = splitEdge(extVertEdges[i], "vertical", splits)
		}
	}
	extVertEdges = multisplice(
		extVertEdges,
		Object.keys(changesV) as any,
		1,
		Object.values(changesV) as any,
		{ insert: MULTISPLICE_ITEM.MATCH_INDEX }
	).array.flat()

	const changesH: Record<number, Edge[]> = {}
	for (const [i, edge] of extHorzEdges.entries()) {
		const splits = Object.keys(intersections)
			.filter(x => intersections[x as any as number][edge.startY] === 4)
			.map(_ => Number.parseInt(_, 10))
		if (splits.length === 0) continue
		changesH[i] = splitEdge(extHorzEdges[i], "horizontal", splits)
	}
	extHorzEdges = multisplice(
		extHorzEdges,
		Object.keys(changesH) as any,
		1,
		Object.values(changesH) as any,
		{ insert: MULTISPLICE_ITEM.MATCH_INDEX }
	).array.flat()

	if (separateByDir) {
		return { vertical: extVertEdges, horizontal: extHorzEdges } satisfies Record<Orientation, Edge[]> as any
	}

	return extVertEdges.concat(extHorzEdges) satisfies Edge[] as any
}
