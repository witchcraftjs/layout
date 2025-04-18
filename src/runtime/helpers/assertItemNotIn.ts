import { LAYOUT_ERROR } from "../types/index.js"
import { KnownError } from "../utils/KnownError.js"

// don't try to be clever with type, we don't want it to narrow to never since we still want to be able to assign a new

export function assertItemNotIn(entries: Record<string, any>, id: string | undefined): void {
	if (id !== undefined && entries[id] !== undefined) {
		throw new KnownError(LAYOUT_ERROR.ID_ALREADY_EXISTS, `Item with id ${id as string} already exists`, { id })
	}
}
