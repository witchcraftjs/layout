import { unreachable } from "@alanscodelog/utils/unreachable.js"


export function toId(item: { id: string } | string): string {
	return typeof item === "string"
		? item
		: typeof item.id === "string"
			? item.id
			: unreachable()
}
