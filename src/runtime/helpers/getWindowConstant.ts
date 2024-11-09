import { assertItemIn } from "./assertItemIn.js"
import { assertLayoutHasActiveWindow } from "./assertLayoutHasActiveWindow.js"

import { type Layout } from "../types/index.js"


export function getWindowConstant<T extends boolean = false>(
	layout: Layout,
	constant: "ACTIVE" | string | undefined,
	assert: T = false as T
): T extends true ? string : string | undefined {
	switch (constant) {
		case "ACTIVE": {
			if (assert) assertLayoutHasActiveWindow(layout)
			return layout.activeWindow as any
		}
		default: {
			if (assert) assertItemIn(layout.windows, constant)
			return constant as any
		}
	}
}
