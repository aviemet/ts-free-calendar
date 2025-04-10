export interface DefaultTheme {
	prefix: string
	colors: Record<string, Record<number | string, string>>
	fontSizes: Record<string, string>
	spacing: Record<string, string>
	radius: Record<string, string>
}

export const theme: DefaultTheme = {
	prefix: "tfc",
	colors: {
		blue: {
			5: "#3b82f6",
			6: "#2563eb",
		},
		gray: {
			1: "#f8f9fa",
			3: "#dee2e6",
			5: "#adb5bd",
			7: "#495057",
			9: "#212529",
		},
	},
	fontSizes: {
		xs: "0.75rem",
		sm: "0.875rem",
		md: "1rem",
		lg: "1.125rem",
		xl: "1.25rem",
	},
	spacing: {
		xs: "0.25rem",
		sm: "0.5rem",
		md: "1rem",
		lg: "1.5rem",
		xl: "2rem",
	},
	radius: {
		xs: "0.125rem",
		sm: "0.25rem",
		md: "0.5rem",
		lg: "1rem",
		xl: "2rem",
	},
} as const
