import { oppositeSide } from "./oppositeSide.js"

import { settings } from "../settings.js"
import type { EdgeSide, LayoutFrame, LayoutWindow } from "../types/index.js"

/**
 * Prepares frames that need to be temporarily repositioned before redistribution
 * and returns functions to apply/revert the fixes after redistribution. Used mostly internally for collapse/uncollapse of docked frames and similar operations.
 *
 * It exists because if you try to resize a layout like this to the right, you will get issues with frame edges not lining up as frame B would be resized less than A. If you had a frame at the empty space that you excluded, it's right edge would no longer align with B's.
 *
 * This helper takes frames like A, moves the edge so it's shared then moved them back. Just excluding them from the calcuation usually leads to subtler errors. Such as if there are frames after A and B to the right, excluding A would mean A's right edge would stop aligning with those other frames.
 *
 * ┌────────────┐
 * │A           │
 * └──┬─────────┤
 *    │B        │
 *    └─────────┘
 *
 * It has two modes, shrink and expand meant for collapse/uncollapse operations.
 *
 * ## Expand
 *
 * When multiple frames are docked* they may share an edge like this:
 * For example, if we collapse A, we need to allow everything else to expand,
 * but if we expand D it will overflow the bounds of the window and we'd get an error.
 * To avoid this, we shrink these frames towards the opposite side first.
 *
 * collapsed size/amount
 * ├──┘
 * │  shrink amount
 * │  ├───┘
 * ├──────┬───────────┐
 * │A*│   │B*         │
 * │      ├──────┬────┤
 * │  │   │E     │C*  │
 * │      │      │    │
 * ├──┴───┴──────┤    │
 * │D*           │    │
 * └──────┬──────┴────┘
 *        │we would shrink D to here
 *
 *  D.x = A.x + A.width, and then subtract the difference from it's width
 *
 * ***IMPROTANT: It needs to stay aligned with the right side of A and the rest of the frames, or redistribute doesn't know how to redistribute it properly.
 *
 * When redistribute expands it again by shrinkAmount it will end up at A.x + collapseSize.
 *
 * This works fine when collapseSize is 0, but otherwise breaks so we keep a list of
 * fixes to make after redistributing to place it's left edge back at the right place (it's right edge will have been moved by redistribute).
 *
 * ## Shrink
 *
 * Mirrors collapse, the only difference being we can skip the fixes if the frame was fully collapsed to 0.
 *
 * Why is this? Well take this example where A is docked and collapsed and B is docked, in the following two cases we would have no problems expanding as B ends where A begins, but if B shares the edge and A is not fully collapsed it is no longer aligned with the "end" of A.
 *
 * Ok:
 * A - fully collapsed to 0
 * ~ ┌──────────┐
 * │ │B*        │
 * │ ├──────────┤
 * │ │          │
 * │ │          │
 * │ └──────────┘
 *
 * Ok:
 * A collapsed to non-zero size
 * Note B still shares A's right edge
 * ┌──┬─────────┐
 * │A~│B*       │
 * │  ├─────────┤
 * │  │         │
 * │  │         │
 * └──┴─────────┘
 *
 * Causes issues:
 * A collapsed to non-zero size with B docked first
 * B looses alignment with A causing issues when redistributing
 * ┌────────────┐
 * │B*          │
 * ├──┬─────────┤
 * │A~│         │
 * │  │         │
 * └──┴─────────┘
 *
 */

export function framesRedistributeFix(
	win: LayoutWindow,
	frame: LayoutFrame,
	dockedSide: EdgeSide,
	posKey: "x" | "y",
	sizeKey: "width" | "height",
	mode: "shrink" | "expand" = "shrink"
): {
	applyFixes: () => void
	toFix: string[]
} {
	const framesToFix: ({
		id: string
		posKey: "x" | "y"
		sizeKey: "width" | "height"
		type: "start" | "end"
	})[] = []

	const opposite = oppositeSide(dockedSide)

	// expand skips if frame was fully collapsed to 0
	if (mode === "expand" && frame[sizeKey] === 0) {
		return {
			applyFixes: () => {},
			toFix: []
		}
	}

	for (const other of Object.values(win.frames)) {
		if (frame.id === other.id || !other.docked) continue

		// expand skips zero-area frames
		if (mode === "expand" && (other.width === 0 || other.height === 0)) continue

		if (other.docked === opposite) continue
		if (dockedSide === "left" || dockedSide === "top") {
			if (other[posKey] !== 0) continue
			other[posKey] = frame[posKey] + frame[sizeKey]
			other[sizeKey] -= frame[sizeKey]
			framesToFix.push({
				id: other.id,
				posKey,
				sizeKey,
				type: "start"
			})
		} else {
			if (other[posKey] + other[sizeKey] !== settings.maxInt) continue
			other[sizeKey] -= frame[sizeKey]
			framesToFix.push({
				id: other.id,
				posKey,
				sizeKey,
				type: "end"
			})
		}
	}

	return {
		applyFixes: () => {
			for (const fix of framesToFix) {
				const other = win.frames[fix.id]
				if (fix.type === "start") {
					const sizeDiff = other[fix.posKey]
					other[fix.posKey] = 0
					other[fix.sizeKey] += sizeDiff
				} else {
					const sizeDiff = settings.maxInt - (other[fix.posKey] + other[fix.sizeKey])
					other[fix.sizeKey] += sizeDiff
				}
			}
		},
		toFix: framesToFix.map(f => f.id)
	}
}
