import { unreachable } from "@alanscodelog/utils/unreachable.js"

import { type Direction, type EdgeSide,
	type ExtendedDirection,
	type ExtendedEdgeSide, type HasOpposite ,
	type Point,
	type Size
} from "../types/index.js"

export function oppositeSide<
	T extends Direction |
	EdgeSide |
	ExtendedDirection |
	ExtendedEdgeSide |
	keyof Point |
	keyof Size
>(dir: T): T {
	switch (dir) {
		case "x":
			return "y" satisfies HasOpposite as any
		case "y":
			return "x" satisfies HasOpposite as any
		case "width":
			return "height" satisfies HasOpposite as any
		case "height":
			return "width" satisfies HasOpposite as any
		case "left":
			return "right" satisfies HasOpposite as any
		case "right":
			return "left" satisfies HasOpposite as any
		case "up":
			return "down" satisfies HasOpposite as any
		case "top":
			return "bottom" satisfies HasOpposite as any
		case "bottom":
			return "top" satisfies HasOpposite as any
		case "down":
			return "up" satisfies HasOpposite as any
		case "horizontal":
			return "vertical" satisfies HasOpposite as any
		case "vertical":
			return "horizontal" satisfies HasOpposite as any
	}
	unreachable()
}
