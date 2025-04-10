import clsx from "clsx"

import { Box, Group } from "@/Components"

import * as classes from "./DailyTotals.css"

interface DailyTotalsProps {
	dailyMinutesTotal: number
}

const DailyTotals = ({ dailyMinutesTotal }: DailyTotalsProps) => {
	return (
		<Box className={ clsx((classes.dailyTotals)) }>
			<Group justify="space-between">
				<Box>Total Hours</Box>
				<Box>{ Math.round(dailyMinutesTotal / 60) }</Box>
			</Group>
		</Box>
	)
}

export default DailyTotals
