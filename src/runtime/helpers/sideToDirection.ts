import type { Direction, EdgeSide } from "../types/index.js"

/** Converts a side to a direction (relative to a frame's center) */

export function sideToDirection(side: EdgeSide): Direction {
	switch (side) {
		case "left":
		case "right":
			return side
		case "top":
			return "up"
		case "bottom":
			return "down"
	}
}
