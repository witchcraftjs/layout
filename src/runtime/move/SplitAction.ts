import { ActionHandler } from "./ActionHandler.js"

import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { applyFrameChanges } from "../layout/applyFrameChanges.js"
import { createSplitDecoFromDrag } from "../layout/createSplitDecoFromDrag.js"
import { getFrameSplitInfo } from "../layout/getFrameSplitInfo.js"
import type { ActionChangeResult, IAction, LayoutShape, MoveState, Point, SplitDeco } from "../types/index.js"
import type { KnownError } from "../utils/KnownError.js"

export type SplitInfo = Exclude<ReturnType<typeof getFrameSplitInfo>, KnownError>

// note that we dont annotateEdges because is possible to forexample drag from a window edge to a frame that can be split, moving over a collapsed frame that was sharing the edge but can't be split

export type DragChangeType = "start" | "move" | "end"

export class SplitAction implements IAction {
	name = "split" as const
	minDragDistance = 5

	state: {
		allowed: true
		res: SplitInfo
		lastPoint: Point | undefined
		lastReturn: undefined
	} | {
		allowed: false
		res: SplitInfo | undefined
		lastPoint: Point | undefined
		lastReturn: ActionChangeResult | undefined
	} = {} as any // this is initialized by `this.reset()`

	debug: boolean | string = false
	textHints: { actions: string[], errors: string[] } = { actions: [], errors: [] }
	splitHints: {
		actions: string[] | ((type: DragChangeType) => string[])
		transformError: (e: KnownError) => string
	} = {
		actions: ["Hold Alt to Split"],
		transformError: e => e.message
	}

	handleEvent: (e: PointerEvent | KeyboardEvent, state: MoveState) => boolean
		= (e: PointerEvent | KeyboardEvent, state: MoveState) => e.altKey || state.isMovingFromWindowEdge

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
			/** Minimum pixel distance the user must drag before the action is allowed (decos shown and action applied). Defaults to 5. */
			minDragDistance?: number
		}
	) {
		if (handleEvent !== undefined) this.handleEvent = handleEvent
		if (modifyDecos !== undefined) this.modifyDecos = modifyDecos

		this.hooks = hooks
		this.reset()
		if (config?.debug) this.debug = true
		if (config?.minDragDistance !== undefined) this.minDragDistance = config.minDragDistance
		if (config?.splitHints?.actions) this.splitHints.actions = config.splitHints.actions
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

	getDecos(state: MoveState): SplitDeco[] {
		let decos: SplitDeco[] = []
		const {
			win,
			isMoving,
			moveHoveredFrame,
			moveDirections,
			movingEdges,
			movePoint
		} = state
		if (isMoving && this.state.allowed && moveHoveredFrame && movingEdges.length === 1) {
			const oppositeOrientation = oppositeSide(getEdgeOrientation(movingEdges[0]))
			const deco = createSplitDecoFromDrag(
				win.frames,
				moveHoveredFrame,
				moveDirections[oppositeOrientation]!,
				movePoint!
			)
			decos = [deco]
		}
		this.modifyDecos(decos)
		return decos
	}

	canHandleRequest(e: PointerEvent | KeyboardEvent, state: MoveState): boolean {
		const { movingEdges } = state
		if (movingEdges.length !== 1) return false
		// hint should not be shown when dragging from window edge but we should still handle the event
		this.setTextHints(state.isMoving === "edge" && !state.isMovingFromWindowEdge ? true : undefined)
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
			this.textHints.actions = typeof this.splitHints.actions === "function"
				? this.splitHints.actions("move")
				: this.splitHints.actions

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

	calculateSplitRequest(state: MoveState): boolean {
		const {
			moveHoveredFrame,
			moveDirections,
			movingEdges,
			movePoint,
			win
		} = state
		const oppositeOrientation = oppositeSide(getEdgeOrientation(movingEdges[0]))
		const originalDragHoveredFrame = win.frames[moveHoveredFrame!.id]
		const canSplit = getFrameSplitInfo(
			originalDragHoveredFrame!,
			moveDirections[oppositeOrientation]!,
			movePoint!
		)
		this.setTextHints(state.isMoving === "edge" && !state.isMovingFromWindowEdge ? canSplit : undefined)
		if (!(canSplit instanceof Error)) {
			this.state.allowed = true
			this.state.res = canSplit
			this.state.lastPoint = movePoint ? { ...movePoint } : undefined
			return true
		} else {
			this.hooks.onError?.(canSplit)
			this.state.lastPoint = undefined
			this.state.allowed = false
			return false
		}
	}

	onMoveChange(
		type: "start" | "end" | "move",
		_e: PointerEvent | undefined,
		state: MoveState
	): ActionChangeResult {
		const { moveHoveredFrame, moveDistance } = state
		if (moveDistance <= this.minDragDistance) {
			return { updateEdges: false, shapes: [], showMoving: false }
		}
		let ok = false
		if (moveHoveredFrame) {
			if (this.state.lastPoint?.x === state.movePoint?.x && this.state.lastPoint?.y === state.movePoint?.y && this.state.lastReturn) {
				return this.state.lastReturn!
			}
			ok = this.calculateSplitRequest(state)
		}
		const decos = this.getDecos(state)

		if (!ok) {
			if (moveHoveredFrame && moveHoveredFrame.docked) {
				const errorDeco: LayoutShape = {
					type: "rect",
					data: {
						x: moveHoveredFrame.x,
						y: moveHoveredFrame.y,
						width: moveHoveredFrame.width,
						height: moveHoveredFrame.height
					},
					attrs: { class: "deco-split-error bg-red-500/50" }
				}
				this.state.lastReturn = {
					updateEdges: true,
					shapes: type === "end" ? [] : [errorDeco],
					showMoving: false
				}
				return this.state.lastReturn
			}
		}
		this.state.lastReturn = {
			updateEdges: false,
			shapes: type === "end" ? [] : decos.flatMap(_ => _.shapes),
			showMoving: false
		}
		return this.state.lastReturn
	}

	onMoveApply(state: MoveState): boolean {
		if (this.state.res && state.moveHoveredFrame) {
			// this only caches once per frame hovered over
			// so the drag position is outdated, we must recalculate
			const ok = this.calculateSplitRequest(state)
			if (ok) {
				if (this.debug) { ActionHandler.debugState(this.name, "before", state, this.state, this.debug) }
				applyFrameChanges(state.win, this.state.res!)
				if (this.debug) { ActionHandler.debugState(this.name, "after", state, this.state, this.debug) }
			}
		}
		return true
	}

	onMoveEnded() {
		this.reset()
	}

	cancel(): void {
		this.hooks.onCancel?.()
	}
}
