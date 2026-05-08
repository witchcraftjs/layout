<template>
<template
	v-for="(shape, i) of shapes"
		:key="`${shape.type}-${i}`"
>
	<LayoutShapeSquare
		v-if="shape.type === 'square'"
		:css="getShapeSquareCss(shape.data, `var(--layoutEdgeWidth,2px)`)"
		v-bind="shape.attrs ?? {}"
	/>
	<LayoutShapeSquare
		v-else-if="shape.type === 'edge'"
		:css="getVisualEdgeCss(shape.data, { padLongAxis: 'var(--layoutEdgeWidth,2px)' })"
		v-bind="shape.attrs ?? {}"
	/>
</template>
</template>
<script lang="ts" setup>
import LayoutShapeSquare from "./LayoutShapeSquare.vue"

import { getShapeSquareCss } from "../helpers/getShapeSquareCss"
import { getVisualEdgeCss } from "../helpers/getVisualEdgeCss"
import type { LayoutShape } from "../types/index.js"

defineProps<{
	shapes: LayoutShape[]
}>()
</script>
