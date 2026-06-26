<template>
<div class="border-2 border-neutral-500 p-2 rounded-md flex gap-2 items-center flex-wrap">
	<div class="">Instruction/status bar:</div>
	<div id="status-bar" class="px-2 flex-1 overflow-x-auto scrollbar-hidden whitespace-nowrap"/>
	<WButton class="" @click="uncollapseAll" >Uncollapse All</WButton>
	<WPopover v-model="showDevActions">
		<template #button>
			<WButton @click="showDevActions = !showDevActions">Dev Actions</WButton>
		</template>
		<template #popover>
			<div class="flex flex-col gap-2 rounded-md w-full`">
				<label class="text-xs">Collapse Size (%):</label>
				<input
					type="number"
					class="w-full min-w-0 border border-neutral-300 dark:border-neutral-700 rounded px-1 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800"
					:min="0"
					:max="100"
					:value="collapseSizeValue"
					@input="collapseSizeValue = Number(($event.target as HTMLInputElement).value); handleCollapseSizeChange(collapseSizeValue)"
				/>
				<WButton class="flex-1" @click="rotateLayoutAction">Rotate Layout</WButton>
				<div class="p-2 flex flex-col border-neutral-500/50 border rounded-md gap-2">
					<span>Debug:</span>
					<div class="flex gap-2">
						<WButton class="flex-1" @click="copyState">Copy State</WButton>
						<WCheckbox v-model="renameFrames">Easy Ids</WCheckbox>
					</div>
					<label class="flex flex-col gap-2 text-sm" v-if="dragActionHandler">
						<span>Plugin Debug Logs (true | debug path):</span>
						<WSimpleInput v-model="debugKey" />
					</label>
				</div>
			</div>
		</template>
	</WPopover>
	<WDarkModeSwitcher :show-label="false"/>
</div>
</template>
<script lang="ts" setup>
import WDarkModeSwitcher from "@witchcraft/ui/components/WDarkModeSwitcher"
import WButton from "@witchcraft/ui/components/WButton"
import WPopover from "@witchcraft/ui/components/WPopover"
import WCheckbox from "@witchcraft/ui/components/WCheckbox"
import WSimpleInput from "@witchcraft/ui/components/WSimpleInput"
import { copyToClipboard } from "@alanscodelog/utils/copyToClipboard"
import { ref, watch } from "vue"
import { applyFrameChanges } from "../layout/applyFrameChanges.js"
import { getFrameUncollapseInfo } from "../layout/getFrameUncollapseInfo.js"
import { settings } from "../settings.js"
import type { LayoutFrame, LayoutWindow } from "../types/index.js"
import { throwIfError } from "@alanscodelog/utils/throwIfError";
import { walk } from "@alanscodelog/utils/walk"
import type { DragActionHandler } from "../drag/DragActionHandler.js"
import { rotateLayout } from "../helpers/rotateFrames.js"

const props = defineProps<{
	win: LayoutWindow
	frames: LayoutFrame[],
	dragActionHandler?: DragActionHandler<any>
}>()

const showDevActions = ref(false)

const collapseSizeValue = ref(Math.round(settings.collapseSizeScaled.width / settings.maxInt * 100))

function handleCollapseSizeChange(value: number) {
	settings.collapseSize = value
	collapseSizeValue.value = value
}


function uncollapseAll() {
	const win = props.win
	if (!win) return
	for (const frame of Object.values(win.frames)) {
		if (frame.docked && typeof frame.collapsed === 'number') {
			const changes = throwIfError(getFrameUncollapseInfo(win, frame.id))
			applyFrameChanges(win, changes)
		}
	}
}

const renameFrames = ref(false)

const rotationAngle = ref(0)

function rotateLayoutAction() {
	const angles = [90, 180, 270] as const
	const currentIdx = angles.indexOf(rotationAngle.value as any)
	const nextIdx = (currentIdx + 1) % angles.length
	const nextAngle = angles[nextIdx]
	rotationAngle.value = nextAngle
	rotateLayout(Object.values(props.win.frames), nextAngle)
}

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
function copyState() {
	const clone = walk(props.win, undefined, { save: true })
	if (renameFrames.value) {
		const framesList = Object.values(clone.frames)
		for (let i = 0; i < framesList.length; i++) {
			const frame = framesList[i] as LayoutFrame
			delete clone.frames[frame.id]
			;(frame as any)._originalId = frame.id
			frame.id = alphabet[i % alphabet.length].repeat(i == 0 ? 1 : Math.ceil(i / alphabet.length))
			clone.frames[frame.id] = frame
		}
	}
	const state = JSON.stringify(clone, null, 2)
	copyToClipboard(state)
}

const debugKey = ref(import.meta.dev ? "state.win.frames" : "false")
watch(debugKey, () => {
	if (!props.dragActionHandler) return
	const value = debugKey.value === "true" 
		? true 
		: debugKey.value === "false" 
		? false 
		: debugKey.value

	for (const plugin of Object.values(props.dragActionHandler.actions)) {
			plugin.debug = value
	}
})


</script>
