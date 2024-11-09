import { frameToPoints } from "./frameToPoints.js"

import { type Edge, type EdgeSide, type LayoutFrame } from "../types/index.js"


export function frameToEdges(frame: LayoutFrame, sides?: EdgeSide[]): Record<EdgeSide, Edge> {
	const { tl, tr, bl, br } = frameToPoints(frame)
	// no need for createEdge, we can assure they're sorted
	// by always starting on the top/left and ending on the bottom/right
	const right = { startX: tr.x, startY: tr.y, endX: br.x, endY: br.y }
	const left = { startX: tl.x, startY: tl.y, endX: bl.x, endY: bl.y }
	const bottom = { startX: bl.x, startY: bl.y, endX: br.x, endY: br.y }
	const top = { startX: tl.x, startY: tl.y, endX: tr.x, endY: tr.y }
	if (sides) {
		const res: Record<EdgeSide, Edge> = {} as any
		for (const side of sides) {
			res[side] = side === "right"
				? right : side === "left"
					? left : side === "bottom"
						? bottom : top
		}
		return res
	}
	return {
		right,
		left,
		bottom,
		top,
	}
}
