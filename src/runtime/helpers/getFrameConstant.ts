import { assertItemIn } from "./assertItemIn.js"
import { assertWindowHasActiveFrame } from "./assertWindowHasActiveFrame.js"

import type { LayoutWindow } from "../types/index.js"

export function getFrameConstant<T extends boolean = false>(
	win: LayoutWindow,
	constant: "ACTIVE" | string,
	assert: T = false as T
): T extends true ? string : string | undefined {
	switch (constant) {
		case "ACTIVE": {
			if (assert) assertWindowHasActiveFrame(win)
			return win.activeFrame as any
		}
		// todo sides
		default: {
			if (assert) assertItemIn(win.frames, constant)
			return constant as any
		}
	}
}
