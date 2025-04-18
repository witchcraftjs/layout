import type { RecordFromArray } from "@alanscodelog/utils"

import type { DragChangeHandler, DragState, IDragAction } from "./types.js"

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

	eventCanceller: (() => void) | undefined = undefined

	boundCancel: () => void

	defaultOnDragChange: DragChangeHandler
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

	constructor(
		/**
		 * Default onDragChange handler for when no action can handle the request.
		 *
		 * Should return true to allow the edges to be moved, or false to prevent it.
		 */
		defaultOnDragChange: DragChangeHandler,
		actions: TRawDragActions,
		hooks: DragActionHandler<TRawDragActions, TDragActions>["hooks"] = {}
	) {
		this.defaultOnDragChange = defaultOnDragChange
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
			this.cancel()
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
				this.actions[oldActiveAction]!.cancel()
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
		cancel?: () => void
	): boolean | undefined {
		if (type === "start") {
			this.eventCanceller = cancel
			state.isDragging = true
			this.eventHandler(e!, state, forceRecalculateEdges)
		}
		if (type === "end") {
			state.isDragging = false
			this.activeAction = undefined
		}

		if (this.activeAction) {
			return this.actions[this.activeAction]!.onDragChange(type, e, state, forceRecalculateEdges, this.boundCancel)
		}
		return this.defaultOnDragChange(type, e, state, forceRecalculateEdges, this.boundCancel)
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

	cancel(): void {
		if (this.activeAction) {
			this.actions[this.activeAction].cancel()
		}
		this.activeAction = undefined
		this.eventCanceller?.()
		this.hooks.onEnd?.({ cancelled: true, applied: false })
	}
}
