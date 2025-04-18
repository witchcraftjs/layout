<template>
<div class="border-2 border-neutral-500 p-2 rounded-md flex">
	<div class="">Instruction/status bar:</div>
	<div id="status-bar" class="px-2 flex-1 overflow-x-auto scrollbar-hidden"/>
	<WDarkModeSwitcher :show-label="false"/>
</div>
</template>
<script lang="ts" setup>
import WDarkModeSwitcher from "@witchcraft/ui/components/LibDarkModeSwitcher"

import type { LayoutFrame } from "../types/index.js"

defineProps<{
	frames: LayoutFrame[]
}>()

</script>
