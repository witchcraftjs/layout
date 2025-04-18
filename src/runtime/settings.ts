import type { Point, Size } from "./types/index.js"

const g = {
	SCALE: 3,
	maxInt: 100 * (10 ** 3),
	SNAP_PERCENTAGE_X: 0.5,
	SNAP_PERCENTAGE_Y: 0.5,
	snapPoint: { x: Math.round(0.5 * (10 ** 3)), y: Math.round(0.5 * (10 ** 3)) },
	MARGIN_PERCENTAGE_WIDTH: 10 ** 3,
	MARGIN_PERCENTAGE_HEIGHT: 10 ** 3,
	marginSize: { width: 10 ** 3, height: 10 ** 3 }
}
export const globalOptions = g
// todo think of better way :/

export function setScale(scale: number): void {
	const max = 100 * (10 ** scale)
	if (!Number.isSafeInteger(max)) {
		throw new TypeError("Scale too high. Precision will be lost!")
	}
	g.SCALE = scale
	g.maxInt = max
}

export function getMaxInt(): number {
	return g.maxInt
}

export function setSnapPercentage(snapPercentage: number | Point): void {
	if (typeof snapPercentage === "number") {
		g.SNAP_PERCENTAGE_X = snapPercentage
		g.SNAP_PERCENTAGE_Y = snapPercentage
	} else {
		g.SNAP_PERCENTAGE_X = snapPercentage.x
		g.SNAP_PERCENTAGE_Y = snapPercentage.y
	}
	g.snapPoint = {
		x: Math.round(g.SNAP_PERCENTAGE_X * (10 ** g.SCALE)),
		y: Math.round(g.SNAP_PERCENTAGE_Y * (10 ** g.SCALE))
	}
}

export function getSnapPoint(): Readonly<Point> {
	return g.snapPoint
}

export function setMarginPercentage(margin: number | Size): void {
	if (typeof margin === "number") {
		g.MARGIN_PERCENTAGE_WIDTH = margin
		g.MARGIN_PERCENTAGE_HEIGHT = margin
	} else {
		g.MARGIN_PERCENTAGE_WIDTH = margin.width
		g.MARGIN_PERCENTAGE_HEIGHT = margin.height
	}
	g.marginSize = {
		width: Math.round(g.MARGIN_PERCENTAGE_WIDTH * (10 ** g.SCALE)),
		height: Math.round(g.MARGIN_PERCENTAGE_HEIGHT * (10 ** g.SCALE))
	}
}

export function getMarginSize(): Readonly<Size> {
	return g.marginSize
}
