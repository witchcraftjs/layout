import { unreachable } from "@alanscodelog/utils/unreachable.js"

import { getEdgeOrientation } from "./getEdgeOrientation.js"

import {
	type Edge,
	type EdgeSide, type LayoutFrame
} from "../types/index.js"


export function getEdgeSide<T extends boolean = false>(
	frame: LayoutFrame,
	edge: Edge,
	allowNone: T = false as T
): EdgeSide | (T extends true ? undefined : never) {
	const edgeDir = getEdgeOrientation(edge)
	if (edgeDir === "horizontal") {
		if (edge.startY === frame.y) return "top"
		else if (edge.startY === frame.y + frame.height) return "bottom"
	} else if (edgeDir === "vertical") {
		if (edge.startX === frame.x) return "left"
		else if (edge.startX === frame.x + frame.width) return "right"
	}
	if (!allowNone) {
		unreachable()
	}
	return undefined as any
}
