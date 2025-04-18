import type { EdgeSide, Orientation } from "../types/index.js"

export function sideToOrientation(dir: EdgeSide): Orientation {
	switch (dir) {
		case "left":
		case "right":
			return "vertical"
		case "top":
		case "bottom":
			return "horizontal"
	}
}
