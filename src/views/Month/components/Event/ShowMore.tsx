import clsx from "clsx"
import { CSSProperties } from "react"

import * as classes from "./Event.css"

interface ShowMoreProps {
	children: React.ReactNode[]
	column: number
}

const ShowMore = ({ children, column }: ShowMoreProps) => {
	return (
		<div
			className={ clsx(classes.showMore, classes.monthEventWrapper) }
			style={ {
				"--column-start": column,
				"--column-span": 1,
			} as CSSProperties }
		>
			<div>+ Show More</div>
			<div className={ clsx(classes.overflowEvents) }>
				{ children }
			</div>
		</div>
	)
}

export { ShowMore }
