import type { Direction, Orientation, Point } from "../types/index.js"

export class DragDirectionStore {
	hooks: {
		onUpdate: (directions: Record<Orientation, Direction | undefined>) => void
	}

	constructor(
		hooks: DragDirectionStore["hooks"]
	) {
		this.hooks = hooks
	}

	lastPoint: Point | undefined

	dragDirection: Record<Orientation, Direction | undefined> = {} as any

	lesser: { x: Direction, y: Direction } = {
		x: "left",
		y: "up"
	}

	greater: { x: Direction, y: Direction } = {
		x: "right",
		y: "down"
	}

	reset(): void {
		this.lastPoint = undefined
		this.dragDirection = {} as any
	}

	update(point: Point): boolean {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const newXDirection = this.getDragDirection("x", point)
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const newYDirection = this.getDragDirection("y", point)
		let changed = false
		if (newXDirection) {
			this.dragDirection.horizontal = newXDirection
		}
		if (newYDirection) {
			this.dragDirection.vertical = newYDirection
		}

		if (this.lastPoint?.x !== point.x || this.lastPoint?.y !== point.y) {
			this.lastPoint = point
			changed = true
		}

		if (!changed) return false
		this.hooks.onUpdate(this.dragDirection)
		return true
	}

	getDragDirection(coord: "x" | "y", point: Point): Direction | false {
		if (!this.lastPoint) return false
		const diff = point[coord] - this.lastPoint![coord]
		if (diff > 0) return this.greater[coord]
		if (diff < 0) return this.lesser[coord]
		return false
	}
}
