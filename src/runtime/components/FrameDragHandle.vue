<template>
<div
	class="cursor-grabbing"
	@pointerdown="handlePointerDown"
>
	<slot/>
</div>
</template>
<script lang="ts" setup>
import { inject, onBeforeUnmount } from "vue"
import { moveContextInjectionKey } from "../types/vue.js"

const props = defineProps<{
	frameId: string
}>()


const dragContext = inject(moveContextInjectionKey)
if (!dragContext) {
	throw new Error("FrameDragHandle must be used inside a LayoutWindow and drag context returned by useFrames must be injected.")
}
function handlePointerDown(e: PointerEvent): void {
	e.preventDefault()
	e.stopPropagation()
	dragContext!.moveStart( e,"frame", {frameId: props.frameId})
}
onBeforeUnmount(() => {
	dragContext.cancel()
})
</script>
