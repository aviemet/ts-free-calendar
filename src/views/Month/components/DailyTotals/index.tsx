import clsx from "clsx"

import * as classes from "./DailyTotals.css"

interface DailyTotalsProps {
	dailyMinutesTotal: number
}

const DailyTotals = ({ dailyMinutesTotal }: DailyTotalsProps) => {
	return (
		<div className={ clsx((classes.dailyTotals)) }>
			<div>
				<div>Total Hours</div>
				<div>{ Math.round(dailyMinutesTotal / 60) }</div>
			</div>
		</div>
	)
}

export default DailyTotals
