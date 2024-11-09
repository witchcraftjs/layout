<template>
<!-- @vue-expect-error just let it inherit extra attrs -->
<LayoutShapeSquare
	tabindex="0"
	:css="getShapeSquareCss(frame)"
	:class="twMerge(`
		frame
		p-[var(--layoutEdgeWidth,_2px)]
		overflow-auto
		`,
		$attrs.class
	)"
	v-bind="{...$attrs.attrs, class: undefined}"
	@focus="emit('focus')"
>
	<slot>
		<div class="p-2 text-xs bg-neutral-500">
			{{ debugFrame(frame) }}
		</div>
	</slot>
</LayoutShapeSquare>
</template>
<script lang="ts" setup>
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
