import { settings } from "../settings.js"
import type { LayoutChange, LayoutFrame, LayoutWindow } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

/**
 * Returns a {@link LayoutChange} with the information necessary to undock a frame.
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 *
 * If a frame is not docked it will throw.
 *
 * If the frame was collapsed it will be uncollapsed.
 */
export function getFrameUndockInfo(
	win: LayoutWindow,
	frameId: string
):
	| LayoutChange
	| KnownError<typeof LAYOUT_ERROR.CANT_UNDOCK_COLLAPSED_FRAME> {
	const frame = win.frames[frameId]
	if (!frame) { throw new Error(`Unknown frame ${frameId}`) }
	if (!frame.docked) throw new Error("Can't undock frame that is not docked.")

	const frameSide = frame.docked
	const isVertical = frameSide === "left" || frameSide === "right"
	const sizeKey = isVertical ? "height" : "width" as const
	const posKey = isVertical ? "y" : "x" as const
	const maxInt = settings.maxInt
	const shrinkStartKey = isVertical ? "top" : "left" as const
	const shrinkEndKey = isVertical ? "bottom" : "right" as const

	if (frame.collapsed) {
		return new KnownError(LAYOUT_ERROR.CANT_UNDOCK_COLLAPSED_FRAME, `Can't undock collapsed frame ${frame.id}.`, { frame: frame.id })
	}
	const frameClone: LayoutFrame = { ...frame, docked: false, collapsed: false }
	const otherDockedFramesToResize = []
	// if the frame is touching either corner, there could be other docked frames  that will need to get expanded like here, * means docked, and B and D would need expanding if we undock A.
	/**
	 * ┌─────┬──────┐
	 * │A*   │B*    │
	 * │     ├──────┤
	 * │     │C     │
	 * │     ├──────┤
	 * │     │D*    │
	 * └─────┴──────┘
	 */
	const dockedSidesToSearch = [
		...frame[posKey] === 0 ? [shrinkStartKey] : [],
		...(frame[posKey] + frame[sizeKey]) === maxInt ? [shrinkEndKey] : []
	]

	for (const other of Object.values(win.frames)) {
		if (other.id !== frame.id && other.docked && dockedSidesToSearch.includes(other.docked)) {
			otherDockedFramesToResize.push(other)
		}
	}

	// if there aren't others we can undock
	if (otherDockedFramesToResize.length === 0) {
		return { modified: [frameClone], created: [], deleted: [] }
	}

	const adjustmentKey = frameSide === "left"
		? "x"
		: frameSide === "top"
			? "y"
			: frameSide === "right"
				? "width"
				: "height"

	const secondaryAdjustmentKey = frameSide === "left"
		? "width"
		: frameSide === "top"
			? "height"
			: frameSide === "right"
				? "x"
				: "y"

	const adjustmentValue = frameSide === "left" || frameSide === "top" ? 0 : maxInt
	const otherChanges = otherDockedFramesToResize.map(other => {
		// shrink the ends of the undocking frame
		if (other.docked === shrinkStartKey) {
			frameClone[posKey] += other[sizeKey]
			frameClone[sizeKey] -= other[sizeKey]
		} else if (other.docked === shrinkEndKey) {
			frameClone[sizeKey] -= other[sizeKey]
		}
		return {
			...other,
			[adjustmentKey]: adjustmentValue,
			[secondaryAdjustmentKey]: other[secondaryAdjustmentKey] + other[adjustmentKey]
		}
	})

	return { modified: [frameClone, ...otherChanges], created: [], deleted: [] }
}
