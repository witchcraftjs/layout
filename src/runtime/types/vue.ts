import type { ComputedRef, InjectionKey, Ref } from "vue"

// eslint-disable-next-line no-restricted-imports
import type { Direction, DragState, Edge, FrameId, IntersectionEntry, LayoutFrame, LayoutShape, LayoutWindow, Orientation, Point } from "./index.js"

export type LayoutContext = ComputedRef<
	& {
		/** The owning window, needed so we can correctly scale coordinates. */
		win: LayoutWindow
		onFocus: (frameId: string) => void
		shapes: LayoutShape[]
	}>

export const layoutContextInjectionKey = Symbol.for("@witchcraft/layout:context") as InjectionKey<LayoutContext>

export interface UseFramesContext {
	dragStart: {
		(e: PointerEvent, type: "edge", data: { edge?: Edge, intersection?: IntersectionEntry }): void
		(e: PointerEvent, type: "frame", data: { frameId: FrameId }): void
	}
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
