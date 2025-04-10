import { css } from "@linaria/core"

import { vars } from "@/lib"

export const container = css`
	position: absolute;
	z-index: 1000;
	transform-origin: top left;
	opacity: 1;

	/* Add a subtle scale animation when the popover appears */
	&[data-entering] {
		opacity: 0;
		transform: scale(0.95);
	}

	&[data-exiting] {
		opacity: 0;
		transform: scale(0.95);
	}
`

export const eventColor = css`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	flex-shrink: 0;
`

export const popover = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
	min-width: 300px;
	max-width: 400px;
	padding: ${ vars.spacing.md };

  & > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  & > div > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  & > div > div > div {
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
  }

  & h4 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }

  & p {
    margin: 0;
    font-size: 0.875rem;
  }
`
