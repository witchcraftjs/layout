import { settings } from "../settings.js"
import type { LayoutFrame } from "../types/index.js"

/**
 * Rotates the list of frames given by 90, 180, or 270 degrees around the 50% center.
 *
 * Used mainly in testing to catch issues with incorrect handling of the same scenario in different orientations.
 */
export function rotateLayout(frames: LayoutFrame[], rotation: 90 | 180 | 270) {
	const sides: NonNullable<LayoutFrame["docked"]>[] = ["top", "right", "bottom", "left"]
	const shift = rotation / 90

	for (const frame of frames) {
		const { x, y, width, height, docked } = frame

		if (docked) {
			const currentIndex = sides.indexOf(docked)
			if (currentIndex !== -1) {
				frame.docked = sides[(currentIndex + shift) % 4]
			}
		}
		switch (rotation) {
			case 90:
				frame.x = settings.maxInt - (y + height)
				frame.y = x
				frame.width = height
				frame.height = width
				break
			case 180:
				frame.x = settings.maxInt - (x + width)
				frame.y = settings.maxInt - (y + height)
				frame.width = width
				frame.height = height
				break
			case 270:
				frame.x = y
				frame.y = settings.maxInt - (x + width)
				frame.width = height
				frame.height = width
				break
			default:
				throw new Error(`Unknown rotation ${rotation}`)
		}
	}
}
