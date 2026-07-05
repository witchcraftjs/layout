<template>
<template
	v-for="css, i of cssDragIntersections"
	:key="cssToKey(css.handle)"
>
	<slot name="handler" v-bind="{
		css: css.handle,
		onPointerDown: dragCtx.moveStart,
		intersection: draggableIntersections[i]
	}">
		<LayoutIntersectionHandle
			:css="css.handle"
			:intersection="draggableIntersections[i]"
			:on-pointer-down="dragCtx.moveStart"
		/>
	</slot>
	<slot name="indicator" v-bind="{ css: css.visible, intersection: draggableIntersections[i] }">
		<LayoutIntersectionVisible
			:css="css.visible"
		/>
	</slot>
</template>
</template>

<script lang="ts" setup>
import { moveContextInjectionKey, layoutContextInjectionKey } from "../types/vue.js"
import { computed, inject } from "vue"


import { getIntersectionsCss } from "../helpers/getIntersectionsCss.js"

import { cssToKey } from "../utils/cssToKey.js"
import LayoutIntersectionHandle from "./LayoutIntersectionHandle.vue"
import LayoutIntersectionVisible from "./LayoutIntersectionVisible.vue"

defineOptions({
	inheritAttrs: false
})

const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used within a LayoutWindow")

const dragCtx = inject(moveContextInjectionKey, undefined)
if (!dragCtx) throw new Error("LayoutEdges must be used within a LayoutWindow")

const draggableIntersections = computed(() => dragCtx.intersections.value
	.filter(_ => !_.isWindowEdge && (_.count === 4 || (_.count === 1 && _.sharesEdge)))
)

const cssDragIntersections = computed(() => {
	const intersections: {
		handle: ReturnType<typeof getIntersectionsCss>[number]
		visible: ReturnType<typeof getIntersectionsCss>[number]
	}[] = []
	const thick = getIntersectionsCss(draggableIntersections.value, {
		intersectionWidth: `var(--layoutIntersectionWidth, 15px)`
	})
	const thin = getIntersectionsCss(draggableIntersections.value, {
	})
	for (let i = 0; i < thick.length; i++) {
		intersections.push({ handle: thick[i], visible: thin[i] })
	}
	return intersections
})
</script>
