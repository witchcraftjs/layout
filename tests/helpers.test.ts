import { expect, it } from "vitest"

import { debugFrame } from "../src/module.js"

it("debugFrame", () => {
	expect(debugFrame({
		id: "A",
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		docked: "left",
		collapsed: undefined,
		...({ extraProperties: "extra" } as any)
	})).toBe(`id: A, x:  0, y: 0, w: 100, h: 100\ndocked: left, collapsed: undefined, extraProperties: extra`)
})
