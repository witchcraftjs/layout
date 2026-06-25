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
	@focus="ctx.onFocus(frame.id); emit('focus');"
	v-for="frame in frames"
	:key="frame.id"
>
	<slot :name="`frame-${frame.id}`" v-bind="{frame}">
		<div class="p-2 text-xs bg-neutral-500">
			{{ debugFrame(frame) }}
		</div>
		<div>No slot found for `frame-{{ frame.id }}`. </div>
	</slot>
</LayoutShapeSquare>
</template>

<script lang="ts" setup>
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { useAttrs, inject, toRef } from "vue"

const $attrs = useAttrs()

import LayoutShapeSquare from "./LayoutShapeSquare.vue"

import { getShapeSquareCss } from "../helpers/getShapeSquareCss"
import { debugFrame } from "../layout/debugFrame.js"
import { dragContextInjectionKey, layoutContextInjectionKey } from "../types/index.js"

defineOptions({
	inheritAttrs: false
})

const emit = defineEmits<{
	/** Focus event is always "emitted" to the provider (so it can't be cancelled), but the component also emits it in case you want to listen to it. */
	(e: "focus"): void
}>()

const ctx = inject(layoutContextInjectionKey, undefined)
if (!ctx) throw new Error("LayoutEdges must be used within a LayoutWindow")

const dragCtx = inject(dragContextInjectionKey, undefined)
if (!dragCtx) throw new Error("LayoutEdges must be used within a LayoutWindow")

const frames = toRef(dragCtx, "frames")
</script>
