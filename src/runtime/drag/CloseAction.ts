import type { DragState, IDragAction } from "./types.js"

import { dirToOrientation } from "../helpers/dirToOrientation.js"
import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { closeFrames } from "../layout/closeFrames.js"
import { findFramesTouchingEdge } from "../layout/findFramesTouchingEdge.js"
import { getCloseFrameInfo } from "../layout/getCloseFrameInfo.js"
import type { CloseDeco } from "../types/index.js"
import type { KnownError } from "../utils/KnownError.js"

export type CloseInfo = Exclude<ReturnType<typeof getCloseFrameInfo>, KnownError>

export class CloseAction implements IDragAction {
	name = "close" as const

	state: {
		allowed: true
		force: boolean
		res: CloseInfo
		cacheKey: string | undefined
	} | {
		allowed: false
		force: boolean
		res: CloseInfo | undefined
		cacheKey: string | undefined
	} = {} as any // this is initialized by this.reset()

	handleEvent: (e: PointerEvent | KeyboardEvent, state: DragState) => boolean | "force"
	updateCloseDecos: (decos: CloseDeco[]) => void
	hooks: {
		onStart?: (active: boolean) => void
		onCancel?: () => void
		onError?: (e: KnownError) => void
	}

	constructor(
		handleEvent: CloseAction["handleEvent"],
		updateCloseDecos: CloseAction["updateCloseDecos"],
		hooks: CloseAction["hooks"] = {}
	) {
		this.handleEvent = handleEvent
		this.updateCloseDecos = updateCloseDecos
		this.hooks = hooks
		this.reset()
	}

	reset(): void {
		this.state = {
			allowed: false,
			force: false,
			res: undefined,
			cacheKey: undefined
		}
		this.updateCloseDecos([])
	}

	updateDecos(state: DragState): void {
		const {
			isDragging
		} = state
		if (isDragging && this.state.allowed && this.state.res) {
			const { force } = this.state
			const decos = this.state.res.deletedFrames.map(_ => ({ id: _.id, type: "close" as const, force }))
			this.updateCloseDecos(decos)
		} else {
			this.updateCloseDecos([])
		}
	}

	canHandleRequest(e: PointerEvent | KeyboardEvent, state: DragState): boolean {
		const { draggingEdges } = state
		if (draggingEdges.length !== 1) return false
		const res = this.handleEvent(e, state)
		if (res === "force") {
			this.state.force = true
		} else {
			this.state.force = false
		}
		if (res) {
			this.hooks.onStart?.(true)
			return true
		}
		this.reset()
		return false
	}

	onDragChange(
		_type: "start" | "end" | "move",
		_e: PointerEvent | undefined,
		state: DragState
	): boolean {
		const {
			touchingFramesArrays,
			dragDirections,
			isDragging,
			draggingEdges,
			visualEdges,
			frames,
			isDraggingFromWindowEdge
		} = state
		const oppositeOrientation = oppositeSide(getEdgeOrientation(draggingEdges[0]))
		let ok = false
		if (isDragging && draggingEdges.length === 1) {
			const res = findFramesTouchingEdge(
				draggingEdges[0],
				touchingFramesArrays[0],
				{
					// referencePoint: dragPoint.value, // if force pick smallest frame?
					searchDirections: [dragDirections[oppositeOrientation]!]
				}
			)
			if (res.length > 0) {
				const orientation = dirToOrientation(dragDirections[oppositeOrientation]!)
				const sizeKey = orientation === "horizontal" ? "width" : "height"
				const smallestFrameSize = Math.min(...res.map(_ => _.frame[sizeKey]))
				const frame = res.find(_ => _.frame[sizeKey] === smallestFrameSize)!.frame!
				const cacheKey = `${frame.id}-${dragDirections[oppositeOrientation]!}`
				if (this.state.allowed) {
					if (this.state.cacheKey === cacheKey) {
						this.updateDecos(state)
						return true
					}
				}
				const closeInfo = getCloseFrameInfo(Object.values(frames), visualEdges, frame, dragDirections[oppositeOrientation]!, "dir", this.state.force)
				if (!(closeInfo instanceof Error)) {
					this.state.allowed = true
					this.state.res = closeInfo
					this.state.cacheKey = cacheKey
					ok = true
				} else {
					this.hooks.onError?.(closeInfo)
				}
			}
		}
		this.updateDecos(state)
		if (!ok) {
			this.state.allowed = false
		}
		return !isDraggingFromWindowEdge
	}

	onDragApply(state: DragState): boolean {
		if (this.state.res) {
			const { deletedFrames, modifiedFrames } = this.state.res
			const win = state.win
			closeFrames(win, deletedFrames, modifiedFrames)
			this.reset()
			return true
		}
		return false
	}

	cancel(): void {
		this.reset()
		this.hooks.onCancel?.()
	}
}
