import { keys } from "@alanscodelog/utils/keys"

import type { LayoutFrame } from "../types/index.js"

const builtinProperties = ["id", "x", "y", "width", "height", "docked", "collapsed"]
export function debugFrame(frame: LayoutFrame): string {
	const f = frame
	const otherProperties = keys(f).filter(k => !builtinProperties.includes(k)).map(k => `${k}: ${f[k]}`)
	const otherPropertiesString = otherProperties.length > 0 ? `, ${otherProperties.join(", ")}` : ""
	return `id: ${f.id.slice(0, 4)}, x:  ${f.x}, y: ${f.y}, w: ${f.width}, h: ${f.height}\ndocked: ${f.docked}, collapsed: ${f.collapsed}${otherPropertiesString}`
}
