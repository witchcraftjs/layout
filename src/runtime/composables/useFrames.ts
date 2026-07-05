import { debounce } from "@alanscodelog/utils/debounce"
import { keys } from "@alanscodelog/utils/keys"
import type { Ref } from "vue"
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"

import { DragDirectionStore } from "../drag/DragDirectionStore.js"
import { cloneFrame } from "../helpers/cloneFrame.js"
import { getIntersections } from "../helpers/getIntersections.js"
import { getVisualEdges } from "../helpers/getVisualEdges.js"
import { isWindowEdge } from "../helpers/isWindowEdge.js"
import { moveEdge } from "../helpers/moveEdge.js"
import { toWindowCoord } from "../helpers/toWindowCoord.js"
import { findFramesTouchingEdge } from "../layout/findFramesTouchingEdge.js"
import { isPointInRect } from "../layout/isPointInRect.js"
import type { ActionHandler, ActionHandlerApplyResult, Direction, DragState, Edge, EdgeDragStartData, FrameDragStartData, FrameId, IntersectionEntry, LayoutFrame, LayoutWindow, Orientation, Point } from "../types/index.js"

export function useFrames(
	win: Ref<LayoutWindow>,
	handler: ActionHandler
) {
	const draggingEdges = ref<Edge[]>([])

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

	const isDragging = ref<false | "frame" | "edge">(false)
	const showDragging = ref(false)
	const dragPoint = ref<Point | undefined>()

	const dragDirections = ref<Record<Orientation, Direction | undefined>>({} as any)

	let dragStartPoint: Point | undefined
	const dragDistance = ref(-1)

	const draggingIntersection = ref<IntersectionEntry | undefined>(undefined)
	const isDraggingFromWindowEdge = ref<boolean>(false)

	const frameDragFrameId = ref<FrameId | undefined>()
	const eventContext = ref<Record<string, unknown> | undefined>()

	const frames = computed(() =>
		isDragging.value && showDragging.value
			? { ...win.value.frames, ...allTouchingFrames.value }
			: win.value.frames
	)

	const dragHoveredFrame = computed(() => {
		if (isDragging.value) {
			for (const id of keys(frames.value)) {
				if (isPointInRect(frames.value[id], dragPoint.value!)) {
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
	const debounceGetDraggableEdges = debounce((f: LayoutFrame[]) => {
		visualEdges.value = getVisualEdges(f, { includeWindowEdges: true })
		handler.annotateEdges?.(visualEdges.value, f)
	}, 50, {}) as any

	watch([isDragging, frames], () => {
		// let request animation force recalc
		if (isDragging.value) return
		// otherwise use more performant debounced version
		debounceGetDraggableEdges(Object.values(frames.value))
	}, { deep: true })
	debounceGetDraggableEdges(Object.values(frames.value))

	function forceRecalculateEdges(): void {
		visualEdges.value = getVisualEdges(Object.values(frames.value), { includeWindowEdges: true })
		handler.annotateEdges?.(visualEdges.value, Object.values(frames.value))
	}

	const dragDirStore = new DragDirectionStore({
		onUpdate: dir => dragDirections.value = dir
	})

	const state = computed(() => ({
		dragDirections: dragDirections.value,
		dragPoint: dragPoint.value,
		dragDistance: dragDistance.value,
		isDragging: isDragging.value,
		showDragging: showDragging.value,
		draggingFrameId: frameDragFrameId.value,
		draggingEdges: draggingEdges.value,
		draggingIntersection: draggingIntersection.value,
		visualEdges: visualEdges.value,
		touchingFrames: touchingFrames.value,
		touchingFramesArrays: touchingFramesArrays.value,
		frames: frames.value,
		dragHoveredFrame: dragHoveredFrame.value,
		intersections: intersections.value,
		isDraggingFromWindowEdge: isDraggingFromWindowEdge.value,
		eventContext: eventContext.value,
		win: win.value
	} satisfies DragState))

	let controller: AbortController
	let dragResolve: ((result: any) => void) | undefined
	let dragResult: any

	function resetState(): void {
		dragStartPoint = undefined

		dragResolve?.(dragResult)
		dragResolve = undefined
		dragResult = undefined

		draggingEdges.value = []
		draggingIntersection.value = undefined
		isDragging.value = false
		dragPoint.value = undefined
		dragDistance.value = -1
		touchingFrames.value = []
		frameDragFrameId.value = undefined
		eventContext.value = undefined
		dragDirStore.reset()
		showDragging.value = false
		forceRecalculateEdges()
	}

	function dragStart<T extends "edge" | "frame">(
		e: PointerEvent,
		type: T,
		// someday this will work
		data: T extends "edge" ? EdgeDragStartData : FrameDragStartData,
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
			dragResolve = resolve
		})

		controller = new AbortController()
		controller.signal.addEventListener("abort", () => resetState())

		e.preventDefault()
		window.addEventListener(moveEvent, dragMove as EventListener, { signal: controller.signal })
		window.addEventListener(endEvent, dragEnd as EventListener, { signal: controller.signal })

		const point = toWindowCoord(win.value, e)
		dragPoint.value = point
		dragStartPoint = { ...point }
		dragDirStore.update(point)
		eventContext.value = context

		isDragging.value = type
		showDragging.value = true

		if (type === "frame") {
			frameDragFrameId.value = (data as FrameDragStartData).frameId
		} else {
			const { edge, intersection } = data as EdgeDragStartData
			draggingIntersection.value = intersection

			draggingEdges.value = edge
				? [edge!]
				: [
						...(draggingIntersection.value?.sharedEdges.horizontal ?? []),
						...(draggingIntersection.value?.sharedEdges.vertical ?? [])
					]


			isDraggingFromWindowEdge.value = draggingEdges.value.some(_ => isWindowEdge(_))

			const framesArray = Object.values(win.value.frames)

			touchingFrames.value = []
			// all frames in touchingFrames must be clones
			// BUT they must be the same clone even if they are referenced by multiple dragging edges
			const clones = new Map<string, LayoutFrame>()
			for (let i = 0; i < draggingEdges.value.length; i++) {
				const draggingEdge = draggingEdges.value[i]
				touchingFrames.value[i] = {}
				for (const { frame } of findFramesTouchingEdge(draggingEdge, framesArray)) {
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

		const res = handler.onDragChange("start", e, state.value, forceRecalculateEdges, cancel, resolve)
		showDragging.value = res.showDragging ?? true
		return promise
	}

	function dragMove(e: PointerEvent): void {
		e.preventDefault()
		const point = toWindowCoord(win.value, e)
		const didChange = dragDirStore.update(point)
		dragPoint.value = point
		// at least one drag move has happened
		dragDistance.value = 0
		if (dragStartPoint) {
			dragDistance.value = Math.sqrt(
				Math.pow(point.x - dragStartPoint.x, 2) + Math.pow(point.y - dragStartPoint.y, 2)
			)
		}
		if (!didChange) return
		const res = handler.onDragChange("move", e, state.value, forceRecalculateEdges, cancel, resolve)


		showDragging.value = res.showDragging ?? true
		if (!res.updateEdges) return

		if (isDragging.value === "edge") {
			requestAnimationFrame(() => {
				for (let i = 0; i < draggingEdges.value.length; i++) {
					const draggingEdge = draggingEdges.value[i]
					if (draggingEdge) {
						moveEdge(touchingFramesArrays.value[i], draggingEdge, point)
					}
				}
				forceRecalculateEdges()
			})
		}
	}

	function dragEnd(e?: PointerEvent, { apply = true }: Partial<Pick<ActionHandlerApplyResult, "apply">> = {}): void {
		if (e) {
			const point = toWindowCoord(win.value, e)
			dragPoint.value = point
		}

		if (apply) {
			const applyResult = handler.onDragApply(state.value, forceRecalculateEdges)
			dragResult = applyResult.result
			if (applyResult.apply) {
				for (const frame of touchingFramesArrays.value.flat()) {
					win!.value.frames[frame.id] = frame
				}
			}
		}

		handler.onDragChange("end", e, state.value, forceRecalculateEdges, undefined, undefined)

		// this can get called from elsewhere
		// also takes care of cleanup nd resolving promise
		controller?.abort()
	}

	function cancel(): void {
		dragEnd(undefined, { apply: false })
	}
	function resolve({ apply, result: value }: ActionHandlerApplyResult): void {
		dragResult = value
		dragEnd(undefined, { apply })
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
		dragStart,
		dragEnd,
		cancel,
		dragMove,
		dragDirections,
		dragPoint,
		isDragging,
		draggingEdges,
		draggingIntersection,
		visualEdges,
		touchingFrames,
		touchingFramesArrays,
		frames,
		dragHoveredFrame,
		intersections,
		isDraggingFromWindowEdge,
		forceRecalculateEdges,
		state,
		showDragging,
		frameDragFrameId,
		actionHandler: handler
	}
}
