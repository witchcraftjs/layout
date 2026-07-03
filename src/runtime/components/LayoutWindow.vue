<template>
<!-- overflow hidden is because the borders inside will make it overflow -->
<div
	:class="twMerge(
		`
			layout-wrapper
			flex
			flex-col
		`,
		isDragging && `dragging cursor-pointer user-select-none`,
		requestType && `request-${requestType}`,
		($attrs as any).class
	)"
	v-bind="{ ...$attrs, class: undefined }"
>
		<!-- we need the size withot borders for correct px calculations -->
	<div
		class="layout-window relative overflow-hidden flex-1"
		ref="windowEl"
	>
		<template v-if="windowEl && win">
			<slot/>
		</template>
	</div>
	<Teleport
		v-if="isDragging === 'frame' && frameDragFrameId && dragPoint"
		:to="ghostTeleportTo"
		defer
	>
		<div
			class="fixed z-[9999] pointer-events-none"
			:style="{
				left: (dragPoint.x / settings.maxInt * win.pxWidth + win.pxX) + 'px',
				top: (dragPoint.y / settings.maxInt * win.pxHeight + win.pxY) + 'px',
				width: frames[frameDragFrameId]
					? (frames[frameDragFrameId].width / settings.maxInt * win.pxWidth) + 'px'
					: undefined,
				height: frames[frameDragFrameId]
					? (frames[frameDragFrameId].height / settings.maxInt * win.pxHeight) + 'px'
					: undefined
			}"
		>
			<slot
				:id="frameDragFrameId"
				:name="`frame-drag-ghost`"
			>
				<div class="frame-drag-ghost border border-neutral-500 bg-white/50 w-10 h-10"/>
			</slot>
		</div>
	</Teleport>
	<Teleport v-if="textHintsTeleportTo && textHints.length > 0" :to="textHintsTeleportTo" defer>
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


import { useFrames } from "../composables/useFrames.js"
import { createDefaultHandlers } from "../drag/createDefaultHandlers.js"
import { DragActionHandler } from "../drag/DragActionHandler"
import { dragContextInjectionKey } from "../types/vue.js"
import { type DragState, type IDragAction } from "../types/index.js"
import { getUpdateWindowSizeInfo } from "../layout/getUpdateWindowSizeInfo.js"
import { windowSetActiveFrame } from "../layout/windowSetActiveFrame.js"
import { type LayoutWindow } from "../types/index.js"
import { layoutContextInjectionKey } from "../types/vue.js"
import { settings } from "../settings.js"
import { applyFrameChanges } from "../layout/applyFrameChanges.js"


const $attrs = useAttrs()
const win = defineModel<LayoutWindow>("win", { required: true })

const props = withDefaults(defineProps<{
	/** If you really need it, you can provide your own drag action handler, note the actionHandler's prop will no longer have any effect.*/
	dragActionHandler?: DragActionHandler<any, any>
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

const requestType = ref<string | undefined | string>()

const dragActionHandler = props.dragActionHandler ?? new DragActionHandler(
	[
		...(props.actionHandlers ?? createDefaultHandlers())
	],
	{
		onEvent: (e, cancel) => {
			showDragging.value = true
			if (e instanceof KeyboardEvent && e.key === "Escape") {
				cancel()
			}
		},
		onRequestChange: type => {
			requestType.value = type as any
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
	dragPoint,
	isDragging,
	frames,
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
function onWindowResize() {
	if (!props.allowWindowSizeUpdate) return
	const newSize = { ...getWindowSize(), ...getWindowOffset() }
	win.value.pxX = newSize.pxX
	win.value.pxY = newSize.pxY
	applyFrameChanges(win.value, getUpdateWindowSizeInfo(win.value, newSize))
}

useGlobalResizeObserver(windowEl, onWindowResize)
watch(() => props.allowWindowSizeUpdate, (newval, oldval) => {
	if (oldval === false && newval === true) {
		onWindowResize()
	}
})


watch(state, () => emit("dragState", state.value))
watch(showDragging, () => emit("isShowingDrag", showDragging.value))

const layoutContext = computed(() => {
	return {
		win: win.value!,
		shapes,
		onFocus: (frameId:string) => windowSetActiveFrame(win.value!, frameId),
	}
})
provide(layoutContextInjectionKey, layoutContext)

defineExpose({
	state,
	win,
	getUpdateWindowSizeInfo,
	dragActionHandler: dragActionHandler as DragActionHandler<any, any>,
})
</script>

