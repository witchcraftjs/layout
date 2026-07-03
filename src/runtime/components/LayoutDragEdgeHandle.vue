<template>
<LayoutShapeRect
	:css="css"
	:title="edge.error?.message"
	:class="twMerge(
		`
			drag-edge
			z-20
			hover:cursor-pointer
			[.request-split_&]:hidden
		`,
		edge.error && `
			drag-edge-errored
			hover:cursor-not-allowed
				`,
		($attrs as any).class
	)"
	v-bind="{ ...$attrs, class: undefined }"
	@pointerdown="onPointerDown?.($event, 'edge', { edge })"
/>
</template>

<script lang="ts" setup>
import { layoutContextInjectionKey } from "../types/vue.js"
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { useAttrs, inject } from "vue"

import LayoutShapeRect from "./LayoutShapeRect.vue"
import { type EdgeDragStartData } from "../types/index.js"
import { dragContextInjectionKey } from "../types/vue.js"
import type { Edge, EdgeCss } from "../types/index.js"

const $attrs = useAttrs()

defineOptions({
	inheritAttrs: false
})

const props = defineProps<{
	edge: Edge
	css: EdgeCss
	onPointerDown?: (e: PointerEvent, type: "edge", data: EdgeDragStartData) => void
}>()

const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used within a LayoutWindow")

const dragCtx = inject(dragContextInjectionKey, undefined)
if (!dragCtx) throw new Error("LayoutEdges must be used within a LayoutWindow")

</script>
