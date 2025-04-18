import { findFramesTouchingEdge } from "./findFramesTouchingEdge.js"

import { clampNumber } from "../helpers/clampNumber.js"
import { frameToEdges } from "../helpers/frameToEdges.js"
import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { getResizeLimit } from "../helpers/getResizeLimit.js"
import { getVisualEdges } from "../helpers/getVisualEdges.js"
import { isWindowEdge } from "../helpers/isWindowEdge.js"
import { resizeByEdge } from "../helpers/resizeByEdge.js"
import { getMarginSize } from "../settings.js"
import type { Edge, ExtendedDirection, LayoutFrame, LayoutWindow, Size } from "../types/index.js"

export function resizeFrame(
	win: LayoutWindow,
	frame: LayoutFrame,
	dir: ExtendedDirection,
	/** Scaled */
	distance: Size,
	/** Scaled */
	minSize: Size = getMarginSize()
): boolean {
	const originalDistance = distance
	const frameEdges = frameToEdges(frame)
	const resizeEdges = dir === "up"
		? [frameEdges.top]
		: dir === "down"
			? [frameEdges.bottom]
			: dir === "vertical"
				? [frameEdges.top, frameEdges.bottom]
				: dir === "left"
					? [frameEdges.left]
					: dir === "right"
						? [frameEdges.right]
						: [frameEdges.left, frameEdges.right]

	let divideDistance = false
	if (resizeEdges.length === 2) {
		divideDistance = true
	}
	let ok = false
	const edgeDirection = getEdgeOrientation(resizeEdges[0])
	const margin = minSize[edgeDirection === "vertical" ? "width" : "height"]

	let dist = distance[edgeDirection === "vertical" ? "width" : "height"]
	if (divideDistance) { dist /= 2 }

	for (const resizeEdge of resizeEdges) {
		// simple resize dir
		const _dir = dir === "horizontal"
			? (resizeEdge === frameEdges.left ? "left" : "right")
			: dir === "vertical"
				? (resizeEdge === frameEdges.top ? "up" : "down")
				: dir

		let frameEdge = resizeEdge

		const visualEdges = getVisualEdges(Object.values(win.frames), { separateByDir: true })
		const edges = visualEdges[edgeDirection]

		const isWinEdge = isWindowEdge(frameEdge, edgeDirection)

		if (isWinEdge) {
			if (edgeDirection === "horizontal") {
				frameEdge = frameEdge === frameEdges.top ? frameEdges.bottom : frameEdges.top
			} else {
				frameEdge = frameEdge === frameEdges.right ? frameEdges.left : frameEdges.right
			}
		}

		let foundEdge: Edge | undefined
		for (const edge of edges) {
			if (edgeDirection === "horizontal") {
				const isInRange = frameEdge.startX >= edge.startX && frameEdge.endX <= edge.endX
				if (isInRange && frameEdge.startY === edge.startY) {
					foundEdge = edge
					break
				}
			} else {
				const isInRange = frameEdge.startY >= edge.startY && frameEdge.endY <= edge.endY
				if (isInRange && frameEdge.startX === edge.startX) {
					foundEdge = edge
					break
				}
			}
		}

		if (!foundEdge) {
			distance = originalDistance
			continue
		}

		const touchingFrames = findFramesTouchingEdge(foundEdge, Object.values(win.frames))?.map(_ => _.frame)
		const posX = foundEdge.startX + (_dir === "left" ? -dist : dist)
		const posY = foundEdge.startY + (_dir === "up" ? -dist : dist)

		const wantedPos = edgeDirection === "horizontal" ? posY : posX
		const limitInDir = getResizeLimit(foundEdge, touchingFrames, _dir, dist, margin)
		const reverseClamp = (_dir === "right" || _dir === "down")
		const pos = reverseClamp
			? clampNumber(wantedPos, -Infinity, limitInDir)
			: clampNumber(wantedPos, limitInDir, Infinity)
		resizeByEdge(touchingFrames, foundEdge, _dir, pos, dist)
		ok = true
	}
	return ok
}
