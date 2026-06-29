export function getPinnedEdgesForCollapsedFrames(
	win: { frames: Record<string, any> },
	frame: { id: string },
	dockedSide: string,
	posKey: string,
	sizeKey: string
): number[] {
	const pinnedEdgeCoordinates: number[] = []
	const isHorizontal = dockedSide === "left" || dockedSide === "right"

	for (const other of Object.values(win.frames)) {
		if (frame.id === other.id || !other.collapsed) continue

		const otherIsHorizontal = other.docked === "left" || other.docked === "right"

		// only pin collapsed frames in the same direction
		if (isHorizontal === otherIsHorizontal) {
			if (other.docked === "left" || other.docked === "top") {
				const edge = other[posKey] + other[sizeKey]
				pinnedEdgeCoordinates.push(edge)
			} else {
				const edge = other[posKey]
				pinnedEdgeCoordinates.push(edge)
			}
		}
	}

	return pinnedEdgeCoordinates
}
