import { getMaxInt } from "../settings.js"
import type { BaseSquare } from "../types/index.js"

export function getShapeSquareCss(
	obj: BaseSquare,
	pad?: string
): {
	x: string
	y: string
	width: string
	height: string
} {
	const unscale = getMaxInt() / 100
	const css = {
		x: `${obj.x / unscale}%`,
		y: `${obj.y / unscale}%`,
		width: `${obj.width / unscale}%`,
		height: `${obj.height / unscale}%`
	}
	if (pad) {
		css.width = `calc(${css.width} - (${pad}*2))`
		css.height = `calc(${css.height}  - (${pad}*2))`
		css.x = `calc(${css.x} + (${pad}))`
		css.y = `calc(${css.y} + (${pad}))`
	}

	return css
}
