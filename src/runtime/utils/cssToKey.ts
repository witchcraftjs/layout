import type { BaseRectCss } from "../types/index.js"

/**
 * Converts a css object to a key that can be used in a vue loop.
 */
export function cssToKey(css: BaseRectCss): string {
	return `${css.x},${css.y},${css.width},${css.height},${css.translate}`
}
