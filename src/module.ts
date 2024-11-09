import type { DeepPartial } from "@alanscodelog/utils"
import {
	addComponentsDir,
	createResolver,
	defineNuxtModule,
	installModule,
	useLogger,
} from "@nuxt/kit"
import { addTailwindContents, globFiles } from "@witchcraft/nuxt-utils/utils"
import { type Config as TwConfig } from "tailwindcss"
export * from "./runtime/index.js"

const { resolve } = createResolver(import.meta.url)

const componentsInfo = globFiles([
	`${resolve("runtime/components")}/**/*.vue`,
], [], (filepath, name) => ({ filepath, name }))

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
		configKey: "witchcraftLayout",
	},
	defaults: {
		debug: false
	},
	async setup(options, nuxt) {
		const moduleName = "@witchcraft/layout"
		const logger = useLogger(moduleName, { level: options.debug ? 10 : 0 })

		await addComponentsDir({
			path: resolve("runtime/components"),
		})


		nuxt.hook("tailwindcss:config" as any, async (config: DeepPartial<TwConfig>) => {
			const contents = [
				...componentsInfo.map(_ => _.filepath)
			]
			logger.info(`Adding Tailwind Contents: ${contents.join("\n")}`)
			addTailwindContents(config, contents)
		})

		await installModule("@nuxtjs/tailwindcss", (nuxt.options as any).tailwindcss)
		

		nuxt.options.alias["#witchcraft-layout"] = resolve("runtime")
	},
})
