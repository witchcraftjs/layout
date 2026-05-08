<template>
<!-- overflow hidden is because the borders inside will make it overflow -->
<div
	:class="twMerge(
		`
			layout-wrapper
			flex
			flex-col
		`,
		isDragging && `dragging cursor-pointer`,
		requestType && `request-${requestType}`,
		($attrs as any).class
	)"
	v-bind="{ ...$attrs, class: undefined }"
>
	<template v-if="windowEl && win">
		<LayoutFrameComponent
			:frame="frame"
			:is-active-frame="frame.id === win.activeFrame"
			v-for="frame of frames"
			:key="frame.id"
			v-bind="frameProps"
			@focus="windowSetActiveFrame(win, frame.id)"
		>
			<slot :name="`frame-${frame.id}`" v-bind="{frame}"/>
		</LayoutFrameComponent>
		<LayoutEdgesComponent
			:win="win"
			:active-frame="win.activeFrame ? frames[win.activeFrame] : undefined"
			:edges="visualEdges"
			:intersections="intersections"
			:dragging-edge="draggingEdges.length === 1 ? draggingEdges[0] : undefined"
			:dragging-intersection="draggingIntersection"
			v-bind="edgesProps"
			@drag-start="dragStart"
		/>
		<LayoutDecosComponent
			:shapes="shapes"
		/>
		<slot name="extra-decos"/>
	</template>
	<Teleport v-if="instructionsTeleportTo && filteredUsageInstructions.length > 0" :to="instructionsTeleportTo" defer>
		<span aria-live="polite">
			<span
				:class="twMerge(`
					text-hint
					after:content-['┃']
					last:after:content-none
					after:mx-1
					after:text-neutral-500
				`, instruction.classes)"
				v-for="instruction of textHints"
				:key="instruction.text"
			>
				{{ instruction.text }}
			</span>
		</span>
	</Teleport>
</div>
</template>
<script lang="ts" setup>
import { useGlobalResizeObserver } from "@witchcraft/ui/composables/useGlobalResizeObserver"
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { computed, provide, reactive, ref, useAttrs, watch } from "vue"

import LayoutDecosComponent from "./LayoutDecos.vue"
import LayoutEdgesComponent from "./LayoutEdges.vue"
import LayoutFrameComponent from "./LayoutFrame.vue"

import { useFrames } from "../composables/useFrames.js"
import { createDefaultHandlers } from "../drag/createDefaultHandlers.js"
import { DragActionHandler } from "../drag/DragActionHandler"
import { dragContextInjectionKey, type DragState, type IDragAction } from "../drag/types.js"
import { updateWindowWithEvent } from "../helpers/updateWindowSizeWithEvent.js"
import { windowSetActiveFrame } from "../layout/windowSetActiveFrame.js"
import type { LayoutEdgesProps, LayoutFrameProps, LayoutWindow } from "../types/index.js"
import { settings } from "../settings.js"


const $attrs = useAttrs()
const win = defineModel<LayoutWindow>("win", { required: true })

const props = withDefaults(defineProps<{
	/** Custom drag action handlers. Falls back to default split/close/frame handlers if not provided. */
	actionHandlers?: IDragAction[]
	textHints?: {text:string, classes?:string}[] 
	textHintsTeleportTo: string | undefined
	ghostTeleportTo?: string
	/**
	 * You might need to temporarily disable updating the window size while transitioning, depending on your layout.
	 *
	 * For example, if the component is in a flex container, during transition, there will be two components, and it will suddenly jump in size to being 1/2 the height. We can avoid this by using the known height (from win), but to do so, we can't let this component update the size while transitioning.
	 *
	 * When this is turned back on again, it will trigger an update. You can also trigger updates manually with the exposed updateWindowSize function.
	 */
	allowWindowSizeUpdate?: boolean
	frameProps?: Partial<Omit<LayoutFrameProps, "frame" | "isActiveFrame" | "onFocus">>
	edgesProps?: Partial<Omit<LayoutEdgesProps, "edges" | "intersections" | "win">>,
}>(), {
	actionHandlers: undefined,
	textHints: () => [],
	textHintsTeleportTo: undefined,
	ghostTeleportTo: "#root",
	allowWindowSizeUpdate: true
})
const emit = defineEmits<{
	(e: "isShowingDrag", value: boolean): void
	(e: "dragState", value: DragState): void
}>()


const windowEl = ref<HTMLElement | null>(null)

const requestType = ref<"split" | "close" | undefined | string>()

const dragActionHandler = new DragActionHandler(
	[
		...(props.actionHandlers ?? createDefaultHandlers()),
	],
	{
		onEvent: (e, cancel) => {
			showDragging.value = true
			if (e instanceof KeyboardEvent && e.key === "Escape") {
				cancel()
			}
		},
		onRequestChange: type => {
			requestType.value = type
		},
		onEnd: () => {
			requestType.value = undefined
			showDragging.value = true
		},
	}
)
dragActionHandler.shapes = reactive([])
dragActionHandler.textHints = reactive({ actions: [], errors: [] })
const shapes = dragActionHandler.shapes

const dragContext  = useFrames(
	win,
	dragActionHandler
)

const {
	dragStart,
	dragPoint,
	visualEdges,
	isDragging,
	draggingEdges,
	draggingIntersection,
	frames,
	intersections,
	state,
	frameDragFrameId,
	showDragging,
} = dragContext

provide(dragContextInjectionKey, dragContext)

function getWindowOffset() {
	const windowElRect = windowEl.value!.getBoundingClientRect()
	return {
		pxX: Math.floor(windowElRect.x),
		pxY: Math.floor(windowElRect.y)
	}
}
function getWindowSize() {
	const windowElRect = windowEl.value!.getBoundingClientRect()
	return {
		pxWidth: Math.floor(windowElRect.width),
		pxHeight: Math.floor(windowElRect.height)
	}
}
function updateWindowSize() {
	if (!props.allowWindowSizeUpdate) return
	const newSize = { ...getWindowSize(), ...getWindowOffset() }
	updateWindowWithEvent(win.value, newSize)
}
useGlobalResizeObserver(windowEl, updateWindowSize)
watch(() => props.allowWindowSizeUpdate, (newval, oldval) => {
	if (oldval === false && newval === true) {
		updateWindowSize()
	}
})


watch(state, () => emit("dragState", state.value))
watch(showDragging, () => emit("isShowingDrag", showDragging.value))

defineExpose({
	state,
	win,
	updateWindowSize,
	dragActionHandler
})
</script>

