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
import { dragContextInjectionKey } from "../drag/types.js";

const props = defineProps<{
	frameId: string
}>()


const dragContext = inject(dragContextInjectionKey)
if (!dragContext) {
	throw new Error("FrameDragHandle must be used inside a LayoutWindow and drag context returned by useFrames must be injected.")
}
function handlePointerDown(e: PointerEvent): void {
	e.preventDefault()
	e.stopPropagation()
	dragContext!.dragStart( e,"frame", {frameId: props.frameId})
}
onBeforeUnmount(() => {
	dragContext.cancel()
})
</script>
