import { type LayoutFrame } from "../types/index.js"


export function frameToPoints(frame: LayoutFrame): {
	tl: { x: number, y: number }
	tr: { x: number, y: number }
	bl: { x: number, y: number }
	br: { x: number, y: number }
} {
	const tl = { x: frame.x, y: frame.y }
	const tr = { x: frame.x + frame.width, y: frame.y }
	const bl = { x: frame.x, y: frame.y + frame.height }
	const br = { x: frame.x + frame.width, y: frame.y + frame.height }
	return { tl, tr, bl, br }
}
