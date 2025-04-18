import type { Direction, Orientation } from "../types/index.js"

export function dirToOrientation(dir: Direction): Orientation {
	switch (dir) {
		case "left":
		case "right":
			return "horizontal"
		case "up":
		case "down":
			return "vertical"
	}
}
