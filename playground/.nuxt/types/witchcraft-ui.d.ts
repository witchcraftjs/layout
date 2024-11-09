declare module "@vue/runtime-dom" {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export interface HTMLAttributes {
		// allow any data-* attr
		[key: `data-${string}`]: any
	}
	export interface AriaAttributes {
		// some aria attributes are missing...
		// eslint-disable-next-line @typescript-eslint/naming-convention
		"aria-description"?: string
	}
}

declare module "@vue/runtime-core" {
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	export interface AllowedComponentProps {
		// allow any data-* attr
		[key: `data-${string}`]: any
	}
}

export {}
