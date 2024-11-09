import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"


export function assertItemIn<
	T extends Record<string, any>
>(entries: T, id: keyof T | string | undefined): asserts id is keyof T {
	if (id === undefined || entries[id] === undefined) {
		const message = id === undefined
			? `Id cannot be undefined.`
			: `Could not find item by that id (${id as string | undefined}).`
		throw new KnownError(LAYOUT_ERROR.INVALID_ID, message, { id: id as string | undefined })
	}
}
