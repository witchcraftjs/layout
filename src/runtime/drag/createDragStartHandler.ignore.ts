import { DragDirectionStore } from "../composables/DragDirectionStore.js"
import { cloneFrame } from "../helpers/cloneFrame.js"
import { getEdgeOrientation } from "../helpers/getEdgeOrientation.js"
import { isWindowEdge } from "../helpers/isWindowEdge.js"
import { toWindowCoord } from "../helpers/toWindowCoord.js"
import { findFramesTouchingEdge } from "../layout/findFramesTouchingEdge.js"
import type { Direction,Edge, LayoutFrame, LayoutWindow, Point } from "../types/index.js"

export function createDragHandlers(
	getWindow: ()	=> LayoutWindow,
	getDragDirection: () => Direction,
	getTouchingFrames: () => Record<string, LayoutFrame>,
	setDraggingEdge: (edge?: Edge) => void,
	setDragPoint: (point?: Point) => void,
	setIsDragging: (isDragging: boolean) => void,
	setTouchingFrames: (touchingFrames: Record<string, LayoutFrame>) => void,
	setIsDraggingWindowEdge: (isDraggingWindowEdge: boolean) => void,
	setDragDirection: (direction?: Direction) => void,
	onDragChange: (type: "start" | "move" | "end", e?: PointerEvent) => void,
	onDragApply: () => boolean,
) {
	const dragDirStore = new DragDirectionStore({
		onUpdate: dir => setDragDirection(dir),
	})
	let controller: AbortController
	function dragStart(e: PointerEvent, edge: Edge): void {
		const win = getWindow()
		const dragDirection = getDragDirection()
		controller = new AbortController()
		controller.signal.addEventListener("abort", () => {
			setDraggingEdge(undefined)
		})

		e.preventDefault()
		setDraggingEdge(edge)
		const point = toWindowCoord(win, e)
		window.addEventListener("pointermove", dragMove, { signal: controller.signal })
		window.addEventListener("pointerup", dragEnd, { signal: controller.signal })

		setDragPoint(point)

		dragDirStore.setOrientation(getEdgeOrientation(edge))
		dragDirStore.update(point)
		if (isWindowEdge(edge)) {
			setIsDraggingWindowEdge(true)
		}
		setDraggingEdge(edge)
		setIsDragging(true)

		const touchingFrames = getTouchingFrames()
		const touching = findFramesTouchingEdge(edge, Object.values(win.value.frames)) ?? []
		setTouchingFrames({})
		for (const _ of touching) touchingFrames[_.frame.id] = cloneFrame(_.frame)
		onDragChange("start", e)
	}
}
	
