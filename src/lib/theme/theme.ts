const black = "#030303"
const white = "#FEFEFE"

export const theme = {
	prefix: "tfc",
	colors: {
		// Base colors
		primary: "#3b82f6",
		black,
		white,

		// Semantic color mappings with light/dark variants
		background: {
			default: {
				light: "#FEFEFE",
				dark: "#121212",
			},
			hover: {
				light: "#f8f9fa",
				dark: "#w1e1e1e",
			},
			disabled: {
				light: "#DDDDDD",
				dark: "#2a2a2a",
			},
			disabledHover: {
				light: "#f8f9fa",
				dark: "#1e1e1e",
			},
			highlight: {
				light: "#dee2e6",
				dark: "#3a3a3a",
			},
		},

		border: {
			default: {
				light: "#495057",
				dark: "#dee2e6",
			},
			highlight: {
				light: "#495057",
				dark: "#6c757d",
			},
		},

		text: {
			default: {
				light: "#495057",
				dark: "#e9ecef",
			},
			disabled: {
				light: "#adb5bd",
				dark: "#6c757d",
			},
			highlight: {
				light: "#495057",
				dark: "#e9ecef",
			},
			accent: {
				light: "#3b82f6",
				dark: "#3b82f6",
			},
		},

		// blue: {
		// 	1: "#3b82f6",
		// 	5: "#3b82f6",
		// 	6: "#2563eb",
		// },
		// gray: {
		// 	0: "#fdfdfd",
		// 	1: "#f8f9fa",
		// 	2: "#e8e9ea",
		// 	3: "#dee2e6",
		// 	4: "#dee2e6",
		// 	5: "#adb5bd",
		// 	6: "#adb5bd",
		// 	7: "#495057",
		// 	8: "#393037",
		// 	9: "#212529",
		// },
	},

	fontSizes: {
		xxs: "0.6rem",
		xs: "0.75rem",
		sm: "0.875rem",
		md: "1rem",
		lg: "1.125rem",
		xl: "1.25rem",
	},

	spacing: {
		xxs: "0.2rem",
		xs: "0.25rem",
		sm: "0.5rem",
		md: "1rem",
		lg: "1.5rem",
		xl: "2rem",
		xxl: "2.5rem",
	},

	radius: {
		xs: "0.125rem",
		sm: "0.25rem",
		md: "0.5rem",
		lg: "1rem",
		xl: "2rem",
	},

	shadows: {
		xs: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
		sm: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
		md: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
		lg: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
		xl: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
		xxl: "0 29px 52px rgba(0,0,0,0.40), 0 25px 16px rgba(0,0,0,0.20)",
	},
} as const
export type DefaultTheme = typeof theme
