import { DragActionHandler } from "./DragActionHandler.js"
import type { ActionDragChangeResult, DragState, IDragAction } from "./types.js"

import { dirToOrientation } from "../helpers/dirToOrientation.js"
import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { applyFrameChanges } from "../layout/applyFrameChanges.js"
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
		lastReturn: ActionDragChangeResult
	} | {
		allowed: false
		force: boolean
		res: CloseInfo | undefined
		cacheKey: string | undefined
		lastReturn: ActionDragChangeResult | undefined
	} = {} as any // this is initialized by this.reset()

	debug: boolean | string = false
	textHints: { actions: string[], errors: string[] } = { actions: [], errors: [] }

	closeHints: {
		actions: string[]
		transformError: (e: KnownError) => string
	} = {
		actions: ["Hold Shift to Close", "Hold Ctrl+Shift to Force Close"],
		transformError: e => e.message
	}

	handleEvent: (e: PointerEvent | KeyboardEvent, state: DragState) => boolean | "force" = (e: PointerEvent | KeyboardEvent) => {
		if (e.ctrlKey && e.shiftKey) {
			return "force"
		}
		if (e.shiftKey) return true
		return false
	}

	modifyDecos: (shapes: CloseDeco[]) => void = () => { }
	hooks: {
		onStart?: (active: boolean) => void
		onCancel?: () => void
		onError?: (e: KnownError) => void
	} = {}

	constructor(
		handleEvent?: CloseAction["handleEvent"],
		/** Modify the created decos before they are rendered. */
		modifyDecos?: CloseAction["modifyDecos"],
		hooks: CloseAction["hooks"] = {},
		config?: {
			debug?: boolean | string
			closeHints?: Partial<CloseAction["closeHints"]>
		}
	) {
		if (handleEvent !== undefined) this.handleEvent = handleEvent
		if (modifyDecos !== undefined) this.modifyDecos = modifyDecos
		this.hooks = hooks
		if (config?.debug) this.debug = true
		this.reset()
	}

	reset(): void {
		this.state = {
			allowed: false,
			force: false,
			res: undefined,
			cacheKey: undefined,
			lastReturn: undefined
		}
		this.modifyDecos([])
	}

	private _getDecos(state: DragState): CloseDeco[] {
		let decos: CloseDeco[] = []
		const { isDragging } = state
		if (isDragging && this.state.allowed && this.state.res) {
			const { force } = this.state
			decos = this.state.res.deleted.map(_ => ({
				id: _.id,
				type: "close" as const,
				force,
				shapes: [
					{
						type: "rect",
						data: { x: _.x, y: _.y, width: _.width, height: _.height },
						attrs: {
							class: force
								? `deco-close-force-frame bg-orange-500/50`
								: `deco-close-frame bg-orange-500/20`
						}
					}
				]
			}))
		}
		this.modifyDecos(decos)
		return decos
	}

	setTextHints(result: true | CloseInfo | KnownError | undefined): void {
		if (result === undefined) {
			this.textHints.actions = []
			this.textHints.errors = []
		} else if (result instanceof Error) {
			this.textHints.actions = []
			this.textHints.errors = [this.closeHints.transformError(result)]
		} else {
			this.textHints.actions = this.closeHints.actions
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


	canHandleRequest(e: PointerEvent | KeyboardEvent, state: DragState): boolean {
		const { draggingEdges } = state
		if (draggingEdges.length !== 1) return false
		const res = this.handleEvent(e, state)
		this.state.force = res === "force"
		this.setTextHints(state.isDragging === "edge" ? true : undefined)
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
	): ActionDragChangeResult {
		const {
			touchingFramesArrays,
			dragDirections,
			isDragging,
			draggingEdges,
			visualEdges,
			frames,
			isDraggingFromWindowEdge,
			dragPoint
		} = state
		const oppositeOrientation = oppositeSide(getEdgeOrientation(draggingEdges[0]))
		const cacheKey = `${dragPoint?.x}-${dragPoint?.y}-${dragDirections[oppositeOrientation]!}-${this.state.force}`
		if (this.state.allowed) {
			if (this.state.cacheKey === cacheKey) {
				return this.state.lastReturn
			}
		}
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

				const closeInfo = getCloseFrameInfo(Object.values(frames), visualEdges, frame, dragDirections[oppositeOrientation]!, "dir", this.state.force)
				this.state.cacheKey = cacheKey
				this.setTextHints(closeInfo)
				if (!(closeInfo instanceof Error)) {
					this.state.res = closeInfo
					this.state.allowed = true
				} else {
					this.state.res = undefined
					this.state.allowed = false
					this.hooks.onError?.(closeInfo)
					return { updateEdges: true, shapes: [] }
				}
			}
		}
		const decos = this._getDecos(state)
		this.state.lastReturn = { updateEdges: !isDraggingFromWindowEdge, shapes: decos.flatMap(_ => _.shapes) }
		return this.state.lastReturn
	}

	onDragApply(state: DragState): boolean {
		if (this.state.res) {
			const win = state.win
			if (this.debug) { DragActionHandler.debugState(this.name, "before", state, this.state, this.debug) }
			applyFrameChanges(win, this.state.res)
			if (this.debug) { DragActionHandler.debugState(this.name, "after", state, this.state, this.debug) }
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
