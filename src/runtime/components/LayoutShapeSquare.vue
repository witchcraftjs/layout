<template>
<div
	:style="`
		--posX:${css.x};
		--posY:${css.y};
		--width:${css.width};
		--height:${css.height};
		${css.translate ? `--translate:${css.translate}`: ``}
	` + style"
	:class="twMerge(`
		absolute
		w-[var(--width)]
		h-[var(--height)]
		top-[var(--posY)]
		left-[var(--posX)]
	`,
		css.translate && `[transform:var(--translate)]`,
		$attrs.class as any
	)"
	v-bind="{...$attrs, class: undefined}"
>
	<slot/>
</div>
</template>
<script setup lang="ts">
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { type PropType } from "vue"
import { useAttrs } from "vue"

import type { BaseSquareCss } from "../types/index.js"
const $attrs = useAttrs()


const props = defineProps({
	style: { type: String, required: false, default: "" },
	css: { type: Object as PropType<BaseSquareCss>, required: true },
})
</script>
