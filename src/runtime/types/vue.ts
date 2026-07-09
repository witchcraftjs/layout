import type { ComputedRef, InjectionKey, Ref } from "vue"

// eslint-disable-next-line no-restricted-imports
import type { Direction, Edge, FrameId, IActionHandler, IntersectionEntry, LayoutFrame, LayoutShape, LayoutWindow, MoveState, Orientation, Point } from "./index.js"

export type LayoutContext = ComputedRef<
	& {

		/** The owning window, needed so we can correctly scale coordinates. */
		win: LayoutWindow
		onFocus: (frameId: string) => void
		shapes: LayoutShape[]
	}>

export const layoutContextInjectionKey = Symbol.for("@witchcraft/layout:context") as InjectionKey<LayoutContext>

export interface UseFramesContext {
	actionHandler: IActionHandler
	moveStart: {
		(e: PointerEvent, type: "edge", data: { edge?: Edge, intersection?: IntersectionEntry }, opts?: { moveEvent?: string, endEvent?: string, context?: Record<string, unknown> }): Promise<any>
		(e: PointerEvent, type: "frame", data: { frameId: FrameId }, opts?: { moveEvent?: string, endEvent?: string, context?: Record<string, unknown> }): Promise<any>
	}
	onMove: (e: PointerEvent) => void
	moveEnd: (e?: PointerEvent, options?: { apply?: boolean }) => void
	cancel: () => void
	moveDirections: Ref<Record<Orientation, Direction | undefined>>
	movePoint: Ref<Point | undefined>
	isMoving: Ref<false | "frame" | "edge" | "other">
	movingEdges: Ref<Edge[]>
	movingIntersection: Ref<IntersectionEntry | undefined>
	visualEdges: Ref<Edge[]>
	touchingFrames: Ref<Record<string, LayoutFrame>[]>
	touchingFramesArrays: Ref<LayoutFrame[][]>
	frames: ComputedRef<Record<string, LayoutFrame>>
	moveHoveredFrame: ComputedRef<LayoutFrame | undefined>
	intersections: ComputedRef<IntersectionEntry[]>
	isMovingFromWindowEdge: Ref<boolean>
	forceRecalculateEdges: () => void
	state: ComputedRef<MoveState>
	movingFrameId: Ref<FrameId | undefined>
}

export const moveContextInjectionKey = Symbol.for("@witchcraft/layout:moveContext") as InjectionKey<UseFramesContext>

