[![Docs](https://github.com/witchcraftjs/layout/workflows/Docs/badge.svg)](https://github.com/witchcraftjs/layout/actions/workflows/docs.yml)
[![Release](https://github.com/witchcraftjs/layout/actions/workflows/release.yml/badge.svg)](https://github.com/witchcraftjs/layout/actions/workflows/release.yml)
[![NPM Version (with latest tag)](https://img.shields.io/npm/v/%40alanscodelog%2FREPONAME/latest)](https://www.npmjs.com/package/@witchcraft/layout/v/latest)
# [Docs](https://witchcraftjs.github.io/layout)
# [Demo](https://witchcraftjs.github.io/layout/demo)

# @witchcraft/layout

A headless layout manager for managing frames in an app.

While it's headless, it does provide ready made nuxt/vue components, but it's pretty easy to re-create these if you need them.

The structure of the library might seem a bit odd. It's not written with classes at all, but uses plain objects and many small utility functions to manipulate them. This makes the objects easily de/serializable and extendable. Basic zod types are included for validating them.

# Usage

## Base Types 

While some base types are provided, it's required you define what's inside a frame. 

This can be done using types:
```ts [global.d.ts]
// you don't need to extend from LayoutFrame, it's done automatically
type ContentA = {
	type: "contentA"
	content: {
		id?: string
	}
}
type ContentB = {
	type: "contentB"
	content: {
		someOtherKey?: string
	}
}
declare module "@witchcraft/layout" {
	interface Register {
		ExtendedLayoutFrame: ContentA | ContentB
	}
}
export {}

```

Or if using zod, you can do something like this. Note that you will need to create/extend `zLayoutWindow/Frame` or use `zLayoutWindow/FramePassthrough` to allow for extra properties. All zod types have been made `strict` where possible as it's easy to accidentally use the wrong type and loose properties silently otherwise. 

```ts
import { zLayoutFramePassthrough, layoutCreate } from "@witchcraft/layout"
import { z } from "zod"

// we remove the id to set the discriminated union, then add it back,
// otherwise this doesn't work
export const zAppFrame = z.discriminatedUnion("type", [
	zLayoutFramePassthrough.extend({
		type: z.literal("contentA"),
		content: z.object({
			id: z.optional(z.uuid()),
		}),
	}),
	zLayoutFramePassthrough.extend({
		type: z.literal("contentB"),
		content: z.object({
			someOtherKey: z.optional(z.uuid()),
		}),
	}),
]).and(z.object({
	id: z.uuid(),
}))

declare module "@witchcraft/layout" {
	interface Register {
		//	Register the type
		ExtendedLayoutFrame: z.infer<typeof zAppFrame>
	}
}
```

## Basics

A layout is very simple, and looks like this:
```ts
{
	activeWindow: string,
	windows: {
		[id: string]: {
			activeFrame: string,
			pxWidth: number,
			pxHeight: number,
			pxX: number,
			pxY: number,
			frames: {
				[id: string]: {
					id: string,
					x: number,
					y: number,
					width: number,
					height: number,
				}
			}
		}
	}
}
```
NOTE: While the "container" for frames is called a window, it does not refer to the actual window, but the element holding the frames (which could only take up a part of the real window) and it's size/pos are in pixels as opposed to the frames which use percentages.

Frame positions are in *scaled* percentage ints. That is, instead of 100%, the value is `100 * 10^SCALE`. `SCALE` is 3 by default, so 100% is 100000.

This is done like this to make it easy to keep the dimensions rounded to x decimal points (in this case 3, `100%` => `100000` => `100.000%`). You could not use any decimal points but movements will be choppy.

`SCALE` is a global setting. See configuration below.

## Configuration

There are a few variables that need to be used nearly everywhere such as `SCALE` and `SNAP_PERCENT_{X/Y}`. 

While all function that need them, can also be called with params to override them, it's much easier to just manage them globally. 

They are exported from `/settings.js` and stored in a variable called `globalOptions` which you can modify, but helpers are provided for getting/setting the information we actually want to extract using these variables, `maxInt`, `margin`, `snapPoint`.

```ts
import {
	globalOptions,
	getMaxInt,
	// this is called snapPoint because it's type looks like a point
	// but it's more like it describes snap steps / distance in x/y
	getSnapPoint,
	setScale,
	setSnapAmount
} from "@witchcraft-layout/settings.js"

// the function checks the max number is safe to use (using `isSafeInteger`)
// 3 decimal points of precision
setScale(3) 
// snap to 1%
setSnapPercentage(1) 
// snap x/y differently
setSnapPercentage({ x: 1, y: 2 })
setMarginPercentage(1)

// like doing const maxInt = globalOptions.maxInt
const maxInt = getMaxInt() // 100000
const snapAmountPoint = getSnapPoint() // { x: 1000, y: 1000 }
const marginSize = getMarginSize() // { width: 1000, height: 1000 }
```
**NOTE: If you are saving layouts, if you change the snap or the margins to a bigger value, old layouts will become "invalid".** The should still load and you should be able to close frames, but it's not guaranteed they'll function correctly.

There are utilities for converting between non-scaled and scaled values if you need to:

```ts
import {
	numberToScaledSize,
	numverToScaledPercent
} from "@witchcraft-layout/helpers/numberToScaledSize.js"

 /* -----------
 * |    *    |
 * -----------
 *      |    ^100px
 *      ^ 50px
 * // returns 50 / 100 * scale or 50000 (50%)
 */

const scaledPercent = numberToScaledPercent(someCoord, boundingBoxMax, scale) // scale is optional and will use the global scale 
```

## Creating a Layout

Using vue as an example, in some file, preferably some sort of store like pinia, you can do something like this:
```ts
import {reactive} from "vue"

// this does not have any windows/frames
// you will need to add them if you want them to exist on init
export const layout = ref(layoutCreate())
```

Then in the page with the layout, initialize it and add a component to handle the rendering. One is included for vue, but it's pretty simple.

It uses a flat structure insides like so, so edges are always on top of frames, and decorations (drag/drop) are always on top of edges:
```
- LayoutWindow
  	- LayoutFrame
  		- [Slot] (`frame-${frame.id}`)
	- LayoutEdges (Edge type)
	- LayoutDecos
```

Edges and Decos are very simple and there are various utilies like `getVisualEdgesCss` and `getShapeSquareCss` to create the css needed to display them. They can both be handled as squares making it easy to reuse a single component to render them.

This has the benefit for edges, that the grabable area can be easily adjusted and bigger than the displayed edge.

## Dragging

Then you will need to add dragging. This is not implemented by default (except for vue) as the state and rendering of a layout being dragged like this is almost always tightly coupled with whatever framework you're using and how you've structured your app. What I've figured out how to separate such as the `DragDirectionStore` and the drag action handlers is in `/drag`.

The default vue component implements some complex, optimized behavior (see the `useFrames` composable) if you want to see an example.

But basic dragging can be added as follows:

Add a `pointerdown` handler to all the edges.

You can then use `toWindowCoord` to translate the event coordinates into a point.

Before using it, you should be sure the window's coordinates are updated as this requires knowing the x/y px offset and the window dimensions.

```ts
const point = toWindowCoord(win, e, snapPoint) // snapPoint is optional, it uses the global settings
```

One drag starts, I suggest making a copy of the original positions in case you need to cancel the drag. This can be further optimized by only cloning and modifying the touching frames and overlaying them over the unmoved edges to render them. See [Overlayed Frames Technique](#overlayed-frames-technique) below.

You can use the `DragDirectionStore `to help keep track of which direction the user is dragging.

Minus framework specific details, the drag handlers might look something like this:
```ts
// i suggest against a barrel import if not using all features, but this is for demo purposes
import {
	DragDirectionStore,
	getEdgeDirection,
	moveEdge,
	cloneFrame,
	getVisualEdges,
	toWindowCoord
	findFramesTouchingEdge
	type Point, type Edge, type LayoutFrame, type LayoutWindow
} from "@witchcraft-layout"

// const frames = getFramesFromYourStore() 

// can be reused
const dragDirStore = new DragDirectionStore()

let dragPoint: Point | undefined
let draggingEdge: Edge | undefined
let isDragging = false
let clonedFrames: Record<string, LayoutFrame> = {}
let touchingFrames: Record<string, LayoutFrame> = {}

// this is what you can render by transforming it into css using getVisualEdgesCss
let visualEdges: Edge[] = []

// updates the edges, it doesn't have to be done with every event
// if the cursor hasn't moved. The dragDirStore can tell you if it did.
function forceRecalculateEdges() {
	visualEdges = getVisualEdges(Object.values(frames.value), false)
}

// just makes it easier to remove the temporary window listeners
let controller: AbortController

// assuming something like this for each edge
// edgeEl.addEventListener("pointerdown", (e) => dragStartHandler(e, edge))
// you could even pass the point here already, and have handlers that look like ({edge, point}) => {...})

const dragStartHandler = function(e:PointerEvent, edge:Edge) {
	controller = new AbortController()
	window.addEventListener("pointermove", dragMoveHandler, { signal: controller.signal })
	window.addEventListener("pointerup", dragEndHandler, { signal: controller.signal })
	e.preventDefault()

	const point = toWindowCoord(win, e)

	dragPoint = point
	dragDirStore.setOrientation(getEdgeDirection(edge))
	dragDirStore.update(point, dragDirection)

	draggingEdge = edge
	isDragging = true
	touchingFrames = findFramesTouchingEdge(edge, Object.values(win.frames)) ?? []
	for (const frame of Object.values(win.frames)) {
		clonedFrames[frame.id] = cloneFrame(frame)
	}
}

const dragMoveHandler = function(e:PointerEvent, edge:Edge) {
	e.preventDefault()
	const point = toWindowCoord(win, e, snapPoint)

	const didChange = dragDirStore.update(point, dragDirection)
	dragPoint = point
	if (!didChange) return

	requestAnimationFrame(() => {
		if (isDragging) {
			moveEdge(win, touchingFrames, draggingEdge, point, 20)
		}
		forceRecalculateEdges()
	})
}

const dragEndHandler = function(e:PointerEvent, edge:Edge) {
	e.preventDefault()
	controller.abort() // remove the temporary listeners
	const point = toWindowCoord(win, e, snapPoint)

	const didChange = dragDirStore.update(point, dragDirection)
	dragPoint = point
	isDragging = false
	draggingEdge = undefined

	touchingFrames = {}
	dragDirStore.reset()
	dragPoint = undefined
	const apply = // determine if user wants to apply the drag
	if (!apply) {
		for (const frame of Object.values(clonedFrames)) {
			win.frames[frame.id] = frame
		}
	}
}
```
### Drag Actions

A drag action describes when and how to handle a drag event, to, for example, split/close a frame when dragging with a certain modifier.

Customizable `SplitAction` and `CloseAction` actions are provided.

It requires implementing the some of the variables `useFrames` returns (i.e. using the overlayed frames technique) for your framework. You can see an example of how to use it in the `LayoutWindows.vue` component.

### Overlayed Frames Technique

If you will be using drag actions or something like it, you'll probably want to handle the frame state by overlaying the changed state as needed. This makes two things possible:

- Actions can hide the new state. For example, when splitting, we don't want the edges to move from their original position.
- Actions can be easily cancelled.

To do this, at the start of the drag, you can clone all the touching frames (they will be the only ones that ever move) using `findFramesTouchingEdge` and `cloneFrames`.

```ts
const touchingFrames = {}
for (const _ of touching) touchingFrames.value[_.frame.id] = cloneFrame(_.frame)
```

You can then just get the overlayed frames like this where you need them.
```ts
const overlayedFrames = {
	...win.value.frames,
	...touchingFrames.value
}
```
If your framework has something like vue's computed you should use that and you can use a condition to "toggle" the overlay on/off.
```ts
showDraggging 
	? { ...win.value.frames, ...touchingFrames.value }
	: win.value.frames
```

You should then calculate all visualEdges based off of these frames. 

```ts
function recalculateEdges() {
	visualEdges = getVisualEdges(Object.values(frames.value), {
		// careful using this, you should handle this with a drag action
		// don't let it actually change the edges or you'll end up with an
		// invalid layout
		includeWindowEdges: true,
	})
}
```

You can use `DragDirectionStore` in your events to check if anything actually changed.


If it did, you should move the edges in touchingFrames in your drag move handler and update your edges.

```ts
requestAnimationFrame(() => {
	moveEdge(touchingFramesArray.value, draggingEdge.value, point)
	recalculateEdges()
})
```


# Vue Only Extras

## LayoutWindow

This is the main component that can render and handle dragging.

The component takes care of updating the size/pos of the window on mount.

It also includes basic styles for the edges and decos.

The order and styles classes look like this:

- `.frame` - frames come first so that edges can be rendered on top of them when needed.

Edges are stacked in this order. 

- `.active-frame-edge` (active frame - rendered as single div)
- `.drag-edge` (thicker edge for attaching pointer events) + sibling .edge 
	- It looks like `.drag-edge .edge .drag-edge .edge` and so on.
	- `.edge` is not shown by default, instead frames are padded to let the background show through since that way we can support having rounded corners inside the frames.
	- This is you can target the edge style on the drag-edge's hover: `.drag-edge:hover+.edge`
- `.grabbed-edge` (the grabbed drag edge if any) - prefer this over drag-edge:hover for css that should remain visible when dragging to avoid flickering when the mouse moves slightly off the edge
- `.intersection` (intersections)

**ALL edges except `active-frame-edge` are rendered as individual divs, so set the background color instead of the border.**

This is done like this for several reasons:
	- Edges can be shared by frames, only the active edges are guaranteed to equal some frame's edges. And we need to know the full edge that is being dragged to implement dragging.
	- The css/logic is simpler, edges can be any width without affecting the layout. We just transform translate them to be exactly centered over their position and then just pad the frames the correct amount.

Decos:

- Close:
  - `.deco-close-frame` (close frame preview)
  - `.deco-close-force-frame` (close frame preview when force is on)
- Split:
  - `.deco-split-new-frame` (new frame preview)
  - `.deco-split-edge` (edge preview)

State classes (so you can do stuff like `.request-split .drag-edge`)
- `.dragging`
- `.request-split`
- `.request-close`

Several css variables are provided to help with sizing:
- `--layoutHandleWidth`
- `--layoutEdgeWidth`
- `--layoutSplitEdgeWidth`
- `--layoutIntersectionWidth`

```vue
<template>

<LayoutWindow
	v-if="win"
	class="flex-1 w-full
		// hide drag/grabbed edge when splitting (let only split edge show)
		[&.request-split_.grabbed-edge]:hidden
		[&.request-split_.drag-edge]:hidden
	"
	style="--layoutSplitEdgeWidth:2px;"
	:win="win"
>
	<template #[`frame-${f.id}`] v-for="f in frames" :key="f.id">
		<ContentFrame
			:frame="f"
			:get-component="getComponent"
		/>
	</template>
</LayoutWindow>
</template>

<script setup lang="ts">
const {
	layout,
	activeWindow: win,
	activeFrame,
	frames
} = storeToRefs(useLayoutStore())

function getComponent(type: string | undefined) {
	if (type === "contentA") {
		return yourContentAComponent
	}
}

</script>
```
## Nuxt w/ Tailwind

The nuxt module creates a `witchcraft-layout.css` file with the proper source imports for the components folder. You just have to import it in your tailwind css file. Note that this requires `@witchcraft/ui` be installed and setup in a similar way also.

```css [~/assets/css/tailwind.css]
@import "tailwindcss";
// or
@import "tailwindcss" source("path/to/src");
@import "../../../.nuxt/witchcraft-ui.css";
@import "../../../.nuxt/witchcraft-layout.css";
```


