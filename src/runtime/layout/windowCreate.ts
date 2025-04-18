import { v4 as uuidv4 } from "uuid"
import type { z } from "zod"

import type { LayoutWindow, zWindowCreate } from "../types/index.js"

/** Create a new window. Note that it will always have a new id if it's undefined. */
export function windowCreate(opts: z.infer<typeof zWindowCreate> = {}): LayoutWindow {
	return {
		frames: {},
		activeFrame: undefined,
		pxWidth: 0,
		pxHeight: 0,
		pxX: 0,
		pxY: 0,
		...opts,
		id: opts.id ?? uuidv4()
	}
}
