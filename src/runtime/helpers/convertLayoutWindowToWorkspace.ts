import { cloneDeep } from "es-toolkit"

import type {
	LayoutWindow,
	Workspace
} from "../types/index.js"

export function convertLayoutWindowToWorkspace(layout: LayoutWindow | Workspace): Workspace {
	// clone to avoid accidental property removal issues
	// cast to be able to delete the properties
	const l = cloneDeep(layout) as Partial<LayoutWindow>
	delete l.id
	delete l.pxHeight
	delete l.pxWidth
	delete l.pxX
	delete l.pxY
	return l as Workspace
}
