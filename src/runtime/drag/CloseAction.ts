import type { IDragAction } from "./DragAction.js"

import { dirToOrientation } from "../helpers/dirToOrientation.js"
import { closeFrames } from "../layout/closeFrames.js"
import { findFramesTouchingEdge } from "../layout/findFramesTouchingEdge.js"
import { getCloseFrameInfo } from "../layout/getCloseFrameInfo.js"
import type { CloseDeco,Direction, Edge, LayoutFrame, LayoutWindow, Point } from "../types/index.js"
import type { KnownError } from "../utils/KnownError.js"
export type CloseInfo = Exclude<ReturnType<typeof getCloseFrameInfo>, KnownError>

export class CloseAction implements IDragAction {
	name = "close" as const
	// allowed = false
	// force = false
	// res: CloseInfo | undefined
	// cacheKey: string | undefined

	state: {
		allowed: true
		force: boolean
		res: CloseInfo
		cacheKey: string | undefined
	} | {
		allowed: false
		force: boolean
		res: CloseInfo | undefined
		cacheKey: string | undefined
	} = {} as any // this is initialized by this.reset()

	constructor(
		public handleEvent: (e?: PointerEvent | KeyboardEvent) => boolean | "force",
		public info: () => {
			dragDirection?: Direction
			dragPoint?: Point
			isDragging: boolean
			touchingFramesArray: LayoutFrame[]
			draggingEdge?: Edge
			visualEdges: Edge[]
			frames: Record<string, LayoutFrame>
			win: LayoutWindow
		},
		public updateCloseDecos: (decos: CloseDeco[]) => void,
		public hooks: {
			onStart?: (active: boolean) => void
			onCancel?: () => void
			onError?: (e: KnownError) => void
		} = {}
	) {
		this.reset()
	}

	reset(): void {
		this.state = {
			allowed: false,
			force: false,
			res: undefined,
			cacheKey: undefined,
		}
		this.updateCloseDecos([])
	}

	updateDecos(): void {
		const {
			isDragging,
		} = this.info()
		if (isDragging && this.state.allowed && this.state.res) {
			const decos = this.state.res.deletedFrames.map(_ => ({ id: _.id, type: "close" as const }))
			this.updateCloseDecos(decos)
		}
		else {
			this.updateCloseDecos([])
		}
	}


	canHandleRequest(e?: PointerEvent | KeyboardEvent): boolean {
		const res = this.handleEvent(e)
		if (res === "force") {
			this.state.force = true
		} else {
			this.state.force = false
		}
		if (res) {
			this.hooks.onStart?.(true)
			return true
		}
		return false
	}

	onDragChange(): void {
		const {
			touchingFramesArray, dragDirection, isDragging, draggingEdge, visualEdges, frames,
		} = this.info()
		let ok = false
		if (isDragging && dragDirection && draggingEdge) {
			const res = findFramesTouchingEdge(
				draggingEdge,
				touchingFramesArray,
				{
					// referencePoint: dragPoint.value, // if force pick smallest frame?
					searchDirections: [dragDirection],
				}
			)
			if (res) {
				const orientation = dirToOrientation(dragDirection)
				const sizeKey = orientation === "horizontal" ? "width" : "height"
				const smallestFrameSize = Math.min(...res.map(_ => _.frame[sizeKey]))
				const frame = res.find(_ => _.frame[sizeKey] === smallestFrameSize)!.frame!
				const cacheKey = `${frame.id}-${dragDirection}`
				if (this.state.allowed) {
					if (this.state.cacheKey === cacheKey) {
						this.updateDecos()
						return
					}
				}
				const closeInfo = getCloseFrameInfo(Object.values(frames), visualEdges, frame, dragDirection, "dir", this.state.force)
				if (!(closeInfo instanceof Error)) {
					this.state.allowed = true
					this.state.res = closeInfo
					this.state.cacheKey = cacheKey
					ok = true
				} else {
					this.hooks.onError?.(closeInfo)
				}
			}
		}
		this.updateDecos()
		if (!ok) {
			this.state.allowed = false
		}
	}

	onDragApply(): boolean {
		if (this.state.res) {
			const { deletedFrames, modifiedFrames } = this.state.res
			const win = this.info().win
			closeFrames(win, deletedFrames, modifiedFrames)
			this.reset()
			return true
		}
		return false
	}

	cancel(): void {
		this.reset()
		this.hooks.onCancel?.()
	}
}

