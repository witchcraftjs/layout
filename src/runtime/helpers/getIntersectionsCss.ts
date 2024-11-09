import { getMaxInt } from "../settings.js"
import {
	type IntersectionEntry, type PointCss
} from "../types/index.js"


export function getIntersectionsCss(points: IntersectionEntry[],
	{
		intersectionWidth = `var(--layoutIntersectionWidth, 3px)`,
	}: {
		intersectionWidth?: string
	} = {},
): PointCss[] {
	const unscale = getMaxInt() / 100
	return points.map(({ point }) => ({
		x: `${point.x / unscale}%`,
		y: `${point.y / unscale}%`,
		width: intersectionWidth,
		height: intersectionWidth,
		translate: `translate(-50%, -50%)`,
	}))
}
