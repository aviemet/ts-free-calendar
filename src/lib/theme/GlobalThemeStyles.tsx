import { css } from "@linaria/core"
import React from "react"

import { generateThemeCssVariables } from "./generateVars"
import { theme } from "./theme"

const cssVariableDeclarations = generateThemeCssVariables(theme)

const rootCss = `
  :root {
    ${Object.entries(cssVariableDeclarations)
		.map(([key, value]) => `${key}: ${value};`)
		.join("\n    ")}
  }
`
const globalStyleClass = css`
  :global() {
    ${rootCss}
  }
`

/**
 * A component that renders nothing but ensures Linaria injects
 * the theme's CSS variables globally during the build process.
 * Should be rendered once near the root of your application/library.
 */
export const GlobalThemeStyles: React.FC = () => {
	return <div className={ globalStyleClass } style={ { display: "none" } } aria-hidden="true" />
}
