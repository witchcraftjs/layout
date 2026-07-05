import { DragActionHandler } from "./DragActionHandler.js"

import { createZoneSideClipPath } from "../helpers/createZoneSideClipPath.js"
import { applyFrameChanges } from "../layout/applyFrameChanges.js"
import { getDragZones } from "../layout/getDragZones.js"
import { getFrameDockInfo } from "../layout/getFrameDockInfo.js"
import { getFrameRearrangeInfo } from "../layout/getFrameRearrangeInfo.js"
import { getFrameSwapInfo } from "../layout/getFrameSwapInfo.js"
import { settings } from "../settings.js"
import type { ActionDragChangeResult, DragState, DragZone, FrameDragDeco, IDragAction, LayoutChange } from "../types/index.js"
import type { KnownError } from "../utils/KnownError.js"


export class FrameDragAction implements IDragAction {
	name = "frameDrag" as const

	minDragDistance = 5

	state: {
		lastReturn?: LayoutChange<"split" | "swap" | "rearrange" | "dock"> | KnownError
	} = {
		lastReturn: undefined
	}

	debug: boolean | string = false
	textHints: { actions: string[], errors: string[] } = { actions: [], errors: [] }

	handleEvent: (e: PointerEvent | KeyboardEvent, state: DragState) => boolean
		= (_e: PointerEvent | KeyboardEvent, state: DragState) => state.isDragging === "frame"

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

	modifyDecos: (shapes: FrameDragDeco[]) => void = () => { }
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
		matchedZone: DragZone | undefined,
		state: DragState,
		result: LayoutChange<"split" | "swap" | "rearrange" | "dock"> | KnownError | undefined
	): FrameDragDeco[] {
		const isError = result instanceof Error
		const frame = state.dragHoveredFrame

		if (!matchedZone || !frame) {
			const decos: FrameDragDeco[] = []
			this.modifyDecos(decos)
			return decos
		}

		const clipPath = createZoneSideClipPath(matchedZone, settings.zoneSizes)

		const classes = isError
			? `deco-frame-drag deco-frame-drag-error deco-frame-drag-${matchedZone.type}-${matchedZone.side} bg-red-500/50`
			: `deco-frame-drag deco-frame-drag-${matchedZone.type}-${matchedZone.side} bg-blue-500/50`

		const decos: FrameDragDeco[] = [{
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

	canHandleRequest(e: PointerEvent | KeyboardEvent, state: DragState): boolean {
		const res = this.handleEvent(e, state)
		this.setTextHints(undefined)
		if (res) {
			this.hooks.onStart?.()
			return true
		}
		this.reset()
		return false
	}

	onDragChange<T extends "start" | "move" | "end">(
		type: T,
		_e: PointerEvent | undefined,
		state: DragState
	): ActionDragChangeResult {
		if (type === "end") {
			this.reset()
			return { shapes: [] }
		}
		if (state.dragDistance <= this.minDragDistance) {
			return { updateEdges: false, shapes: [], showDragging: false }
		}
		const { win, draggingFrameId, dragHoveredFrame } = state
		const matchedZone = getDragZones(state, settings.zoneSizes)

		if (!matchedZone) {
			this.state.lastReturn = undefined
		} else if (dragHoveredFrame && matchedZone.type === "frame" && matchedZone.side) {
			if (matchedZone.side !== "center") {
				this.state.lastReturn = getFrameRearrangeInfo(win, draggingFrameId!, dragHoveredFrame.id!, matchedZone.side)
			} else {
				this.state.lastReturn = getFrameSwapInfo(win, draggingFrameId!, dragHoveredFrame.id!)
				// for the hints
				if (!(this.state.lastReturn instanceof Error)) this.state.lastReturn.info = "swap"
			}
		} else if (matchedZone.type === "window" && dragHoveredFrame && !dragHoveredFrame.docked) {
			this.state.lastReturn = getFrameDockInfo(win, draggingFrameId!, matchedZone.side)
			// for the hints
			if (!(this.state.lastReturn instanceof Error)) this.state.lastReturn.info = "dock"
		}

		this.setTextHints(this.state.lastReturn)
		const decos = this.getDecos(matchedZone, state, this.state.lastReturn)

		return {
			shapes: decos.flatMap(_ => _.shapes),
			updateEdges: false,
			showDragging: false
		}
	}

	onDragApply(state: DragState): boolean {
		const result = this.state.lastReturn
		if (!result || !state.dragHoveredFrame || !state.draggingFrameId) {
			return true
		}

		if (result instanceof Error) {
			this.hooks.onError?.(result)
		} else {
			if (this.debug) { DragActionHandler.debugState(this.name, "before", state, this.state, this.debug) }
			applyFrameChanges(state.win, result)
			if (this.debug) { DragActionHandler.debugState(this.name, "after", state, this.state, this.debug) }
		}

		return true
	}

	cancel(): void {
		this.reset()
	}
}
