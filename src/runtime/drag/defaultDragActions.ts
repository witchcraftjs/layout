import { CloseAction } from "./CloseAction"
import { FrameDragAction } from "./FrameDragAction.js"
import { SplitAction } from "./SplitAction.js"

import type { IDragAction } from "../types/index.js"

/**
 * Creates the default drag actions (Split, Close, FrameDrag).
 */
export function createDefaultHandlers(config: {
	debugSplit?: boolean
	debugClose?: boolean
	debugFrameDrag?: boolean
}): IDragAction[] {
	return [
		new SplitAction(undefined, undefined, undefined, { debug: config.debugSplit }),
		new CloseAction(undefined, undefined, undefined, { debug: config.debugClose }),
		new FrameDragAction(undefined, undefined, undefined, { debug: config.debugFrameDrag })
	]
}
