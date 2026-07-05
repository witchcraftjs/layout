<template>
<template
	v-for="css, i in cssDragEdges"
	:key="cssToKey(css.handle)"
>
	<slot name="handle" v-bind="{
		css: css.handle,
		edge: visualEdges[i],
		onPointerDown: dragCtx.moveStart
	}">
		<LayoutDragEdgeHandle
			:css="css.handle"
			:edge="visualEdges[i]"
			:on-pointer-down="dragCtx.moveStart"
		/>
	</slot>
	<slot name="indicator" v-bind="{
		css: css.visible,
		edge: visualEdges[i],
	}">
		<LayoutDragEdgeVisible
				:edge="visualEdges[i]"
			:css="css.visible"
		/>
	</slot>
</template>
</template>
<script lang="ts" setup>
import { layoutContextInjectionKey } from "../types/vue.js"

import { computed, inject } from "vue"

import LayoutDragEdgeHandle from "./LayoutDragEdgeHandle.vue"
import LayoutDragEdgeVisible from "./LayoutDragEdgeVisible.vue"
import { getVisualEdgesCss } from "../helpers/getVisualEdgesCss.js"
import { isEdgeEqual } from "../helpers/isEdgeEqual.js"
import { toRef } from "vue"
import {cssToKey} from "../utils/cssToKey.js"
import { type EdgeCss } from "../types/index.js"
import { moveContextInjectionKey } from "../types/vue.js"

defineOptions({
	inheritAttrs: false
})

const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used wivisible a LayoutWindow")

const dragCtx = inject(moveContextInjectionKey, undefined)
if (!dragCtx) throw new Error("LayoutEdges must be used within a LayoutWindow")


const visualEdges = toRef(dragCtx, "visualEdges")

const draggingEdge = computed(() => dragCtx.movingEdges.value.length === 1 ? dragCtx.movingEdges.value[0] : undefined)

const cssDragEdges = computed(() => {
	const handleEdges = getVisualEdgesCss(
		draggingEdge.value
			? dragCtx.visualEdges.value.filter(_ => !isEdgeEqual(draggingEdge.value!, _))
			: dragCtx.visualEdges.value,
		{
			edgeWidth: `var(--layoutHandleWidth, 8px)`,
			padLongAxis: `var(--layoutEdgeWidth, 2px)`
		}
	)
	const visibleEdges = getVisualEdgesCss(dragCtx.visualEdges.value, {
		edgeWidth: `var(--layoutEdgeWidth, 2px)`,
		padLongAxis: `(var(--layoutEdgeWidth, 2px) + var(--layoutExtraDragEdgePadding, 0px))`
	})
	const edges: { visible: EdgeCss, handle: EdgeCss }[] = []
	for (let i = 0; i < handleEdges.length; i++) {
		edges.push({ visible: visibleEdges[i], handle: handleEdges[i] })
	}
	return edges
})

</script>
