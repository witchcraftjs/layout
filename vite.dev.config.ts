import { run } from "@alanscodelog/utils/node"
import { defineConfig } from "@alanscodelog/vite-config"
import vue from "@vitejs/plugin-vue"
import { builtinModules } from "module"
import path from "path"
import type { PluginOption } from "vite"


const config = defineConfig({
	entryGlobs: [
		
	],
	pluginOpts: {
		// just for ./src/nuxt/*
		externalizeDeps: { include: [ "#imports" ]},
		typesPlugin: { dtsGenerator: "echo" }
	},
}, {
	plugins: [
		vue() as any,
		
	],
	build: {
		outDir: "dev",
	},
},{
	test: {
		// specifying just tests/... is including stuff it shouldn't ???
		dir: `${path.resolve(import.meta.dirname)}/tests`,
	},
	server: {
		port: 3001,
	},
})

delete (config as any).lib
export default config
