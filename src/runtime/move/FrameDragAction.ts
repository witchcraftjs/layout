import { ActionHandler } from "./ActionHandler.js"

import { createZoneSideClipPath } from "../helpers/createZoneSideClipPath.js"
import { applyFrameChanges } from "../layout/applyFrameChanges.js"
import { getFrameDockInfo } from "../layout/getFrameDockInfo.js"
import { getFrameRearrangeInfo } from "../layout/getFrameRearrangeInfo.js"
import { getFrameSwapInfo } from "../layout/getFrameSwapInfo.js"
import { getZones } from "../layout/getZones.js"
import { settings } from "../settings.js"
import type { ActionChangeResult, FrameDeco, IAction, LayoutChange, MoveState, Zone } from "../types/index.js"
import type { KnownError } from "../utils/KnownError.js"


export class FrameDragAction implements IAction {
	name = "frameDrag" as const

	minDragDistance = 5

	state: {
		lastReturn?: LayoutChange<"split" | "swap" | "rearrange" | "dock"> | KnownError
	} = {
		lastReturn: undefined
	}

	debug: boolean | string = false
	textHints: { actions: string[], errors: string[] } = { actions: [], errors: [] }

	handleEvent: (e: PointerEvent | KeyboardEvent, state: MoveState) => boolean
		= (_e: PointerEvent | KeyboardEvent, state: MoveState) => state.isMoving === "frame"

	dragHints: {
		actions: { split?: string, swap?: string, rearrange?: string, dock?: string } | ((state: { type: "split" | "swap" | "rearrange" | "dock" }) => string[])
		transformError: (e: KnownError) => string
	} = {
		actions: {
			split: "Drop to Split the current frame.",
			swap: "Drop to Swap the frames.",
			rearrange: "Drop to Move the frame.",
			dock: "Drop to Dock the frame."
		},
		transformError: e => e.message
	}

	modifyDecos: (shapes: FrameDeco[]) => void = () => { }
	hooks: {
		onStart?: () => void
		onCancel?: () => void
		onError?: (e: KnownError) => void
	} = {}

	constructor(
		handleEvent?: FrameDragAction["handleEvent"],
		/** Modify the created decos before they are rendered. */
		modifyDecos?: FrameDragAction["modifyDecos"],
		hooks: FrameDragAction["hooks"] = {},
		config?: {
			debug?: boolean | string
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
			lastReturn: undefined
		}
	}

	setTextHints(result: LayoutChange<"split" | "swap" | "rearrange" | "dock"> | KnownError | undefined): void {
		if (result === undefined || !result.info) {
			this.textHints.actions = []
			this.textHints.errors = []
		} else if (result instanceof Error) {
			this.textHints.actions = []
			this.textHints.errors = [this.dragHints.transformError(result)]
		} else {
			this.textHints.actions = typeof this.dragHints.actions === "function"
				? this.dragHints.actions({ type: result.info })
				: this.dragHints.actions[result.info] !== undefined
					?	[this.dragHints.actions[result.info]!]
					: []
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


	getDecos(
		matchedZone: Zone | undefined,
		state: MoveState,
		result: LayoutChange<"split" | "swap" | "rearrange" | "dock"> | KnownError | undefined
	): FrameDeco[] {
		const isError = result instanceof Error
		const frame = state.moveHoveredFrame

		if (!matchedZone || !frame) {
			const decos: FrameDeco[] = []
			this.modifyDecos(decos)
			return decos
		}

		const clipPath = createZoneSideClipPath(matchedZone, settings.zoneSizes)

		const classes = isError
			? `deco-frame-drag deco-frame-drag-error deco-frame-drag-${matchedZone.type}-${matchedZone.side} bg-red-500/50`
			: `deco-frame-drag deco-frame-drag-${matchedZone.type}-${matchedZone.side} bg-blue-500/50`

		const decos: FrameDeco[] = [{
			id: frame.id,
			type: "drop",
			position: matchedZone.side ?? "center",
			shapes: [
				{
					type: "rect",
					data: matchedZone,
					attrs: clipPath
						? { class: classes, style: `clip-path:${clipPath}` }
						: { class: classes }
				}
			]
		}]

		this.modifyDecos(decos)
		return decos
	}

	canHandleRequest(e: PointerEvent | KeyboardEvent, state: MoveState): boolean {
		const res = this.handleEvent(e, state)
		this.setTextHints(undefined)
		if (res) {
			this.hooks.onStart?.()
			return true
		}
		this.reset()
		return false
	}

	onMoveChange<T extends "start" | "move" | "end">(
		type: T,
		_e: PointerEvent | undefined,
		state: MoveState
	): ActionChangeResult {
		if (state.moveDistance <= this.minDragDistance) {
			return { updateEdges: false, shapes: [], showMoving: false }
		}
		const { win, movingFrameId, moveHoveredFrame } = state
		const matchedZone = getZones(state, settings.zoneSizes)

		if (!matchedZone) {
			this.state.lastReturn = undefined
		} else if (moveHoveredFrame && matchedZone.type === "frame" && matchedZone.side) {
			if (matchedZone.side !== "center") {
				this.state.lastReturn = getFrameRearrangeInfo(win, movingFrameId!, moveHoveredFrame.id!, matchedZone.side)
			} else {
				this.state.lastReturn = getFrameSwapInfo(win, movingFrameId!, moveHoveredFrame.id!)
				// for the hints
				if (!(this.state.lastReturn instanceof Error)) this.state.lastReturn.info = "swap"
			}
		} else if (matchedZone.type === "window" && moveHoveredFrame && !moveHoveredFrame.docked) {
			this.state.lastReturn = getFrameDockInfo(win, movingFrameId!, matchedZone.side)
			// for the hints
			if (!(this.state.lastReturn instanceof Error)) this.state.lastReturn.info = "dock"
		}

		this.setTextHints(this.state.lastReturn)
		const decos = this.getDecos(matchedZone, state, this.state.lastReturn)

		return {
			shapes: type === "end" ? [] : decos.flatMap(_ => _.shapes),
			updateEdges: false,
			showMoving: false
		}
	}

	onMoveApply(state: MoveState): boolean {
		const result = this.state.lastReturn
		if (!result || !state.moveHoveredFrame || !state.movingFrameId) {
			return true
		}

		if (result instanceof Error) {
			this.hooks.onError?.(result)
		} else {
			if (this.debug) { ActionHandler.debugState(this.name, "before", state, this.state, this.debug) }
			applyFrameChanges(state.win, result)
			if (this.debug) { ActionHandler.debugState(this.name, "after", state, this.state, this.debug) }
		}

		return true
	}

	onMoveEnded() {
		this.reset()
	}

	cancel(): void {
		this.reset()
	}
}
