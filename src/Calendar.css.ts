import { css } from "@linaria/core"

import { vars } from "@/lib"

export const borderColor = `light-dark(${ vars.colors.border.default.light }, ${ vars.colors.border.default.dark })`

export const calendarOuterContainer = css`
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	width: 100%;
`

export const calendar = css`
	position: relative;
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	min-height: 0;
`

export const calendarInnerContainer = css`
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	min-height: 0;
	padding: 0;
	margin: 0;
	background-color: light-dark(${ vars.colors.background.default.light }, ${ vars.colors.background.default.dark });
	border-radius: ${ vars.radius.lg };
	border-width: 1px;
	border-color: ${ borderColor };
`

export const popoverOverlay = css`
	inset: 0;
	z-index: 100;
`
