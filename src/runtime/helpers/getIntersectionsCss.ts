import { getMaxInt } from "../settings.js"
import type {
	IntersectionEntry, PointCss
} from "../types/index.js"

export function getIntersectionsCss(entries: IntersectionEntry[],
	{
		intersectionWidth = `var(--layoutIntersectionWidth, 8px)`,
		/** How much to shift the intersections by when it's not on a four corner intersection. Otherwise it tends to look ugly because it overlaps one of the frame edges, this shifts it away from it. */
		shiftAmount = `var(--layoutIntersectionShiftAmount, 2px)`
	}: {
		intersectionWidth?: string
		shiftAmount?: string
	} = {}
): (PointCss & { _shifted?: true }) [] {
	const unscale = getMaxInt() / 100
	return entries.map(entry => {
		const point = entry.point
		const css = {
			x: `${point.x / unscale}%`,
			y: `${point.y / unscale}%`,
			width: intersectionWidth,
			height: intersectionWidth,
			translate: `translate(-50%, -50%)`
		}
		if (shiftAmount) {
			const shift = getIntersectionShift(entry)
			if (shift.includes("left")) {
				css.x = `calc(${css.x} + ${shiftAmount})`
			} else if (shift.includes("right")) {
				css.x = `calc(${css.x} - ${shiftAmount})`
			}
			if (shift.includes("top")) {
				css.y = `calc(${css.y} + ${shiftAmount})`
			} else if (shift.includes("bottom")) {
				css.y = `calc(${css.y} - ${shiftAmount})`
			}
			if (shift !== "") {
				;(css as any)._shifted = true
			}
		}
		return css
	})
}

function getIntersectionShift(intersection: IntersectionEntry): string {
	let shift = ""
	if (intersection.sharedEdges.horizontal.length === 1) {
		const edge = intersection.sharedEdges.horizontal[0]
		if (edge.endX === intersection.point.x) {
			shift += "right"
		} else if (edge.startX === intersection.point.x) {
			shift += "left"
		}
	}
	if (intersection.sharedEdges.vertical.length === 1) {
		const edge = intersection.sharedEdges.vertical[0]
		if (edge.endY === intersection.point.y) {
			shift += "bottom"
		} else if (edge.startY === intersection.point.y) {
			shift += "top"
		}
	}
	return shift
}
