<template>
<!-- not sure why we're needed to specify flex-col, tailwind isn't detecting the class properly in wroot maybe? -->
<WRoot class="
	gap-2
	p-2
	flex-col
	[&_.frame-drag-ghost]:rounded-md
">
	<DemoControls
		v-if="win"
		:frames="frames!"
		:win="win"
		:actionHandler="actionHandler"
	/>

	<LayoutWindow
		ref="layoutComponent"
		v-if="win"
		:class="twMerge(`
			flex-1
			w-full
			self-stretch
			border-1
			border-neutral-300
			dark:border-neutral-700
			rounded-md
		`,
			collapsedDocks.top && `border-t-2 border-t-green-500`,
			collapsedDocks.bottom && `border-b-2 border-b-green-500`,
			collapsedDocks.left && `border-l-2 border-l-green-500`,
			collapsedDocks.right && `border-r-2 border-r-green-500`
		)"
		:textHints="textHints"
		textHintsTeleportTo="#status-bar"
		v-model:win="win"
		@is-showing-move="isShowingMove = $event"
		@move-state="moveState = $event"
	>
			<LayoutFrame class="
				flex
				flex-col
				outline-hidden
			">
				<template #[`frame-${f.id}`] v-for="f in frames" :key="f.id" >
					<div
						v-if="!(f.collapsed && (f.width === 0 || f.height === 0))"
						:data-is-active="win.activeFrame === f.id"
						:class="twMerge(`
							border-2
							border-neutral-500
							h-full
							rounded-md
							overflow-auto
						`,
							win.activeFrame === f.id && `border-blue-500`
						)"
						@click="win.activeFrame=f.id"
					>
						<!--
							Avoid placing the padding on the first div in the frame.
							Set it on the first child instead, so that the frame can shrink as small as possible.
							Too big a border can also be a problem, but usually it's small enough that it's beneath the min frame width/height allowed.
						-->
						<div class="p-2 flex flex-col">
							<FrameDragHandle :frame-id="f.id">
								<div
									class="cursor-grab bg-neutral-200 dark:bg-neutral-700 px-2 py-1 text-xs select-none"
								>
									⠿ Drag to move frame
								</div>
							</FrameDragHandle>
							<div class="flex gap-1 px-2 py-1 flex-wrap">
								<button
									v-if="f.docked && !f.collapsed"
									class="bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 text-xs rounded"
									@click="handleUndock(f.id)"
								>Undock</button>
								<button
									v-if="f.docked && !f.collapsed"
									class="bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 text-xs rounded"
									@click="handleCollapse(f.id)"
								>Collapse</button>
								<button
									v-if="f.docked && f.collapsed"
									class="bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 text-xs rounded"
									@click="handleUncollapse(f.id)"
								>Uncollapse</button>
							</div>
							<div class="p-2 whitespace-pre-wrap">
								{{ debugFrame(f) }}
							</div>
						</div>
					</div>
					<div v-else>
					</div>
				</template>
			</LayoutFrame>
			<LayoutEdgesActiveFrame class="rounded-md border-none"/>
			<!-- Following slot usage is just done as an example for how to override the slots and further customize the components. You could place classes on the parent LayoutWindow instead or if you don't need to customize anything you can just do:
			<LayoutIntersections/>
			...
			<LayoutDragEdges/>
			-->
			<LayoutDragEdges>
				<template #handle="slotProps">
					<LayoutDragEdgeHandle
						class="..."
						v-bind="slotProps"
					/>
				</template>
				<template #indicator="slotProps">
					<LayoutDragEdgeVisible
						class="..."
						v-bind="slotProps"
					/>
				</template>
			</LayoutDragEdges>
			<LayoutDecosEdges/>
			<!-- Decos add only the most basic color indicators (which you can override, we also pretty them up here with from rounded edges. -->
			<LayoutDecosRects class="
				[&.deco-split-error]:rounded-md
				[&.deco-split-new-frame]:rounded-md
				[&.deco-close-frame]:rounded-md
				[&.deco-close-frame-force]:rounded-md
				[&.deco-frame-drag]:rounded-md
			"/>
			<LayoutDragEdgeGrabbed class="bg-accent-500"/>
			<LayoutIntersections>
				<template #handler="slotProps">
					<LayoutIntersectionHandle
						class="..."
						v-bind="slotProps"
					/>
				</template>
				<template #indicator="slotProps">
					<LayoutIntersectionVisible
						class="..."
						v-bind="slotProps"
					/>
				</template>
			</LayoutIntersections>
	</LayoutWindow>
</WRoot>
</template>

<script lang="ts" setup>
import { keys } from "@alanscodelog/utils/keys"
// playground not resolving???
// todo this breaks the non-playground build
import WRoot from "@witchcraft/ui/components/WRoot"
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { computed, onBeforeMount, ref } from "vue"

import DemoControls from "./DemoControls.vue"
import { app } from "./sharedLayoutInstance.js"

import FrameDragHandle from "../components/FrameDragHandle.vue"
import LayoutFrame from "../components/LayoutFrame.vue"
import LayoutDecosEdges from "../components/LayoutDecosEdges.vue"
import LayoutDecosRects from "../components/LayoutDecosRects.vue"
import LayoutDragEdgeGrabbed from "../components/LayoutDragEdgeGrabbed.vue"
import LayoutIntersections from "../components/LayoutIntersections.vue"
import LayoutEdgesActiveFrame from "../components/LayoutEdgesActiveFrame.vue"
import LayoutDragEdges from "../components/LayoutDragEdges.vue"
import LayoutIntersectionHandle from "../components/LayoutIntersectionHandle.vue"
import type { MoveState } from "../types/index.js"
import { applyFrameChanges } from "../layout/applyFrameChanges.js"
import { debugFrame } from "../layout/debugFrame.js"
import { getFrameCollapseInfo } from "../layout/getFrameCollapseInfo.js"
import { getFrameUncollapseInfo } from "../layout/getFrameUncollapseInfo.js"
import { getFrameUndockInfo } from "../layout/getFrameUndockInfo.js"
import {
	frameCreate,
	layoutAddWindow,
	windowAddFrame,
	windowCreate
} from "../layout/index.js"
import { settings } from "../settings.js"
import type { EdgeSide, Layout, Pos, Size } from "../types/index.js"
import { throwIfError } from "@alanscodelog/utils/throwIfError"
import { useTemplateRef } from "vue"
import { ActionHandler } from "../move/ActionHandler.js"
import LayoutDragEdgeHandle from "../components/LayoutDragEdgeHandle.vue"
import LayoutDragEdgeVisible from "../components/LayoutDragEdgeVisible.vue"
import LayoutIntersectionVisible from "../components/LayoutIntersectionVisible.vue"


import LayoutWindow from "../components/LayoutWindow.vue"

const winId = ref<string | undefined>(undefined)
const win = computed(() => winId.value !== undefined ? app.layout.windows[winId.value] : undefined)
const layoutComponent = ref<InstanceType<typeof LayoutWindow> | undefined>(undefined)

const frames = computed(() => {
	if (!win.value) return
	return Object.values(win.value.frames)
})
onBeforeMount(() => {
	layoutInitialize(app.layout)
	winId.value = keys(app.layout.windows)[0]
})

function layoutInitialize(layout: Layout, { defaultPos, defaultSize }: {
	defaultPos: Pos
	defaultSize: Size
} = {
	defaultPos: { x: 0, y: 0 },
	defaultSize: { width: 0, height: 0 }
}) {
	const w = layoutAddWindow(
		layout,
		windowCreate({
			...defaultPos,
			...defaultSize,
			frames: {}
		})
	)

	layout.activeWindow = w.id
	const max = settings.maxInt
	const frame = windowAddFrame(w, frameCreate({
		x: 0,
		y: 0,
		width: max,
		height: max
	}))
	w.activeFrame = frame.id
}

// whether layout window is showing the edge beneath the mouse
// as determined by the ActionHandler in LayoutWindow
const isShowingMove = ref(false)
// drag state as returned by useFrames in LayoutWindow
const moveState = ref<MoveState | undefined>(undefined)

function handleUndock(frameId: string) {
	const changes = throwIfError(getFrameUndockInfo(win.value!, frameId))
	ActionHandler.debugState("undock", "before", moveState.value!, {}, undefined)
	applyFrameChanges(win.value!, changes)
	ActionHandler.debugState("undock", "after", moveState.value!, {}, undefined)
}

function handleCollapse(frameId: string) {
	const changes = throwIfError(getFrameCollapseInfo(win.value!, frameId))
	ActionHandler.debugState("collapse", "before", moveState.value!, {}, undefined)
	applyFrameChanges(win.value!, changes)
	ActionHandler.debugState("collapse", "after", moveState.value!, {}, undefined)
}

function handleUncollapse(frameId: string) {
	const changes = throwIfError(getFrameUncollapseInfo(win.value!, frameId))
	ActionHandler.debugState("uncollapse", "before", moveState.value!, {}, undefined)
	applyFrameChanges(win.value!, changes)
	ActionHandler.debugState("uncollapse", "after", moveState.value!, {}, undefined)
}

const collapsedDocks = computed(() => {
	const sides: Partial<Record<EdgeSide, true>> = {}
	for (const frame of Object.values(win.value?.frames ?? {})) {
		if (frame.docked) {
			sides[frame.docked] = true
		}
	}
	return sides
})

const actionHandler = computed(() => layoutComponent.value?.actionHandler)

const textHints = computed(() => {
	const isMoving = moveState.value?.isMoving
	const textHints = actionHandler.value?.textHints ?? {actions:[], errors:[]}
	return [
		...(!isMoving ? [{classes:"", text:"Drag from an edge to create a new frame."}] : []),
		...textHints.errors.map((_: string) => ({classes:"text-red-500", text:_})),
		...textHints.actions.map((_: string) => ({ text:_})),
	]
})

</script>
