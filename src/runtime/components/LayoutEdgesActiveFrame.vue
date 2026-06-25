<template>
<LayoutShapeSquare
	v-if="activeFrame"
	:class="twMerge(`
		active-frame-edge
		pointer-events-none
		z-0
		border-blue-500
		border
		rounded-md
	`,
		($attrs as any).class
	)"
	v-bind="{ ...$attrs, class: undefined }"
	:css="getShapeSquareCss(activeFrame, `var(--layoutEdgeWidth,2px)`)"
/>
</template>

<script lang="ts" setup>
import { computed, inject, useAttrs } from "vue"
import { twMerge } from "@witchcraft/ui/utils/twMerge"

import LayoutShapeSquare from "./LayoutShapeSquare.vue"
import { dragContextInjectionKey, layoutContextInjectionKey } from "../types/index.js"
import { getShapeSquareCss } from "../helpers/getShapeSquareCss.js"


const $attrs = useAttrs()

defineOptions({
	inheritAttrs: false
})

const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used within a LayoutWindow")

const dragCtx = inject(dragContextInjectionKey, undefined)
if (!dragCtx) throw new Error("LayoutEdges must be used within a LayoutWindow")


const activeFrame = computed(() => ctx.value.win.activeFrame ? dragCtx.frames.value[ctx.value.win.activeFrame] : undefined)
</script>

