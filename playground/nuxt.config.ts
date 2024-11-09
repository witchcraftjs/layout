export default defineNuxtConfig({
	devtools: { enabled: true },
	compatibilityDate: "2024-09-23",
	future: {
		compatibilityVersion: 4 as const
	},
	modules: [
		"@witchcraft/ui/nuxt", // either work
		// "@witchcraft/layout/nuxt", // either work
		"../src/module"
	],
})
