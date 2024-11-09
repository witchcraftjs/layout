import type { LayoutWindow, PxPos, PxSize } from "../types/index.js"

const props = ["pxWidth", "pxHeight", "pxX", "pxY"] as const
export function updateWindowWithEvent(win: LayoutWindow, event: PxPos & PxSize): void {
	for (const prop of props) {
		if (event[prop] && win[prop] !== event[prop]) {
			win[prop] = event[prop]
		}
	}
}
