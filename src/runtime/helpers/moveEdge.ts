import { getMoveEdgeInfo } from "./getMoveEdgeInfo.js"
import { resizeByEdge } from "./resizeByEdge.js"

import { getMarginSize } from "../settings.js"
import {
	type Edge, type LayoutFrame,
	type Point,
	type Size
} from "../types/index.js"


export function moveEdge(
	touchingFrames: LayoutFrame[] | undefined,
	edge: Edge | undefined,
	/** Window scaled/snaped position. See {@link toWindowCoord} */
	position: Point,
	margin: Size = getMarginSize()
): void {
	if (!edge || !touchingFrames) return
	const { pos, dir, distance } = getMoveEdgeInfo(touchingFrames, edge, position, margin)
	resizeByEdge(touchingFrames, edge, dir, pos, distance)
}
