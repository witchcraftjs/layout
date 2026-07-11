import { ActionHandler } from "./ActionHandler.js"

import { dirToOrientation } from "../helpers/dirToOrientation.js"
import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { oppositeSide } from "../helpers/oppositeSide.js"
import { applyFrameChanges } from "../layout/applyFrameChanges.js"
import { findFramesTouchingEdge } from "../layout/findFramesTouchingEdge.js"
import { getCloseFrameInfo } from "../layout/getCloseFrameInfo.js"
import type { ActionApplyResult, ActionChangeResult, CloseDeco, IAction, MoveState } from "../types/index.js"
import type { KnownError } from "../utils/KnownError.js"

export type CloseInfo = Exclude<ReturnType<typeof getCloseFrameInfo>, KnownError>

export class CloseAction implements IAction {
	name = "close" as const
	minDragDistance = 5

	state: {
		allowed: true
		force: boolean
		res: CloseInfo
		cacheKey: string | undefined
		lastReturn: ActionChangeResult
	} | {
		allowed: false
		force: boolean
		res: CloseInfo | undefined
		cacheKey: string | undefined
		lastReturn: ActionChangeResult | undefined
	} = {} as any // this is initialized by this.reset()

	debug: boolean | string = false
	textHints: { actions: string[], errors: string[] } = { actions: [], errors: [] }

	closeHints: {
		actions: string[] | ((state: { force: boolean }) => string[])
		transformError: (e: KnownError) => string
	} = {
		actions: ["Hold Shift to Close", "Hold Ctrl+Shift to Force Close"],
		transformError: e => e.message
	}

	handleEvent: (e: PointerEvent | KeyboardEvent | undefined, state: MoveState) => boolean | "force" = (e: PointerEvent | KeyboardEvent | undefined) => {
		if (e?.ctrlKey && e?.shiftKey) {
			return "force"
		}
		if (e?.shiftKey) return true
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
			/** Minimum pixel distance the user must drag before the action is allowed (decos shown and action applied). Defaults to 5. */
			minDragDistance?: number
		}
	) {
		if (handleEvent !== undefined) this.handleEvent = handleEvent
		if (modifyDecos !== undefined) this.modifyDecos = modifyDecos
		this.hooks = hooks
		if (config?.debug) this.debug = true
		if (config?.minDragDistance !== undefined) this.minDragDistance = config.minDragDistance
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

	private _getDecos(state: MoveState): CloseDeco[] {
		let decos: CloseDeco[] = []
		const { isMoving } = state
		if (isMoving && this.state.allowed && this.state.res) {
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
			this.textHints.actions = typeof this.closeHints.actions === "function"
				? this.closeHints.actions({ force: this.state.force })
				: this.closeHints.actions
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


	canHandleRequest(e: PointerEvent | KeyboardEvent | undefined, state: MoveState): boolean {
		const { movingEdges } = state
		if (movingEdges.length !== 1) return false
		const res = this.handleEvent(e, state)
		this.state.force = res === "force"
		this.setTextHints(state.isMoving === "edge" ? true : undefined)
		if (res) {
			this.hooks.onStart?.(true)
			return true
		}
		this.reset()
		return false
	}

	onMoveChange(
		type: "start" | "end" | "move",
		_e: PointerEvent | undefined,
		state: MoveState
	): ActionChangeResult {
		if (type === "end" || state.moveDistance <= this.minDragDistance) {
			return { updateEdges: false, shapes: [] }
		}
		const {
			touchingFramesArrays,
			moveDirections,
			isMoving,
			movingEdges,
			visualEdges,
			frames,
			isMovingFromWindowEdge,
			movePoint
		} = state
		const oppositeOrientation = oppositeSide(getEdgeOrientation(movingEdges[0]))
		const cacheKey = `${movePoint?.x}-${movePoint?.y}-${moveDirections[oppositeOrientation]!}-${this.state.force}`
		if (this.state.allowed) {
			if (this.state.cacheKey === cacheKey) {
				return this.state.lastReturn
			}
		}
		if (isMoving && movingEdges.length === 1) {
			const res = findFramesTouchingEdge(
				movingEdges[0],
				touchingFramesArrays[0],
				{
					// referencePoint: movePoint.value, // if force pick smallest frame?
					searchDirections: [moveDirections[oppositeOrientation]!]
				}
			)
			if (res.length > 0) {
				const orientation = dirToOrientation(moveDirections[oppositeOrientation]!)
				const sizeKey = orientation === "horizontal" ? "width" : "height"
				const smallestFrameSize = Math.min(...res.map(_ => _.frame[sizeKey]))
				const frame = res.find(_ => _.frame[sizeKey] === smallestFrameSize)!.frame!

				const closeInfo = getCloseFrameInfo(Object.values(frames), visualEdges, frame, moveDirections[oppositeOrientation]!, "dir", this.state.force)
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
		this.state.lastReturn = {
			updateEdges: !isMovingFromWindowEdge,
			shapes: decos.flatMap(_ => _.shapes)
		}
		return this.state.lastReturn
	}

	onMoveApply(state: MoveState): ActionApplyResult {
		if (this.state.res) {
			const win = state.win
			if (this.debug) { ActionHandler.debugState(this.name, "before", state, this.state, this.debug) }
			applyFrameChanges(win, this.state.res)
			if (this.debug) { ActionHandler.debugState(this.name, "after", state, this.state, this.debug) }
			return { updateEdges: false, wasApplied: true }
		}
		return { updateEdges: true, wasApplied: false }
	}

	cancel(): void {
		this.hooks.onCancel?.()
	}

	onMoveEnded() {
		this.reset()
	}
}
