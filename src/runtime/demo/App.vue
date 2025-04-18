<template>
<WRoot class="gap-2 p-2">
	<DemoControls
		:frames="frames!"
	/>
	<LayoutWindow v-if="win"
		class="
			flex-1 w-full
			border-1
			border-neutral-300
			dark:border-neutral-700
			rounded-md
			flex-1
			self-stretch
			[&_.frame]:flex
			[&_.frame]:flex-col
			[&_.frame]:outline-hidden
			[&_.active-frame-edge]:rounded-md
			[&_.active-frame-edge]:border-none
			[&_.drag-edge:hover+.edge]:bg-accent-500/20
			[&_.grabbed-edge]:bg-accent-500
			[&.request-split_.grabbed-edge]:hidden
			[&.request-split_.drag-edge]:hidden
			[&_.deco-split-new-frame]:rounded-md
			[&_.deco-close-frame]:rounded-md
			[&_.deco-close-frame]:bg-orange-500/50
		"
		:usage-instructions="usageInstructions"
		instructions-teleport-to="#status-bar"
		v-model:win="win"
		@is-showing-drag="isShowingDrag = $event"
		@drag-state="dragState = $event"
	>
		<template #[`frame-${f.id}`] v-for="f in frames" :key="f.id">
			<div
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
				<div class="p-2"> {{ debugFrame(f) }} </div>
			</div>
		</template>
	</LayoutWindow>
</Wroot>
</template>
<script lang="ts" setup>
import { keys } from "@alanscodelog/utils/keys"
// playground not resolving???
// todo this breaks the non-playground build
import WRoot from "@witchcraft/ui/components/LibRoot"
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { computed, onBeforeMount, ref } from "vue"

import DemoControls from "./DemoControls.vue"
import { app } from "./sharedLayoutInstance.js"

import LayoutWindow from "../components/LayoutWindow.vue"
import type { DragState } from "../drag/types.js"
import { debugFrame } from "../layout/debugFrame.js"
import {
	frameCreate,
	layoutAddWindow,
	windowAddFrame,
	windowCreate,
} from "../layout/index.js"
import { getMaxInt } from "../settings.js"
import { type Layout, type Pos, type Size } from "../types/index.js"


const winId = ref<string | undefined>(undefined)
const win = computed(() => winId.value !== undefined ? app.layout.windows[winId.value] : undefined)

const frames = computed(() => {
	if (!win.value) return
	return Object.values(win.value.frames)
})
onBeforeMount(() => {
	layoutInitialize(app.layout)
	winId.value = keys(app.layout.windows)[0]
})

const isDragging = ref(false)
function layoutInitialize(layout: Layout, { defaultPos, defaultSize }: {
	defaultPos: Pos
	defaultSize: Size
} = {
	defaultPos: { x: 0, y: 0 },
	defaultSize: { width: 0, height: 0 },
}) {
	const w = layoutAddWindow(
		layout,
		windowCreate({
			...defaultPos,
			...defaultSize,
			frames: {},
		})
	)

	layout.activeWindow = w.id
	const max = getMaxInt()
	const frame = windowAddFrame(w, frameCreate({
		x: 0,
		y: 0,
		width: max,
		height: max,
	}))
	w.activeFrame = frame.id
}

// whether layout window is showing the edge beneath the mouse
// as determined by the DragActionHandler in LayoutWindow
const isShowingDrag = ref(false)
// drag state as returned by useFrames in LayoutWindow
const dragState = ref<DragState | undefined>(undefined)

const usageInstructions = computed(() => ({
	// names are arbitrary and don't mean anything, they just make things easier
	// if a key is undefined, it's ignored
	none: !dragState.value?.isDragging ? "Drag from an edge to create a new frame." : undefined,
	split: dragState.value?.isDragging ? "Hold Alt to Split" : undefined,
	close: dragState.value?.isDragging ? "Shift+Drag to Close" : undefined,
	forceClose: dragState.value?.isDragging ? "Ctrl+Shift+Drag to Force Close" : undefined
}))
	
</script>

