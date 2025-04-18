<template>
<LayoutShapeSquare
	v-if="activeFrame"
	:css="getShapeSquareCss(activeFrame, `var(--layoutEdgeWidth,2px)`)"
	:class="twMerge(`
		active-frame-edge
		pointer-events-none
		z-0
		border-blue-500
		border
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
		@pointerdown="emit('dragStart', $event, {edge:edges[i]})"
	/>
	<LayoutShapeSquare
		:css="css.thin"
		:class="twMerge(`
			pointer-events-none
			edge
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
<template v-for="css, i of cssDragIntersections" :key="i">
	<LayoutShapeSquare
		:css="css.thick"
		:class="twMerge(`
		drag-intersection
		z-30
		rounded-full
		hover:cursor-pointer
		[&:hover+.intersection]:bg-blue-500/50
		`,
		)"
		@pointerdown="emit('dragStart', $event, { intersection:wantedIntersections[i]})"
	/>
	<LayoutShapeSquare
		:css="css.thin"
		:class="twMerge(`
		intersection
		z-30
		rounded-full
		pointer-events-none
		`,
			css.thin._shifted && `w-[7px] h-[7px]`,
		)"
	/>
</template>
</template>
<script lang="ts" setup>
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { computed,type PropType, ref,useAttrs } from "vue"

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
	dragStart: [e: PointerEvent, { edge?: Edge, intersection?: IntersectionEntry }]
}>()
const props = withDefaults(defineProps< {
	edges: Edge[]
	intersections: IntersectionEntry[]
	/** The owning window, needed so we can correctly scale coordinates. */
	win: LayoutWindow
	/** The active frame, used to render the active edges. Calculate it from the `frames` returned by `useFrames` composable because otherwise it will be the wrong size while dragging. */
	activeFrame?: LayoutFrame
	draggingEdge?: Edge
	draggingIntersection?: IntersectionEntry
}>(), {
	activeFrame: undefined,
	draggingEdge: undefined,
	draggingIntersection: undefined,
})


const activeFrameCssEdges = computed(() => {
	if (!props.activeFrame) return []
	return getVisualEdgesCss(Object.values(frameToEdges(props.activeFrame)), {
		edgeWidth: `var(--layoutEdgeWidth, 2px)`,
	})
})

const cssDragEdges = computed(() => {
	const thickEdges = getVisualEdgesCss(
		props.draggingEdge
			? props.edges.filter(_ => !isEdgeEqual(props.draggingEdge!, _))
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
	if (!props.draggingEdge) return []
	return getVisualEdgesCss([props.draggingEdge], {
		edgeWidth: `var(--layoutEdgeWidth, 2px)`,
		padLongAxis: `(var(--layoutEdgeWidth, 2px) + var(--layoutExtraDragEdgePadding, 0px))`,
	})
})


const wantedIntersections = computed(() => props.intersections
	.filter(_ => !_.isWindowEdge && (_.count === 4 || (_.count === 1 && _.sharesEdge)))
)
const cssDragIntersections = computed(() => {
	const intersections: {
		thick: ReturnType<typeof getIntersectionsCss>[number]
		thin: ReturnType<typeof getIntersectionsCss>[number]
	}[] = []
	const thick = getIntersectionsCss(wantedIntersections.value, {
		intersectionWidth: `var(--layoutIntersectionWidth, 15px)`,
	})
	const thin = getIntersectionsCss(wantedIntersections.value, {
	})
	for (let i = 0; i < thick.length; i++) {
		intersections.push({ thick: thick[i], thin: thin[i] })
	}
	return intersections
})

</script>

