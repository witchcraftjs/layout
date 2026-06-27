<template>
<LayoutShapeRect
	:css="css"
	:class="twMerge(`
		drag-edge-grabbed
		z-20
		bg-accent-500
		cursor-pointer
		[&.request-split]:hidden
	`,
		($attrs as any).class
	)"
	v-bind="{ ...$attrs, class: undefined }"
	v-for="css, i of cssDragEdge"
	:key="cssToKey(css)"
/>
</template>
<script lang="ts" setup>
import { dragContextInjectionKey, layoutContextInjectionKey } from "../types/vue.js"
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { computed, inject, useAttrs } from "vue"

import LayoutShapeRect from "./LayoutShapeRect.vue"
import { getVisualEdgesCss } from "../helpers/getVisualEdgesCss.js"
import { cssToKey } from "../utils/cssToKey.js"


const $attrs = useAttrs()

defineOptions({
	inheritAttrs: false
})

const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used within a LayoutWindow")

const dragCtx = inject(dragContextInjectionKey, undefined)
if (!dragCtx) throw new Error("LayoutEdges must be used within a LayoutWindow")

const draggingEdge = computed(() => dragCtx.draggingEdges.value.length === 1 ? dragCtx.draggingEdges.value[0] : undefined)

const cssDragEdge = computed(() => {
	if (!draggingEdge.value) return []
	return getVisualEdgesCss([draggingEdge.value], {
		edgeWidth: `var(--layoutEdgeWidth, 2px)`,
		padLongAxis: `(var(--layoutEdgeWidth, 2px) + var(--layoutExtraDragEdgePadding, 0px))`
	})
})

</script>
