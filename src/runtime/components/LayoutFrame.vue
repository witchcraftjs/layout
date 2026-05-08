<template>
<!-- overflow-hidden is just in case, if the frame's css is not properly set to h-full, overflow-auto, or the border/padding are too large, we can still get overflows -->
<LayoutShapeSquare
	tabindex="0"
	:css="getShapeSquareCss(frame)"
	:class="twMerge(`
		frame
		p-[var(--layoutEdgeWidth,_2px)]
		overflow-hidden
		`,
		($attrs as any).class
	)"
	v-bind="{ ...$attrs, class: undefined }"
	@focus="emit('focus')"
>
	<slot>
		<div class="p-2 text-xs bg-neutral-500">
			{{ debugFrame(frame) }}
		</div>
		<div>No slot found for `frame-{{ frame.id }}`. </div>
	</slot>
</LayoutShapeSquare>
</template>

<script lang="ts" setup>
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { useAttrs } from "vue"

const $attrs = useAttrs()

defineOptions({
	inheritAttrs: false
})

import LayoutShapeSquare from "./LayoutShapeSquare.vue"

import { getShapeSquareCss } from "../helpers/getShapeSquareCss"
import { debugFrame } from "../layout/debugFrame.js"
import type { LayoutFrameProps } from "../types/index.js"


const emit = defineEmits<{
	/** Documentation #todo */
	(e: "focus"): void
}>()

/* const props =  */defineProps<LayoutFrameProps>()
</script>
