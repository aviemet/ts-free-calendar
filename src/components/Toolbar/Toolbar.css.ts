import { css } from "@linaria/core"

import { vars } from "@/lib"

export const buttonsContainer = css`
  position: relative;
  background-color: light-dark(${ vars.colors.background.default.light }, ${ vars.colors.background.default.dark });
  padding: ${ vars.spacing.xxs };
  border: 1px solid light-dark(${ vars.colors.border.default.light }, ${ vars.colors.border.default.dark });

  display: flex;
  align-items: center;
  
	button {
    color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
	}
`

export const datePickerMenu = css`
  transition: transform 200ms ease;

  &.opened {
    transform: rotate(-180deg);
  }
`

export const dateButton = css`
  width: fit-content;
  white-space: nowrap;
`

export const leftSection = css`
  flex: 1;
  justify-items: flex-start;
  white-space: nowrap;

  & > .${ buttonsContainer } {
    width: fit-content;
  }
`

export const centerSection = css`
`

export const rightSection = css`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  white-space: nowrap;
`
