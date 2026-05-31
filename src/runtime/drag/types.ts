import type { ComputedRef, InjectionKey, Ref } from "vue"

import type { Direction, Edge, FrameId, IntersectionEntry, LayoutFrame, LayoutShape, LayoutWindow, Orientation, Point } from "../types/index.js"

export type DragState = {
	/** The current directions in the corresponding orientations that the user is dragging in. */
	dragDirections: Record<Orientation, Direction | undefined>
	/** The curren point (in scaled window coordinates) the user is dragging at. */
	dragPoint?: Point
	/** Whether the user is currently dragging and what type of drag. Is truthy string during all drag events. */
	isDragging: boolean | "frame" | "edge"
	/** Whether to show the moved frames while dragging. */
	showDragging: boolean
	/** The frame being dragged during a frame drag. Only set when isDragging is "frame". */
	draggingFrameId?: FrameId
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


export interface ActionDragChangeResult {
	/** Whether the drag should update the edges. Defaults to false. */
	updateEdges?: boolean
	/** Deco shapes produced by this action during this drag step. */
	shapes: LayoutShape[]
	/** Whether to show the moved edges while dragging. Defaults to true. */
	showDragging?: boolean
}
export type DragChangeResult = Omit<ActionDragChangeResult, "shapes">

/**
 * Called when the drag coordinates change (during any event).
 *
 * Should return `{ allowed: true/false, shapes: LayoutShape[] }` to control whether the action is allowed and edges update and what deco shapes to render.
 *
 * Note that the allowed return type only affect the `move` event but is also typed as `boolean` for other events for ease of use.
 */
export type DragChangeHandler = <T extends "start" | "move" | "end">(
	type: T,
	e: T extends "end" ? PointerEvent | undefined : PointerEvent,
	state: DragState,
	forceRecalculateEdges: () => void,
	cancel: (e: PointerEvent | KeyboardEvent | undefined, state: DragState) => void
) => ActionDragChangeResult

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
	cancel(e: PointerEvent | KeyboardEvent | undefined, state: DragState): void
	/**
	 * Plugins should implement some basic debug logs by calling {@link DragActionHandler.debugState } at least before and after applying actions in onDragApply. Debug can be a string because it can be an object key to filter on (see the debugState function).
	 *
	 *
	 * Calls look like this usually, where this.state is the plugin state:
	 * ```ts
	 * DragActionHandler.debugState(this.name, "before", state, this.state, this.debug)
	 * ```
	 */
	debug: boolean | string
	/**
	 * The action handler will call this regardless of whether the action is active or not.
	 *
	 * Can be used by actions to return display hints.
	 *
	 * Actions should keep the state of the hints locally and update them in canHandlerRequest/onDrag*, etc. and only use this to return the state of the actions, not update them as that could become expensive.
	 */
	// todo think of a better way to do this, don't like that the action handler has to construct a bunch of objects on every change
	getTextHints(type: "start" | "move" | "end"): {
		/** Hint texts to display regarding the action state/usage. Undefined means no hint. */
		actions?: string[]
		/** Error texts/hints to display when the action produces an error. */
		errors?: string[]
	}
}
export type EdgeDragStartData = { edge?: Edge, intersection?: IntersectionEntry }
export type FrameDragStartData = { frameId: FrameId }

// drag start overloads for triggering dragsj
export type DragStartFn = {
	(e: PointerEvent, type: "edge", data: EdgeDragStartData): void
	(e: PointerEvent, type: "frame", data: FrameDragStartData): void
}

export interface UseFramesContext {
	dragStart: DragStartFn
	dragMove: (e: PointerEvent) => void
	dragEnd: (e?: PointerEvent, options?: { apply?: boolean }) => void
	cancel: () => void
	dragDirections: Ref<Record<Orientation, Direction | undefined>>
	dragPoint: Ref<Point | undefined>
	isDragging: Ref<false | "frame" | "edge">
	draggingEdges: Ref<Edge[]>
	draggingIntersection: Ref<IntersectionEntry | undefined>
	visualEdges: Ref<Edge[]>
	touchingFrames: Ref<Record<string, LayoutFrame>[]>
	touchingFramesArrays: Ref<LayoutFrame[][]>
	frames: ComputedRef<Record<string, LayoutFrame>>
	dragHoveredFrame: ComputedRef<LayoutFrame | undefined>
	intersections: ComputedRef<IntersectionEntry[]>
	isDraggingFromWindowEdge: Ref<boolean>
	forceRecalculateEdges: () => void
	state: ComputedRef<DragState>
	frameDragFrameId: Ref<FrameId | undefined>
}


export const dragContextInjectionKey = Symbol.for("@witchcraft/layout:dragContext") as InjectionKey<UseFramesContext>
