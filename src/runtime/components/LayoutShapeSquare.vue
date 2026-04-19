<template>
<div
	:style="[`
		--posX:${css.x};
		--posY:${css.y};
		--width:${css.width};
		--height:${css.height};
		${css.translate ? `--translate:${css.translate}`: ``}
	`, $attrs.style]"
	:class="twMerge(`
		absolute
		w-[var(--width)]
		h-[var(--height)]
		top-[var(--posY)]
		left-[var(--posX)]
	`,
		css.translate && `[transform:var(--translate)]`,
		($attrs as any).class
	)"
	v-bind="{...$attrs, class: undefined}"
>
	<slot/>
</div>
</template>
<script setup lang="ts">
import { twMerge } from "@witchcraft/ui/utils/twMerge"
import { useAttrs } from "vue"

import type { LayoutShapeSquareProps } from "../types/index.js"
const $attrs = useAttrs()

defineOptions({
	inheritAttrs: false,
})

const props = defineProps<LayoutShapeSquareProps>()
</script>
