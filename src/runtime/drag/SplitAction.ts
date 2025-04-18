import type { DragState, IDragAction } from "./types.js"

import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { createSplitDecoFromDrag } from "../layout/createSplitDecoFromDrag.js"
import { frameSplit } from "../layout/frameSplit.js"
import { getFrameSplitInfo } from "../layout/getFrameSplitInfo.js"
import type { SplitDeco } from "../types/index.js"
import type { KnownError } from "../utils/KnownError.js"

export type SplitInfo = Exclude<ReturnType<typeof getFrameSplitInfo>, KnownError>
export class SplitAction implements IDragAction {
	name = "split" as const

	state: {
		allowed: false
		res: SplitInfo | undefined
		cacheKey: string | undefined
	} | {
		allowed: true
		res: SplitInfo
		cacheKey: string | undefined
	} = {} as any // this is initialized by `this.reset()`

	handleEvent: (e: PointerEvent | KeyboardEvent, state: DragState) => boolean
	updateSplitDecos: (decos: SplitDeco[]) => void
	hooks: {
		onStart?: () => void
		onCancel?: () => void
		onError?: (e: KnownError) => void
	}

	constructor(
		handleEvent: SplitAction["handleEvent"],
		updateSplitDecos: SplitAction["updateSplitDecos"],
		hooks: SplitAction["hooks"] = {}
	) {
		this.handleEvent = handleEvent
		this.updateSplitDecos = updateSplitDecos
		this.hooks = hooks
		this.reset()
	}

	reset(): void {
		this.state = {
			allowed: false,
			res: undefined,
			cacheKey: undefined
		}
		this.updateSplitDecos([])
	}

	updateDecos(state: DragState): void {
		const {
			win,
			isDragging,
			dragHoveredFrame,
			dragDirections,
			draggingEdges,
			dragPoint
		} = state
		if (isDragging && this.state.allowed && dragHoveredFrame && draggingEdges.length === 1) {
			const oppositeOrientation = oppositeSide(getEdgeOrientation(draggingEdges[0]))
			const deco = createSplitDecoFromDrag(
				win.frames,
				dragHoveredFrame,
				dragDirections[oppositeOrientation]!,
				dragPoint!
			)
			this.updateSplitDecos([deco])
		} else {
			this.updateSplitDecos([])
		}
	}

	canHandleRequest(e: PointerEvent | KeyboardEvent, state: DragState): boolean {
		const { draggingEdges } = state
		if (draggingEdges.length !== 1) return false
		if (this.handleEvent(e, state)) {
			this.hooks.onStart?.()
			return true
		}
		this.reset()
		return false
	}

	calculateSplitRequest(state: DragState): boolean {
		const {
			dragHoveredFrame,
			dragDirections,
			draggingEdges,
			dragPoint
		} = state
		const oppositeOrientation = oppositeSide(getEdgeOrientation(draggingEdges[0]))
		const canSplit = getFrameSplitInfo(
			dragHoveredFrame!,
			dragDirections[oppositeOrientation]!,
			dragPoint!
		)
		if (!(canSplit instanceof Error)) {
			this.state.allowed = true
			this.state.res = canSplit
			this.state.cacheKey = dragHoveredFrame?.id
			return true
		} else {
			this.hooks.onError?.(canSplit)
			return false
		}
	}

	onDragChange(
		_type: "start" | "end" | "move",
		_e: PointerEvent | undefined,
		state: DragState
	): true {
		const { dragHoveredFrame } = state
		let ok = false
		if (dragHoveredFrame) {
			if (this.state.cacheKey === dragHoveredFrame.id) {
				this.updateDecos(state)
				return true
			}
			ok = this.calculateSplitRequest(state)
		}
		this.updateDecos(state)
		if (!ok) {
			this.state.allowed = false
		}
		return true
	}

	onDragApply(state: DragState): boolean {
		if (this.state.res) {
			// this only caches once per frame hovered over
			// so the drag position is outdated
			this.calculateSplitRequest(state)
			frameSplit(state.win, this.state.res!)
		}
		this.reset()
		return true
	}

	cancel(): void {
		this.reset()
		this.hooks.onCancel?.()
	}
}
