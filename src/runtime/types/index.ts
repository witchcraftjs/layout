import { z } from "zod"

import { getMaxInt } from "../settings.js"

export const zUuid = z.string().uuid()
export type AnyUuid = z.infer<typeof zUuid>

export const zWindowIdConstants = z.enum(["ACTIVE"])
export const zWinId = z.string().uuid().or(zWindowIdConstants)
export type WindowId = z.infer<typeof zWinId>

export const zFrameIdConstants = z.enum(["ACTIVE"])
export const zFrameId = z.string().uuid().or(zFrameIdConstants)
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
	y: zScaledIntPercentage,
})

export type Pos = z.infer<typeof zPos>

export const zSize = z.object({
	width: zScaledIntPercentage,
	height: zScaledIntPercentage,
})
export type Size = z.infer<typeof zSize>

export const zPoint = z.object({
	x: zScaledIntPercentage,
	y: zScaledIntPercentage,
})

export type Point = z.infer<typeof zPoint>

export const zPxPos = z.object({
	pxX: zPx,
	pxY: zPx,
})

export type PxPos = z.infer<typeof zPxPos>

export const zPxSize = z.object({
	pxWidth: zPx,
	pxHeight: zPx,
})

export type PxSize = z.infer<typeof zPxSize>

export const zEdge = z.object({
	startX: zScaledIntPercentage,
	startY: zScaledIntPercentage,
	endX: zScaledIntPercentage,
	endY: zScaledIntPercentage,
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

export const zBaseSquare = zSize.merge(zPos)
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

export type IntersectionEntry = { point: Point, count: number }
export const zLayoutFrame = z.object({
	id: z.string().uuid(),
}).merge(zBaseSquare)
	.passthrough()


export interface Register {
}
/* eslint-disable @typescript-eslint/naming-convention */
type ExtendedLayoutFrame = Register extends { ExtendedLayoutFrame: infer T } ? T : unknown
type ExtendedLayoutWindow = Register extends { ExtendedLayoutWindow: infer T } ? T : unknown
type ExtendedLayout = Register extends { ExtendedLayout: infer T } ? T : unknown
/* eslint-enable @typescript-eslint/naming-convention */

export type LayoutFrame = ExtendedLayoutFrame & Size & Pos & {
	id: FrameId
}
export type LayoutFrames = Record<string, LayoutFrame>

export const zLayoutWindow = z.object({
	id: z.string().uuid(),
	activeFrame: z.string().optional(),
	frames: z.record(z.string(), zLayoutFrame),
}).merge(zPxSize)
	.merge(zPxPos)
	.passthrough()
// types are re-declared so that if they are extended, the types are still correct

export type LayoutWindow = ExtendedLayoutWindow & {
	id: WindowId
	activeFrame?: string
	frames: LayoutFrames
	pxWidth: number
	pxHeight: number
	pxX: number
	pxY: number
}
export type LayoutWindows = Record<string, LayoutWindow>


export const zLayout = z.object({
	activeWindow: z.string().optional(),
	windows: z.record(z.string(), zLayoutWindow),
}).passthrough()

export const zInitializedLayout = zLayout.required({
	activeWindow: true,
})
	.passthrough()
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
	newFrame: zBaseSquare,
})

export type SplitDecoShapes = z.infer<typeof zSplitDecoShapes>
export const zSplitDeco = z.object({
	id: z.string().uuid(),
	type: z.literal("split"),
	position: zScaledIntPercentage,
	direction: zDirection,
	shapes: zSplitDecoShapes,
})
export const zRawSplitDeco = zSplitDeco.omit({ shapes: true })
export type RawSplitDeco = z.infer<typeof zRawSplitDeco>
export type SplitDeco = z.infer<typeof zSplitDeco>

const zCloseDeco = z.object({
	id: z.string().uuid(),
	type: z.literal("close"),
})
export type CloseDeco = z.infer<typeof zCloseDeco>

const zDropDeco = z.object({
	id: z.string().uuid(),
	type: z.literal("drop"),
	position: zSide.or(z.enum(["center"])),
})

export type DropDeco = z.infer<typeof zDropDeco>

export const zDeco = z.union([
	zSplitDeco,
	zCloseDeco,
	zDropDeco,
])

export type Deco = z.infer<typeof zDeco>

export enum LAYOUT_ERROR {
	INVALID_ID = "LAYOUT_ERROR.INVALID_ID",
	ID_ALREADY_EXISTS = "LAYOUT_ERROR.ID_ALREADY_EXISTS",
	CANT_RESIZE = "LAYOUT_ERROR.CANT_RESIZE",
	NO_ACTIVE_WINDOW = "LAYOUT_ERROR.NO_ACTIVE_WINDOW",
	NO_ACTIVE_FRAME = "LAYOUT_ERROR.NO_ACTIVE_FRAME",
	CANT_CLOSE_NO_DRAG_EDGE = "LAYOUT_CANT_CLOSE_NO_DRAG_EDGE",
	CANT_CLOSE_NEARBY_FRAMES_TOO_SMALL = "LAYOUT_CANT_CLOSE_NEARBY_FRAMES_TOO_SMALL",
	CANT_CLOSE_SINGLE_FRAME = "LAYOUT_CANT_CLOSE_SINGLE_FRAME",
	CANT_SPLIT_FRAME_TOO_SMALL = "LAYOUT_CANT_SPLIT_FRAME_TOO_SMALL",
	CANT_CLOSE_WITHOUT_FORCE = "LAYOUT_CANT_CLOSE_WITHOUT_FORCE",
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type ALL_ERRORS = LAYOUT_ERROR

export type ErrorInfo<T extends ALL_ERRORS> = ERROR_INFO[T] extends undefined ? never : ERROR_INFO[T]


// eslint-disable-next-line @typescript-eslint/naming-convention
type ERROR_INFO = {
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


export const zWindowCreate = zLayoutWindow
	.partial({ id: true, pxWidth: true, pxHeight: true, pxX: true, pxY: true })
	.extend({ frames: zLayoutWindow.shape.frames.optional() })

export const zLayoutCreate = zLayout
	.extend({
		windows: zLayout.shape.windows.optional(),
	})

export const zFrameCreate = zLayoutFrame.partial({ id: true, x: true, y: true, width: true, height: true })
