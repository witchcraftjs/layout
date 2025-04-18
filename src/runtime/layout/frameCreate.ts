import { v4 as uuidv4 } from "uuid"

import { getMaxInt } from "../settings.js"
import type {
	BaseLayoutFrame,
	ExtendedLayoutFrame,
	LayoutFrame
} from "../types/index.js"

/** Create a new frame. Note that it will always have a new id if it's undefined. */
export function frameCreate(
	opts: Partial<BaseLayoutFrame> & Omit<ExtendedLayoutFrame, keyof BaseLayoutFrame> = {}
): LayoutFrame {
	const maxInt = getMaxInt()
	return {
		width: maxInt,
		height: maxInt,
		x: 0,
		y: 0,
		...opts,
		id: opts.id ?? uuidv4()
	}
}
