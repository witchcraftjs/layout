import type { EnumLike } from "@alanscodelog/utils"
import { enumFromArray } from "@alanscodelog/utils/enumFromArray"
import { z } from "zod"

import { KnownError } from "../utils/KnownError.js"

export const zUuid = z.uuid()
export type AnyUuid = z.infer<typeof zUuid>

export const zWindowIdConstants = z.enum(["ACTIVE"])
export const zWinId = z.uuid().or(zWindowIdConstants)
export type WindowId = z.infer<typeof zWinId>

export const zFrameIdConstants = z.enum(["ACTIVE"])
export const zFrameId = z.uuid().or(zFrameIdConstants)
export type FrameId = z.infer<typeof zFrameId>

import { settings } from "../settings.js"

export const zScaledIntPercentage = z.number()
	.int()
	.min(0)
	.nonnegative()
	.superRefine((val, ctx) => {
		if (val > settings.maxInt) {
			ctx.addIssue({
				code: "too_big",
				type: "number",
				origin: "number",
				maximum: settings.maxInt,
				inclusive: true,
				message: `Value ${val} must be less than or equal to ${settings.maxInt}`
			})
		}
	})

const zPx = z.number()
	.int()
	.nonnegative()

export const zPos = z.object({
	x: zScaledIntPercentage,
	y: zScaledIntPercentage
})

export type Pos = z.infer<typeof zPos>

export const zSize = z.object({
	width: zScaledIntPercentage,
	height: zScaledIntPercentage
})
export type Size = z.infer<typeof zSize>

export const zPoint = z.object({
	x: zScaledIntPercentage,
	y: zScaledIntPercentage
})

export type Point = z.infer<typeof zPoint>

export const zPxPos = z.object({
	pxX: zPx,
	pxY: zPx
})

export type PxPos = z.infer<typeof zPxPos>

export const zPxSize = z.object({
	pxWidth: zPx,
	pxHeight: zPx
})

export type PxSize = z.infer<typeof zPxSize>

export const zEdge = z.object({
	startX: zScaledIntPercentage,
	startY: zScaledIntPercentage,
	endX: zScaledIntPercentage,
	endY: zScaledIntPercentage,
	error: z.instanceof<typeof KnownError>(KnownError).or(z.object({ code: z.string(), message: z.string() })).optional()
})

export type Edge = z.infer<typeof zEdge>

export const zDirection = z.enum(["up", "down", "left", "right"] as const)
export const zExtendedDirection = z.union([zDirection, z.enum(["horizontal", "vertical"])])
export const zSide = z.enum(["top", "bottom", "left", "right"] as const)
export const zOrientation = z.enum(["horizontal", "vertical"])
export const zExtendedSide = z.union([zSide, zOrientation])

export type Direction = z.infer<typeof zDirection>
export type ExtendedDirection = z.infer<typeof zExtendedDirection>
export type Orientation = z.infer<typeof zOrientation>

export type EdgeSide = z.infer<typeof zSide>
export type ExtendedEdgeSide = z.infer<typeof zExtendedSide>

export const zBaseRect = zSize.extend(zPos.shape)
export type BaseRect = z.infer<typeof zBaseRect>
export type BaseRectCss = {
	x: string
	y: string
	width: string
	height: string
	translate?: string
}

export type EdgeCss = BaseRectCss & {
	translate: string
}
export type PointCss = BaseRectCss & {
	translate: string
}

export type Intersections = Record<number, Record<number, number>>

export type IntersectionEntry = {
	point: Point
	count: number
	sharesEdge: boolean
	sharedEdges: { horizontal: Edge[], vertical: Edge[] }
	isWindowEdge: boolean
}


export const zLayoutFrame = zBaseRect.extend({
	id: z.uuid(),
	docked: zSide.optional(),
	collapsed: z.number().min(1).optional()
}).loose()

export const zLayoutFrameLoose = zLayoutFrame.loose()

export interface Register {
}
/* eslint-disable @typescript-eslint/naming-convention */
export type ExtendedLayoutFrame = Register extends { ExtendedLayoutFrame: infer T } ? T : unknown
export type ExtendedLayoutWindow = Register extends { ExtendedLayoutWindow: infer T } ? T : unknown
export type ExtendedLayout = Register extends { ExtendedLayout: infer T } ? T : unknown
export type ExtendedWorkspace = Register extends { ExtendedWorkspace: infer T } ? T : unknown
/* eslint-enable @typescript-eslint/naming-convention */

export type BaseLayoutFrame = Size & Pos & {
	id: FrameId
	docked?: EdgeSide
	collapsed?: number
}
export type LayoutFrame = ExtendedLayoutFrame & BaseLayoutFrame
export type LayoutFrames = Record<string, LayoutFrame>

const baseLayoutWindow = z.object({
	id: z.uuid(),
	activeFrame: z.string().optional(),
	frames: z.record(z.string(), zLayoutFrame)
}).extend(zPxSize.shape)
	.extend(zPxPos.shape)

export const zLayoutWindow = baseLayoutWindow
export const zLayoutWindowLoose = baseLayoutWindow.loose()
// types are re-declared so that if they are extended, the types are still correct

export type BaseLayoutWindow = {
	id: WindowId
	activeFrame?: string
	frames: LayoutFrames
	pxWidth: number
	pxHeight: number
	pxX: number
	pxY: number
}
export type LayoutWindow = ExtendedLayoutWindow & BaseLayoutWindow
export type LayoutWindows = Record<string, LayoutWindow>

const baseWorkspace = baseLayoutWindow.pick({ activeFrame: true, frames: true }).superRefine((data, ctx) => {
	for (const [frameId, frame] of Object.entries(data.frames ?? {})) {
		if ((frame as any).docked === undefined) continue
		const edge = (frame as any).docked
		if (edge === "left" && (frame as any).x !== 0) {
			ctx.addIssue({ code: "custom", message: `Docked frame ${frameId} on left edge must have x=0`, path: ["frames", frameId, "x"] })
		}
		if (edge === "right" && (frame as any).x + (frame as any).width !== settings.maxInt) {
			ctx.addIssue({ code: "custom", message: `Docked frame ${frameId} on right edge must have x+width=maxInt`, path: ["frames", frameId, "x"] })
		}
		if (edge === "top" && (frame as any).y !== 0) {
			ctx.addIssue({ code: "custom", message: `Docked frame ${frameId} on top edge must have y=0`, path: ["frames", frameId, "y"] })
		}
		if (edge === "bottom" && (frame as any).y + (frame as any).height !== settings.maxInt) {
			ctx.addIssue({ code: "custom", message: `Docked frame ${frameId} on bottom edge must have y+height=maxInt`, path: ["frames", frameId, "y"] })
		}
	}
})
export const zWorkspace = baseWorkspace.strict()
export const zWorkspaceLoose = zWorkspace.loose()

export type Workspace = Pick<LayoutWindow, "activeFrame" | "frames"> & ExtendedWorkspace

const baseLayout = z.object({
	activeWindow: z.string().optional(),
	windows: z.record(z.string(), zLayoutWindow)
})

export const zLayout = baseLayout

export const zInitializedLayout = zLayout.required({
	activeWindow: true
})
	.refine(layout => {
		if (layout.windows[layout.activeWindow] === undefined) {
			return false
		}
		return zLayoutWindow.safeParse(layout.windows[layout.activeWindow]).success
	}, { message: "An initialized layout's active window must exist and be valid." })

export type Layout = ExtendedLayout & {
	activeWindow?: string
	windows: LayoutWindows
}
const zLayoutShape = z.discriminatedUnion("type", [
	z.object({ type: z.literal("rect"), data: zBaseRect, attrs: z.record(z.string(), z.string()).optional() }),
	z.object({ type: z.literal("edge"), data: zEdge, attrs: z.record(z.string(), z.string()).optional() })
])

export type LayoutShape = z.infer<typeof zLayoutShape>

const zBaseDeco = z.object({
	shapes: z.array(zLayoutShape).default([])
})

export type BaseDeco = z.infer<typeof zBaseDeco>

export const zSplitDeco = zBaseDeco.extend({
	id: z.uuid(),
	type: z.literal("split"),
	position: zScaledIntPercentage,
	direction: zDirection
})
export const zRawSplitDeco = zSplitDeco.omit({ shapes: true })
export type RawSplitDeco = z.infer<typeof zRawSplitDeco>
export type SplitDeco = z.infer<typeof zSplitDeco>

const zCloseDeco = zBaseDeco.extend({
	id: z.uuid(),
	type: z.literal("close"),
	force: z.boolean().optional()
})
export type CloseDeco = z.infer<typeof zCloseDeco>


const zFrameDeco = zBaseDeco.extend({
	id: z.uuid(),
	type: z.literal("drop"),
	position: zSide.or(z.enum(["center"]))
})

export type FrameDeco = z.infer<typeof zFrameDeco>

export const zDeco = z.union([
	zSplitDeco,
	zCloseDeco,
	zFrameDeco
])

export type Deco = z.infer<typeof zDeco>

export const LAYOUT_ERROR = enumFromArray([
	"INVALID_ID",
	"ID_ALREADY_EXISTS",
	"CANT_RESIZE",
	"NO_ACTIVE_WINDOW",
	"NO_ACTIVE_FRAME",
	"CANT_CLOSE_NO_DRAG_EDGE",
	"CANT_CLOSE_NEARBY_FRAMES_TOO_SMALL",
	"CANT_CLOSE_SINGLE_FRAME",
	"CANT_SPLIT_FRAME_TOO_SMALL",
	"CANT_CLOSE_WITHOUT_FORCE",
	"CANT_SWAP_WITH_SELF",
	"CANT_REARRANGE_TO_SAME_RELATIVE_POSITION",
	"CANT_REARRANGE_WITH_DOCKED_EDGES",
	"CANT_REARRANGE_DOCKED_WITH_NON_DOCKED",
	"CANT_SPLIT_DOCKED_FRAME",
	"NO_SPACE_TO_REDISTRIBUTE",
	"REDISTRIBUTE_OUT_OF_BOUNDS",
	"REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES",
	"FRAME_ALREADY_DOCKED_ON_SIDE",
	"CANT_LEAVE_NO_UNDOCKED_FRAMES",
	"CANT_UNDOCK_COLLAPSED_FRAME",
	"CANT_COLLAPSE_NOT_DOCKED",
	"CANT_UNCOLLAPSE_NOT_COLLAPSED",
	"NO_FILL_CANDIDATES",
	"CANT_RESIZE_COLLAPSED_FRAME",
	"CANT_RESIZE_SINGLE_FRAME"
])

export type LayoutError = EnumLike<typeof LAYOUT_ERROR>

export type LayoutErrorInfo<T extends LayoutError> = LayoutErrorsInfo[T] extends undefined ? never : LayoutErrorsInfo[T]

export type LayoutErrorsInfo = {
	[LAYOUT_ERROR.INVALID_ID]: {
		id: string | undefined
	}
	[LAYOUT_ERROR.ID_ALREADY_EXISTS]: {
		id: string | undefined
	}
	[LAYOUT_ERROR.CANT_RESIZE]: {
		size: Size
	}
	[LAYOUT_ERROR.NO_ACTIVE_WINDOW]: Record<string, never>
	[LAYOUT_ERROR.NO_ACTIVE_FRAME]: Record<string, never>
	[LAYOUT_ERROR.CANT_CLOSE_NO_DRAG_EDGE]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.CANT_CLOSE_NEARBY_FRAMES_TOO_SMALL]: {
		frame: LayoutFrame
		nearbyFrames: LayoutFrame[]
		minSize: Size
	}
	[LAYOUT_ERROR.CANT_CLOSE_SINGLE_FRAME]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.CANT_SPLIT_FRAME_TOO_SMALL]: {
		frame: LayoutFrame
		newSize: number
		minSize: number
	}
	[LAYOUT_ERROR.CANT_CLOSE_WITHOUT_FORCE]: {
		frame: LayoutFrame
		framesRequiredToBeDeleted: LayoutFrame[]
	}
	[LAYOUT_ERROR.CANT_SWAP_WITH_SELF]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.CANT_REARRANGE_TO_SAME_RELATIVE_POSITION]: {
		movingFrameId: string
		hoveredFrameId: string
		zoneSide: Zone["side"]
	}
	[LAYOUT_ERROR.CANT_REARRANGE_WITH_DOCKED_EDGES]: {
		movingFrameId: string
		hoveredFrameId: string
		zoneSide: Zone["side"]
	}
	[LAYOUT_ERROR.CANT_REARRANGE_DOCKED_WITH_NON_DOCKED]: {
		movingFrameId: string
		hoveredFrameId: string
		zoneSide: Zone["side"]
	}
	[LAYOUT_ERROR.CANT_SPLIT_DOCKED_FRAME]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE]: {
		minFrameSize: number
		frameSizeNeeded: number
	}
	[LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS]: {
		min: number
		max: number
		wanted: number
	}
	[LAYOUT_ERROR.FRAME_ALREADY_DOCKED_ON_SIDE]: {
		side: EdgeSide
		id: string
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	[LAYOUT_ERROR.CANT_LEAVE_NO_UNDOCKED_FRAMES]: {}
	[LAYOUT_ERROR.CANT_UNDOCK_COLLAPSED_FRAME]: {
		frame: string
	}
	[LAYOUT_ERROR.CANT_COLLAPSE_NOT_DOCKED]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.CANT_UNCOLLAPSE_NOT_COLLAPSED]: {
		frame: LayoutFrame
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	[LAYOUT_ERROR.NO_FILL_CANDIDATES]: {}
	[LAYOUT_ERROR.CANT_RESIZE_COLLAPSED_FRAME]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.CANT_RESIZE_SINGLE_FRAME]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.REDISTRIBUTE_WOULD_RESULT_IN_INVALID_FRAMES]: {
		problemEdgeCoordinates: number[]
	}
}

// todo rename to toOpposite
export type HasOpposite = Direction | EdgeSide | ExtendedDirection | ExtendedEdgeSide | keyof Point | keyof Size


export type BaseZone = {
	x: number
	y: number
	width: number
	height: number
	pxWidth: number
	pxHeight: number
}

export type FrameZone = BaseZone & {
	type: "frame"
	side: EdgeSide | "center"
}

export type WindowEdgeZone = BaseZone & {
	type: "window"
	side: EdgeSide
}

export type Zone = FrameZone | WindowEdgeZone

export const zWindowCreate = zLayoutWindowLoose
	.partial({ id: true, pxWidth: true, pxHeight: true, pxX: true, pxY: true })
	.extend({ frames: zLayoutWindow.shape.frames.optional() })

export const zLayoutCreate = baseLayout.loose()
	.extend({
		windows: zLayout.shape.windows.optional()
	})

export const zFrameCreate = zLayoutFrame.partial({
	id: true,
	x: true,
	y: true,
	width: true,
	height: true
})


export type LayoutShapeRectProps
	= & {
		css: BaseRectCss
	}


export type LayoutChange<TInfo = never> = {
	modified: LayoutFrame[]
	created: LayoutFrame[]
	deleted: LayoutFrame[]
	window?: Partial<LayoutWindow>
	info?: TInfo
}
export type MoveState = {
	/** The current directions in the corresponding orientations that the user is dragging in. */
	moveDirections: Record<Orientation, Direction | undefined>
	/** The curren point (in scaled window coordinates) the user is dragging at. */
	movePoint?: Point
	/** Cumulative pixel distance the user has dragged from the initial click point. 0 on start, increases on each move. */
	moveDistance: number
	/** Whether the user is currently dragging and what type of drag. Is truthy string during all drag events. */
	isMoving: boolean | "frame" | "edge"
	/** Whether to show the moved frames while dragging. */
	showMoving: boolean
	/** The frame being dragged during a frame drag. Only set when isMoving is "frame". */
	movingFrameId?: FrameId
	/**
	 * The edges that are currently being dragged. There are multiple edges if they drag an intersection since what's actually happening is we're just dragging the closest horizontal and vertical edges.
	 */
	movingEdges: Edge[]
	/**
	 * The intersection that is currently being dragged.
	 */
	movingIntersection?: IntersectionEntry
	/** The "visual" edges that can be displayed for dragging. See {@link getVisualEdges} */
	visualEdges: Edge[]
	/**
	 * The frames touching the currently dragged edges. Each entry corresponds to the frames touching the corresponding dragging edge.
	 *
	 * So you can use the index in movingEdges to get the corresponding frames.
	 */
	touchingFrames: Record<string, LayoutFrame>[]
	/**
	 * Same as touchingFrames, but with the frames in an array.
	 */
	touchingFramesArrays: LayoutFrame[][]
	/**
	 * All the frames, with/without the currently dragged frames depending on if `showMoving` is true.
	 */
	frames: Record<string, LayoutFrame>
	/**
	 * The frame that is currently being hovered over (according to whether `movePoint` in in the frame or not).
	 */
	moveHoveredFrame: LayoutFrame | undefined
	/**
	 * A list of corner intersections. Frames can also be dragged by these.
	 */
	intersections: IntersectionEntry[]
	/**
	 * Whether the move was initiated from a point along the window edge.
	 */
	isMovingFromWindowEdge: boolean
	/** Custom context passed to moveStart, available to action handlers via state.eventContext. */
	eventContext?: Record<string, unknown>
	win: LayoutWindow
}


export interface ActionChangeResult {
	/** Whether the move should update the edges. Defaults to false. */
	updateEdges?: boolean
	/** Deco shapes produced by this action during this drag step. */
	shapes: LayoutShape[]
	/** Whether to show the moved edges while dragging. Defaults to true. */
	showMoving?: boolean
}
export type MoveChangeResult = Omit<ActionChangeResult, "shapes">


/**
 * A drag action describes when and how to handle a drag event.
 *
 * For example, there are the default split/close actions that can be triggered in certain situations. This could be when holding down a modifier or key, or some other condition (e.g. the user is dragging a specific edge).
 *
 * Each action should handle it's configuration and saving/caching any state it needs. See {@link SplitAction} and {@link CloseAction} for examples.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IAction {
	/** A unique name for your action. */
	name: string
	/**
	 * Called when the drag coordinates change (during any event).
	 *
	 * Should return `{ allowed: true/false, shapes: LayoutShape[] }` to control whether the action is allowed and edges update and what deco shapes to render.
	 *
	 * Note that the allowed return type only affect the `move` event but is also typed as `boolean` for other events for ease of use.
	 *
	 * Use also to cleanup your action when type is "end".
	 *
	 * See also {@link ActionHandler.onMoveChange} to understand it's lifecycle as it is the extended version of.
	 */
	onMoveChange: <T extends "start" | "move" | "end">(
		type: T,
		e: T extends "end" ? PointerEvent | undefined : PointerEvent,
		state: MoveState,
		forceRecalculateEdges: () => void,
		/** Calls moveEnd with updateEdges: false. This can technically be called from "end", it should still work. */
		cancel: (e: PointerEvent | KeyboardEvent | undefined, state: MoveState) => void,
		/** Saves result to resolve moveStart promise with then calls moveEnd with given apply. Not available during "end" event. It's designed for resolving from other external evente (e.g. key events). */
		resolve: T extends "end" ? undefined : ((opts: ActionResolve) => void)
	) => ActionChangeResult
	/**
	 * Is called after `onMoveChange("end")` with the same event. Will not be called if the request was cancelled.
	 *
	 * You should apply your action if possible and return whether it was applied `wasApplied` as well as `updateEdges` and `result` (optional), see {@link ActionHandler.onMoveApply}, which this is the extended version of.
	 *
	 * Do not reset state here, use onMoveChange ("end").
	 */
	onMoveApply: (state: MoveState, forceRecalculateEdges: () => void) => ActionApplyResult
	/**
	 * Should return true if it should handle the "request"/event (e.g. some modifier is being pressed => user is requesting x action).
	 *
	 * The user is not necessarily dragging at this point, though they might also change actions mid drag. So it does not necessarily mean the event is allowed.
	 *
	 * Here is where you should initiate your state. Don't allow the action by default unless it can always be allowed.
	 */
	canHandleRequest(
		e: KeyboardEvent | PointerEvent,
		state: MoveState,
		forceRecalculateEdges: () => void
	): boolean
	/**
	 * Plugins should implement some basic debug logs by calling {@link ActionHandler.debugState } at least before and after applying actions in onMoveApply. Debug can be a string because it can be an object key to filter on (see the debugState function).
	 *
	 *
	 * Calls look like this usually, where this.state is the plugin state:
	 * ```ts
	 * ActionHandler.debugState(this.name, "before", state, this.state, this.debug)
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
	/**
	 * Called when an action is cancelled. Call action specific onCancel hooks here.
	 */
	// note: internally this is done by the actionhandler wrapping the given cancel function for an event
	cancel(e: PointerEvent | KeyboardEvent | undefined, state: MoveState): void
	/**
	 * Called after visual edges are recalculated, once per edge. Action handlers can annotate edges with error info here ({@link Edge.error}).
	 *
	 * When `LayoutEdges` sees an error it adds the message as the title and the following classes:
	 * - `data-error` attribute with the error message
	 * - class `drag-edge-errored` on the thick drag handle
	 * - class `edge-errored` on the thin visual edge
	 *
	 * Tailwind example to style errored edges:
	 * ```css
	 * [&_.drag-edge-errored]:cursor-not-allowed
	 * [&_.drag-edge-errored]:bg-red-500/30
	 * [&_.edge-errored]:bg-red-500/20
	 * ```
	 *
	 * Regarding the title, this is a temporary solution until lib is refactored to more composable components.
	 *
	 * NOTE: Annotation does NOT prevent dragging/events on edges.
	 */
	annotateEdge?(edge: Edge, frames: LayoutFrame[]): void
}
export type EdgeMoveStartData = { edge?: Edge, intersection?: IntersectionEntry }
export type FrameMoveStartData = { frameId: FrameId }

export type ActionHandlerApplyResult = {
	// /** Whether the move should update the edges. Defaults to false which resets to the position before moving started.*/
	updateEdges: boolean
	/** Value to resolve the drag promise with. Ignored if `updateEdges` is false. */
	result?: any
}

export type ActionApplyResult = ActionHandlerApplyResult & { wasApplied: boolean }

export type ActionResolve = { apply: boolean, result?: any }

/**
 * Handler interface for drag actions.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IActionHandler {
	eventHandler: (e: KeyboardEvent, state: MoveState, forceRecalculateEdges: () => void) => void

	/**
	 * Called when the drag coordinates change (during any event). Should return updateEdges true to allow the edges to be updated/moved, or false to prevent it. See also {@link MoveChangeHandler} for the built in action handler.
	 *
	 * Can be used to save some context/info to later apply safely during onMoveApply.
	 *
	 * The call order is:
	 * - onMoveChange("start", ...)
	 * - onMoveChange("move", ...)
	 * - onMoveChange("end", ...)
	 * - onMoveApply(...) (IF moveEnd was called with apply: true, otherwise this is skipped)
	 * 	- If anything calls cancel or resolve they call onMoveApply (cancel with apply: false, resolve with whatever apply value you gave it).
	 * - onMoveEnded() // do cleanup here
	 *
	 * Note also that resolve just resolves the promise value (after onMoveApply("end") and before onMoveEnded()). Depending on what you're doing you might still have to apply the result, remember onMoveApply will still be called if you do `resolve({ apply:true })`.
	 */
	onMoveChange<T extends "start" | "move" | "end">(
		type: T,
		e: T extends "end" ? PointerEvent | undefined : PointerEvent,
		state: MoveState,
		forceRecalculateEdges: () => void,
		/** Calls moveEnd with apply: false. This can technically be called from "end", it should still work. */
		cancel: (e: PointerEvent | KeyboardEvent | undefined, state: MoveState) => void,
		/** Saves result to resolve moveStart promise with then calls moveEnd with given apply. Not available during "end" event. It's designed for resolving from other external evente (e.g. key events). */
		resolve: T extends "end" ? undefined : ((opts: ActionResolve) => void)
	): MoveChangeResult
	/**
	 * Called when drag will be applied. If moveEnd was called with apply false, it will not be called.
	 * Return `{updateEdges: false`} to not apply the regular drag end changes (i.e. return false to reset to the position before dragging). Optionally return a `result` value to resolve the promise with.
	 *
	 * Do not use for resetting handler state, use onMoveEnded for that.
	 */
	onMoveApply: (
		state: MoveState,
		forceRecalculateEdges: () => void
	) => ActionHandlerApplyResult

	/** For doing cleanup */
	onMoveEnded: () => void

	/**
	 * Called after visual edges are recalculated. Action handlers can annotate edges with error info.
	 */
	annotateEdges?: (edges: Edge[], frames: LayoutFrame[]) => void
}

// drag start overloads for triggering dragsj
export type MoveStartFn = {
	(e: PointerEvent, type: "edge", data: EdgeMoveStartData): void
	(e: PointerEvent, type: "frame", data: FrameMoveStartData): void
}

export type * from "./vue.js"

