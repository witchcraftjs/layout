import { oppositeSide } from "../helpers/index.js"
import { toCoord } from "../helpers/toCoord.js"
import type { Direction,Orientation, Point } from "../types/index.js"

export class DragDirectionStore {
	constructor(
		public hooks: {
			onUpdate: (direction?: Direction) => void
		}
	) {}

	lastPoint: Point | undefined

	dragDirection: Direction | undefined = undefined

	coord: "x" | "y" | undefined

	lesser: { x: Direction, y: Direction } = {
		x: "left",
		y: "up",
	}

	greater: { x: Direction, y: Direction } = {
		x: "right",
		y: "down",
	}

	reset(): void {
		this.lastPoint = undefined
		this.dragDirection = undefined
		this.coord = undefined
	}

	setOrientation(orientation: Orientation): void {
		this.coord = toCoord(oppositeSide(orientation))
	}

	update(point: Point): boolean {
		if (!this.coord) {
			throw new Error("Forgot to setOrientation.")
		}
		if (this.lastPoint) {
			const diff = point[this.coord] - this.lastPoint[this.coord]
			if (diff === 0) return false
			if (diff > 0) this.dragDirection = this.greater[this.coord]
			if (diff < 0) this.dragDirection = this.lesser[this.coord]
		}
		this.lastPoint = point
		this.hooks.onUpdate(this.dragDirection)
		return true
	}
}
