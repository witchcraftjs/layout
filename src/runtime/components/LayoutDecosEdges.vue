<template>
<template
	v-for="(shape, i) of ctx.shapes.filter(_ => _.type === 'edge')"
	:key="cssToKey(shape.data)"
>
	
	<slot
		name="edge"
		v-bind="{
			shape,
			css: getVisualEdgeCss(shape.data, { padLongAxis: 'var(--layoutEdgeWidth,2px)' })
		}"
	>
	<LayoutShapeRect
		:css="getVisualEdgeCss(shape.data, { padLongAxis: 'var(--layoutEdgeWidth,2px)' })"
		:class="twMerge(shape.attrs?.class, ($attrs as any).class)"
		v-bind="{...shape.attrs, ...$attrs, class: undefined }"

	/>
	</slot>
</template>
</template>
<script lang="ts" setup>
import LayoutShapeRect from "./LayoutShapeRect.vue"

import { getVisualEdgeCss } from "../helpers/getVisualEdgeCss"
import { layoutContextInjectionKey } from "../types/vue.js"
import { useAttrs, inject } from "vue"
import {cssToKey} from "../utils/cssToKey.js"
import { twMerge } from "@witchcraft/ui/utils/twMerge"

const $attrs = useAttrs()

const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used within a LayoutWindow")


</script>
