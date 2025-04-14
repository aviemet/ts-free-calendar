import { css } from "@linaria/core"

import { vars } from "@/lib"

export const dailyTotals = css`
	width: 100%;
	border-top: 1px solid light-dark(${ vars.colors.border.default.light }, ${ vars.colors.border.default.dark });

	& > div {
		display: flex;
		justify: space-between;
	}
`
