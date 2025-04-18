import type { EnumLike } from "@alanscodelog/utils"
import { enumFromArray } from "@alanscodelog/utils/enumFromArray"
import { z } from "zod"

export * from "../drag/types.js"

import { getMaxInt } from "../settings.js"

export const zUuid = z.uuid()
export type AnyUuid = z.infer<typeof zUuid>

export const zWindowIdConstants = z.enum(["ACTIVE"])
export const zWinId = z.uuid().or(zWindowIdConstants)
export type WindowId = z.infer<typeof zWinId>

export const zFrameIdConstants = z.enum(["ACTIVE"])
export const zFrameId = z.uuid().or(zFrameIdConstants)
export type FrameId = z.infer<typeof zFrameId>

export const zScaledIntPercentage = z.number()
	.int()
	.min(0)
	.max(getMaxInt())
	.nonnegative()

const zPx = z.number()
	.int()
	.nonnegative()

export const zPos = z.object({
	x: zScaledIntPercentage,
	y: zScaledIntPercentage
})

export type Pos = z.infer<typeof zPos>

export const zSize = z.object({
	width: zScaledIntPercentage,
	height: zScaledIntPercentage
})
export type Size = z.infer<typeof zSize>

export const zPoint = z.object({
	x: zScaledIntPercentage,
	y: zScaledIntPercentage
})

export type Point = z.infer<typeof zPoint>

export const zPxPos = z.object({
	pxX: zPx,
	pxY: zPx
})

export type PxPos = z.infer<typeof zPxPos>

export const zPxSize = z.object({
	pxWidth: zPx,
	pxHeight: zPx
})

export type PxSize = z.infer<typeof zPxSize>

export const zEdge = z.object({
	startX: zScaledIntPercentage,
	startY: zScaledIntPercentage,
	endX: zScaledIntPercentage,
	endY: zScaledIntPercentage
})

export type Edge = z.infer<typeof zEdge>

export const zDirection = z.enum(["up", "down", "left", "right"] as const)
export const zExtendedDirection = z.union([zDirection, z.enum(["horizontal", "vertical"])])
export const zSide = z.enum(["top", "bottom", "left", "right"] as const)
export const zOrientation = z.enum(["horizontal", "vertical"])
export const zExtendedSide = z.union([zSide, zOrientation])

export type Direction = z.infer<typeof zDirection>
export type ExtendedDirection = z.infer<typeof zExtendedDirection>
export type Orientation = z.infer<typeof zOrientation>

export type EdgeSide = z.infer<typeof zSide>
export type ExtendedEdgeSide = z.infer<typeof zExtendedSide>

export const zBaseSquare = zSize.extend(zPos.shape)
export type BaseSquare = z.infer<typeof zBaseSquare>
export type BaseSquareCss = {
	x: string
	y: string
	width: string
	height: string
	translate?: string
}

export type EdgeCss = BaseSquareCss & {
	translate: string
}
export type PointCss = BaseSquareCss & {
	translate: string
}

export type Intersections = Record<number, Record<number, number>>

export type IntersectionEntry = {
	point: Point
	count: number
	sharesEdge: boolean
	sharedEdges: { horizontal: Edge[], vertical: Edge[] }
	isWindowEdge: boolean
}
export const zLayoutFrame = z.looseObject({
	id: z.uuid()
}).extend(zBaseSquare.shape)

export const zLayoutFramePassthrough = zLayoutFrame.passthrough()

export interface Register {
}
/* eslint-disable @typescript-eslint/naming-convention */
export type ExtendedLayoutFrame = Register extends { ExtendedLayoutFrame: infer T } ? T : unknown
export type ExtendedLayoutWindow = Register extends { ExtendedLayoutWindow: infer T } ? T : unknown
export type ExtendedLayout = Register extends { ExtendedLayout: infer T } ? T : unknown
export type ExtendedWorkspace = Register extends { ExtendedWorkspace: infer T } ? T : unknown
/* eslint-enable @typescript-eslint/naming-convention */

export type BaseLayoutFrame = Size & Pos & { id: FrameId }
export type LayoutFrame = ExtendedLayoutFrame & BaseLayoutFrame
export type LayoutFrames = Record<string, LayoutFrame>

const baseLayoutWindow = z.object({
	id: z.uuid(),
	activeFrame: z.string().optional(),
	frames: z.record(z.string(), zLayoutFrame)
}).extend(zPxSize.shape)
	.extend(zPxPos.shape)

export const zLayoutWindow = baseLayoutWindow.strict()
export const zLayoutWindowPassthrough = baseLayoutWindow
// types are re-declared so that if they are extended, the types are still correct

export type BaseLayoutWindow = {
	id: WindowId
	activeFrame?: string
	frames: LayoutFrames
	pxWidth: number
	pxHeight: number
	pxX: number
	pxY: number
}
export type LayoutWindow = ExtendedLayoutWindow & BaseLayoutWindow
export type LayoutWindows = Record<string, LayoutWindow>

const baseWorkspace = zLayoutWindow.pick({ activeFrame: true, frames: true })
export const zWorkspace = baseWorkspace.strict()
export const zWorkspacePassthrough = zWorkspace.passthrough()

export type Workspace = Pick<LayoutWindow, "activeFrame" | "frames"> & ExtendedWorkspace

const baseLayout = z.looseObject({
	activeWindow: z.string().optional(),
	windows: z.record(z.string(), zLayoutWindow)
})

export const zLayout = baseLayout.strict()

export const zInitializedLayout = zLayout.required({
	activeWindow: true
})
	.refine(layout => {
		if (layout.windows[layout.activeWindow] === undefined) {
			return false
		}
		return zLayoutWindow.safeParse(layout.windows[layout.activeWindow]).success
	}, { message: "An initialized layout's active window must exist and be valid." })

export type Layout = ExtendedLayout & {
	activeWindow?: string
	windows: LayoutWindows
}

export const zSplitDecoShapes = z.object({
	edge: zEdge,
	newFrame: zBaseSquare
}).strict()

export type SplitDecoShapes = z.infer<typeof zSplitDecoShapes>
export const zSplitDeco = z.object({
	id: z.uuid(),
	type: z.literal("split"),
	position: zScaledIntPercentage,
	direction: zDirection,
	shapes: zSplitDecoShapes
}).strict()
export const zRawSplitDeco = zSplitDeco.omit({ shapes: true })
export type RawSplitDeco = z.infer<typeof zRawSplitDeco>
export type SplitDeco = z.infer<typeof zSplitDeco>

const zCloseDeco = z.object({
	id: z.uuid(),
	type: z.literal("close"),
	force: z.boolean().optional()
}).strict()
export type CloseDeco = z.infer<typeof zCloseDeco>

const zDropDeco = z.object({
	id: z.uuid(),
	type: z.literal("drop"),
	position: zSide.or(z.enum(["center"]))
}).strict()

export type DropDeco = z.infer<typeof zDropDeco>

export const zDeco = z.union([
	zSplitDeco,
	zCloseDeco,
	zDropDeco
])

export type Deco = z.infer<typeof zDeco>

export const LAYOUT_ERROR = enumFromArray([
	"INVALID_ID",
	"ID_ALREADY_EXISTS",
	"CANT_RESIZE",
	"NO_ACTIVE_WINDOW",
	"NO_ACTIVE_FRAME",
	"CANT_CLOSE_NO_DRAG_EDGE",
	"CANT_CLOSE_NEARBY_FRAMES_TOO_SMALL",
	"CANT_CLOSE_SINGLE_FRAME",
	"CANT_SPLIT_FRAME_TOO_SMALL",
	"CANT_CLOSE_WITHOUT_FORCE"
])

export type LayoutError = EnumLike<typeof LAYOUT_ERROR>

export type AllErrors = LayoutError

export type ErrorInfo<T extends AllErrors> = AllErrorsInfo[T] extends undefined ? never : AllErrorsInfo[T]

type AllErrorsInfo = {
	[LAYOUT_ERROR.INVALID_ID]: {
		id: string | undefined
	}
	[LAYOUT_ERROR.ID_ALREADY_EXISTS]: {
		id: string | undefined
	}
	[LAYOUT_ERROR.CANT_RESIZE]: {
		size: Size
	}
	[LAYOUT_ERROR.NO_ACTIVE_WINDOW]: Record<string, never>
	[LAYOUT_ERROR.NO_ACTIVE_FRAME]: Record<string, never>
	[LAYOUT_ERROR.CANT_CLOSE_NO_DRAG_EDGE]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.CANT_CLOSE_NEARBY_FRAMES_TOO_SMALL]: {
		frame: LayoutFrame
		nearbyFrames: LayoutFrame[]
		minSize: Size
	}
	[LAYOUT_ERROR.CANT_CLOSE_SINGLE_FRAME]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.CANT_SPLIT_FRAME_TOO_SMALL]: {
		frame: LayoutFrame
		newSize: number
		minSize: number
	}
	[LAYOUT_ERROR.CANT_CLOSE_WITHOUT_FORCE]: {
		frame: LayoutFrame
		framesRequiredToBeDeleted: LayoutFrame[]
	}
}

// todo rename to toOpposite
export type HasOpposite = Direction | EdgeSide | ExtendedDirection | ExtendedEdgeSide | keyof Point | keyof Size

export const zWindowCreate = zLayoutWindowPassthrough
	.partial({ id: true, pxWidth: true, pxHeight: true, pxX: true, pxY: true })
	.extend({ frames: zLayoutWindow.shape.frames.optional() })

export const zLayoutCreate = baseLayout
	.extend({
		windows: zLayout.shape.windows.optional()
	})

export const zFrameCreate = zLayoutFrame.partial({
	id: true,
	x: true,
	y: true,
	width: true,
	height: true
})
