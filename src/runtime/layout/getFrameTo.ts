import { getMaxInt } from "../settings.js"

import { type EdgeSide, type LayoutFrame } from "../types/index.js"


export function getFrameTo(
	side: EdgeSide,
	frame: LayoutFrame,
	frames: LayoutFrame[]
): LayoutFrame | undefined {
	const max = getMaxInt()
	if ((side === "top" && frame.y === 0) ||
		(side === "left" && frame.y === 0) ||
		(side === "right" && frame.x + frame.width === max) ||
		(side === "bottom" && frame.x + frame.height === max)) return undefined

	let candidate: LayoutFrame | undefined
	let candidateDistance = Infinity
	const midPointX = frame.x + Math.round(frame.width / 2)
	const midPointY = frame.y + Math.round(frame.height / 2)
	const dir = side === "top" || side === "bottom" ? "horizontal" : "vertical"
	const midPoint = dir === "horizontal" ? midPointX : midPointY
	for (const other of frames) {
		if (frame.id === other.id) continue
		const isOutOfRange = dir === "horizontal"
			? other.x + other.width <= frame.x || other.x >= frame.x + frame.width
			: other.y + other.height <= frame.y || other.y >= frame.y + frame.height
		if (isOutOfRange) continue

		const otherMidPoint = dir === "horizontal"
			? other.x + Math.round(other.width / 2)
			: other.y + Math.round(other.height / 2)
		const otherDist = Math.abs(midPoint - otherMidPoint)
		switch (side) {
			case "left":
				if (other.x + other.width !== frame.x) continue
				break
			case "right":
				if (other.x !== frame.x + frame.width) continue
				break
			case "top":
				if (other.y + other.height !== frame.y) continue
				break
			case "bottom":
				if (other.y !== frame.y + frame.height) continue
				break
		}
		if (otherDist < candidateDistance) {
			candidate = other
			candidateDistance = otherDist
		} else if (otherDist === candidateDistance && candidate) {
			// future customizable preference?
			if (dir === "vertical") {
				// prefer top
				if (other.y > candidate.y) {
					candidate = other
				}
			} else {
				// prefer left
				if (other.x > candidate.x) {
					candidate = other
				}
			}
		}
	}
	return candidate
}
