import { get, type RecordFromArray } from "@alanscodelog/utils"

import type { DragChangeHandler, DragChangeResult, DragState, IDragAction } from "./types.js"

import type { LayoutShape } from "../types/index.js"

/**
 * Handles the lifecycle of a drag actions {@link IDragAction} and provides additional hooks.
 *
 * The first action instance that can handle the request is passed control of the event handlers until the request changes.
 */
export class DragActionHandler<
	TRawDragActions extends IDragAction[],
	TDragActions extends RecordFromArray<TRawDragActions, "name"> = RecordFromArray<TRawDragActions, "name">
> {
	activeAction?: keyof TDragActions

	actions: TDragActions

	eventCanceller: ((e: PointerEvent | KeyboardEvent | undefined, state: DragState) => void) | undefined = undefined

	boundCancel: (e: PointerEvent | KeyboardEvent | undefined, state: DragState) => void

	defaultOnDragChange: DragChangeHandler = (type, _e, state, _forceRecalculateEdges, _cancel) => ({
		updateEdges: type === "move" ? !state.isDraggingFromWindowEdge : true,
		shapes: []
	})

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
		onRequestChange?: (type: keyof TDragActions | undefined) => void
		/** Called when the drag action ends either because it was completed or cancelled. */
		onEnd?: (context: { cancelled: boolean, applied: boolean }) => void
	}

	/** All action shapes merged into a single array. If using vue you can set this to a reactive array for reactivity. */
	shapes: LayoutShape[] = []

	/** All hint/error text from all actions, updated on every onDragChange. If using vue you can set this to a reactive object for reactivity. */
	textHints: { actions: string[], errors: string[] } = { actions: [], errors: [] }

	constructor(
		actions: TRawDragActions,
		hooks: DragActionHandler<TRawDragActions, TDragActions>["hooks"] = {},
		/**
		 * Default onDragChange handler for when no action can handle the request.
		 *
		 * Should return true to allow the edges to be moved, or false to prevent it.
		 */
		defaultOnDragChange?: DragChangeHandler
	) {
		if (defaultOnDragChange) this.defaultOnDragChange = defaultOnDragChange
		this.hooks = hooks
		this.actions = {} as any
		for (const action of actions) {
			(this.actions as any)[action.name] = action
		}
		this.boundCancel = this.cancel.bind(this)
	}

	eventHandler(
		e: KeyboardEvent | PointerEvent,
		state: DragState,
		forceRecalculateEdges: () => void
	) {
		if (state.isDragging) {
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
		for (const action of Object.values<TRawDragActions[number]>(this.actions)) {
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

		if (state.isDragging) {
			forceRecalculateEdges()
			this.hooks.onRecalculate?.()
		}
		return undefined
	}

	onDragChange<T extends "start" | "move" | "end">(
		type: T,
		e: T extends "end" ? PointerEvent | undefined : PointerEvent,
		state: DragState,
		forceRecalculateEdges: () => void,
		cancel: (e: PointerEvent | KeyboardEvent | undefined, state: DragState) => void
	): DragChangeResult {
		if (type === "start") {
			this.eventCanceller = cancel
			this.eventHandler(e!, state, forceRecalculateEdges)
		}
		if (type === "end") {
			this.activeAction = undefined
		}

		if (this.activeAction) {
			const res = this.actions[this.activeAction]!.onDragChange(type, e, state, forceRecalculateEdges, this.boundCancel)
			// in case it's a vue reactive array
			this.shapes.splice(0, this.shapes.length, ...res.shapes)
			this.setTextHints(type)
			return res
		}
		this.setTextHints(type)
		const res = this.defaultOnDragChange(type, e, state, forceRecalculateEdges, this.boundCancel)
		this.shapes.splice(0, this.shapes.length, ...res.shapes)
		return res
	}

	setTextHints(type: "start" | "move" | "end") {
		// again in case it's a vue reactive object
		this.textHints.actions = []
		this.textHints.errors = []
		for (const action of Object.values<IDragAction>(this.actions)) {
			const res = action.getTextHints?.(type)
			this.textHints.actions.push(...(res?.actions ?? []))
			this.textHints.errors.push(...(res?.errors ?? []))
		}
	}

	onDragApply(
		state: DragState,
		forceRecalculateEdges: () => void
	): boolean {
		if (this.activeAction) {
			const res = this.actions[this.activeAction]!.onDragApply(state, forceRecalculateEdges)
			this.hooks.onEnd?.({ cancelled: false, applied: res })
			return false
		}
		this.hooks.onEnd?.({ cancelled: false, applied: false })
		return true
	}

	cancel(e: PointerEvent | KeyboardEvent | undefined, state: DragState): void {
		if (this.activeAction) {
			this.actions[this.activeAction].cancel(e, state)
		}
		this.activeAction = undefined
		this.eventCanceller?.(e, state)
		this.hooks.onEnd?.({ cancelled: true, applied: false })
	}

	static debugState(
		pluginName: string,
		type: "before" | "after" | string,
		state: DragState,
		pluginState: Record<string, any> = {},
		/** Object key to filter the state by, e.g. state.win.frames. If boolean is ignored. The idea is you pass this.debug and users can set this.debug to a string to filter. */
		key?: string | boolean
	): void {
		let res = { state, pluginState }
		let pickedRes: any = {}
		if (typeof key === "string" && key !== "") {
			pickedRes = {} as any
			const paths = key.split(",").map(_ => _.trim()).filter(_ => _)
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
