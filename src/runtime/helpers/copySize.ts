import type { Size } from "../types/index.js"

export function copySize<TFrom extends Size, TTo extends Size>(from: TFrom, to: TTo): TTo {
	to.width = from.width
	to.height = from.height
	return from as any
}
