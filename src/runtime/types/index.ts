import type { EnumLike } from "@alanscodelog/utils"
import { enumFromArray } from "@alanscodelog/utils/enumFromArray"
import { z } from "zod"

export * from "../drag/types.js"

import { settings } from "../settings.js"

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
	.max(settings.maxInt)
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


export const zLayoutFrame = zBaseSquare.extend({
	id: z.uuid(),
	docked: zSide.optional(),
	collapsed: z.union([z.literal(false), z.number()]).optional()
}).loose()

export const zLayoutFrameLoose = zLayoutFrame.loose()

export interface Register {
}
/* eslint-disable @typescript-eslint/naming-convention */
export type ExtendedLayoutFrame = Register extends { ExtendedLayoutFrame: infer T } ? T : unknown
export type ExtendedLayoutWindow = Register extends { ExtendedLayoutWindow: infer T } ? T : unknown
export type ExtendedLayout = Register extends { ExtendedLayout: infer T } ? T : unknown
export type ExtendedWorkspace = Register extends { ExtendedWorkspace: infer T } ? T : unknown
/* eslint-enable @typescript-eslint/naming-convention */

export type BaseLayoutFrame = Size & Pos & {
	id: FrameId
	docked?: EdgeSide | false
	collapsed?: false | number
}
export type LayoutFrame = ExtendedLayoutFrame & BaseLayoutFrame
export type LayoutFrames = Record<string, LayoutFrame>

const baseLayoutWindow = z.object({
	id: z.uuid(),
	activeFrame: z.string().optional(),
	frames: z.record(z.string(), zLayoutFrame)
}).extend(zPxSize.shape)
	.extend(zPxPos.shape)

export const zLayoutWindow = baseLayoutWindow
export const zLayoutWindowLoose = baseLayoutWindow.loose()
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

const baseWorkspace = baseLayoutWindow.pick({ activeFrame: true, frames: true }).superRefine((data, ctx) => {
	for (const [frameId, frame] of Object.entries(data.frames ?? {})) {
		if ((frame as any).docked === undefined) continue
		const edge = (frame as any).docked
		if (edge === "left" && (frame as any).x !== 0) {
			ctx.addIssue({ code: "custom", message: `Docked frame ${frameId} on left edge must have x=0`, path: ["frames", frameId, "x"] })
		}
		if (edge === "right" && (frame as any).x + (frame as any).width !== settings.maxInt) {
			ctx.addIssue({ code: "custom", message: `Docked frame ${frameId} on right edge must have x+width=maxInt`, path: ["frames", frameId, "x"] })
		}
		if (edge === "top" && (frame as any).y !== 0) {
			ctx.addIssue({ code: "custom", message: `Docked frame ${frameId} on top edge must have y=0`, path: ["frames", frameId, "y"] })
		}
		if (edge === "bottom" && (frame as any).y + (frame as any).height !== settings.maxInt) {
			ctx.addIssue({ code: "custom", message: `Docked frame ${frameId} on bottom edge must have y+height=maxInt`, path: ["frames", frameId, "y"] })
		}
	}
})
export const zWorkspace = baseWorkspace.strict()
export const zWorkspaceLoose = zWorkspace.loose()

export type Workspace = Pick<LayoutWindow, "activeFrame" | "frames"> & ExtendedWorkspace

const baseLayout = z.object({
	activeWindow: z.string().optional(),
	windows: z.record(z.string(), zLayoutWindow)
})

export const zLayout = baseLayout

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
const zLayoutShape = z.discriminatedUnion("type", [
	z.object({ type: z.literal("square"), data: zBaseSquare, attrs: z.record(z.string(), z.string()).optional() }),
	z.object({ type: z.literal("edge"), data: zEdge, attrs: z.record(z.string(), z.string()).optional() })
])

export type LayoutShape = z.infer<typeof zLayoutShape>

const zBaseDeco = z.object({
	shapes: z.array(zLayoutShape).default([])
})

export type BaseDeco = z.infer<typeof zBaseDeco>

export const zSplitDeco = zBaseDeco.extend({
	id: z.uuid(),
	type: z.literal("split"),
	position: zScaledIntPercentage,
	direction: zDirection
})
export const zRawSplitDeco = zSplitDeco.omit({ shapes: true })
export type RawSplitDeco = z.infer<typeof zRawSplitDeco>
export type SplitDeco = z.infer<typeof zSplitDeco>

const zCloseDeco = zBaseDeco.extend({
	id: z.uuid(),
	type: z.literal("close"),
	force: z.boolean().optional()
})
export type CloseDeco = z.infer<typeof zCloseDeco>


const zFrameDragDeco = zBaseDeco.extend({
	id: z.uuid(),
	type: z.literal("drop"),
	position: zSide.or(z.enum(["center"]))
})

export type FrameDragDeco = z.infer<typeof zFrameDragDeco>

export const zDeco = z.union([
	zSplitDeco,
	zCloseDeco,
	zFrameDragDeco
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
	"CANT_CLOSE_WITHOUT_FORCE",
	"CANT_SWAP_WITH_SELF",
	"CANT_REARRANGE_TO_SAME_RELATIVE_POSITION",
	"CANT_REARRANGE_WITH_DOCKED_EDGES",
	"CANT_REARRANGE_DOCKED_WITH_NON_DOCKED",
	"CANT_SPLIT_DOCKED_FRAME",
	"NO_SPACE_TO_REDISTRIBUTE",
	"REDISTRIBUTE_OUT_OF_BOUNDS",
	"FRAME_ALREADY_DOCKED_ON_SIDE",
	"CANT_LEAVE_NO_UNDOCKED_FRAMES",
	"CANT_UNDOCK_COLLAPSED_FRAME",
	"CANT_COLLAPSE_NOT_DOCKED",
	"CANT_UNCOLLAPSE_NOT_COLLAPSED",
	"NO_FILL_CANDIDATES"
])

export type LayoutError = EnumLike<typeof LAYOUT_ERROR>

export type LayoutErrorInfo<T extends LayoutError> = LayoutErrorsInfo[T] extends undefined ? never : LayoutErrorsInfo[T]

export type LayoutErrorsInfo = {
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
	[LAYOUT_ERROR.CANT_SWAP_WITH_SELF]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.CANT_REARRANGE_TO_SAME_RELATIVE_POSITION]: {
		draggingFrameId: string
		hoveredFrameId: string
		zoneSide: DragZone["side"]
	}
	[LAYOUT_ERROR.CANT_REARRANGE_WITH_DOCKED_EDGES]: {
		draggingFrameId: string
		hoveredFrameId: string
		zoneSide: DragZone["side"]
	}
	[LAYOUT_ERROR.CANT_REARRANGE_DOCKED_WITH_NON_DOCKED]: {
		draggingFrameId: string
		hoveredFrameId: string
		zoneSide: DragZone["side"]
	}
	[LAYOUT_ERROR.CANT_SPLIT_DOCKED_FRAME]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.NO_SPACE_TO_REDISTRIBUTE]: {
		minFrameSize: number
		frameSizeNeeded: number
	}
	[LAYOUT_ERROR.REDISTRIBUTE_OUT_OF_BOUNDS]: {
		min: number
		max: number
		wanted: number
	}
	[LAYOUT_ERROR.FRAME_ALREADY_DOCKED_ON_SIDE]: {
		side: EdgeSide
		id: string
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	[LAYOUT_ERROR.CANT_LEAVE_NO_UNDOCKED_FRAMES]: {}
	[LAYOUT_ERROR.CANT_UNDOCK_COLLAPSED_FRAME]: {
		frame: string
	}
	[LAYOUT_ERROR.CANT_COLLAPSE_NOT_DOCKED]: {
		frame: LayoutFrame
	}
	[LAYOUT_ERROR.CANT_UNCOLLAPSE_NOT_COLLAPSED]: {
		frame: LayoutFrame
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	[LAYOUT_ERROR.NO_FILL_CANDIDATES]: {}
}

// todo rename to toOpposite
export type HasOpposite = Direction | EdgeSide | ExtendedDirection | ExtendedEdgeSide | keyof Point | keyof Size


export type BaseDragZone = {
	x: number
	y: number
	width: number
	height: number
	pxWidth: number
	pxHeight: number
}

export type FrameDragZone = BaseDragZone & {
	type: "frame"
	side: EdgeSide | "center"
}

export type WindowEdgeZone = BaseDragZone & {
	type: "window"
	side: EdgeSide
}

export type DragZone = FrameDragZone | WindowEdgeZone

export const zWindowCreate = zLayoutWindowLoose
	.partial({ id: true, pxWidth: true, pxHeight: true, pxX: true, pxY: true })
	.extend({ frames: zLayoutWindow.shape.frames.optional() })

export const zLayoutCreate = baseLayout.loose()
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


export type LayoutShapeSquareProps
	= & {
		css: BaseSquareCss
	}

export type LayoutEdgesProps
	= & {
		edges: Edge[]
		intersections: IntersectionEntry[]
		/** The owning window, needed so we can correctly scale coordinates. */
		win: LayoutWindow
		/** The active frame, used to render the active edges. Calculate it from the `frames` returned by `useFrames` composable because otherwise it will be the wrong size while dragging. */
		activeFrame?: LayoutFrame
		draggingEdge?: Edge
		draggingIntersection?: IntersectionEntry
	}
	& Partial<LayoutShapeSquareProps>


export type LayoutChange<TInfo = never> = {
	modified: LayoutFrame[]
	created: LayoutFrame[]
	deleted: LayoutFrame[]
	info?: TInfo
}

export type LayoutFrameProps
	= & {
		frame: LayoutFrame
		isActiveFrame: boolean
	}
	& Partial<LayoutShapeSquareProps>
