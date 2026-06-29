import { pushIfNotIn } from "@alanscodelog/utils/pushIfNotIn"
import { walk } from "@alanscodelog/utils/walk"

import { getMoveEdgeInfo } from "../helpers/getMoveEdgeInfo.js"
import { settings } from "../settings.js"
import type { LayoutChange, LayoutWindow } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"


/**
 * Experimental frame "relaxation" algorithm.
 *
 * Useful for expanding frames that have gotten too small. Used internally by {@link getUpdateWindowSizeInfo}
 */
export function getRelaxFramesInfo(
	win: LayoutWindow,
	passes: number = 2
): LayoutChange<any> {
	win = walk(win, undefined, { save: true })

	const toExtract: string[] = []
	const framesSortedHorizontal = Object.values(win.frames)
		.filter(f => f.width > 0 && f.width < settings.minSizeScaled.width && !f.collapsed)
		.sort((a, b) => a.x - b.x)
	const framesSortedVertical = Object.values(win.frames)
		.filter(f => f.height > 0 && f.height < settings.minSizeScaled.height && !f.collapsed)
		.sort((a, b) => a.y - b.y)

	for (let pass = 0; pass < passes; pass++) {
		let anyChanged = false

		for (const orientation of ["horizontal", "vertical"] as const) {
			const sizeKey = orientation === "horizontal" ? "width" : "height" as const
			const posKey = orientation === "horizontal" ? "x" : "y" as const
			const minSize = settings.minSizeScaled[sizeKey]

			const frames = orientation === "horizontal" ? framesSortedHorizontal : framesSortedVertical

			if (frames.length === 0) { continue }


			for (const frame of frames) {
				const deficit = minSize - frame[sizeKey]


				if (deficit <= 0) continue

				// try expanding the right/bottom edge first
				const endEdge = {
					startX: frame.x + frame.width,
					startY: frame.y + frame.height,
					endX: frame.x + frame.width,
					endY: frame.y + frame.height
				}

				const touchingEnd = Object.values(win.frames).filter(f =>
					f.id !== frame.id
					&& f[posKey] === frame[posKey] + frame[sizeKey]
					&& !f.collapsed
				)

				if (touchingEnd.length > 0) {
					const targetPos = {
						x: orientation === "horizontal" ? frame.x + frame.width + deficit : frame.x,
						y: orientation === "vertical" ? frame.y + frame.height + deficit : frame.y
					}


					const result = getMoveEdgeInfo(touchingEnd, endEdge, targetPos, settings.minSizeScaled, true, true)


					if (!(result instanceof KnownError) && result.distance > 0) {
						const expandBy = Math.min(deficit, result.distance)

						frame[sizeKey] += expandBy
						for (const f of touchingEnd) {
							f[posKey] += expandBy
							f[sizeKey] -= expandBy
						}
						pushIfNotIn(toExtract, [frame.id, ...touchingEnd.map(f => f.id)])
						anyChanged = true

						if (frame[sizeKey] >= minSize) continue
					}
				}

				// if still too small, try expanding the left/top edge
				if (frame[sizeKey] < minSize) {
					const remainingDeficit = minSize - frame[sizeKey]

					const startEdge = {
						startX: frame.x,
						startY: frame.y,
						endX: frame.x,
						endY: frame.y
					}

					const touchingStart = Object.values(win.frames).filter(f =>
						f.id !== frame.id
						&& f[posKey] + f[sizeKey] === frame[posKey]
						&& !f.collapsed
					)


					if (touchingStart.length > 0) {
						const targetPos = {
							x: orientation === "horizontal" ? frame.x - remainingDeficit : frame.x,
							y: orientation === "vertical" ? frame.y - remainingDeficit : frame.y
						}


						const result = getMoveEdgeInfo(touchingStart, startEdge, targetPos, settings.minSizeScaled, true, true)


						if (!(result instanceof KnownError) && result.distance > 0) {
							const expandBy = Math.min(remainingDeficit, result.distance)

							frame[posKey] -= expandBy
							frame[sizeKey] += expandBy
							for (const f of touchingStart) {
								f[sizeKey] -= expandBy
							}
							pushIfNotIn(toExtract, [frame.id, ...touchingStart.map(f => f.id)])
							anyChanged = true
						}
					}
				}
			}
		}

		if (!anyChanged) { break }
	}

	return {
		modified: toExtract.map(id => win.frames[id]),
		created: [],
		deleted: []
	}
}
