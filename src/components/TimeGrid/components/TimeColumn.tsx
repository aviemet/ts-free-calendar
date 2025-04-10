import { useCalendarContext } from "@/."

import * as classes from "../TimeGrid.css"


interface TimeColumnProps {
	timeSlots: Date[]
}

const TimeColumn = ({
	timeSlots,
}: TimeColumnProps) => {
	const { localizer } = useCalendarContext()

	return (
		<div className={ classes.timeColumn }>
			{ timeSlots.map((time) => (
				<div key={ time.toISOString() } className={ classes.timeSlot }>
					<span>
						{ localizer.format(time, `h${time.getMinutes() === 0 ? "" : ":mm "} A`) }
					</span>
				</div>
			)) }
		</div>
	)
}

export default TimeColumn
