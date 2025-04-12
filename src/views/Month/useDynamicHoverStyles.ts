import { useMemo } from "react"

import * as classes from "./components/Event/Event.css"
import { monthView } from "./MonthView.css"

const useDynamicHoverStyles = (hoverId: string) => {
	// Generate dynamic hover styles
	return useMemo(() => {
		if(!hoverId) return ""
		const safeHoverId = String(hoverId).replace(/"/g, '\\"')

		return `
      .${monthView} [data-id="${safeHoverId}"] .${classes.monthEvent} {
        background-color: var(--hover-color);
        outline: 1px solid color-mix(in srgb, white 50%, var(--event-color));
      }
      /* Apply to pseudo-elements for continued events */
      .${monthView} [data-id="${safeHoverId}"] .${classes.monthEvent}.continues-on::after {
        border-left-color: var(--hover-color);
      }
      .${monthView} [data-id="${safeHoverId}"] .${classes.monthEvent}.continued-from::before {
        border-top-color: var(--hover-color);
        border-bottom-color: var(--hover-color);
      }
    `
	}, [hoverId])
}

export { useDynamicHoverStyles }
