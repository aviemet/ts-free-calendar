import { css } from "@linaria/core"

import { vars } from "@/lib"

export const eventWrapper = css`
  --column-start: 1;
  --grid-row-start: 1;
  --grid-row-end: 1;
  --event-color: ${ vars.colors.primaryColors.filled };
  --contrasting-color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
  --hover-color: color-mix(
          in srgb,
          var(--event-color) 85%,
          white
        );
  overflow: hidden;
  margin: 1px;
  font-size: ${ vars.fontSizes.xs };
  grid-column: var(--column-start);
  grid-row: var(--grid-row-start) / var(--grid-row-end);
  z-index: 1;
`

export const event = css`
  background-color: var(--event-color);
  color: var(--contrasting-color);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  height: calc(100% - 2px);
  transition: background-color 200ms ease-in-out;

  &:hover {
    filter: brightness(0.9);
    z-index: 2;
  }
`

export const stackedEvent = css`
  position: relative;
  z-index: var(--event-z-index);

  &:hover {
    z-index: 999;
  }
`

export const splitEvent = css`
  width: var(--event-width, 100%);
  left: var(--event-left, 0);
  position: relative;
`
