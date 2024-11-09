import type { IDragAction, Request } from "./DragAction.js"

import { createSplitDecoFromDrag } from "../layout/createSplitDecoFromDrag.js"
import { frameSplit } from "../layout/frameSplit.js"
import { getFrameSplitInfo } from "../layout/getFrameSplitInfo.js"
import type { Direction, LayoutFrame, LayoutWindow, Point, SplitDeco } from "../types/index.js"
import type { KnownError } from "../utils/KnownError.js"


export type SplitInfo = Exclude<ReturnType<typeof getFrameSplitInfo>, KnownError>
export class SplitAction implements IDragAction {
	name = "split" as const

	state: {
		allowed: false
		res: SplitInfo | undefined
		cacheKey: string | undefined
	} | {
		allowed: true
		res: SplitInfo
		cacheKey: string | undefined
	} = {} as any // this is initialized by `this.reset()`

	constructor(
		public handleEvent: (e?: PointerEvent | KeyboardEvent) => boolean,
		public info: () => {
			win: LayoutWindow
			isDragging: boolean
			dragHoveredFrame?: LayoutFrame
			dragDirection?: Direction
			dragPoint?: Point
		},
		public updateSplitDecos: (decos: SplitDeco[]) => void,
		public hooks: {
			onStart?: () => void
			onCancel?: () => void
			onError?: (e: KnownError) => void
		} = {},
		
	) {
		this.reset()
	}

	reset(): void {
		this.state = {
			allowed: false,
			res: undefined,
			cacheKey: undefined,
		}
		this.updateSplitDecos([])
	}

	updateDecos(): void {
		const {
			win,
			isDragging,
			dragHoveredFrame,
			dragDirection,
			dragPoint,
		} = this.info()
		if (isDragging && this.state.allowed && dragHoveredFrame) {
			const deco = createSplitDecoFromDrag(
				win.frames,
				dragHoveredFrame,
				dragDirection!,
				dragPoint!,
			)
			this.updateSplitDecos([deco])
		}
		else {
			this.updateSplitDecos([])
		}
	}

	canHandleRequest(e?: PointerEvent | KeyboardEvent): boolean {
		if (this.handleEvent(e)) {
			this.hooks.onStart?.()
			return true
		}
		return false
	}


	calculateSplitRequest(): boolean {
		const { dragHoveredFrame, dragDirection, dragPoint } = this.info()
		const canSplit = getFrameSplitInfo(
			dragHoveredFrame!,
			dragDirection!,
			dragPoint!
		)
		if (!(canSplit instanceof Error)) {
			this.state.allowed = true
			this.state.res = canSplit
			this.state.cacheKey = dragHoveredFrame?.id
			return true
		} else {
			this.hooks.onError?.(canSplit)
			return false
		}
	}

	onDragChange(): void {
		const { dragHoveredFrame } = this.info()
		let ok = false
		if (dragHoveredFrame) {
			if (this.state.cacheKey === dragHoveredFrame.id) {
				this.updateDecos()
				return
			}
			ok = this.calculateSplitRequest()
		}
		this.updateDecos()
		if (!ok) {
			this.state.allowed = false
		}
	}


	onDragApply(): boolean {
		if (this.state.res) {
			// this only caches once per frame hovered over
			// so the drag position is outdated
			this.calculateSplitRequest()
			frameSplit(this.info().win, this.state.res!)
			this.reset()
		}
		return true
	}
	
	cancel(): void {
		this.reset()
		this.hooks.onCancel?.()
	}
}

