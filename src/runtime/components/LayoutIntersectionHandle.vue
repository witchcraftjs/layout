<template>
<LayoutShapeRect
	:css="css"
	:class="twMerge(`
		drag-intersection
		z-30
		rounded-full
		hover:cursor-pointer
	`, ($attrs as any).class)"
	v-bind="{ ...$attrs, class: undefined }"
	@pointerdown="onPointerDown?.($event, 'edge', { intersection })"
/>
</template>

<script lang="ts" setup>
import { layoutContextInjectionKey } from "../types/vue.js"
import { useAttrs, inject } from "vue"
import { twMerge } from "@witchcraft/ui/utils/twMerge"

import LayoutShapeRect from "./LayoutShapeRect.vue"

import { getIntersectionsCss } from "../helpers/getIntersectionsCss.js"
import { type EdgeDragStartData } from "../types/index.js"
import { dragContextInjectionKey } from "../types/vue.js"
import type { IntersectionEntry } from "../types/index.js"

const $attrs = useAttrs()

defineOptions({
	inheritAttrs: false
})

const props = defineProps<{
	css: ReturnType<typeof getIntersectionsCss>[number]
	intersection: IntersectionEntry
	onPointerDown?: (e: PointerEvent, type: "edge", data: EdgeDragStartData) => void
}>()

const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used within a LayoutWindow")

const dragCtx = inject(dragContextInjectionKey, undefined)
if (!dragCtx) throw new Error("LayoutEdges must be used within a LayoutWindow")

</script>
