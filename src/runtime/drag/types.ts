import type { Direction, Edge, IntersectionEntry, LayoutFrame, LayoutWindow, Orientation, Point } from "../types/index.js"

export type DragState = {
	/** The current directions in the corresponding orientations that the user is dragging in. */
	dragDirections: Record<Orientation, Direction | undefined>
	/** The curren point (in scaled window coordinates) the user is dragging at. */
	dragPoint?: Point
	/** Whether the user is currently dragging. Is true during all drag events. */
	isDragging: boolean
	/**
	 * The edges that are currently being dragged. There are multiple edges if they drag an intersection since what's actually happening is we're just dragging the closest horizontal and vertical edges.
	 */
	draggingEdges: Edge[]
	/**
	 * The intersection that is currently being dragged.
	 */
	draggingIntersection?: IntersectionEntry
	/** The "visual" edges that can be displayed for dragging. See {@link getVisualEdges} */
	visualEdges: Edge[]
	/**
	 * The frames touching the currently dragged edges. Each entry corresponds to the frames touching the corresponding dragging edge.
	 *
	 * So you can use the index in draggingEdges to get the corresponding frames.
	 */
	touchingFrames: Record<string, LayoutFrame>[]
	/**
	 * Same as touchingFrames, but with the frames in an array.
	 */
	touchingFramesArrays: LayoutFrame[][]
	/**
	 * All the frames, with/without the currently dragged frames depending on if `showDragging` is true.
	 */
	frames: Record<string, LayoutFrame>
	/**
	 * The frame that is currently being hovered over (according to whether `dragPoint` in in the frame or not).
	 */
	dragHoveredFrame: LayoutFrame | undefined
	/**
	 * A list of corner intersections. Frames can also be dragged by these.
	 */
	intersections: IntersectionEntry[]
	/**
	 * Whether the drag was initiated from a point along the window edge.
	 */
	isDraggingFromWindowEdge: boolean
	win: LayoutWindow
}

/**
 * Note that the return type only affects the `move` event but is also typed as `boolean` for other events for ease of use.
 */
export interface DragChangeHandler {
	<T extends "start" | "move" | "end">(
		type: T,
		e: T extends "end" ? PointerEvent | undefined : PointerEvent,
		state: DragState,
		forceRecalculateEdges: () => void,
		cancel: () => void
	): boolean | undefined
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
	/**
	 * Called when the drag coordinates change (during any event). Should return true to allow the edges to be moved, or false to prevent it.
	 *
	 * Can be used to save some context/info to later apply safely during onDragApply.
	 */

	onDragChange: DragChangeHandler
	/**
	 *
	 * Is called after `onDragChange("end")` with the same event. Might not be called if the request was cancelled.
	 *
	 * You should apply your action if possible and return whether it was applied.
	 *
	 * This is also a good place to reset your state.
	 */
	onDragApply: (state: DragState, forceRecalculateEdges: () => void) => boolean
	/**
	 * Should return true if it should handle the "request"/event (e.g. some modifier is being pressed => user is requesting x action).
	 *
	 * The user is not necessarily dragging at this point, though they might also change actions mid drag. So it does not necessarily mean the event is allowed.
	 *
	 * Here is where you should initiate your state. Don't allow the action by default unless it can always be allowed.
	 */
	canHandleRequest(
		e: KeyboardEvent | PointerEvent,
		state: DragState,
		forceRecalculateEdges: () => void
	): boolean
	/**
	 * Called when a user cancels the drag action.
	 *
	 * You should reset your state here.
	 */
	cancel(): void
}
