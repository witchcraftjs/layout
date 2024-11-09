import { type EdgeSide, type LayoutFrame } from "../types/index.js"


export function getSideTouching(frameA: LayoutFrame, frameB: LayoutFrame): EdgeSide | undefined {
	if (frameA.x + frameA.width === frameB.x) return "right"
	if (frameA.x === frameB.x + frameB.width) return "left"
	if (frameA.y + frameA.height === frameB.y) return "bottom"
	if (frameA.y === frameB.y + frameB.height) return "top"
	return undefined
}
