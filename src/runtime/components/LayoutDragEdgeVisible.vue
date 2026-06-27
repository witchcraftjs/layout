<template>
<LayoutShapeRect
	:class="twMerge(
		`
			visible-drag-edge
			pointer-events-none
			[.drag-edge:hover+&]:bg-accent-500/60
		`,
		edge.error && `
			visible-drag-edge-errored
			[.drag-edge:hover+&]:bg-red-500/50
			[.drag-edge:hover+&]:cursor-not-allowed

		`,
		($attrs as any).class
	)"
	:css="css"
	v-bind="{ ...$attrs, class: undefined }"
/>
</template>

<script lang="ts" setup>
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { useAttrs, inject } from "vue"

import LayoutShapeRect from "./LayoutShapeRect.vue"
import { type Edge, type EdgeCss } from "../types/index.js"
import { layoutContextInjectionKey } from "../types/vue.js"


const $attrs = useAttrs()

defineOptions({
	inheritAttrs: false
})

defineProps<{
	edge: Edge
	css: EdgeCss
}>()

const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used within a LayoutWindow")

</script>
