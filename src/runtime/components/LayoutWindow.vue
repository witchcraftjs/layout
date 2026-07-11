<template>
<!-- overflow hidden is because the borders inside will make it overflow -->
<div
	:class="twMerge(
		`
			layout-wrapper
			flex
			flex-col
		`,
		isMoving && `dragging cursor-pointer user-select-none pointer-events-none`,
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
		v-if="isMoving === 'frame' && movingFrameId && movePoint"
		:to="ghostTeleportTo"
		defer
	>
		<div
			class="fixed z-[9999] pointer-events-none"
			:style="{
				left: (movePoint.x / settings.maxInt * win.pxWidth + win.pxX) + 'px',
				top: (movePoint.y / settings.maxInt * win.pxHeight + win.pxY) + 'px',
				width: frames[movingFrameId]
					? (frames[movingFrameId].width / settings.maxInt * win.pxWidth) + 'px'
					: undefined,
				height: frames[movingFrameId]
					? (frames[movingFrameId].height / settings.maxInt * win.pxHeight) + 'px'
					: undefined
			}"
		>
			<slot
				:id="movingFrameId"
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
import { computed, markRaw, provide, reactive, ref, useAttrs, watch } from "vue"


import { useFrames } from "../composables/useFrames.js"
import { createDefaultHandlers } from "../move/createDefaultHandlers.js"
import { ActionHandler } from "../move/ActionHandler"
import { moveContextInjectionKey } from "../types/vue.js"
import { type MoveState, type IAction } from "../types/index.js"
import { getUpdateWindowSizeInfo } from "../layout/getUpdateWindowSizeInfo.js"
import { windowSetActiveFrame } from "../layout/windowSetActiveFrame.js"
import { type LayoutWindow } from "../types/index.js"
import { layoutContextInjectionKey } from "../types/vue.js"
import { settings } from "../settings.js"
import { applyFrameChanges } from "../layout/applyFrameChanges.js"


const $attrs = useAttrs()
const win = defineModel<LayoutWindow>("win", { required: true })

const props = withDefaults(defineProps<{
	/** If you really need it, you can provide your own drag action handler (remember to markRaw it), note the actionHandler's prop will no longer have any effect.*/
	actionHandler?: ActionHandler<any, any>
	/** Custom drag action handlers. Falls back to default split/close/frame handlers if not provided. */
	actionHandlers?: IAction[]
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
	(e: "isShowingMove", value: boolean): void
	(e: "moveState", value: MoveState): void
}>()


const windowEl = ref<HTMLElement | null>(null)

const requestType = ref<string | undefined | string>()

const actionHandler = props.actionHandler ?? markRaw(new ActionHandler(
	[
		...(props.actionHandlers ?? createDefaultHandlers())
	],
	{
		onEvent: (e, cancel) => {
			if (e instanceof KeyboardEvent && e.key === "Escape") {
				cancel()
			}
		},
		onRequestChange: type => {
			requestType.value = type as any
		},
		onEnd: () => {
			requestType.value = undefined
		},
	}
))
actionHandler.shapes = reactive([])
actionHandler.textHints = reactive({ actions: [], errors: [] })
const shapes = actionHandler.shapes

const moveContext  = useFrames(
	win,
	actionHandler
)

const {
	movePoint,
	isMoving,
	frames,
	state,
	movingFrameId,
	showMoving,
} = moveContext

provide(moveContextInjectionKey, moveContext)

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


watch(state, () => emit("moveState", state.value))
watch(showMoving, () => emit("isShowingMove", showMoving.value))

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
	actionHandler: actionHandler as ActionHandler<any, any>,
	moveContext
})
</script>

