import { getMoveEdgeInfo } from "./getMoveEdgeInfo.js"
import { resizeByEdge } from "./resizeByEdge.js"

import { settings } from "../settings.js"
import type {
	Edge, LayoutFrame,
	Point,
	Size
} from "../types/index.js"

export function moveEdge(
	touchingFrames: LayoutFrame[] | undefined,
	edge: Edge | undefined,
	/** Window scaled/snaped position. See {@link toWindowCoord} */
	position: Point,
	margin: Size = settings.minSizeScaled
): void {
	if (!edge || !touchingFrames) return
	const result = getMoveEdgeInfo(touchingFrames, edge, position, margin)
	if (result instanceof Error) return
	const { pos, dir, distance } = result
	resizeByEdge(touchingFrames, edge, dir, pos, distance)
}
