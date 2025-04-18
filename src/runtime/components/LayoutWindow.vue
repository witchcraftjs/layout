<template>
<!-- overflow hidden is because the borders inside will make it overflow -->
<div :class="twMerge(
		`window
		relative
		overflow-hidden
	`,
		isDragging && `dragging cursor-pointer`,
		requestType && `request-${requestType}`,
		$attrs.attrs.class
	)"
	ref="windowEl"
	v-bind="{...$attrs.attrs, class: undefined}"
>
	<template v-if="windowEl && win">
		<LayoutFrameComponent :frame="frame"
			:is-active-frame="frame.id === win.activeFrame"
			v-for="frame of frames"
			:key="frame.id"
			v-bind="$attrs.frameAttrs"
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
			v-bind="$attrs.edgesAttrs"
			@drag-start="dragStart"
		/>
		<LayoutDecosComponent
			:frames="frames"
			:split-decos="splitDecos"
			:close-decos="closeDecos"
			v-bind="$attrs.decosAttrs"
		/>
		<slot name="extra-decos"/>
	</template>
	<Teleport v-if="instructionsTeleportTo && filteredUsageInstructions.length > 0" defer :to="instructionsTeleportTo">
		<span aria-live="polite">
			<span
				class="
					after:content-['┃']
					after:text-accent-500
					last:after:content-none
					after:mx-1
					after:text-gray-500
				"
				v-for="instruction of filteredUsageInstructions"
				:key="instruction"
			>
				{{ instruction }}
			</span>
		</span>
	</Teleport>
</div>
</template>
<script lang="ts" setup>
import { useDivideAttrs } from "@witchcraft/ui/composables/useDivideAttrs"
import { useGlobalResizeObserver } from "@witchcraft/ui/composables/useGlobalResizeObserver"
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { computed, ref,watch } from "vue"

import LayoutDecosComponent from "./LayoutDecos.vue"
import LayoutEdgesComponent from "./LayoutEdges.vue"
import LayoutFrameComponent from "./LayoutFrame.vue"

import { useFrames } from "../composables/useFrames.js"
import { CloseAction } from "../drag/CloseAction"
import { DragActionHandler } from "../drag/DragActionHandler"
import { SplitAction } from "../drag/SplitAction.js"
import { type DragState, type IDragAction } from "../drag/types.js"
import { updateWindowWithEvent } from "../helpers/updateWindowSizeWithEvent.js"
import { windowSetActiveFrame } from "../layout/windowSetActiveFrame.js"
import { type CloseDeco, type LayoutWindow, type SplitDeco } from "../types/index.js"

const $attrs = useDivideAttrs(["frame", "edges", "decos"] as const)

const win = defineModel<LayoutWindow>("win", { required: true })

const props = withDefaults(defineProps<{
	additionalDragActions?: IDragAction[]
	splitKeyHandler?: (e: PointerEvent | KeyboardEvent, state: DragState) => boolean
	closeKeyHandler?: (e: PointerEvent | KeyboardEvent, state: DragState) => boolean
	usageInstructions?: Record<string, string | undefined>
	instructionsTeleportTo: string | undefined
	/**
	 * You might need to temporarily disable updating the window size while transitioning, depending on your layout.
	 *
	 * For example, if the component is in a flex container, during transition, there will be two components, and it will suddenly jump in size to being 1/2 the height. We can avoid this by using the known height (from win), but to do so, we can't let this component update the size while transitioning.
	 *
	 * When this is turned back on again, it will trigger an update. You can also trigger updates manually with the exposed updateWindowSize function.
	 */
	allowWindowSizeUpdate?: boolean
}>(), {
	additionalDragActions: () => ([]),
	splitKeyHandler: undefined,
	closeKeyHandler: undefined,
	usageInstructions: () => ({ }),
	instructionTeleportTo: undefined,
	allowWindowSizeUpdate: true
})
const emit = defineEmits<{
	(e: "isShowingDrag", value: boolean): void
	(e: "dragState", value: DragState): void
}>()

const filteredUsageInstructions = computed(() => Object.values(props.usageInstructions).filter(_ => _ !== undefined).map(_ => _))

const splitKeyHandler = props.splitKeyHandler ?? ((e: PointerEvent | KeyboardEvent, state: DragState) =>
	e.altKey || state.isDraggingFromWindowEdge)
const closeKeyHandler = props.closeKeyHandler ?? ((e: PointerEvent | KeyboardEvent) => {
	if (e.ctrlKey && e.shiftKey) {
		return "force"
	}
	if (e.shiftKey) return true
	return false
})


const windowEl = ref<HTMLElement | null>(null)

const showDragging = ref(true)

const closeDecos = ref<CloseDeco[]>([])
const splitDecos = ref<SplitDeco[]>([])
const requestType = ref<"split" | "close" | undefined | string>()

const dragActionHandler = new DragActionHandler(
	(
		type: "start" | "move" | "end",
		_e: PointerEvent | KeyboardEvent | undefined,
		state: DragState
	) => type === "move" ? !state.isDraggingFromWindowEdge : undefined,
	[
		new SplitAction(
			splitKeyHandler,
			((decos: SplitDeco[]) => splitDecos.value = decos),
			{
				onStart: () => showDragging.value = false,
				onCancel: () => showDragging.value = true,
			}),
		new CloseAction(
			closeKeyHandler,
			((decos: CloseDeco[]) => closeDecos.value = decos),
		),
		...props.additionalDragActions
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
		}
	}
)

const {
	dragStart,
	visualEdges,
	isDragging,
	draggingEdges,
	draggingIntersection,
	frames,
	intersections,
	state,
} = useFrames(
	win,
	showDragging,
	dragActionHandler,
)


function getWindowOffset() {
	const windowElRect = windowEl.value!.getBoundingClientRect()
	return {
		pxX: Math.floor(windowElRect.x),
		pxY: Math.floor(windowElRect.y),
	}
}
function getWindowSize() {
	const windowElRect = windowEl.value!.getBoundingClientRect()
	return {
		pxWidth: Math.floor(windowElRect.width),
		pxHeight: Math.floor(windowElRect.height),
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
})

</script>

