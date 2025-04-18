import type {
	Direction,
	Edge, LayoutFrame
} from "../types/index.js"

export function resizeByEdge(
	touchingFrames: LayoutFrame[],
	edge: Edge,
	dir: Direction,
	newPos: number,
	distance: number
): void {
	if (distance === 0) return

	for (const frame of touchingFrames) {
		if (dir === "up" || dir === "down") {
			const isAbove = frame.y < edge!.startY

			if (isAbove) {
				frame.height = newPos - frame.y
			} else {
				// careful order
				frame.height = (frame.y + frame.height) - newPos
				frame.y = newPos
			}
		} else {
			const isLeft = frame.x < edge!.startX

			if (isLeft) {
				frame.width = newPos - frame.x
			} else {
				// careful order
				frame.width = (frame.x + frame.width) - newPos
				frame.x = newPos
			}
		}
	}
	if (dir === "up" || dir === "down") {
		edge!.startY = newPos
		edge!.endY = newPos
	} else {
		edge!.startX = newPos
		edge!.endX = newPos
	}
}
