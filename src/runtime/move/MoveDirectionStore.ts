import type { Direction, Orientation, Point } from "../types/index.js"

export class MoveDirectionStore {
	hooks: {
		onUpdate: (directions: Record<Orientation, Direction | undefined>) => void
	}

	constructor(
		hooks: MoveDirectionStore["hooks"]
	) {
		this.hooks = hooks
	}

	lastPoint: Point | undefined

	moveDirection: Record<Orientation, Direction | undefined> = {} as any

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
		this.moveDirection = {} as any
	}

	update(point: Point): boolean {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const newXDirection = this.getMoveDirection("x", point)
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const newYDirection = this.getMoveDirection("y", point)
		let changed = false
		if (newXDirection) {
			this.moveDirection.horizontal = newXDirection
		}
		if (newYDirection) {
			this.moveDirection.vertical = newYDirection
		}

		if (this.lastPoint?.x !== point.x || this.lastPoint?.y !== point.y) {
			this.lastPoint = point
			changed = true
		}

		if (!changed) return false
		this.hooks.onUpdate(this.moveDirection)
		return true
	}

	getMoveDirection(coord: "x" | "y", point: Point): Direction | false {
		if (!this.lastPoint) return false
		const diff = point[coord] - this.lastPoint![coord]
		if (diff > 0) return this.greater[coord]
		if (diff < 0) return this.lesser[coord]
		return false
	}
}
