<template>
<LayoutShapeSquare
	v-if="activeFrame"
	:css="getShapeSquareCss(activeFrame)"
	:class="twMerge(`
			active-frame-edge
			z-0
			border-blue-500
			hover:border-accent-300
		`,
	)"
/>
	
<template
	v-for="css, i of cssDragEdges"
	:key="i"
>
	<LayoutShapeSquare
		:css="css.thick"
		:class="twMerge(`
			drag-edge
			z-20
			hover:cursor-pointer
			[&:hover+.edge]:bg-blue-500/50
		`)"
		@pointerdown="emit('dragStart', $event, edges[i])"
	/>
	<LayoutShapeSquare
		:css="css.thin"
		:class="twMerge(`
			edge
			pointer-events-none
		`)"
	/>
</template>
<LayoutShapeSquare
	:css="css"
	:class="twMerge(`
			grabbed-edge
			z-20
			bg-blue-500/50
			cursor-pointer
		`)"
	v-for="css, i of cssDragEdge"
	:key="i"
/>
<LayoutShapeSquare
	:css="css"
	:class="twMerge(`
		intersection
		z-30
		rounded-full
		hover:bg-red-500/50
		hover:cursor-pointer
		transition-all
		`,
		draggingEdge && `bg-blue-500`
	)"
	v-for="css, i of cssIntersections"
	:key="i"
/>
</template>
<script lang="ts" setup>
import { twMerge } from "@witchcraft/ui/utils/twMerge.js"
import { computed, defineEmits,type PropType, ref,useAttrs } from "vue"

import LayoutShapeSquare from "./LayoutShapeSquare.vue"

import { frameToEdges } from "../helpers/frameToEdges.js"
import { getIntersectionsCss } from "../helpers/getIntersectionsCss.js"
import { getShapeSquareCss } from "../helpers/getShapeSquareCss.js"
import { getVisualEdgesCss } from "../helpers/getVisualEdgesCss.js"
import { isEdgeEqual } from "../helpers/isEdgeEqual.js"
import { toWindowCoord } from "../helpers/toWindowCoord.js"
import {
	type Edge,
	type EdgeCss,
	type IntersectionEntry,
	type LayoutFrame,
	type LayoutWindow,
	type Point,
} from "../types/index.js"
const $attrs = useAttrs()

const emit = defineEmits<{
	dragStart: [e: PointerEvent, edge: Edge]
}>()
const props = withDefaults(defineProps< {
	edges: Edge[]
	intersections: IntersectionEntry[]
	/** The owning window, needed so we can correctly scale coordinates. */
	win: LayoutWindow
	/** The active frame, used to render the active edges. Calculate it from the `frames` returned by `useFrames` composable because otherwise it will be the wrong size while dragging. */
	activeFrame?: LayoutFrame
}>(), {
	activeFrame: undefined,
})

const draggingEdge = ref<Edge | undefined>(undefined)

const activeFrameCssEdges = computed(() => {
	if (!props.activeFrame) return []
	return getVisualEdgesCss(Object.values(frameToEdges(props.activeFrame)), {
		edgeWidth: `var(--layoutEdgeWidth, 2px)`,
	})
})

const cssDragEdges = computed(() => {
	const thickEdges = getVisualEdgesCss(
		draggingEdge.value
			? props.edges.filter(_ => !isEdgeEqual(draggingEdge.value!, _))
			: props.edges,
		{
			edgeWidth: `var(--layoutHandleWidth, 8px)`,
			padLongAxis: `var(--layoutEdgeWidth, 2px)`,
		}
	)
	const thinEdges = getVisualEdgesCss(props.edges, {
		edgeWidth: `var(--layoutEdgeWidth, 2px)`,
		padLongAxis: `(var(--layoutEdgeWidth, 2px) + var(--layoutExtraDragEdgePadding, 0px))`,
	})
	const edges: { thin: EdgeCss, thick: EdgeCss }[] = []
	for (let i = 0; i < thickEdges.length; i++) {
		edges.push({ thin: thinEdges[i], thick: thickEdges[i] })
	}
	return edges
})

const cssDragEdge = computed(() => {
	if (!draggingEdge.value) return []
	return getVisualEdgesCss([draggingEdge.value], {
		edgeWidth: `var(--layoutEdgeWidth, 2px)`,
		padLongAxis: `(var(--layoutEdgeWidth, 2px) + var(--layoutExtraDragEdgePadding, 0px))`,
	})
})

const cssIntersections = computed(() => getIntersectionsCss(
	props.intersections.filter(_ => _.count === 4),
	{ intersectionWidth: `var(--layoutIntersectionWidth, 5px)` }
))

let controller: AbortController


// function dragStart(e: PointerEvent, edge: Edge) {
// 	controller = new AbortController()
// 	controller.signal.addEventListener("abort", () => {
// 		draggingEdge.value = undefined
// 	})
//
// 	e.preventDefault()
// 	draggingEdge.value = edge
// 	emit("dragstart", {
// 		edge,
// 		point: toWindowCoord(props.win, e),
// 		abortController: controller,
// 	}, e)
// 	window.addEventListener("pointermove", dragMove, { signal: controller.signal })
// 	window.addEventListener("pointerup", dragEnd, { signal: controller.signal })
// }
// function dragMove(e: PointerEvent) {
// 	e.preventDefault()
// 	emit("dragmove", {
// 		point: toWindowCoord(props.win, e),
// 	}, e)
// }
// function dragEnd(e: PointerEvent) {
// 	controller.abort()
// 	emit("dragend", {
// 		point: toWindowCoord(props.win, e),
// 		apply: true,
// 	}, e)
// }
//
</script>

