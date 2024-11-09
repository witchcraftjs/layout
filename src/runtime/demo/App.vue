<template>
<WRoot>
	<LayoutWindow v-if="win"
		class="flex-1 w-full"
		deco-class="
			[&_.edge]:bg-red-500
			[&_.new-frame]:bg-cyan-500
			[&_.close-frame]:bg-red-500 opacity-50
		"
		:win="win"
		@resize="win.pxWidth = $event.width; win.pxHeight = $event.height;"
	>
		<!-- <template #[`frame-${content.id}`] v-for="content in psuedoContent" :key="content.id"> -->
		<!-- </template> -->
	</LayoutWindow>
</Wroot>
</template>
<script lang="ts" setup>
import { keys } from "@alanscodelog/utils/keys.js"
import WRoot from "@witchcraft/ui/components/LibRoot"
import { computed, onBeforeMount, ref } from "vue"

import { app } from "./sharedLayoutInstance.js"

import LayoutWindow from "../components/LayoutWindow.vue"
import { layoutInitialize } from "../layout/index.js"


const winId = ref<string | undefined>(undefined)
const win = computed(() => winId.value !== undefined ? app.layout.windows[winId.value] : undefined)

const psuedoContent = computed(() => {
	if (!win.value) return
	return win.value.frames
})
onBeforeMount(() => {
	layoutInitialize(app.layout)
	winId.value = keys(app.layout.windows)[0]
})

</script>

