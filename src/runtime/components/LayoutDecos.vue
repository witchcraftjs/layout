<template>
<!-- <div -->
<!-- 	v-bind="$attrs" -->
<!-- 	class="decos" -->
<!-- > -->
<template
	v-for="(deco) of splitDecos"
	:key="deco.id"
>
	<LayoutShapeSquare
		class="
				deco-split-new-frame
				bg-blue-500/50
			"
		:css="getShapeSquareCss( deco.shapes.newFrame, `var(--layoutEdgeWidth,2px)`)"
	/>
	<LayoutShapeSquare
		class="
			deco-split-edge
			bg-red-500
		"
		:css="getVisualEdgeCss(deco.shapes.edge, {padLongAxis:`var(--layoutEdgeWidth,2px)`})"
	/>
</template>
<template
	v-for="deco of closeDecos"
	:key="deco.id"
>
	<LayoutShapeSquare
		:class="`
			${deco.force ? 'deco-close-force-frame' : 'deco-close-frame'}
			bg-red-500/50
		`"
		:css="getShapeSquareCss( frames[deco.id], `var(--layoutEdgeWidth,2px)`)"
	/>
</template>
<!-- </div> -->
</template>
<script lang="ts" setup>
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import type { PropType } from "vue"
import { computed, inject, ref, useAttrs } from "vue"

import LayoutShapeSquare from "./LayoutShapeSquare.vue"

import { dirToOrientation } from "../helpers/dirToOrientation.js"
import { getShapeSquareCss } from "../helpers/getShapeSquareCss"
import { getVisualEdgeCss } from "../helpers/getVisualEdgeCss"
import { type CloseDeco, type LayoutFrames, type Size, type SplitDeco } from "../types/index.js"

const $attrs = useAttrs()

const props = withDefaults(defineProps<{
	frames: LayoutFrames
	splitDecos: SplitDeco[]
	closeDecos: CloseDeco[]
} >(),{
})


</script>

