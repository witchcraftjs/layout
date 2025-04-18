import type { HasOpposite } from "../types/index.js"

/** Converts the given side/dir into a coordinate key (x/y) */
export function toCoord<T extends HasOpposite>(dir: T): T extends "left" | "right" | "horizontal" ? "x" : "y" {
	switch (dir) {
		case "left":
		case "right":
		case "horizontal":
			return "x" satisfies "x" | "y" as any
		default:
			return "y" satisfies "x" | "y" as any
	}
}
