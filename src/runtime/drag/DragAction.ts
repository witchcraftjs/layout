export type Request<
	TName extends string = string,
> = {
	type: TName
	allowed: true
} | {
	type: TName
	allowed: false
}

/**
 * A drag action describes when and how to handle a drag event.
 *
 * For example, there are the default split/close actions that can be triggered in certain situations. This could be when holding down a modifier or key, or some other condition (e.g. the user is dragging a specific edge).
 *
 * Each action should handle it's configuration and saving/caching any state it needs. See {@link SplitAction} and {@link CloseAction} for examples.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IDragAction {
	/** A unique name for your action. */
	name: string
	/** Is called with each drag event (start, move, end). */
	onDragChange: (type: "start" | "end" | "move", e?: PointerEvent) => void
	/**
	 * Is called after `onDragChange("end")` with the same event. Might not be called if the request was cancelled.
	 *
	 * You should apply your action if possible and return whether it was applied.
	 *
	 * This is also a good place to reset your state.
	 *
	 */
	onDragApply: () => boolean
	/**
	 * Should return true if it should handle the "request"/event (e.g. some modifier is being pressed => user is requesting x action).
	 *
	 * The user is not necessarily dragging at this point, though they might also change actions mid drag. So it does not necessarily mean the event is allowed.
	 *
	 * Here is where you should initiate your state. Don't allow the action by default unless it can always be allowed.
	 */
	canHandleRequest(e?: PointerEvent | KeyboardEvent): boolean
	/**
	 * Called when a user cancels the drag action.
	 *
	 * You should reset your state here.
	 */
	cancel(): void
}

