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
		// the below also works, just remember to run the update-dep script and uncomment ../src/module above before attempting to use the file: linked module
		// "@witchcraft/layout/nuxt",
	],
})
