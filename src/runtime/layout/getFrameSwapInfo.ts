import type { LayoutChange, LayoutWindow } from "../types/index.js"
import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

/**
 * Returns a {@link LayoutChange} with the information necessary to swap two frames within the same window.
 *
 * Changes can be applied to a window with {@link applyFrameChanges}.
 */
export function getFrameSwapInfo(
	window: LayoutWindow,
	frameIdA: string,
	frameIdB: string
): LayoutChange
	| KnownError<typeof LAYOUT_ERROR.CANT_SWAP_WITH_SELF> {
	const frameA = { ...window.frames[frameIdA] }
	const frameB = { ...window.frames[frameIdB] }

	if (frameA.id === frameB.id) {
		return new KnownError(LAYOUT_ERROR.CANT_SWAP_WITH_SELF, `Cannot swap frames with the same id`, { frame: frameA })
	}


	const temp = { x: frameA.x, y: frameA.y, width: frameA.width, height: frameA.height }
	frameA.x = frameB.x
	frameA.y = frameB.y
	frameA.width = frameB.width
	frameA.height = frameB.height
	frameB.x = temp.x
	frameB.y = temp.y
	frameB.width = temp.width
	frameB.height = temp.height

	const dockedA = frameA.docked
	const dockedB = frameB.docked
	frameA.docked = dockedB
	frameB.docked = dockedA

	const collapsedA = frameA.collapsed
	const collapsedB = frameB.collapsed
	frameA.collapsed = collapsedB
	frameB.collapsed = collapsedA

	return { modified: [frameA, frameB], created: [], deleted: [] }
}
