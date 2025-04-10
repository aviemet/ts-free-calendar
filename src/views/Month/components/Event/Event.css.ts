import { css } from "@linaria/core"

import { eventHeight } from "../../MonthView.css"

import { vars } from "@/lib"

const triangleWidth = 3

export const eventWrapper = css`
  --column-start: 1;
  --column-span: 1;
  --event-color: ${ vars.colors.primaryColors.filled };
  --contrasting-color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
  --hover-color: color-mix(
          in srgb,
          var(--event-color) 85%,
          white
        );
  min-height: ${ eventHeight };
  overflow: hidden;
  pointer-events: all;
  grid-column: var(--column-start) / span var(--column-span);
`

export const event = css`
  font-size: ${ vars.fontSizes.xs };
  letter-spacing: -1px;
  border-radius: ${ vars.radius.sm };
  padding: 2px 5px 2px 6px;
  margin: 1px 3px;
  color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
  cursor: pointer;
  min-height: ${ eventHeight };
  height: ${ eventHeight };
  position: relative;

  &, &:before, &:after {
    transition: all 200ms ease-in-out;
  }

  & > span {
    overflow: hidden;
  }

  &.filled {
    background-color: var(--event-color);
    color: var(--contrasting-color);
    box-shadow: ${ vars.shadows.xs };

    &:hover {
      /* background-color: var(--hover-color);
      outline: 1px solid color-mix(in srgb, var(--event-color) 100%, var(--contrasting-color)); */
    }
  }

  &.indicator {
    &:hover {
      background-color: light-dark(${ vars.colors.gray[2] }, ${ vars.colors.dark[6] });
    }

    &::before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--event-color);
      margin-right: 4px;
      vertical-align: middle;
    }
  }

  &.continues-on {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    margin-right: 0;
    width: calc(100% - ${ triangleWidth }px - 5px);
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: -${ triangleWidth }px;
      width: 0;
      height: 0;
      border-top: calc(${ eventHeight } / 2) solid transparent;
      border-bottom: calc(${ eventHeight } / 2) solid transparent;
      border-left: ${ triangleWidth }px solid var(--event-color);
    }

    &:hover::after {
      border-left-color: var(--hover-color);
    }
  }

  &.continued-from {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: ${ triangleWidth + 5 }px;
    padding-left: 1px;
    width: calc(100% - ${ triangleWidth + 9 }px);
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -${ triangleWidth }px;
      width: 0;
      height: 0;
      border-top: calc(${ eventHeight } / 2) solid var(--event-color);
      border-bottom: calc(${ eventHeight } / 2) solid var(--event-color);
      border-left: ${ triangleWidth }px solid transparent;
    }

    &:hover::before {
      border-top-color: var(--hover-color);
      border-bottom-color: var(--hover-color);
    }
  }
`
