import { castType } from "@alanscodelog/utils/castType.js"
import { keys } from "@alanscodelog/utils/keys.js"
import { unreachable } from "@alanscodelog/utils/unreachable.js"

import { getMaxInt } from "../settings.js"
import {
	type Direction,
	type Edge, type ExtendedDirection, type LayoutFrame
} from "../types/index.js"


export function getResizeLimit<TDir extends ExtendedDirection>(
	edge: Edge,
	touchingFrames: LayoutFrame[],
	dir: TDir,
	amount: number,
	margin: number
): TDir extends "horizontal" ? Record<"left" | "right", number> : TDir extends "vertical" ? Record<"up" | "down", number> : number {
	const limits: Partial<Record<Direction, number>> = dir === "horizontal"
		? { left: -Infinity, right: Infinity }
		: dir === "vertical"
			? { up: -Infinity, down: Infinity }
			: { [dir]: dir === "up" || dir === "left" ? -Infinity : Infinity }

	if (amount === 0) {
		throw new Error("Amount cannot be zero.")
	}
	castType<ExtendedDirection>(dir)

	for (const frame of touchingFrames) {
		if (dir === "vertical" || dir === "up") {
			if (frame.y < edge.startY) {
				limits.up = Math.max(limits[dir]!, frame.y)
			}
		}
		if (dir === "vertical" || dir === "down") {
			if (frame.y >= edge.startY) {
				limits.down = Math.min(limits[dir]!, frame.y + frame.height)
			}
		}
		if (dir === "horizontal" || dir === "left") {
			if (frame.x < edge.startX) {
				limits.left = Math.max(limits[dir]!, frame.x)
			}
		}
		if (dir === "horizontal" || dir === "right") {
			if (frame.x >= edge.startX) {
				limits.right = Math.min(limits[dir]!, frame.x + frame.width)
			}
		}
	}

	for (const key of keys(limits)) {
		// this happens when we drag window edges
		if (limits[key] === -Infinity) limits[key] = 0
		if (limits[key] === Infinity) limits[key] = getMaxInt()
			
		limits[key]! += (dir === "left" || dir === "up" ? margin : -margin)
	}
	if (dir === "horizontal" || dir === "vertical") return limits as any
	return limits[dir] as any
}
