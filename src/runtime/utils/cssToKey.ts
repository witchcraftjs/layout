import type { BaseSquareCss } from "../types/index.js"

/**
 * Converts a css object to a key that can be used in a vue loop.
 */
export function cssToKey(css: BaseSquareCss): string {
	return `${css.x},${css.y},${css.width},${css.height},${css.translate}`
}
