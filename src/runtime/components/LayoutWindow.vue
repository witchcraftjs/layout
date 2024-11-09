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
			v-bind="$attrs.edgesAttrs"
			@drag-start="dragStart"
		/>
		<LayoutDecosComponent
			:frames="frames"
			:split-decos="splitDecos"
			:close-decos="closeDecos"
			v-bind="$attrs.decosAttrs"
		/>
	</template>

	<Teleport defer to="#dev">
		{{ isDragging }}
		{{ showDragging }}
		{{ frames }}
	</Teleport>
	<Teleport v-if="isDragging" defer to="#status-bar">
		<span aria-live="polite">
			{{ isDragging? "Hold Ctrl to Close a Frame, Shift to Force Close, or Alt to Split" : "" }}
		</span>
	</Teleport>
</div>
</template>
<script lang="ts" setup>
import { snapNumber } from "@alanscodelog/utils/snapNumber.js"
import { unreachable } from "@alanscodelog/utils/unreachable.js"
import { useDivideAttrs } from "@witchcraft/ui/composables/useDivideAttrs.js"
import { useGlobalResizeObserver } from "@witchcraft/ui/composables/useGlobalResizeObserver.js"
import { twMerge } from "@witchcraft/ui/utils/twMerge.js"
import { computed, onBeforeUnmount, onMounted, provide, ref, toRef } from "vue"

import LayoutDecosComponent from "./LayoutDecos.vue"
import LayoutEdgesComponent from "./LayoutEdges.vue"
import LayoutFrameComponent from "./LayoutFrame.vue"

import { useFrames } from "../composables/useFrames.js"
import { CloseAction } from "../drag/CloseAction"
import { DragActionHandler } from "../drag/DragActionHandler"
import { SplitAction } from "../drag/SplitAction.js"
import { dirToOrientation } from "../helpers/dirToOrientation.js"
import { updateWindowWithEvent } from "../helpers/updateWindowSizeWithEvent.js"
import { closeFrames } from "../layout/closeFrames.js"
import { createSplitDecoFromDrag } from "../layout/createSplitDecoFromDrag.js"
import { findFramesTouchingEdge } from "../layout/findFramesTouchingEdge.js"
import { frameSplit } from "../layout/frameSplit.js"
import { getCloseFrameInfo } from "../layout/getCloseFrameInfo.js"
import { getFrameSplitInfo } from "../layout/getFrameSplitInfo.js"
import { windowSetActiveFrame } from "../layout/windowSetActiveFrame.js"
import { type CloseDeco, type LayoutFrame, type LayoutWindow, type Point, type SplitDeco } from "../types/index.js"
import type { KnownError } from "../utils/KnownError.js"

const $attrs = useDivideAttrs(["frame", "edges", "decos"] as const)

const win = defineModel<LayoutWindow>("win", { required: true })

const windowEl = ref<HTMLElement | null>(null)

const showDragging = ref(true)

const closeDecos = ref<CloseDeco[]>([])
const splitDecos = ref<SplitDeco[]>([])
const requestType = ref<"split" | "close" | undefined>()

function dragInfo() {
	return {
		/* eslint-disable no-use-before-define */
		dragHoveredFrame: dragHoveredFrame.value,
		dragDirection: dragDirection.value,
		dragPoint: dragPoint.value,
		win: win.value,
		isDragging: isDragging.value,
		draggingEdge: draggingEdge.value,
		visualEdges: visualEdges.value,
		frames: frames.value,
		touchingFramesArray: touchingFramesArray.value,
		/* eslint-enable no-use-before-define */
	}
}
const dragActionHandler = new DragActionHandler(
	[
		new SplitAction(
			// eslint-disable-next-line no-use-before-define
			(e?: PointerEvent | KeyboardEvent) => (e instanceof KeyboardEvent && e.altKey) || isDraggingWindowEdge.value,
			dragInfo,
			((decos: SplitDeco[]) => splitDecos.value = decos),
			{
				onStart: () => showDragging.value = false,
				onCancel: () => showDragging.value = true,
			}),
		new CloseAction(
			(e?: PointerEvent | KeyboardEvent) => {
				if (e instanceof KeyboardEvent) {
					if (e.ctrlKey && e.shiftKey) {
						return "force"
					}
					if (e.shiftKey) return true
				}
				return false
			},
			dragInfo,
			((decos: CloseDeco[]) => closeDecos.value = decos),
		)

	],
	{
		onEvent: (e, cancel) => {
			showDragging.value = true
			if (e instanceof KeyboardEvent && e.key === "Escape") {
				cancel()
			}
		},
		// eslint-disable-next-line no-use-before-define
		onRecalculate: () => forceRecalculateEdges(),
		onRequestChange: type => {
			requestType.value = type
		},
		onEnd: () => {
			requestType.value = undefined
			showDragging.value = true
		}
	}
)

const eventHandler = dragActionHandler.eventHandler.bind(dragActionHandler)
const onDragChange = dragActionHandler.onDragChange.bind(dragActionHandler)
const onDragApply = dragActionHandler.onDragApply.bind(dragActionHandler)

const {
	dragStart,
	visualEdges,
	isDragging,
	draggingEdge,
	dragDirection,
	touchingFramesArray,
	forceRecalculateEdges,
	frames,
	dragHoveredFrame,
	dragPoint,
	intersections,
	isDraggingWindowEdge,
} = useFrames(
	win,
	showDragging,
	{
		onDragChange: dragActionHandler.onDragChange.bind(dragActionHandler),
		onDragApply: dragActionHandler.onDragApply.bind(dragActionHandler),
	},
)

const request = ref<Request>({} as any)

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
useGlobalResizeObserver(windowEl, () => {
	const newSize = { ...getWindowSize(), ...getWindowOffset() }
	updateWindowWithEvent(win.value, newSize)
})

const controller = new AbortController()

onMounted(() => {
	window.addEventListener("keydown", eventHandler, {	signal: controller.signal })
	window.addEventListener("keyup", eventHandler, { signal: controller.signal })
})

onBeforeUnmount(() => {
	controller.abort()
})

</script>

