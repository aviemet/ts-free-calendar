import { css } from "@linaria/core"

import { borderColor } from "../../Calendar.css"

import { rem, vars } from "@/lib"

const headingHeight = rem(25)
export const eventHeight = rem(22)

export const monthView = css`
	position: relative;
	display: flex;  
	flex-direction: column;
	flex: 1 1 auto;
	min-height: 0;
	margin: 0;
`

export const daysHeading = css`
	width: 100%;
	margin: 0;
	align-items: stretch;
	display: flex;
	flex: none;
`

export const daysContainer = css`
	margin: 0;
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	min-height: 0;
`

export const row = css`
  --min-rows: 4;
	position: relative;
	display: flex;
	flex: 1 1 0%;
	pointer-events: none;
	border-top-color: ${ borderColor };
	border-top-width: 1px;
	border-top-style: solid;
	padding-bottom: ${ vars.spacing.xs };
  min-height: calc(var(--min-rows) * ${ eventHeight });
`

export const columnHeading = css`
  flex: 1 1 0%;
  text-align: center;
  text-transform: uppercase;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${ vars.spacing.xxs };
  overflow: hidden;

  border-right-color: ${ borderColor };
  border-right-width: 1px;
  border-right-style: solid;

  &:last-child {
    border-right: none;
  }
`

export const rowLayerContainer = css`
	position: relative;
	display: flex;
	flex: 1;
	pointer-events: none;
`

export const backgroundLayer = css`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`

export const headingLayer = css`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`

export const contentLayer = css`
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(auto-fill, calc(${ eventHeight } + 2px));
  pointer-events: none;
  grid-auto-flow: dense;
  row-gap: 2px;
  column-gap: 3px;
  margin-top: ${ headingHeight };
`

export const outOfRange = css``

export const dateCellBackground = css`
  flex: 1 1 0%;
  pointer-events: all;
  background-color: none;
  transition: background-color 200ms linear;

  border-right-color: ${ borderColor };
  border-right-width: 1px;
  border-right-style: solid;

  &:last-child {
    border-right: none;
  }
  
  &:hover {
    background-color: light-dark(${ vars.colors.background.hover.light }, ${ vars.colors.background.hover.dark });
  }

  &.${ outOfRange } {
    background-color: light-dark(${ vars.colors.background.disabled.light }, ${ vars.colors.background.disabled.dark });

    &:hover {
      background-color: light-dark(${ vars.colors.background.disabledHover.light }, ${ vars.colors.background.disabledHover.dark });
    }
  }
`

export const dateCellHeading = css`
  font-size: 14px;
  color: light-dark(${ vars.colors.text.default.light }, ${ vars.colors.text.default.dark });
  background: transparent;
  height: ${ headingHeight };
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;

  &.${ outOfRange } {
    color: light-dark(${ vars.colors.text.disabled.light }, ${ vars.colors.text.disabled.dark });
  }
`

export const dateToday = css`
  font-weight: 600;
  
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: light-dark(${ vars.colors.background.highlight.light }, ${ vars.colors.background.highlight.dark });
    border: 2px solid light-dark(${ vars.colors.border.highlight.light }, ${ vars.colors.border.highlight.dark });
    transition: all 200ms ease;
    color: light-dark(${ vars.colors.text.highlight.light }, ${ vars.colors.text.highlight.dark });

    &:hover {
      background: ${ vars.colors.text.accent.light };
    }
  }
`

export const dateCellFooter = css`
  font-size: 12px;
  text-align: right;
  padding: 0 ${ vars.spacing.xxs };
  background: transparent;
  flex: 1 1 0%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export const footerLayer = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  pointer-events: none;
  height: ${ vars.spacing.md };
`
