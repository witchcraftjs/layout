import { DragActionHandler } from "./DragActionHandler.js"

import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { applyFrameChanges } from "../layout/applyFrameChanges.js"
import { createSplitDecoFromDrag } from "../layout/createSplitDecoFromDrag.js"
import { getFrameSplitInfo } from "../layout/getFrameSplitInfo.js"
import type { ActionDragChangeResult, DragState, IDragAction, LayoutShape, Point, SplitDeco } from "../types/index.js"
import type { KnownError } from "../utils/KnownError.js"

export type SplitInfo = Exclude<ReturnType<typeof getFrameSplitInfo>, KnownError>

// note that we dont annotateEdges because is possible to forexample drag from a window edge to a frame that can be split, moving over a collapsed frame that was sharing the edge but can't be split

export class SplitAction implements IDragAction {
	name = "split" as const

	state: {
		allowed: true
		res: SplitInfo
		lastPoint: Point | undefined
		lastReturn: undefined
	} | {
		allowed: false
		res: SplitInfo | undefined
		lastPoint: Point | undefined
		lastReturn: ActionDragChangeResult | undefined
	} = {} as any // this is initialized by `this.reset()`

	debug: boolean | string = false
	textHints: { actions: string[], errors: string[] } = { actions: [], errors: [] }
	splitHints: {
		action: string
		transformError: (e: KnownError) => string
	} = {
		action: "Hold Alt to Split",
		transformError: e => e.message
	}

	handleEvent: (e: PointerEvent | KeyboardEvent, state: DragState) => boolean
		= (e: PointerEvent | KeyboardEvent, state: DragState) => e.altKey || state.isDraggingFromWindowEdge

	modifyDecos: (shapes: SplitDeco[]) => void = () => { }
	hooks: {
		onStart?: () => void
		onCancel?: () => void
		onError?: (e: KnownError) => void
	}

	constructor(
		handleEvent?: SplitAction["handleEvent"],
		/** Modify the created decos before they are rendered. */
		modifyDecos?: SplitAction["modifyDecos"],
		hooks: SplitAction["hooks"] = {},
		config?: {
			debug?: boolean | string
			splitHints?: Partial<SplitAction["splitHints"]>
		}
	) {
		if (handleEvent !== undefined) this.handleEvent = handleEvent
		if (modifyDecos !== undefined) this.modifyDecos = modifyDecos

		this.hooks = hooks
		this.reset()
		if (config?.debug) this.debug = true
		if (config?.splitHints?.action) this.splitHints.action = config.splitHints.action
		if (config?.splitHints?.transformError) this.splitHints.transformError = config.splitHints.transformError
	}

	reset(): void {
		this.state = {
			allowed: false,
			res: undefined,
			lastPoint: undefined,
			lastReturn: undefined
		}
		this.modifyDecos([])
	}

	getDecos(state: DragState): SplitDeco[] {
		let decos: SplitDeco[] = []
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
			decos = [deco]
		}
		this.modifyDecos(decos)
		return decos
	}

	canHandleRequest(e: PointerEvent | KeyboardEvent, state: DragState): boolean {
		const { draggingEdges } = state
		if (draggingEdges.length !== 1) return false
		this.setTextHints(state.isDragging === "edge" ? true : undefined)
		if (this.handleEvent(e, state)) {
			this.hooks.onStart?.()
			return true
		}
		this.reset()
		return false
	}

	setTextHints(result: true | SplitInfo | KnownError | undefined): void {
		if (result === undefined) {
			this.textHints.actions = []
			this.textHints.errors = []
		} else if (result instanceof Error) {
			this.textHints.actions = []
			this.textHints.errors = [this.splitHints.transformError(result)]
		} else {
			this.textHints.actions = [this.splitHints.action]
			this.textHints.errors = []
		}
	}

	getTextHints(type: "start" | "move" | "end"): {
		actions: string[]
		errors: string[]
	} {
		if (type === "end") { this.setTextHints(undefined) }
		return this.textHints
	}

	calculateSplitRequest(state: DragState): boolean {
		const {
			dragHoveredFrame,
			dragDirections,
			draggingEdges,
			dragPoint,
			win
		} = state
		const oppositeOrientation = oppositeSide(getEdgeOrientation(draggingEdges[0]))
		const originalDragHoveredFrame = win.frames[dragHoveredFrame!.id]
		const canSplit = getFrameSplitInfo(
			originalDragHoveredFrame!,
			dragDirections[oppositeOrientation]!,
			dragPoint!
		)
		this.setTextHints(canSplit)
		if (!(canSplit instanceof Error)) {
			this.state.allowed = true
			this.state.res = canSplit
			this.state.lastPoint = dragPoint ? { ...dragPoint } : undefined
			return true
		} else {
			this.hooks.onError?.(canSplit)
			this.state.lastPoint = undefined
			this.state.allowed = false
			return false
		}
	}

	onDragChange(
		_type: "start" | "end" | "move",
		_e: PointerEvent | undefined,
		state: DragState
	): ActionDragChangeResult {
		const { dragHoveredFrame } = state
		let ok = false
		if (dragHoveredFrame) {
			if (this.state.lastPoint?.x === state.dragPoint?.x && this.state.lastPoint?.y === state.dragPoint?.y && this.state.lastReturn) {
				return this.state.lastReturn!
			}
			ok = this.calculateSplitRequest(state)
		}
		const decos = this.getDecos(state)

		if (!ok) {
			if (dragHoveredFrame && dragHoveredFrame.docked) {
				const errorDeco: LayoutShape = {
					type: "rect",
					data: {
						x: dragHoveredFrame.x,
						y: dragHoveredFrame.y,
						width: dragHoveredFrame.width,
						height: dragHoveredFrame.height
					},
					attrs: { class: "deco-split-error bg-red-500/50" }
				}
				this.state.lastReturn = { updateEdges: true, shapes: [errorDeco], showDragging: false }
				return this.state.lastReturn
			}
		}
		this.state.lastReturn = { updateEdges: false, shapes: decos.flatMap(_ => _.shapes), showDragging: false }
		return this.state.lastReturn
	}

	onDragApply(state: DragState): boolean {
		if (this.state.res && state.dragHoveredFrame) {
			// this only caches once per frame hovered over
			// so the drag position is outdated, we must recalculate
			const ok = this.calculateSplitRequest(state)
			if (ok) {
				if (this.debug) { DragActionHandler.debugState(this.name, "before", state, this.state, this.debug) }
				applyFrameChanges(state.win, this.state.res!)
				if (this.debug) { DragActionHandler.debugState(this.name, "after", state, this.state, this.debug) }
			}
		}
		this.reset()
		return true
	}

	cancel(): void {
		this.reset()
		this.hooks.onCancel?.()
	}
}
