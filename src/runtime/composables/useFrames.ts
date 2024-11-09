import { debounce } from "@alanscodelog/utils/debounce.js"
import { keys } from "@alanscodelog/utils/keys.js"
import type { Ref } from "vue"
import { computed, ref, watchEffect } from "vue"

import { DragDirectionStore } from "../drag/DragDirectionStore.js"
import { cloneFrame } from "../helpers/cloneFrame.js"
import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { getIntersections } from "../helpers/getIntersections.js"
import { getVisualEdges } from "../helpers/getVisualEdges.js"
import { isWindowEdge } from "../helpers/isWindowEdge.js"
import { moveEdge } from "../helpers/moveEdge.js"
import { toWindowCoord } from "../index.js"
import { findFramesTouchingEdge } from "../layout/findFramesTouchingEdge.js"
import { isPointInFrame } from "../layout/isPointInFrame.js"
import type { Direction, Edge, LayoutFrame, LayoutWindow, Point } from "../types/index.js"

export type DragStartHandler = (layoutEvent: { point: Point, edge: Edge, abortController: AbortController
}, event: PointerEvent,) => void
export type DragMoveHandler = (layoutEvent: { point: Point }, event: PointerEvent) => void
// event might not be defined because the handler can be called synthetically
export type DragEndHandler = (layoutEvent: { point: Point, apply: boolean }, event?: PointerEvent) => void


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useFrames(
	win: Ref<LayoutWindow>,
	/** Whether to show merged the moved frames while dragging. */
	showDragging: Ref<boolean>,
	{ onDragChange, onDragApply }: {
		/**
			* Called when the drag coordinates change (during any event).
			* Can be used to save some context/info to later apply safely during onDragApply.
			*/
		onDragChange: ((type: "start" | "move" | "end", e?: PointerEvent) => void)
		/**
		 * Called when drag will be applied. If dragEnd was called with apply false, it will not be called.
		 * Return false to not apply the regular drag end changes (i.e. return false to reset to the position before dragging).
		 */
		onDragApply: (() => boolean)
	}
) {
	const touchingFrames = ref<Record<string, LayoutFrame>>({})
	const touchingFramesArray = computed(() => Object.values(touchingFrames.value))

	const isDragging = ref(false)
	const dragPoint = ref<Point | undefined>()

	const dragDirection = ref<Direction | undefined>(undefined)

	const draggingEdge = ref<Edge | undefined>(undefined)
	const isDraggingWindowEdge = ref<boolean>(false)

	const frames = computed(() =>
		isDragging.value && showDragging.value
			? { ...win.value.frames, ...touchingFrames.value }
			: win.value.frames
	)

	const dragHoveredFrame = computed(() => {
		if (isDragging.value) {
			for (const id of keys(frames.value)) {
				if (isPointInFrame(frames.value[id], dragPoint.value!)) {
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
		visualEdges.value = getVisualEdges(f,{ includeWindowEdges: true })
	}, 50, {}) as any


	watchEffect(() => {
		// let request animation force recalc
		if (isDragging.value) return
		// otherwise use more performant debounced version
		debounceGetDraggableEdges(Object.values(frames.value))
	})
	function forceRecalculateEdges(): void {
		visualEdges.value = getVisualEdges(Object.values(frames.value), { includeWindowEdges: true })
	}

	const dragDirStore = new DragDirectionStore({
		onUpdate: dir => dragDirection.value = dir,
	})

	let controller: AbortController
	function dragStart(e: PointerEvent, edge: Edge): void {
		controller = new AbortController()
		controller.signal.addEventListener("abort", () => {
			draggingEdge.value = undefined
		})

		e.preventDefault()
		draggingEdge.value = edge
		const point = toWindowCoord(win.value, e)
		window.addEventListener("pointermove", dragMove, { signal: controller.signal })
		window.addEventListener("pointerup", dragEnd, { signal: controller.signal })

		dragPoint.value = point

		dragDirStore.setOrientation(getEdgeOrientation(edge))
		dragDirStore.update(point)
		if (isWindowEdge(edge)) {
			isDraggingWindowEdge.value = true
		}
		draggingEdge.value = edge
		isDragging.value = true

		const touching = findFramesTouchingEdge(edge, Object.values(win.value.frames)) ?? []
		touchingFrames.value = {}
		for (const _ of touching) touchingFrames.value[_.frame.id] = cloneFrame(_.frame)
		onDragChange("start", e)
	}

	function dragMove(e: PointerEvent): void {
		e.preventDefault()
		const point = toWindowCoord(win.value, e)
		const didChange = dragDirStore.update(point)
		dragPoint.value = point
		if (!didChange) return
		onDragChange("move", e)

		requestAnimationFrame(() => {
			// if (isDragging.value) {
			moveEdge(touchingFramesArray.value, draggingEdge.value, point)
			// }
			forceRecalculateEdges()
		})
	}

	function dragEnd(e?: PointerEvent, { apply = true }: { apply?: boolean } = {}): void {
		// this can get called from elsewhere
		controller?.abort()
		if (e) {
			const point = toWindowCoord(win.value, e)
			dragPoint.value = point
		}
		onDragChange("end", e)
		

		const doApply = apply && onDragApply()
		if (doApply) {
			for (const frame of touchingFramesArray.value) {
				win!.value.frames[frame.id] = frame
			}
		}

		isDragging.value = false
		draggingEdge.value = undefined
		isDraggingWindowEdge.value = false
		dragPoint.value = undefined
		touchingFrames.value = {}
		dragDirStore.reset()
		// this will work regardless of whether we applied the drag or not
		forceRecalculateEdges()
	}

	return {
		dragStart,
		dragEnd,
		dragMove,
		dragDirection,
		dragPoint,
		isDragging,
		draggingEdge,
		visualEdges,
		touchingFrames,
		touchingFramesArray,
		frames,
		forceRecalculateEdges,
		dragHoveredFrame,
		intersections,
		isDraggingWindowEdge
	}
}

