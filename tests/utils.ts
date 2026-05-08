import { settings } from "../src/runtime/settings.js"


class TestWidths {
	get full() { return 100 * (10 ** settings.scale) }
	get half() { return 50 * (10 ** settings.scale) }
	get third() { return Math.round(33.33333 * (10 ** settings.scale)) }
	get forth() { return 25 * (10 ** settings.scale) }
	get fifth() { return 20 * (10 ** settings.scale) }
}

export const w = new TestWidths()

export function createTestWindow() {
	return {
		id: "test-window",
		activeFrame: undefined,
		frames: {} as any,
		pxWidth: w.full,
		pxHeight: w.full,
		pxX: 0,
		pxY: 0
	}
}
