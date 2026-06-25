<template>
<template
	v-for="(shape) of ctx.shapes.filter(_ => _.type === 'square')"
	:key="cssToKey(shape.data)"
>
	<slot
		name="square"
		v-bind="{
			shape,
			css: getShapeSquareCss(shape.data, `var(--layoutEdgeWidth,2px)`)
		}"
	>
		<LayoutShapeSquare
			v-if="shape.type === 'square'"
			:css="getShapeSquareCss(shape.data, `var(--layoutEdgeWidth,2px)`)"
			:class="twMerge(`bg-neutral-500/20`,shape.attrs?.class, ($attrs as any).class)"
			v-bind="{...shape.attrs, ...$attrs, class: undefined }"
		/>
			{{twMerge(shape.attrs?.class, ($attrs as any).class)}}
	</slot>
	
</template>
</template>
<script lang="ts" setup>
import LayoutShapeSquare from "./LayoutShapeSquare.vue"

import { getShapeSquareCss } from "../helpers/getShapeSquareCss"
import { layoutContextInjectionKey,   } from "../types/index.js"
import { useAttrs, inject } from "vue"
import { cssToKey } from "../utils/cssToKey.js"
import { twMerge } from "@witchcraft/ui/utils/twMerge"

const $attrs = useAttrs()

defineOptions({
	inheritAttrs: false
})


const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used within a LayoutWindow")

</script>
