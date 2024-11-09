import { type z } from "zod"

import { type Layout,zLayout, type zLayoutCreate } from "../types/index.js"


// todo ability to init with windows and checks
export function layoutCreate(opts: z.infer<typeof zLayoutCreate> = {}): Layout {
	return {
		windows: {},
		activeWindow: undefined,
		...opts,
	} satisfies Layout
}

