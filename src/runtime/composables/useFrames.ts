import { debounce } from "@alanscodelog/utils/debounce"
import { keys } from "@alanscodelog/utils/keys"
import type { Ref } from "vue"
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"

import { cloneFrame } from "../helpers/cloneFrame.js"
import { getIntersections } from "../helpers/getIntersections.js"
import { getVisualEdges } from "../helpers/getVisualEdges.js"
import { isWindowEdge } from "../helpers/isWindowEdge.js"
import { moveEdge } from "../helpers/moveEdge.js"
import { toWindowCoord } from "../helpers/toWindowCoord.js"
import { findFramesTouchingEdge } from "../layout/findFramesTouchingEdge.js"
import { isPointInRect } from "../layout/isPointInRect.js"
import { MoveDirectionStore } from "../move/MoveDirectionStore.js"
import type { ActionHandler, ActionHandlerApplyResult, Direction, Edge, EdgeMoveStartData, FrameId, FrameMoveStartData, IntersectionEntry, LayoutFrame, LayoutWindow, MoveState, Orientation, Point } from "../types/index.js"

export function useFrames(
	win: Ref<LayoutWindow>,
	handler: ActionHandler
) {
	const movingEdges = ref<Edge[]>([])

	// each entry corresponds to the frames touching the corresponding dragging edge
	const touchingFrames = ref<Record<string, LayoutFrame>[]>([])
	const allTouchingFrames = computed(() => {
		const result: Record<string, LayoutFrame> = {}
		for (const entry of touchingFrames.value) {
			for (const frame of Object.values(entry)) {
				result[frame.id] = frame
			}
		}
		return result
	})

	const touchingFramesArrays = computed(() => touchingFrames.value.map(entry => Object.values(entry)))

	const isMoving = ref<false | "frame" | "edge">(false)
	const showMoving = ref(false)
	const movePoint = ref<Point | undefined>()

	const moveDirections = ref<Record<Orientation, Direction | undefined>>({} as any)

	let moveStartPoint: Point | undefined
	const moveDistance = ref(-1)

	const movingIntersection = ref<IntersectionEntry | undefined>(undefined)
	const isMovingFromWindowEdge = ref<boolean>(false)

	const movingFrameId = ref<FrameId | undefined>()
	const eventContext = ref<Record<string, unknown> | undefined>()

	const frames = computed(() =>
		isMoving.value && showMoving.value
			? { ...win.value.frames, ...allTouchingFrames.value }
			: win.value.frames
	)

	const moveHoveredFrame = computed(() => {
		if (isMoving.value) {
			for (const id of keys(frames.value)) {
				if (isPointInRect(frames.value[id], movePoint.value!)) {
					return frames.value[id]
				}
			}
		}
		return undefined
	})

	const visualEdges = ref<Edge[]>([])
	const intersections = computed(() => getIntersections(visualEdges.value))
	// avoid expensive calculation of edges when lots of frames are added/removed
	// all at once (e.g. by clicking on some command many times in a row)
	const debounceGetMoveableEdges = debounce((f: LayoutFrame[]) => {
		visualEdges.value = getVisualEdges(f, { includeWindowEdges: true })
		handler.annotateEdges?.(visualEdges.value, f)
	}, 50, {}) as any

	watch([isMoving, frames], () => {
		// let request animation force recalc
		if (isMoving.value) return
		// otherwise use more performant debounced version
		debounceGetMoveableEdges(Object.values(frames.value))
	}, { deep: true })
	debounceGetMoveableEdges(Object.values(frames.value))

	function forceRecalculateEdges(): void {
		visualEdges.value = getVisualEdges(Object.values(frames.value), { includeWindowEdges: true })
		handler.annotateEdges?.(visualEdges.value, Object.values(frames.value))
	}

	const moveDirStore = new MoveDirectionStore({
		onUpdate: dir => moveDirections.value = dir
	})

	const state = computed(() => ({
		moveDirections: moveDirections.value,
		movePoint: movePoint.value,
		moveDistance: moveDistance.value,
		isMoving: isMoving.value,
		showMoving: showMoving.value,
		movingFrameId: movingFrameId.value,
		movingEdges: movingEdges.value,
		movingIntersection: movingIntersection.value,
		visualEdges: visualEdges.value,
		touchingFrames: touchingFrames.value,
		touchingFramesArrays: touchingFramesArrays.value,
		frames: frames.value,
		moveHoveredFrame: moveHoveredFrame.value,
		intersections: intersections.value,
		isMovingFromWindowEdge: isMovingFromWindowEdge.value,
		eventContext: eventContext.value,
		win: win.value
	} satisfies MoveState))

	let controller: AbortController
	let moveResolve: ((result: any) => void) | undefined
	let moveResult: any

	function resetState(): void {
		moveStartPoint = undefined

		moveResolve?.(moveResult)
		moveResolve = undefined
		moveResult = undefined

		movingEdges.value = []
		movingIntersection.value = undefined
		isMoving.value = false
		movePoint.value = undefined
		moveDistance.value = -1
		touchingFrames.value = []
		movingFrameId.value = undefined
		eventContext.value = undefined
		moveDirStore.reset()
		showMoving.value = false
		forceRecalculateEdges()
		handler.onMoveEnded()
	}

	function moveStart<T extends "edge" | "frame">(
		e: PointerEvent,
		type: T,
		// someday this will work
		data: T extends "edge" ? EdgeMoveStartData : FrameMoveStartData,
		{
			moveEvent = "pointermove",
			endEvent = "pointerup",
			context
		}: {
			moveEvent?: string
			endEvent?: string
			context?: Record<string, unknown>
		} = {}
	): Promise<any> {
		// if already dragging, abort previous (resetState resolves the old promise)
		if (controller) {
			controller.abort()
		}

		const promise = new Promise<any>(resolve => {
			moveResolve = resolve
		})

		controller = new AbortController()
		controller.signal.addEventListener("abort", () => resetState())

		e.preventDefault()
		window.addEventListener(moveEvent, onMove as EventListener, { signal: controller.signal })
		window.addEventListener(endEvent, moveEnd as EventListener, { signal: controller.signal })

		const point = toWindowCoord(win.value, e)
		movePoint.value = point
		moveStartPoint = { ...point }
		moveDirStore.update(point)
		eventContext.value = context

		isMoving.value = type
		showMoving.value = true

		if (type === "frame") {
			movingFrameId.value = (data as FrameMoveStartData).frameId
		} else {
			const { edge, intersection } = data as EdgeMoveStartData
			movingIntersection.value = intersection

			movingEdges.value = edge
				? [edge!]
				: [
						...(movingIntersection.value?.sharedEdges.horizontal ?? []),
						...(movingIntersection.value?.sharedEdges.vertical ?? [])
					]


			isMovingFromWindowEdge.value = movingEdges.value.some(_ => isWindowEdge(_))

			const framesArray = Object.values(win.value.frames)

			touchingFrames.value = []
			// all frames in touchingFrames must be clones
			// BUT they must be the same clone even if they are referenced by multiple dragging edges
			const clones = new Map<string, LayoutFrame>()
			for (let i = 0; i < movingEdges.value.length; i++) {
				const movingEdge = movingEdges.value[i]
				touchingFrames.value[i] = {}
				for (const { frame } of findFramesTouchingEdge(movingEdge, framesArray)) {
					if (!clones.has(frame.id)) {
						const clone = cloneFrame(frame)
						touchingFrames.value[i][frame.id] = clone
						clones.set(frame.id, clone)
					} else {
						touchingFrames.value[i][frame.id] = clones.get(frame.id)!
					}
				}
			}
		}

		const res = handler.onMoveChange("start", e, state.value, forceRecalculateEdges, cancel, resolve)
		showMoving.value = res.showMoving ?? true
		return promise
	}

	function onMove(e: PointerEvent): void {
		e.preventDefault()
		const point = toWindowCoord(win.value, e)
		const didChange = moveDirStore.update(point)
		movePoint.value = point
		// at least one drag move has happened
		moveDistance.value = 0
		if (moveStartPoint) {
			moveDistance.value = Math.sqrt(
				Math.pow(point.x - moveStartPoint.x, 2) + Math.pow(point.y - moveStartPoint.y, 2)
			)
		}
		if (!didChange) return
		onMoveChange(e, "move", point)
	}

	function onMoveChange(e: PointerEvent | undefined, type: "move" | "end", point: Point | undefined) {
		const res = handler.onMoveChange(type, e, state.value, forceRecalculateEdges, cancel, type === "end" ? undefined : resolve)


		showMoving.value = res.showMoving ?? true
		if (!res.updateEdges) return

		if (isMoving.value === "edge" && point) {
			requestAnimationFrame(() => {
				for (let i = 0; i < movingEdges.value.length; i++) {
					const movingEdge = movingEdges.value[i]
					if (movingEdge) {
						moveEdge(touchingFramesArrays.value[i], movingEdge, point)
					}
				}
				forceRecalculateEdges()
			})
		}
	}

	function moveEnd(e?: PointerEvent, { apply = true }: Partial<Pick<ActionHandlerApplyResult, "apply">> = {}): void {
		if (e) {
			const point = toWindowCoord(win.value, e)
			movePoint.value = point
		}

		onMoveChange(e, "end", movePoint.value)

		if (apply) {
			const applyResult = handler.onMoveApply(state.value, forceRecalculateEdges)
			moveResult = applyResult.result
			if (applyResult.apply) {
				for (const frame of touchingFramesArrays.value.flat()) {
					win!.value.frames[frame.id] = frame
				}
			}
		}

		// this can get called from elsewhere
		// also takes care of cleanup, resolving promise, and calling onMoveEnded
		controller?.abort()
	}

	function cancel(): void {
		moveEnd(undefined, { apply: false })
	}
	function resolve({ apply, result: value }: ActionHandlerApplyResult): void {
		moveResult = value
		moveEnd(undefined, { apply })
	}

	const keydownController = new AbortController()
	const wrappedKeydownHandler = (e: KeyboardEvent): void => {
		handler.eventHandler(e, state.value, forceRecalculateEdges)
	}
	onMounted(() => {
		window.addEventListener("keydown", wrappedKeydownHandler, {	signal: keydownController.signal })
		window.addEventListener("keyup", wrappedKeydownHandler, { signal: keydownController.signal })
	})

	onBeforeUnmount(() => {
		controller?.abort()
		keydownController?.abort()
	})

	return {
		moveStart,
		moveEnd,
		cancel,
		onMove,
		moveDirections,
		movePoint,
		isMoving,
		movingEdges,
		movingIntersection,
		visualEdges,
		touchingFrames,
		touchingFramesArrays,
		frames,
		moveHoveredFrame,
		intersections,
		isMovingFromWindowEdge,
		forceRecalculateEdges,
		state,
		showMoving,
		movingFrameId,
		actionHandler: handler
	}
}
