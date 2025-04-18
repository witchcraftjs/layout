import type { Size } from "../types/index.js"

export function isSizeEqual(sizeA: Size, sizeB: Size): boolean {
	return sizeA.width === sizeB.width && sizeA.height === sizeB.height
}
