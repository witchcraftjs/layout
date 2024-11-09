import { getEdgeOrientation } from "./getEdgeOrientation.js"

import { getMaxInt } from "../settings.js"
import {
	type Edge,
	type EdgeCss } from "../types/index.js"


export function getVisualEdgeCss(
	edge: Edge,
	{
		translate = true,
		edgeWidth = `var(--layoutEdgeWidth, 2px)`,
		padLongAxis,
		padShortAxis,
	}: {
		translate?: boolean
		edgeWidth?: string
		padLongAxis?: string
		padShortAxis?: string
	} = {}
): EdgeCss {
	const dir = getEdgeOrientation(edge)
	const unscale = getMaxInt() / 100
	const w = (edge.endX - edge.startX) / unscale
	const h = (edge.endY - edge.startY) / unscale
	const width = dir === "vertical" ? edgeWidth : `${w}%`
	const height = dir === "horizontal" ? edgeWidth : `${h}%`

	const x = `${edge.startX / unscale}%`
	const y = `${edge.startY / unscale}%`

	const xTranslate = dir === "vertical" ? "-50%" : "0"
	const yTranslate = dir === "horizontal" ? "-50%" : "0"

	const translation = translate ? `translate(${xTranslate}, ${yTranslate})` : ""
	const css = {
		x, y, width, height, translate: translation,
	}

	if (padLongAxis) {
		const axis = dir === "vertical" ? "height" : "width"
		const coord = dir === "vertical" ? "y" : "x"
		css[axis] = `calc(${css[axis]} - (${padLongAxis}*2))`
		css[coord] = `calc(${css[coord]} + (${padLongAxis}))`
	}
	if (padShortAxis) {
		const axis = dir === "vertical" ? "width" : "height"
		const coord = dir === "vertical" ? "x" : "y"
		css[axis] = `calc(${css[axis]} - (${padShortAxis}*2))`
		css[coord] = `calc(${css[coord]} + (${padShortAxis}))`
	}
	return css
}
