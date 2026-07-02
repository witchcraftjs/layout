import { castType } from "@alanscodelog/utils/castType"

import { settings } from "../settings.js"
import type { LayoutWindow, Point, Size } from "../types/index.js"

/**
 * See also {@link createDebugLabeler} for customizing the labeling function, for
 * example to debug the pixel sizes instead of position/size:
 *
 * ```ts
 * consoleDebugWindow(clone, 50, createDebugLabeler({
 * 	showPxSize: true,
 * 	showSize: false,
 * 	showPos: false,
 * 	getWin: () => clone
 * }))
 *
 * @experimental
 */
export function consoleDebugWindow(
	win: LayoutWindow,
	targetWidth = 100,
	labelFunc = createDebugLabeler()
) {
	const consoleCharAspect = 0.5

	const windowAspect = win.pxWidth / win.pxHeight

	const effectiveRatio = (1 / windowAspect) * consoleCharAspect
	// eslint-disable-next-line no-console
	console.log(boxesToText(Object.values(win.frames), targetWidth, {
		heightScale: effectiveRatio,
		labelFunc
	}))
}

type Border = {
	horizontal: string
	vertical: string
	topLeft: string
	topRight: string
	bottomLeft: string
	bottomRight: string
	cross: string
	fill: string
	labelBg: string
}

export function boxesToText<T extends Size & Point & { id?: string }>(
	boxes: T[],
	targetWidth = 100,
	{
		border = {} as any,
		heightScale = 1,
		labelFunc = () => ""
	}: {
		border?: Partial<Border>
		heightScale?: number
		labelFunc?: (box: T) => string
	} = {}
) {
	border = {
		horizontal: "─",
		vertical: "│",
		topLeft: "┌",
		topRight: "┐",
		bottomLeft: "└",
		bottomRight: "┘",
		cross: "┼",
		fill: " ",
		labelBg: " ",
		...border
	}
	castType<Border>(border)

	const normBoxes = boxes.map(box => ({
		...box,
		original: box,
		id: box.id,
		x: box.x / 100,
		y: box.y / 100,
		width: box.width / 100,
		height: box.height / 100
	}))

	let minX = Infinity, minY = Infinity
	let maxX = -Infinity, maxY = -Infinity

	normBoxes.forEach(box => {
		minX = Math.min(minX, box.x)
		minY = Math.min(minY, box.y)
		maxX = Math.max(maxX, box.x + box.width)
		maxY = Math.max(maxY, box.y + box.height)
	})

	const availableWidth = targetWidth
	const availableHeight = Math.floor(availableWidth * heightScale)

	const totalWidth = maxX - minX || 1
	const totalHeight = maxY - minY || 1

	/* eslint-disable @typescript-eslint/naming-convention */
	const scaleX_final = availableWidth / totalWidth
	const scaleY_final = availableHeight / totalHeight
	/* eslint-enable @typescript-eslint/naming-convention */

	const scaledBoxes = normBoxes.map(box => {
		const idPart = box.id !== undefined && box.id !== null && box.id !== ""
			? String(box.id)
			: "??"
		const funcLabel = labelFunc(box.original)
		const label = funcLabel && funcLabel.trim()
			? `${idPart} ${funcLabel}`
			: idPart

		return {
			id: box.id,
			x: (box.x - minX) * scaleX_final,
			y: (box.y - minY) * scaleY_final,
			width: box.width * scaleX_final,
			height: box.height * scaleY_final,
			label: label,
			original: box
		}
	})

	const cols = Math.min(availableWidth, Math.floor(totalWidth * scaleX_final))
	const rows = Math.min(availableHeight, Math.floor(totalHeight * scaleY_final))

	if (cols < 1 || rows < 1) {
		return new Error("Grid too small to display")
	}

	type CellData = {
		char: string
		priority: number
		type: "horizontal" | "vertical" | "corner" | "cross" | "fill" | "label"
		boxIndex: number
	}

	const grid: CellData[][] = Array(rows).fill(null).map(() =>
		Array(cols).fill(null).map(() => ({
			char: border.fill,
			priority: 0,
			type: "fill" as const,
			boxIndex: -1
		}))
	)

	function setCell(x: number, y: number, char: string, priority: number, type: CellData["type"], boxIndex: number) {
		if (x < 0 || y < 0 || x >= cols || y >= rows) return

		const current = grid[y][x]

		if (boxIndex > current.boxIndex
			|| (boxIndex === current.boxIndex && priority > current.priority)) {
			grid[y][x] = { char, priority, type, boxIndex }
		}
	}

	function getCell(x: number, y: number): CellData | undefined {
		if (x < 0 || y < 0 || x >= cols || y >= rows) return undefined
		return grid[y][x]
	}

	for (let boxIndex = scaledBoxes.length - 1; boxIndex >= 0; boxIndex--) {
		const box = scaledBoxes[boxIndex]
		const x1 = Math.round(box.x)
		const y1 = Math.round(box.y)
		const x2 = Math.round(box.x + box.width)
		const y2 = Math.round(box.y + box.height)

		const clampedX1 = Math.max(0, Math.min(cols - 1, x1))
		const clampedY1 = Math.max(0, Math.min(rows - 1, y1))
		const clampedX2 = Math.max(0, Math.min(cols - 1, x2))
		const clampedY2 = Math.max(0, Math.min(rows - 1, y2))

		if (clampedX1 >= clampedX2 || clampedY1 >= clampedY2) continue

		const edgePriority = 10

		if (clampedY1 >= 0 && clampedY1 < rows) {
			for (let x = clampedX1 + 1; x < clampedX2; x++) {
				const cell = getCell(x, clampedY1)
				if (cell && cell.type === "vertical" && cell.boxIndex !== boxIndex) {
					setCell(x, clampedY1, border.cross, edgePriority, "cross", boxIndex)
				} else {
					setCell(x, clampedY1, border.horizontal, edgePriority, "horizontal", boxIndex)
				}
			}
		}

		if (clampedY2 >= 0 && clampedY2 < rows && clampedY2 !== clampedY1) {
			for (let x = clampedX1 + 1; x < clampedX2; x++) {
				const cell = getCell(x, clampedY2)
				if (cell && cell.type === "vertical" && cell.boxIndex !== boxIndex) {
					setCell(x, clampedY2, border.cross, edgePriority, "cross", boxIndex)
				} else {
					setCell(x, clampedY2, border.horizontal, edgePriority, "horizontal", boxIndex)
				}
			}
		}

		if (clampedX1 >= 0 && clampedX1 < cols) {
			for (let y = clampedY1 + 1; y < clampedY2; y++) {
				const cell = getCell(clampedX1, y)
				if (cell && (cell.type === "horizontal" || cell.type === "cross") && cell.boxIndex !== boxIndex) {
					setCell(clampedX1, y, border.cross, edgePriority, "cross", boxIndex)
				} else {
					setCell(clampedX1, y, border.vertical, edgePriority, "vertical", boxIndex)
				}
			}
		}

		if (clampedX2 >= 0 && clampedX2 < cols && clampedX2 !== clampedX1) {
			for (let y = clampedY1 + 1; y < clampedY2; y++) {
				const cell = getCell(clampedX2, y)
				if (cell && (cell.type === "horizontal" || cell.type === "cross") && cell.boxIndex !== boxIndex) {
					setCell(clampedX2, y, border.cross, edgePriority, "cross", boxIndex)
				} else {
					setCell(clampedX2, y, border.vertical, edgePriority, "vertical", boxIndex)
				}
			}
		}

		const cornerPriority = 20
		const corners = [
			{ x: clampedX1, y: clampedY1, char: border.topLeft, type: "corner" as const },
			{ x: clampedX2, y: clampedY1, char: border.topRight, type: "corner" as const },
			{ x: clampedX1, y: clampedY2, char: border.bottomLeft, type: "corner" as const },
			{ x: clampedX2, y: clampedY2, char: border.bottomRight, type: "corner" as const }
		]

		corners.forEach(corner => {
			if (corner.x < 0 || corner.y < 0 || corner.x >= cols || corner.y >= rows) return

			const cell = getCell(corner.x, corner.y)
			if (cell && cell.boxIndex !== boxIndex && cell.type !== "fill") {
				if (cell.type === "horizontal" || cell.type === "vertical" || cell.type === "cross") {
					setCell(corner.x, corner.y, border.cross, cornerPriority, "cross", boxIndex)
				} else {
					setCell(corner.x, corner.y, corner.char, cornerPriority, corner.type, boxIndex)
				}
			} else {
				setCell(corner.x, corner.y, corner.char, cornerPriority, corner.type, boxIndex)
			}
		})

		const labelPriority = 30
		if (box.label && box.label.trim().length > 0) {
			const labelText = String(box.label)

			const boxWidth = clampedX2 - clampedX1
			const boxHeight = clampedY2 - clampedY1

			const interiorWidth = boxWidth - 2
			const interiorHeight = boxHeight - 2

			if (interiorWidth >= 1 && interiorHeight >= 0) {
				let displayText = labelText
				if (displayText.length > interiorWidth) {
					displayText = displayText.substring(0, interiorWidth)
				}

				const interiorLeft = clampedX1 + 1
				const interiorRight = clampedX2 - 1
				const interiorTop = clampedY1 + 1
				const interiorBottom = clampedY2 - 1

				const interiorCenterX = Math.floor((interiorLeft + interiorRight) / 2)
				const interiorCenterY = Math.floor((interiorTop + interiorBottom) / 2)

				let startX = interiorCenterX - Math.floor(displayText.length / 2)

				if (startX < interiorLeft) {
					startX = interiorLeft
				}
				if (startX + displayText.length > interiorRight) {
					startX = interiorRight - displayText.length
				}

				for (let i = 0; i < displayText.length; i++) {
					const xPos = startX + i
					const yPos = interiorCenterY

					if (xPos >= interiorLeft && xPos < interiorRight
						&& yPos >= interiorTop && yPos < interiorBottom) {
						setCell(xPos, yPos, border.labelBg, labelPriority, "label", boxIndex)
						setCell(xPos, yPos, displayText[i], labelPriority + 1, "label", boxIndex)
					}
				}
			}
		}
	}

	const displayGrid = grid.map(row => row.map(cell => cell.char).join("")).join("\n")
	return displayGrid
}


export function createDebugLabeler({
	showPxSize = false,
	showCollapsed = true,
	showDocked = true,
	showSize = true,
	showPos = true,
	getWin
}: {
	showPxSize?: boolean
	showCollapsed?: boolean
	showDocked?: boolean
	showSize?: boolean
	showPos?: boolean
	getWin?: (f: LayoutWindow["frames"][string]) => Pick<LayoutWindow, "pxWidth" | "pxHeight">
} = {}) {
	return function (f: LayoutWindow["frames"][string]) {
		if (showPxSize && !getWin) throw new Error("showPxSize is true but getWin is not provided")
		const win = showPxSize ? getWin?.(f) : undefined

		const widthPx = showPxSize ? Math.round(f.width / settings.maxInt * win!.pxWidth) : undefined
		const heightPx = showPxSize ? Math.round(f.height / settings.maxInt * win!.pxHeight) : undefined
		const isCollapsed = showCollapsed && typeof f.collapsed === "number" ? "~" : ""
		const isDocked = showDocked && f.docked ? "*" : ""
		const size = showSize ? ` ${f.width}x${f.height}` : ""
		const pos = showPos ? ` ${f.x},${f.y}` : ""
		const pxSize = showPxSize ? ` ${widthPx}x${heightPx}px` : ""

		return `${isCollapsed}${isDocked}${pos}${size}${pxSize}`
	}
}

