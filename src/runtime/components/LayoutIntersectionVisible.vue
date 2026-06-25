<template>
<LayoutShapeSquare
	:css="css"
	:class="twMerge(`
		drag-intersection-visible
		z-30
		rounded-full
		pointer-events-none
		[.drag-intersection:hover+&]:bg-blue-500/50
	`,
		css._shifted && `w-[7px] h-[7px]`,
		($attrs as any).class
	)"
	v-bind="{ ...$attrs, class: undefined }"
/>
</template>

<script lang="ts" setup>
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { inject, useAttrs } from "vue"

import LayoutShapeSquare from "./LayoutShapeSquare.vue"
import { layoutContextInjectionKey } from "../types/index.js"

import { getIntersectionsCss } from "../helpers/getIntersectionsCss.js"

const $attrs = useAttrs()

defineOptions({
	inheritAttrs: false
})

defineProps<{
	css: ReturnType<typeof getIntersectionsCss>[number]
}>()


const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used within a LayoutWindow")

</script>
