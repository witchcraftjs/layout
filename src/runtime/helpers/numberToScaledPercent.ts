import { snapNumber } from "@alanscodelog/utils/snapNumber.js"

import { getMaxInt } from "../settings.js"

/**
 * Given a number (e.g. the x coordinate in px), and the max value it could be (e.g. the max width of it's container in px), returns it's position as a scaled percentage.
 *
 * ```
 * -----------
 * |    *    |
 * -----------
 *      |    ^100px
 *      ^ 50px
 * // returns 50 / 100 * scale or 50000 (50%)
 * ```
 */
export function numberToScaledPercent(num: number, max: number, scale: number = getMaxInt()): number {
	return snapNumber((num / max) * scale, 1)
}
