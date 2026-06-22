import pkg from "../package.json" with { type: "json" }

export default defineNuxtConfig({
	app: {
		baseURL: process.env.CI ? 
			`/${pkg.name.slice(pkg.name.indexOf("/") + 1)}/demo`
			: "/",
	},
	devtools: { enabled: true },
	compatibilityDate: "2024-09-23",
	future: {
		compatibilityVersion: 4 as const
	},
	modules: [
		"@witchcraft/ui/nuxt",
		"../src/module"
	],
	// workaround for hmr issue
	vite: {
		server: {
			watch: {
				usePolling: true
			}
		},
		optimizeDeps: {
			include: [
			'@alanscodelog/utils',
			'@alanscodelog/utils/castType',
			'@alanscodelog/utils/clampNumber',
			'@alanscodelog/utils/copyToClipboard',
			'@alanscodelog/utils/debounce',
			'@alanscodelog/utils/enumFromArray',
			'@alanscodelog/utils/keys',
			'@alanscodelog/utils/last',
			'@alanscodelog/utils/multisplice',
			'@alanscodelog/utils/pushIfNotIn',
			'@alanscodelog/utils/readable',
			'@alanscodelog/utils/snapNumber',
			'@alanscodelog/utils/throwIfError',
			'@alanscodelog/utils/unreachable',
			'@alanscodelog/utils/walk',
			'uuid',
			'zod',
			]
		}
	},
})
