import type { LayoutFrame } from "../types/index.js"

export function debugFrame(frame: LayoutFrame): string {
	const f = frame
	return `id: ${f.id.slice(0,4)}, x:  ${f.x}, y: ${f.y}, w: ${f.width}, h: ${f.height}`
}

