import type { LayoutFrame } from "../types/index.js"

export function cloneFrame(frame: LayoutFrame): LayoutFrame {
	return { ...frame }
}
