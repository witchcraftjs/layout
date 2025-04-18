import {
	addComponentsDir,
	addTemplate,
	createResolver,
	defineNuxtModule
} from "@nuxt/kit"

export * from "./runtime/index.js"

declare module "@nuxt/schema" {
	interface PublicRuntimeConfig {
	}
}

export interface ModuleOptions {
	debug?: boolean
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "@witchcraft/layout",
		configKey: "witchcraftLayout"
	},
	defaults: {
		debug: false
	},
	async setup(_options, nuxt) {
		const { resolve } = createResolver(import.meta.url)
		// const logger = useLogger(moduleName, { level: options.debug ? 10 : 0 })

		addComponentsDir({
			path: resolve("runtime/components")
		})

		addTemplate({
			filename: "witchcraft-layout.css",
			write: true,
			getContents: () => `@source "${resolve("runtime/components")}";`
		})

		nuxt.options.alias["#witchcraft-layout"] = resolve("runtime")
	}
})
