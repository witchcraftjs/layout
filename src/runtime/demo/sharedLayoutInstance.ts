import { reactive } from "vue"

import { layoutCreate } from "../layout/layoutCreate.js"


export const app = reactive({
	layout: layoutCreate(),
})

