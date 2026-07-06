import { get, type RecordFromArray } from "@alanscodelog/utils"

import { isWindowEdge } from "../helpers/isWindowEdge.js"
import { findFramesTouchingEdge } from "../layout/findFramesTouchingEdge.js"
import type { ActionHandlerApplyResult, ActionResolve, Edge, IAction, IActionHandler, LayoutFrame, LayoutShape, MoveChangeResult, MoveState } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

/**
 * Handles the lifecycle of a drag actions {@link IAction} and provides additional hooks.
 *
 * The first action instance that can handle the request is passed control of the event handlers until the request changes.
 */
export class ActionHandler<
	TRawActions extends IAction[],
	TActions extends RecordFromArray<TRawActions, "name"> = RecordFromArray<TRawActions, "name">
> implements IActionHandler {
	activeAction?: keyof TActions

	actions: TActions

	eventCanceller: ((e: PointerEvent | KeyboardEvent | undefined, state: MoveState) => void) | undefined = undefined

	boundCancel: (e: PointerEvent | KeyboardEvent | undefined, state: MoveState) => void

	defaultOnMoveChange: IAction["onMoveChange"] = (type, _e, state, _forceRecalculateEdges, _cancel) => {
		const isTouchingCollapsedFrameEdge = type === "move"
			&& state.isMoving === "edge"
			&& state.touchingFramesArrays.some(frames =>
				// we check with a falsy check on PURPOSE, frames collapsed to 0 aren't an issue, they are ignored anyways
				Object.values(frames).some(f => f.collapsed)
			)
		return {
			updateEdges: type === "move" ? !(state.isMovingFromWindowEdge || isTouchingCollapsedFrameEdge) : true,
			shapes: []
		}
	}

	hooks: {
		/** Called while dragging during dragChange events. You can use this to update the dragging edges. */
		onRecalculate?: () => void
		/**
		 * Called before searching for a matching action. Useful for re-initializing state.
		 *
		 * Is passed a `cancel` function if you want to cancel the current drag action.
		 */
		onEvent?: (e: PointerEvent | KeyboardEvent | undefined, cancel: () => void) => void
		/** Called when the action requested changes. */
		onRequestChange?: (type: keyof TActions | undefined) => void
		/** Called when the drag action ends either because it was completed or cancelled. */
		onEnd?: (context: { cancelled: boolean, wasApplied: boolean, result?: any }) => void
	}

	/** All action shapes merged into a single array. If using vue you can set this to a reactive array for reactivity. */
	shapes: LayoutShape[] = []

	/** All hint/error text from all actions, updated on every onMoveChange. If using vue you can set this to a reactive object for reactivity. */
	textHints: { actions: string[], errors: string[] } = { actions: [], errors: [] }

	constructor(
		actions: TRawActions,
		hooks: ActionHandler<TRawActions, TActions>["hooks"] = {},
		/**
		 * Default onMoveChange handler for when no action can handle the request. See {@link IAction.onMoveChange}.
		 *
		 * The default prevents movement when the edge is a window edge and when the edge is touching a collapsed frame.
		 */
		defaultOnMoveChange?: IAction["onMoveChange"]
	) {
		if (defaultOnMoveChange) this.defaultOnMoveChange = defaultOnMoveChange
		this.hooks = hooks
		this.actions = {} as any
		for (const action of actions) {
			(this.actions as any)[action.name] = action
		}
		this.boundCancel = this.cancel.bind(this)
	}

	eventHandler(
		e: KeyboardEvent | PointerEvent,
		state: MoveState,
		forceRecalculateEdges: () => void
	) {
		if (state.isMoving) {
			e.preventDefault()
		}
		let cancelled = false
		this.hooks.onEvent?.(e, () => {
			cancelled = true
			this.cancel(e, state)
		})
		if (cancelled) return

		let found = false
		const oldActiveAction = this.activeAction
		for (const action of Object.values<TRawActions[number]>(this.actions)) {
			if (action.canHandleRequest(e, state, forceRecalculateEdges)) {
				// if (this.activeAction !== action.name) {
				// }
				found = true
				this.activeAction = action.name
				break
			}
		}

		if (!found) {
			this.activeAction = undefined
		}

		if (oldActiveAction !== this.activeAction) {
			if (oldActiveAction) {
				this.actions[oldActiveAction]!.cancel(e, state)
			}
			this.hooks.onRequestChange?.(this.activeAction)
		}

		if (state.isMoving) {
			forceRecalculateEdges()
			this.hooks.onRecalculate?.()
		}
		return undefined
	}

	onMoveChange<T extends "start" | "move" | "end">(
		type: T,
		e: T extends "end" ? PointerEvent | undefined : PointerEvent,
		state: MoveState,
		forceRecalculateEdges: () => void,
		cancel: (e: PointerEvent | KeyboardEvent | undefined, state: MoveState) => void,
		resolve: T extends "end" ? undefined : ((opts: ActionResolve) => void)
	): MoveChangeResult {
		if (type === "start") {
			this.eventCanceller = cancel
			this.eventHandler(e!, state, forceRecalculateEdges)
		}

		if (this.activeAction) {
			const res = this.actions[this.activeAction]!.onMoveChange(type, e, state, forceRecalculateEdges, this.boundCancel as any, resolve)
			// in case it's a vue reactive array
			this.shapes.splice(0, this.shapes.length, ...res.shapes)
			this.setTextHints(type)
			return res
		}
		this.setTextHints(type)
		const res = this.defaultOnMoveChange(type, e, state, forceRecalculateEdges, this.boundCancel as any, resolve as any)
		this.shapes.splice(0, this.shapes.length, ...res.shapes)

		return res
	}

	onMoveApply(
		state: MoveState,
		forceRecalculateEdges: () => void
	): ActionHandlerApplyResult {
		if (this.activeAction) {
			const res = this.actions[this.activeAction]!.onMoveApply(state, forceRecalculateEdges)
			this.hooks.onEnd?.({ cancelled: false, wasApplied: res.wasApplied, result: res.result })
			return res
		}
		this.hooks.onEnd?.({ cancelled: false, wasApplied: false })
		return { updateEdges: true, result: undefined }
	}

	onMoveEnded() {
		if (this.activeAction) {
			this.actions[this.activeAction]!.onMoveEnded()
		}

		this.activeAction = undefined
	}

	cancel(e: PointerEvent | KeyboardEvent | undefined, state: MoveState): void {
		if (this.activeAction) {
			this.actions[this.activeAction].cancel(e, state)
		}
		this.activeAction = undefined
		this.eventCanceller?.(e, state)
		this.hooks.onEnd?.({ cancelled: true, wasApplied: false })
	}


	setTextHints(type: "start" | "move" | "end") {
		// again in case it's a vue reactive object
		this.textHints.actions = []
		this.textHints.errors = []
		for (const action of Object.values<IAction>(this.actions)) {
			const res = action.getTextHints?.(type)
			this.textHints.actions.push(...(res?.actions ?? []))
			this.textHints.errors.push(...(res?.errors ?? []))
		}
	}

	annotateEdges(edges: Edge[], frames: LayoutFrame[]): void {
		for (const edge of edges) {
			// edge already has an error
			if (edge.error) continue
			for (const action of Object.values<IAction>(this.actions)) {
				action.annotateEdge?.(edge, frames)
				if (edge.error) break
			}
			// window edges don't resize anything
			if (!edge.error && !isWindowEdge(edge)) {
				const touching = findFramesTouchingEdge(edge, frames)
				if (touching) {
					// we check with a falsy check on PURPOSE, frames collapsed to 0 aren't an issue, they are ignored anyways
					const collapsedFrame = touching.find(f => f.frame.collapsed)
					if (collapsedFrame) {
						edge.error = new KnownError(
							LAYOUT_ERROR.CANT_RESIZE_COLLAPSED_FRAME,
							"Cannot Move: Can't Resize Collapsed Frame",
							{ frame: (collapsedFrame.frame as LayoutFrame) }
						)
					}
				}
			}
		}
	}

	static debugState(
		pluginName: string,
		type: "before" | "after" | string,
		state: MoveState,
		pluginState: Record<string, any> = {},
		/** Object key to filter the state by, e.g. state.win.frames. If false is ignored. The idea is you pass this.debug and users can set this.debug to a string to filter. */
		key?: string | boolean
	): void {
		if (key === false) return
		let res = { state, pluginState }
		if (typeof key === "string" && key !== "") {
			const paths = key.split(",").map(_ => _.trim()).filter(_ => _)
			const pickedRes: Record<string, any> = {}
			for (const path of paths) {
				pickedRes[path] = get(res, path.split("."))
			}
			res = pickedRes as any
		}
		const resString = JSON.stringify(res, null, 2)
		// eslint-disable-next-line no-console
		console.log(`[Drag Action Debug - ${pluginName}]:`, type, resString)
	}
}
