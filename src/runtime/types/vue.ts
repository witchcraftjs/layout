import type { ComputedRef, InjectionKey, Ref } from "vue"

// eslint-disable-next-line no-restricted-imports
import type { Direction, Edge, EdgeMoveStartData, ExtendedMoveTypes, FrameId, FrameMoveStartData, IActionHandler, IntersectionEntry, LayoutFrame, LayoutShape, LayoutWindow, MoveState, Orientation, Point } from "./index.js"

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
	moveStart<
		T extends "edge" | "frame" | "other",
		TContextType extends keyof ExtendedMoveTypes,
		TContext extends ExtendedMoveTypes[TContextType],
		TContextReturn extends TContext extends { resolve: infer R } ? R : never,
		TContextMoveType extends TContext extends { moveType: infer M } ? M : never,
		TContextContext extends TContext extends { context: infer C } ? C : never,
		// cursed https://github.com/microsoft/TypeScript/issues/23182
		TType extends [TContextMoveType] extends [never] ? T : TContextMoveType
	>(
		e: PointerEvent | undefined,
		type: TType,
		// someday this will work
		data: T extends "edge" ? EdgeMoveStartData : T extends "frame" ? FrameMoveStartData : undefined,
		opts?: {
			moveEvent?: string
			endEvent?: string
			context?: { type: TContextType } & TContextContext
		}
	): TContext extends never
		? Promise<void>
		: Promise<TContextReturn>
	onMove: (e: PointerEvent) => void
	moveEnd: (e?: PointerEvent, options?: { apply?: boolean }) => void
	cancel: () => void
	moveDirections: Ref<Record<Orientation, Direction | undefined>>
	movePoint: Ref<Point | undefined>
	isMoving: Ref<false | "frame" | "edge" | "other">
	showMoving: Ref<boolean>
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

