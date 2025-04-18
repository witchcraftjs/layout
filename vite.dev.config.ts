import { defineConfig } from "@alanscodelog/vite-config"
import tailwindcss from "@tailwindcss/vite"
import vue from "@vitejs/plugin-vue"
import { unpluginIconViteOptions } from "@witchcraft/ui/build/unpluginIconViteOptions"
import { WitchcraftUiResolver } from "@witchcraft/ui/build/WitchcraftUiResolver"
import path from "node:path"
import IconsResolver from "unplugin-icons/resolver"
import Icons from "unplugin-icons/vite"
import Components from "unplugin-vue-components/vite"

const config = defineConfig({
	entryGlobs: [

	],
	pluginOpts: {
		// just for ./src/nuxt/*
		externalizeDeps: { include: ["#imports"] },
		typesPlugin: { dtsGenerator: "echo" }
	}
}, {
	plugins: [
		vue() as any,
		Components({
			// don't auto-import our own components
			dirs: [],
			resolvers: [
				IconsResolver(),
				WitchcraftUiResolver()
			],
			dts: "./types/components.d.ts"
		}),
		Icons(unpluginIconViteOptions),
		tailwindcss()
	],
	build: {
		outDir: "dev"
	}
}, {
	test: {
		// specifying just tests/... is including stuff it shouldn't ???
		dir: `${path.resolve(import.meta.dirname)}/tests`
	},
	css: { postcss: undefined },
	server: {
		port: 3001
	}
})

delete (config as any).lib
export default config
