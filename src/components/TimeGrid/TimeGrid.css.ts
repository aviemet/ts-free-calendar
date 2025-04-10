import { css } from "@linaria/core"

import { rem, vars } from "@/lib"

const rowHeight = rem(60)
const borderColor = `light-dark(${ vars.colors.dark[6] }, ${ vars.colors.gray[3] })`

export const timeGrid = css`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  height: 100%;
  overflow: hidden;
`

export const timeColumn = css`
  display: flex;
  flex-direction: column;
  grid-row: 2;
  grid-column: 1;
  position: relative;
  z-index: 1;
`

export const timeSlot = css`
  height: ${ rowHeight };
  color: light-dark(${ vars.colors.dark[7] }, ${ vars.colors.gray[4] });
  font-size: ${ vars.fontSizes.xxs };
  font-weight: 700;
  position: relative;
  text-align: right;
  padding-left: 0.5rem;

  span { 
    position: relative;
    display: inline-block;
    transform: translateY(-60%);
    padding-right: 0.5rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 0.25rem;
    border-top: 1px solid ${ borderColor };
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: -0.5rem;
    border-top: 1px dotted light-dark(${ vars.colors.dark[8] }, ${ vars.colors.gray[6] });
  }
`

export const cornerSpacer = css`
  grid-column: 1;
  grid-row: 1;
`

export const contentArea = css`
  padding-top: 1px;
  grid-column: 2;
  grid-row: 2;
  overflow-y: auto;
  position: relative;
`

export const contentGrid = css`
  min-height: 100%;
  border-left: 1px solid ${ borderColor };
`

export const gridLines = css`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(
    to bottom,
    ${ borderColor } 1px,
    transparent 1px
  );
  background-size: 100% ${ rowHeight };
`

export const headerArea = css`
  grid-row: 1;
  grid-column: 2;
`

export const columnHeadings = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding: 0.5rem;
  border-left: 1px solid ${ borderColor };
`

export const columnHeading = css`
  text-align: center;
  font-weight: 500;
  color: light-dark(${ vars.colors.dark[7] }, ${ vars.colors.gray[3] });
`

export const eventsContainer = css`
  display: grid;
  position: relative;
  grid-template-columns: repeat(var(--column-count, 7), 1fr);
  grid-template-rows: repeat(var(--rows-per-day, 48), ${ rowHeight });
`
