import type { Size } from "../types/index.js"

export function isSizeAboveMin(
	size: Size,
	min: Size
): boolean {
	return size.width >= min.width && size.height >= min.height
}
