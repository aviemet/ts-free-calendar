import clsx from "clsx"

import * as classes from "../../MonthView.css"

interface DaysHeadingProps {
	weekdays: string[]
}

const DaysHeading = ({ weekdays }: DaysHeadingProps) => {
	return (
		<div className={ clsx(classes.daysHeading) }>
			{ weekdays.map(day => (
				<div key={ day } className={ clsx(classes.columnHeading) }>
					{ day }
				</div>
			)) }
		</div>
	)
}

export { DaysHeading }
