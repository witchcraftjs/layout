<template>
<!-- @vue-expect-error just let it inherit extra attrs -->
<!-- overflow-hidden is just in case, if the frame's css is not properly set to h-full, overflow-auto, or the border/padding are too large, we can still get overflows -->
<LayoutShapeSquare
	tabindex="0"
	:css="getShapeSquareCss(frame)"
	:class="twMerge(`
		frame
		p-[var(--layoutEdgeWidth,_2px)]
		overflow-hidden
		`,
		$attrs.class
	)"
	v-bind="{...$attrs, class: undefined}"
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
import { type PropType } from "vue"
import { useAttrs } from "vue"
const $attrs = useAttrs()

import LayoutShapeSquare from "./LayoutShapeSquare.vue"

import { getShapeSquareCss } from "../helpers/getShapeSquareCss"
import { debugFrame } from "../layout/debugFrame.js"
import { type LayoutFrame } from "../types/index.js"


const emit = defineEmits<{
	/** Documentation #todo */
	(e: "focus"): void
}>()

/* const props =  */defineProps({
	frame: { type: Object as PropType<LayoutFrame>, required: true },
	isActiveFrame: { type: Boolean, required: true },
})
</script>
