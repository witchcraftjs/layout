import type { Direction, EdgeSide } from "../types/index.js"

export function dirToSide<T extends Direction>(dir: T): T extends "up" ? "top" : T extends "down" ? "bottom" : T extends "left" | "right" ? T : EdgeSide {
	if (dir === "up") return "top" satisfies EdgeSide as any
	if (dir === "down") return "bottom" satisfies EdgeSide as any
	return dir satisfies EdgeSide as any
}
