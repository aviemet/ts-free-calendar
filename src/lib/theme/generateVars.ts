import { DefaultTheme, theme } from "./theme"

function toKebabCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase()
}

function generateCssVarStrings(
	obj: Record<string, any>,
	prefix: string,
	path: string[] = []
): Record<string, string> {
	let declarations: Record<string, string> = {}
	for(const key in obj) {
		if(typeof obj[key] === "object" && obj[key] !== null) {
			declarations = {
				...declarations,
				...generateCssVarStrings(obj[key], prefix, [...path, toKebabCase(key)]),
			}
		} else {
			const varName = `--${prefix}-${[...path, toKebabCase(key)].join("-")}`
			declarations[varName] = String(obj[key])
		}
	}
	return declarations
}

function generateNestedVars(
	obj: Record<string, any>,
	prefix: string,
	path: string[] = []
): Record<string, any> {
	let nested: Record<string, any> = {}
	for(const key in obj) {
		if(typeof obj[key] === "object" && obj[key] !== null) {
			nested[key] = generateNestedVars(obj[key], prefix, [...path, toKebabCase(key)])
		} else {
			const varName = `--${prefix}-${[...path, toKebabCase(key)].join("-")}`
			nested[key] = `var(${varName})`
		}
	}
	return nested
}

export function generateThemeCssVariables(sourceTheme: DefaultTheme): Record<string, string> {
	const { prefix, ...themeValues } = sourceTheme
	return generateCssVarStrings(themeValues, prefix)
}

export type ThemeVars = Omit<DefaultTheme, "prefix">;

const { prefix, ...themeValues } = theme
export const vars = generateNestedVars(themeValues, prefix) as ThemeVars
