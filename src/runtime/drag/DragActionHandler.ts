import type { RecordFromArray } from "@alanscodelog/utils"

import type { IDragAction } from "./DragAction.js"


/**
 * Handles the lifecycle of a drag actions {@link IDragAction} and provides additional hooks.
 */
export class DragActionHandler<
    TRawDragActions extends IDragAction[],
    TDragActions extends RecordFromArray<TRawDragActions, "name"> = RecordFromArray<TRawDragActions, "name">
> {
	activeAction?: keyof TDragActions

	actions: TDragActions

	isDragging = false

	constructor(
		actions: TRawDragActions,
		public hooks: {
			/** Called while dragging during dragChange events. You can use this to update the dragging edges. */
			onRecalculate?: () => void
			/** Called before searching for a matching action. Useful for re-initializing state. */
			onEvent?: (e: PointerEvent | KeyboardEvent | undefined, cancel: () => void) => void
			/** Called when the action requested changes. */
			onRequestChange?: (type: keyof TDragActions | undefined) => void
			/** Called when the drag action ends either because it was completed or cancelled. */
			onEnd?: (context: { cancelled: boolean, applied: boolean }) => void
		} = {}
	) {
		this.actions = {} as any
		for (const action of actions) {
			(this.actions as any)[action.name] = action
		}
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	eventHandler(e?: PointerEvent | KeyboardEvent) {
		let cancelled = false
		this.hooks.onEvent?.(e, () => {
			cancelled = true
			this.cancel()
		})
		if (cancelled) return

		let found = false
		for (const action of Object.values<TRawDragActions[number]>(this.actions)) {
			if (action.canHandleRequest(e)) {
				if (this.activeAction !== action.name && this.activeAction) {
					this.actions[this.activeAction!]!.cancel()
				} else {
					this.hooks.onRequestChange?.(action.name)
				}
				found = true
				this.activeAction = action.name
				break
			}
		}
		if (!found) {
			this.activeAction = undefined
			this.hooks.onRequestChange?.(this.activeAction)
		}
		if (this.isDragging) {
			this.hooks.onRecalculate?.()
		}
		return undefined
	}
	
	onDragChange(type: "start" | "end" | "move", e?: PointerEvent): void {
		if (type === "start") {
			this.eventHandler(e)
			this.isDragging = true
		}
		if (type === "end") {
			this.isDragging = false
		}
		if (!this.activeAction) return

		if (this.activeAction) {
			this.actions[this.activeAction]!.onDragChange(type, e)
		}
	}

	onDragApply(): boolean {
		if (this.activeAction) {
			const res = this.actions[this.activeAction]!.onDragApply()
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
		this.hooks.onEnd?.({ cancelled: true, applied: false })
	}
}

